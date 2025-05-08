import { Router } from "express";
import { generateBillController } from "../controllers/invoiceController";
const router = Router();

router.get("/", (req, res) => {
})


router.post('/generateBill', (req, res) => {
    generateBillController(req, res)
})
export default router;