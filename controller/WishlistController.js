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

export const getAll = async (req, res, next) => { 
  try {
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
    const limit = 6; // Fixed limit of 6 items per page
    const skip = (page - 1) * limit;

    // Fetch the wishlist with pagination and populate product details
    const wishlist = await Wishlist.find()
      .populate("productId")
      .skip(skip)
      .limit(limit);

    // Count total documents for pagination metadata
    const totalItems = await Wishlist.countDocuments();

    res.json({
      status: "success",
      data: wishlist,
      pagination: {
        totalItems,
        currentPage: page,
        limit,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching wishlist" });
  }
};

