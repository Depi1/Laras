import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  usertype: String,
});

const adminSchema = new mongoose.Schema({
  banner: String,
  categories: Array,
});

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  mainImg: String,
  carousel: Array,
  sizes: Array,
  category: String,
  gender: String,
  price: Number,
  discount: Number,
});

const orderSchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: String,
  mobile: String,
  address: String,
  pincode: String,
  title: String,
  description: String,
  mainImg: String,
  size: String,
  quantity: Number,
  price: Number,
  discount: Number,
  paymentMethod: String,
  orderDate: String,
  deliveryDate: String,
  orderStatus: { type: String, default: "order placed" },
});

const cartSchema = new mongoose.Schema({
  userId: String,
  productId: String,
  title: String,
  description: String,
  mainImg: String,
  size: String,
  quantity: Number,
  price: Number,
  discount: Number,
});

export const User = mongoose.model("users", userSchema);
export const Admin = mongoose.model("admin", adminSchema);
export const Product = mongoose.model("products", productSchema);
export const Orders = mongoose.model("orders", orderSchema);
export const Cart = mongoose.model("cart", cartSchema);