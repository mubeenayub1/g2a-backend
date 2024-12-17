import { catchAsyncError } from "../middleware/catchAsyncError.js";
import {Blogs} from '../model/Blog.js'
import cloudinary from "cloudinary";
cloudinary.v2.config({
    cloud_name: "ddu4sybue",
    api_key: "658491673268817",
    api_secret: "w35Ei6uCvbOcaN4moWBKL3BmW4Q",
});


// create blog
export const createBlog = catchAsyncError(async (req, res, next) => {
    let image = req.files.image;
    const data = req.body;
    const result = await cloudinary.v2.uploader.upload(image.tempFilePath);
    const slider = result.url;
    let data1 = {
       image: slider,
       content: data?.content,
       title:data?.title,
       shortDescription:data?.shortDescription
    };
    // console.log(data1);
    const newBlog = await Blogs.create(data1);
    res.status(200).json({
        status: "success",
        message: "New blog created successfully!",
        data: newBlog,
    });

});



// get blog by id
export const getBlogById = async (req, res, next) => {
    const id = req?.params.id;
    try {
        const data = await Blogs.findById(id);

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
// update blog
export const updateBlog = catchAsyncError(async (req, res, next) => {
    const data = req.body;
    const blogId = req.params.id;
  
    const updatedblog = await Blogs.findByIdAndUpdate(blogId, data, {
      new: true,
    });
    if (!updatedblog) {
      return res.status(404).json({ message: "blog not found" });
    }
    
  
  
    res.status(200).json({
      status: 'success',
      data: updatedblog,
      message: "blog updated successfully!",
    });
  });


// Get All blogs
export const getAllBlogs = catchAsyncError(async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1; // Current page, default to 1
      const limit = 10; // Number of blogs per page
      const skip = (page - 1) * limit; // Calculate the number of documents to skip
  
      // Fetch paginated blogs and total count
      const blogs = await Blogs.find().skip(skip).limit(limit);
      const totalBlogs = await Blogs.countDocuments();
  
      res.status(200).json({
        status: "success",
        data: {
          data:blogs,
          currentPage: page,
          totalPages: Math.ceil(totalBlogs / limit),
          totalBlogs,
        },
      });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      res.status(500).json({
        status: "fail",
        error: "Internal Server Error",
      });
    }
  });
  
// delete blog
export const deleteBlogById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const delBlog = await Blogs.findByIdAndDelete(id);
        if (!delBlog) {
            return res.json({ status: "fail", message: "Blog not Found" });
        }
        res.json({
            status: "success",
            message: "Blog deleted successfully!",
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};




