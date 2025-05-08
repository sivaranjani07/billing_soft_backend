import { Request, Response } from "express";
import { sendErrorResponse, sendResponse } from "../utils/responseHandler";
import { AppDataSource } from "../data-source";
import { Customer } from "../entity/Customer";
import { Invoice } from "../entity/invoice";
import { InvoiceItem } from "../entity/billgenerate";

export const generateBillController = async (req: Request, res: Response) => {
    try {
        const { productsList, customerName, mobileNumber } = req.body

        //TODO: Customer creation logic 
        const customerRepo = AppDataSource.getRepository(Customer)

        let customer = await customerRepo.findOne({ where: { mobileNumber: mobileNumber } });

        //TODO: if customer does not exist, create a new customer

        if (!customer) {
            customer = customerRepo.create({ name: customerName, mobileNumber: mobileNumber })
            customer = await customerRepo.save(customer)
        }


        const invoiceRepo = AppDataSource.getRepository(Invoice)

        let cgstTotal = 0;
        let sgstTotal = 0;
        let igstTotal = 0;
        const isSameState = true;
        let totalQuantity = 0;

        for (const item of productsList) {
            const gstRate = Number(item.gstRate);
            const itemGross = item.amount;
            const gstAmount = (itemGross * gstRate) / 100
            totalQuantity += item.quantity

            let cgst = 0, sgst = 0, igst = 0;
            if (isSameState) {
                cgst = gstAmount / 2;
                sgst = gstAmount / 2;
            } else {
                igst = gstAmount;
            }

            cgstTotal += cgst;
            sgstTotal += sgst;
            igstTotal += igst;
        }

        const taxTotal = cgstTotal + sgstTotal + igstTotal;
        const grandTotal = req.body.grossAmount + taxTotal;
        const finalAmount = grandTotal - parseNumber(req.body.discount);

        const createInvoice = invoiceRepo.create({
            totalAmount: grandTotal,
            customer: customer,
            grossAmount: req.body.grossAmount,
            finalAmount: finalAmount,
            discount: req.body.discount,
            cgstAmount: cgstTotal,
            sgstAmount: sgstTotal,
            igstAmount: igstTotal,
            totalQuantity: totalQuantity,
        })

        const savedInvoice = await invoiceRepo.save(createInvoice);
        const invoiceItemRepo = AppDataSource.getRepository(InvoiceItem)


        const invoiceItems = productsList.map((item: any) => {
            return invoiceItemRepo.create({
                productName: item.productName,
                quantity: item.quantity,
                unit: item.unit,
                gstRate: item.gstRate,
                salesPrice: parseNumber(item.salesPrice),
                mrpPrice: parseNumber(item.mrp),
                total: parseNumber(item.amount),
                invoice: savedInvoice
            })

        })
        await invoiceItemRepo.save(invoiceItems);
        let result = await invoiceRepo.findOne({
            where: { id: savedInvoice.id },
            relations: ['items', 'customer'],
        });
        console.log(result, "result")
        return sendResponse(res, result, "Invoice generated successfully", 200);
    }
    catch (error) {
        return sendErrorResponse(res, error, "Something went wrong", 500)
    }
}


function parseNumber(value: string): number {
    // Removes commas and converts to number
    return parseFloat(value.replace(/,/g, ''));
}