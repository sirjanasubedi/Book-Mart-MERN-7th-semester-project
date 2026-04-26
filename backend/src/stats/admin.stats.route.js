const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const verifyAdminToken = require("../middleware/verifyAdminToken");

const Book = require("../books/book.model");
const Order = require("../orders/order.model");
const User = require("../users/user.model");

router.get("/stats", verifyAdminToken, async (req, res) => {
  try {
    // ✅ parallel counts
    const [totalBooks, totalOrders, totalUsers] = await Promise.all([
      Book.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
    ]);

    // ✅ sales summary
    const salesResult = await Order.aggregate([
      { $match: { paymentStatus: "COMPLETE" } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" },
          completedOrders: { $sum: 1 },
        },
      },
    ]);

    const totalSales = salesResult[0]?.totalSales || 0;
    const completedOrders = salesResult[0]?.completedOrders || 0;

    const averageOrderValue =
      completedOrders > 0
        ? (totalSales / completedOrders).toFixed(2)
        : 0;

    // ✅ trending books (FIXED PRICE FIELD)
    const trendingBooks = await Order.aggregate([
      { $unwind: "$productIds" },

      {
        $group: {
          _id: "$productIds",
          count: { $sum: 1 },
        },
      },

      { $sort: { count: -1 } },
      { $limit: 5 },

      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },

      { $unwind: "$bookDetails" },

      {
        $project: {
          title: "$bookDetails.title",
          coverImage: "$bookDetails.coverImage",
          price: "$bookDetails.newPrice", // ✅ FIXED HERE
          count: 1,
        },
      },
    ]);

    // ✅ monthly sales
    const monthlySales = await Order.aggregate([
      { $match: { paymentStatus: "COMPLETE" } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt",
            },
          },
          totalSales: { $sum: "$totalPrice" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          month: "$_id",
          totalSales: 1,
          orderCount: 1,
          _id: 0,
        },
      },
    ]);

    // ✅ response
    res.status(200).json({
      totalBooks,
      totalOrders,
      totalUsers,

      totalSales,
      completedOrders,
      averageOrderValue,

      trendingBooks,
      trendingBooksCount: await Book.countDocuments({
        trending: true,
      }),

      monthlySales,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);

    res.status(500).json({
      message: "Failed to fetch admin stats",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
});

module.exports = router;
