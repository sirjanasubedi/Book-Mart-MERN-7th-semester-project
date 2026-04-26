import React, { useEffect, useState } from "react";
import { useGetAllOrdersQuery } from "../../redux/features/orders/ordersApi";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
import StatsCard from "./stats/StatsCard";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";
import SalesChart from "./stats/SalesChart";
import { Link } from "react-router-dom";

const DashboardHome = () => {
  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    isError,
    refetch,
  } = useGetAllOrdersQuery();

  const { data: booksData, isLoading: isLoadingBooks } =
    useFetchAllBooksQuery();

  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalEarnings: 0,
    popularBooks: [],
    monthlySales: [],
    recentOrders: [],
  });

  useEffect(() => {
    if (ordersData && booksData) {
      const allOrders = Array.isArray(ordersData) ? ordersData : [];
      const allBooks = Array.isArray(booksData?.books)
        ? booksData.books
        : [];

      // Pending + Completed
      const pendingOrders = allOrders.filter(
        (order) => order.paymentStatus !== "COMPLETE"
      ).length;

      const completedOrders = allOrders.filter(
        (order) => order.paymentStatus === "COMPLETE"
      ).length;

      const totalEarnings = allOrders
        .filter((order) => order.paymentStatus === "COMPLETE")
        .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

      // Book count map
      const bookCounts = {};

      allOrders.forEach((order) => {
        if (Array.isArray(order.productIds)) {
          order.productIds.forEach((product) => {
            if (product?._id) {
              bookCounts[product._id] =
                (bookCounts[product._id] || 0) + 1;
            }
          });
        }
      });

      // Popular books (SAFE FIX)
      const popularBooksRaw = Object.entries(bookCounts).map(
        ([id, count]) => {
          const orderWithProduct = allOrders.find((order) =>
            order.productIds?.some((p) => p._id === id)
          );

          const product =
            orderWithProduct?.productIds?.find((p) => p._id === id);

          return {
            _id: id,
            title: product?.title || "Unknown Book",
            price: product?.price || 0,
            coverImage: product?.coverImage || "/default-book.png",
            count,
          };
        }
      );

      // ✅ FIXED SORT (NO MUTATION ERROR)
      const popularBooks = [...popularBooksRaw]
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Monthly Sales
      const salesByMonth = {};

      allOrders
        .filter((order) => order.paymentStatus === "COMPLETE")
        .forEach((order) => {
          const date = new Date(order.createdAt);
          const month = date.toLocaleString("default", {
            month: "short",
            year: "numeric",
          });

          if (!salesByMonth[month]) {
            salesByMonth[month] = 0;
          }

          salesByMonth[month] += order.totalPrice || 0;
        });

      const monthlySales = Object.entries(salesByMonth)
        .map(([month, totalSales]) => ({ month, totalSales }))
        .sort((a, b) => new Date(a.month) - new Date(b.month));

      // ✅ FIXED recentOrders (NO MUTATION ERROR)
      const recentOrders = [...allOrders]
        .sort(
          (a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        )
        .slice(0, 5);

      setStats({
        totalBooks: allBooks.length,
        totalOrders: allOrders.length,
        pendingOrders,
        completedOrders,
        totalEarnings,
        popularBooks,
        monthlySales,
        recentOrders,
      });
    }
  }, [ordersData, booksData]);

  if (isLoadingOrders || isLoadingBooks) return <Loading />;

  if (isError) {
    toast.error("Error loading dashboard data");

    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-red-500">
          Error Loading Dashboard
        </h2>
        <button
          onClick={() => refetch()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>

        <div className="flex gap-3">
          <Link
            to="/dashboard/add-book"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Book
          </Link>

          <Link
            to="/dashboard/manage-books"
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Manage Books
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatsCard title="Books" value={stats.totalBooks} />
        <StatsCard title="Orders" value={stats.totalOrders} />
        <StatsCard title="Pending" value={stats.pendingOrders} />
        <StatsCard title="Completed" value={stats.completedOrders} />
        <StatsCard title="Earnings" value={stats.totalEarnings} />
      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded shadow">
        <SalesChart data={stats.monthlySales} />
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          Recent Orders
        </h2>

        {stats.recentOrders.map((order) => (
          <div
            key={order._id}
            className="flex justify-between border-b py-2"
          >
            <span>#{order._id.slice(-5)}</span>
            <span>{order.totalPrice}</span>
          </div>
        ))}
      </div>

      {/* POPULAR BOOKS */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          Popular Books
        </h2>

        {stats.popularBooks.map((book) => (
          <div
            key={book._id}
            className="flex justify-between border-b py-2"
          >
            <span>{book.title}</span>
            <span>{book.count}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default DashboardHome;
