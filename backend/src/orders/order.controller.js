const Order = require("./order.model");
const Transaction = require("../model/Transaction.model");
const User = require("../users/user.model");
const Book = require("../books/book.model");

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
    const orderId = req.body.orderId || req.body._id || req.body.transactionUuid;

    if (req.body.mock) {
      if (orderId) {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { paymentStatus: "COMPLETE", paymentMethod: "eSewa" },
        { new: true }
      );

      if (updatedOrder) {
        // Update user profile based on completed purchase
        try {
          await updateUserProfileOnPurchase(updatedOrder.email, updatedOrder.productIds);
        } catch (err) {
          console.error('Failed to update user profile after order completion', err);
        }
        return res.status(200).json(updatedOrder);
      }
    }

    const newOrder = new Order({
      ...normalizeOrderPayload(req.body),
      paymentStatus: "COMPLETE",
      paymentMethod: "eSewa",
    });
    await newOrder.save();
    // Update profile
    try {
      await updateUserProfileOnPurchase(newOrder.email, newOrder.productIds);
    } catch (err) {
      console.error('Failed to update user profile after mock/new order', err);
    }
    return res.status(201).json(newOrder);
    }

    const transaction = await Transaction.findOne({
      transaction_uuid: req.body.transactionUuid || req.body.productId,
    });

    if (!transaction || transaction.status !== "COMPLETE") {
      return res.status(400).json({ message: "Payment not verified" });
    }

    if (orderId) {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { paymentStatus: "COMPLETE", paymentMethod: "eSewa" },
        { new: true }
      );

      if (updatedOrder) return res.status(200).json(updatedOrder);
    }

    const newOrder = new Order({
      ...normalizeOrderPayload(req.body),
      paymentStatus: "COMPLETE",
      paymentMethod: "eSewa",
    });
    await newOrder.save();
    // Update profile
    try {
      await updateUserProfileOnPurchase(newOrder.email, newOrder.productIds);
    } catch (err) {
      console.error('Failed to update user profile after order', err);
    }
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Helper: update user's purchasedBooks and category counts
const updateUserProfileOnPurchase = async (email, productIds) => {
  if (!email || !Array.isArray(productIds)) return;
  const user = await User.findOne({ email });
  if (!user) return;

  // Ensure productIds are ObjectIds
  const ids = productIds.map((p) => (typeof p === 'object' && p?._id) ? p._id : p);

  // Add to purchasedBooks (unique)
  const existing = new Set((user.purchasedBooks || []).map(String));
  const toAdd = ids.filter((id) => !existing.has(String(id)));
  if (toAdd.length > 0) {
    user.purchasedBooks = [...(user.purchasedBooks || []), ...toAdd];
  }

  // Fetch book categories and increment preference counts
  const books = await Book.find({ _id: { $in: ids } }).select('category');
  books.forEach((b) => {
    const cat = b.category || 'Unknown';
    const current = user.preferences?.categories?.get(cat) || 0;
    user.preferences = user.preferences || { categories: {} };
    if (!user.preferences.categories) user.preferences.categories = new Map();
    user.preferences.categories.set(cat, current + 1);
  });

  await user.save();
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
