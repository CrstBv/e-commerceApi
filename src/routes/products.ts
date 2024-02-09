import express from "express";
import {
    createProduct,
    deleteProduct,
    getFilteredProducts,
    getProductById,
    getProducts,
    updateProduct,
} from "../controllers/products";

const router = express.Router();

router.get("/", getProducts);

router.get("/product/:productId", getProductById);

router.post("/create", createProduct);

router.patch("/update/:productId", updateProduct);

router.post("/delete/:productId", deleteProduct);

router.get("/filter/:query", getFilteredProducts);

export default router;
