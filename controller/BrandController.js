import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Brands } from "../model/Brand.js";
import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: "ddu4sybue",
  api_key: "658491673268817",
  api_secret: "w35Ei6uCvbOcaN4moWBKL3BmW4Q",
});

// create brand
export const createBrand = catchAsyncError(async (req, res, next) => {
  let image = req.files.image;
  const data = req.body;
  const result = await cloudinary.v2.uploader.upload(image.tempFilePath);
  const slider = result.url;
  let data1 = {
    image: slider,
    name: data?.name,
  };
  //   console.log(data1);
  const newBrands = await Brands.create(data1);
  res.status(200).json({
    status: "success",
    message: "Main category created successfully!",
    data: newBrands,
  });
});

// get brand by id
export const getBrandById = async (req, res, next) => {
  const id = req?.params.id;
  try {
    const data = await Brands.findById(id);

    res.json({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      error: "Internal Server Error",
    });
  }
};
// update brand
export const updateBrand = catchAsyncError(async (req, res, next) => {
  const data = req.body;
  const blogId = req.params.id;

  const updatedbrand = await Brands.findByIdAndUpdate(blogId, data, {
    new: true,
  });
  if (!updatedbrand) {
    return res.status(404).json({ message: "brand not found" });
  }

  res.status(200).json({
    status: "success",
    data: updatedbrand,
    message: "brand updated successfully!",
  });
});

// Get All brand
export const getAllBrand = catchAsyncError(async (req, res, next) => {
  // try {
  //   const brands = await Brands.find();

  //   res.status(200).json({
  //     status: "success",
  //     data: brands,
  //   });
  // } catch (error) {
  //   console.error("Error fetching blogs:", error);
  //   res.status(500).json({
  //     status: "fail",
  //     error: "Internal Server Error",
  //   });
  // }
  const page = parseInt(req.query.page, 10) || 1; // Default to page 1
  const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page
  const skip = (page - 1) * limit;

  // Aggregation pipeline with pagination
  const brands = await Brands.aggregate([
    // Lookup categories for each blog
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "categories",
      },
    },
    // Unwind categories array to process each category individually
    { $unwind: { path: "$categories", preserveNullAndEmptyArrays: true } },
    // Lookup subcategories for each category
    {
      $lookup: {
        from: "subcategories",
        localField: "categories._id",
        foreignField: "categoryId",
        as: "categories.subcategories",
      },
    },
    // Re-group categories back into an array after subcategories lookup
    {
      $group: {
        _id: "$_id",
        title: { $first: "$title" },
        content: { $first: "$content" },
        categories: { $push: "$categories" },
      },
    },
    // Pagination: skip and limit
    { $skip: skip },
    { $limit: limit },
  ]);

  // Count total documents for pagination metadata
  const totalbrands = await Brands.countDocuments();

  res.status(200).json({
    status: "success",
    data: brands,
    pagination: {
      total:totalbrands ,
      page,
      limit,
      totalPages: Math.ceil(totalbrands / limit),
    },
  });
});

// delete brand
export const deleteBrandById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const delBrands = await Brands.findByIdAndDelete(id);
    if (!delBrands) {
      return res.json({ status: "fail", message: "Brand not Found" });
    }
    res.json({
      status: "success",
      message: "Brand deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
