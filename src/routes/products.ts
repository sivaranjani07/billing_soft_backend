import { Router } from "express";
import { createProduct, getAllProducts, getScannedProductDetails, uploadProducts } from "../controllers/productsController";
import multer from "multer";

const router = Router();
const upload = multer();

router.get("/getAllProducts", (req, res) => {
    getAllProducts(req, res)
})

router.post('/addProduct', (req, res, next) => {
    createProduct(req, res)
})

router.post('/bulkUpload',upload.single('file'),(req,res)=>{
    uploadProducts(req,res)
})

router.get("/getProductDataByBarcode/:barcode", (req, res) => {
    getScannedProductDetails(req, res)
})

export default router;