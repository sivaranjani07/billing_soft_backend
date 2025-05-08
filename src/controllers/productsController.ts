import { Request, Response } from "express";
import { sendErrorResponse, sendResponse } from "../utils/responseHandler";
import { plainToInstance } from "class-transformer";
import { ProductDTO } from "../dtos/ProductsDTO";
import { validate } from "class-validator";
import { AppDataSource } from "../data-source";
import { Products } from "../entity/products";
import xlsx from "xlsx";
import { barCodeImageGenerator } from "../utils/barcodeImageGenerator";
import qz from 'qz-tray'

const timestamp = Date.now()

// Single product creation
export const createProduct = async (req: Request, res: Response) => {
    try {
        const productData = plainToInstance(ProductDTO, req.body);
        const errors = await validate(productData);

        if (errors.length > 0) {
            return sendErrorResponse(res, errors, "Validation failed", 400)
        }
        const { name } = productData;

        const productRepo = AppDataSource.getRepository(Products);
        const existingProduct = await productRepo.findOne({ where: { name } });
        if (existingProduct) {
            return sendErrorResponse(res, {}, 'Product already exists', 400);
        }

        const barcode = `P-${name.replace(/\s+/g, '').toUpperCase()}-${timestamp}`;
        const barcodeImageBuffer = await barCodeImageGenerator(barcode);

        const newProduct = productRepo.create({ ...productData, barcode: barcode, barcodeImagePath: barcodeImageBuffer, description: productData.description ?? '' })

        await productRepo.save(newProduct)
        return sendResponse(res, {}, 'Product created successfully', 201);

    } catch (error) {
        return sendErrorResponse(res, error, "Something went wrong", 500)
    }
}

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const productRepo = AppDataSource.getRepository(Products);
        const products = await productRepo.find();
        return sendResponse(res, products, 'Products fetched successfully', 200);
    } catch (error) {
        return sendErrorResponse(res, error, "Something went wrong", 500)
    }
}

// Bulk upload products
export const uploadProducts = async (req: Request, res: Response) => {
    try {
        const file = req.file;
        if (!file) {
            return sendErrorResponse(res, {}, "No file Uploaded", 500)
        }

        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        const products = plainToInstance(ProductDTO, data);
        for (const productData of products) {
            // console.log(productData, "productData")
            const errors = await validate(productData);
            if (errors.length > 0) {
                return sendErrorResponse(res, errors, 'Validation failed', 400);

            }
        }
        const productRepo = AppDataSource.getRepository(Products);

        for (const productData of products) {
            const { name } = productData;
            const existingProduct = await productRepo.findOne({ where: { name } });
            if (existingProduct) {
                return sendErrorResponse(res, {}, 'Product already exists', 400);
            }
            const barcode = `P-${name.replace(/\s+/g, '').toUpperCase()}-${timestamp}`;
            const barcodeImageBuffer = await barCodeImageGenerator(barcode);


            const savedProduct = productRepo.create({
                ...productData,
                barcode: barcode,
                barcodeImagePath: barcodeImageBuffer,
                description: productData.description ?? ''
            });

            await productRepo.save(savedProduct);

        }
        // console.log(productRepo, "productRepo")

        return sendResponse(res, {}, 'Product created successfully', 201);

    } catch (error) {
        return sendErrorResponse(res, error, "Something went wrong", 500)
    }
}

// Print label bar code
export const printLabelBar = async (req: Request, res: Response) => {
    const { imageUrl, count } = req.body
    try {
        await qz.websocket.connect()
        const printer = await qz.printers.find("EPSON TM-T20II Receipt");

        if (Array.isArray(printer)) {
            return sendErrorResponse(res, {}, "Multiple printers found. Please specify one.", 400);
        }

        const printJobs: any = Array.from({ length: count }).map(() => ({
            data: imageUrl,
            flavor: 'image',
        }));

        const config = qz.configs.create(printer);
        await qz.print(config, printJobs);

    } catch (error) {
        return sendErrorResponse(res, error, "Something went wrong", 500)

    }
}

// Get scanned product details by barcode
export const getScannedProductDetails = async (req: Request, res: Response) => {
    try {
        const barcode = req.params.barcode;

        const productRepo = AppDataSource.getRepository(Products);
        const productExists = await productRepo.findOne({ where: { barcode: barcode } });
        if (!productExists) {
            return sendErrorResponse(res, {}, 'Product not found', 404);
        }
        const responseData = {
            productId: productExists.id,
            productName: productExists?.name,
            salesprice: productExists.salesPrice,
            mrpPrice: productExists.mrpPrice,
            quantity: productExists.quantity,
            unit: productExists.unit,
            gstRate: productExists.gstRate,
        };
      return sendResponse(res, responseData, 'Product fetched successfully', 200);

    } catch (error) {
        return sendErrorResponse(res, error, "Something went wrong", 500)

    }
}