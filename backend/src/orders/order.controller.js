const Order = require("./order.model");
const Transaction = require("../model/Transation.model");

const createAOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const completeEsewaOrder = async (req, res) => {
  try {
    if (req.body.mock) {
      const newOrder = new Order({
        ...req.body,
        paymentStatus: "COMPLETE",
        paymentMethod: "eSewa",
      });
      await newOrder.save();
      return res.status(201).json(newOrder);
    }

    const transaction = await Transaction.findOne({
      product_id: req.body.productId || req.body.productIds?.[0],
    });

    if (!transaction || transaction.status !== "COMPLETE") {
      return res.status(400).json({ message: "Payment not verified" });
    }

    const newOrder = new Order({
      ...req.body,
      paymentStatus: "COMPLETE",
      paymentMethod: "eSewa",
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
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
 
// this is for user detelte orders


const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allowing deletion of pending orders
    if (order.paymentStatus !== 'PENDING') {
      return res.status(400).json({ message: 'Only pending orders can be deleted' });
    }


await Order.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ 
      message: 'Order deleted successfully',
      deletedOrderId: req.params.id // Return the deleted ID
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
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
    const order = await Order.findById(req.params.id)
      .populate({
        path: "productIds",
        model: "Book",
        select: "title price coverImage"
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
  getOrderByEmail,deleteOrder,getAllOrders,
  updateOrderStatus,getOrderById
};