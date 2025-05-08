import express from 'express'
import { loginUser, registerUser } from '../controllers/authController';
const router = express.Router();

router.post('/register', function (req, res, next) {
    registerUser(req, res, next)
});

router.post('/login', function (req, res, next) {
    loginUser(req, res)
});

export default router;
