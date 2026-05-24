const Order = require("./order.model");
const Payment = require("../model/Payment");

const normalizeOrderPayload = (payload) => ({
  ...payload,
  address:
    typeof payload.address === "object"
      ? payload.address
      : {
          city: payload.city,
          country: payload.country,
          state: payload.state,
          zipcode: payload.zipcode,
        },
  productIds: Array.isArray(payload.productIds)
    ? payload.productIds.map((item) => item?._id || item)
    : [],
});

const createAOrder = async (req, res) => {
  try {
    const newOrder = new Order(normalizeOrderPayload(req.body));
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const completeEsewaOrder = async (req, res) => {
  try {
    const { transactionUuid, productId, orderId, _id, paymentMethod } = req.body;

    // Find the verified payment in Payment model (not Transaction model)
    const txUuid = transactionUuid || productId;
    const payment = await Payment.findOne({ transaction_uuid: txUuid });

    if (!payment || payment.status !== "COMPLETE") {
      console.error("Payment not verified for uuid:", txUuid);
      return res.status(400).json({ message: "Payment not verified" });
    }

    const existingOrderId = orderId || _id;

    // If order already exists, just update its payment status
    if (existingOrderId) {
      const updatedOrder = await Order.findByIdAndUpdate(
        existingOrderId,
        {
          paymentStatus: "COMPLETE",
          paymentMethod: paymentMethod || "eSewa",
        },
        { new: true }
      );
      if (updatedOrder) return res.status(200).json(updatedOrder);
    }

    // Otherwise create a new order
    const newOrder = new Order({
      ...normalizeOrderPayload(req.body),
      paymentStatus: "COMPLETE",
      paymentMethod: paymentMethod || "eSewa",
    });
    await newOrder.save();
    return res.status(201).json(newOrder);

  } catch (error) {
    console.error("completeEsewaOrder error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

const getOrderByEmail = async (req, res) => {
  try {
    const orders = await Order.find({ email: req.params.email })
      .sort({ createdAt: -1 })
      .populate("productIds");
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.paymentStatus !== "PENDING") {
      return res.status(400).json({ message: "Only pending orders can be deleted" });
    }
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Order deleted successfully",
      deletedOrderId: req.params.id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("productIds");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: req.body.status },
      { new: true }
    );
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: "productIds",
      model: "Book",
      select: "title price coverImage",
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createAOrder,
  completeEsewaOrder,
  getOrderByEmail,
  deleteOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
};