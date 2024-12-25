import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Wishlist } from "../model/wishlist.js";

export const AddWishlist = catchAsyncError(async (req, res, next) => {
  try {
    const { userId, productId } = req.body;

    // Check if the product is already in the wishlist
    const existingItem = await Wishlist.findOne({ userId, productId });
    if (existingItem) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    const wishlistItem = new Wishlist({ userId, productId });
    const savedItem = await wishlistItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ error: "Error adding product to wishlist" });
  }
});

export const getById = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.find({
      userId: req.params.id,
    }).populate("productId");
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: "Error fetching wishlist" });
  }
};

export const deleteById = async (req, res, next) => {
  try {
    const { userId, productId } = req.body;
    const deletedItem = await Wishlist.findOneAndDelete({ userId, productId });
    if (!deletedItem) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }
    res.json({ message: "Product removed from wishlist" });
  } catch (error) {
    res.status(500).json({ error: "Error removing product from wishlist" });
  }
};
