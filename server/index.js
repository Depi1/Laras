import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Product, Orders, Cart } from "./models/Schema.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err.message));

// ---------- Middleware ----------
const auth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Login dulu" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Token tidak valid" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.usertype !== "admin")
    return res.status(403).json({ message: "Khusus admin" });
  next();
};

// ---------- Auth ----------
app.post("/register", async (req, res) => {
  try {
    const { username, email, password, usertype } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email sudah terdaftar" });
    const hashed = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashed,
      usertype: usertype || "customer",
    });
    res.status(201).json({ message: "Registrasi berhasil" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Email atau password salah" });
    const token = jwt.sign(
      { id: user._id, usertype: user.usertype },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        usertype: user.usertype,
      },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// ---------- Products ----------
app.get("/products", async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.gender) filter.gender = req.query.gender;
  res.json(await Product.find(filter));
});

app.get("/products/:id", async (req, res) => {
  res.json(await Product.findById(req.params.id));
});

app.post("/products", auth, adminOnly, async (req, res) => {
  res.status(201).json(await Product.create(req.body));
});

app.put("/products/:id", auth, adminOnly, async (req, res) => {
  res.json(
    await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
  );
});

app.delete("/products/:id", auth, adminOnly, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Produk dihapus" });
});

// ---------- Cart ----------
app.get("/cart", auth, async (req, res) => {
  res.json(await Cart.find({ userId: req.user.id }));
});

app.post("/cart", auth, async (req, res) => {
  res
    .status(201)
    .json(await Cart.create({ ...req.body, userId: req.user.id }));
});

app.delete("/cart/:id", auth, async (req, res) => {
  await Cart.findByIdAndDelete(req.params.id);
  res.json({ message: "Item dihapus dari cart" });
});

// ---------- Orders ----------
app.post("/orders", auth, async (req, res) => {
  try {
    const { items, fromCart, ...info } = req.body;
    const today = new Date();
    const delivery = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const docs = items.map((i) => ({
      ...info,
      ...i,
      userId: req.user.id,
      orderDate: today.toISOString().slice(0, 10),
      deliveryDate: delivery.toISOString().slice(0, 10),
    }));
    await Orders.insertMany(docs);
    if (fromCart) await Cart.deleteMany({ userId: req.user.id });
    res.status(201).json({ message: "Order berhasil dibuat" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.get("/orders/my", auth, async (req, res) => {
  res.json(await Orders.find({ userId: req.user.id }));
});

app.put("/orders/:id/cancel", auth, async (req, res) => {
  res.json(
    await Orders.findByIdAndUpdate(
      req.params.id,
      { orderStatus: "cancelled" },
      { new: true }
    )
  );
});

// ---------- Admin ----------
app.get("/orders", auth, adminOnly, async (req, res) => {
  res.json(await Orders.find());
});

app.put("/orders/:id/status", auth, adminOnly, async (req, res) => {
  res.json(
    await Orders.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.status },
      { new: true }
    )
  );
});

app.get("/admin/stats", auth, adminOnly, async (req, res) => {
  res.json({
    users: await User.countDocuments(),
    products: await Product.countDocuments(),
    orders: await Orders.countDocuments(),
  });
});

app.get("/", (req, res) => res.send("ShopEZ API running"));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);