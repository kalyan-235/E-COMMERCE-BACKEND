const Order = require("../models/order.model");
const Product = require("../models/product.model");

exports.createOrder = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items required" });
    }

    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const orderItems = [];
    let subtotal = 0;

    for (const i of items) {
      const product = products.find((p) => p._id.toString() === i.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (!i.quantity || i.quantity <= 0) {
        return res.status(400).json({ message: "Quantity must be >= 1" });
      }

      if (product.stock < i.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: i.quantity,
      });

      subtotal += product.price * i.quantity;
    }

    const totalPrice = subtotal;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      paymentMethod: paymentMethod || "COD",
      subtotal,
      totalPrice,
      status: "Pending",
    });

    for (const i of items) {
      await Product.findByIdAndUpdate(i.productId, { $inc: { stock: -i.quantity } });
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name price");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email role")
      .populate("items.product", "name price");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email role")
      .populate("items.product", "name price");

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role !== "admin" && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role !== "admin" && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Order already cancelled" });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({ message: "Delivered order can't be cancelled" });
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["Pending", "Shipped", "Delivered", "Cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (status === "Cancelled" && order.status !== "Cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
      }
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};