import express from "express";
import {
  createProducts,
  getAllProducts,
  getProductsById,
  deleteproductsById,
  searchProduct,getProductbyCategorId
} from "../controller/ProductController.js";
const productRouter = express.Router();

productRouter.route("/create").post(createProducts);
productRouter.route("/getAll").get(getAllProducts);
productRouter.route("/search").get(searchProduct);
// blogRouter.route("/update/:id").put(updateBlog);
productRouter.route("/get/:id").get(getProductsById);
productRouter.route("/category/:categoryId").get(getProductbyCategorId);
productRouter.route("/delete/:id").delete(deleteproductsById);

export default productRouter;
