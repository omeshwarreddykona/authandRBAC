import express from "express";
import authController from "../controllers/auth.js";
import compare from '../uilites/helper.js'



const router = express.Router();
router.post("/register", authController.signUser);
router.post("/login", authController.loginUser);
router.post("/create-product",compare.verifyUser,authController.createProduct);
router.get("/get-product",authController.getAllProduct);
router.get("/get-product-id/:id",authController.getproductbyId);
router.put("/update-product-id/:id",authController.UpdateProductbyId);
router.delete("/delete-product-id/:id",authController.deleteProductId);
router.put("/delete-update-product/:id",authController.deleteandUpdateProductId)

router.get("/verify-token", compare.verifyUser, (req,res) => {
    res.json({
        success: true,
        message: "Token validated successfully",
    });
});
export default router;