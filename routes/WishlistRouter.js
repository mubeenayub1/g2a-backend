import express from "express";

import {
  AddWishlist,
  deleteById,
  getById,
} from "../controller/WishlistController.js";
const wishlistRoute = express.Router();

wishlistRoute.route("/add").post(AddWishlist);

wishlistRoute.route("/get/:id").get(getById);
wishlistRoute.route("/remove").post(deleteById);

export default wishlistRoute;
