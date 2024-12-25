import mongoose from "mongoose";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  companyName: {
    type: String,
    require: true,
  },
  adress: {
    type: Object,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

export const Sellers = mongoose.model("Sellers", sellerSchema);
