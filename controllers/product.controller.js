const Product = require("../models/product.model");
const Category = require("../models/category.model");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image, category } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock: stock ?? 0,
      image,
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter)
      .populate("category", "name image")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name image");

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("category", "name image");

    if (!updated)
      return res.status(404).json({ message: "Product not found" });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addStock = async (req, res) => {
  try {
    const { stockChange, stock } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    if (typeof stock === "number") {
      if (stock < 0)
        return res.status(400).json({ message: "Stock cannot be negative" });
      product.stock = stock;
    } else if (typeof stockChange === "number") {
      const newStock = product.stock + stockChange;
      if (newStock < 0)
        return res.status(400).json({ message: "Stock cannot be negative" });
      product.stock = newStock;
    } else {
      return res.status(400).json({ message: "Provide stock or stockChange" });
    }

    await product.save();

    res.json({ message: "Stock updated", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};