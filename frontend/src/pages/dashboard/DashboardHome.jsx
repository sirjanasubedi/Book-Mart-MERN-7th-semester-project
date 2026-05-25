import React, { useEffect, useState } from "react";
import { useGetAllOrdersQuery } from "../../redux/features/orders/ordersApi";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";
import SalesChart from "./stats/SalesChart";

const DashboardHome = () => {
  const { data: ordersData, isLoading: isLoadingOrders, isError, refetch } = useGetAllOrdersQuery();
  const { data: booksData, isLoading: isLoadingBooks } = useFetchAllBooksQuery();

  const [stats, setStats] = useState({
    totalBooks: 0, totalOrders: 0, pendingOrders: 0,
    completedOrders: 0, totalEarnings: 0,
    popularBooks: [], monthlySales: [], recentOrders: [],
  });

  useEffect(() => {
    if (ordersData && booksData) {
      const allOrders = Array.isArray(ordersData) ? ordersData : [];
      const allBooks = Array.isArray(booksData?.books) ? booksData.books : [];

      const pendingOrders = allOrders.filter(o => o.paymentStatus !== "COMPLETE").length;
      const completedOrders = allOrders.filter(o => o.paymentStatus === "COMPLETE").length;
      const totalEarnings = allOrders
        .filter(o => o.paymentStatus === "COMPLETE")
        .reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);

      const bookCounts = {};
      allOrders.forEach(order => {
        if (Array.isArray(order.productIds)) {
          order.productIds.forEach(product => {
            if (product?._id) bookCounts[product._id] = (bookCounts[product._id] || 0) + 1;
          });
        }
      });

      const popularBooks = Object.entries(bookCounts).map(([id, count]) => {
        const order = allOrders.find(o => o.productIds?.some(p => p._id === id));
        const product = order?.productIds?.find(p => p._id === id);
        return { _id: id, title: product?.title || "Unknown", count };
      }).sort((a, b) => b.count - a.count).slice(0, 5);

      const salesByMonth = {};
      allOrders.filter(o => o.paymentStatus === "COMPLETE").forEach(order => {
        const month = new Date(order.createdAt).toLocaleString("default", { month: "short", year: "numeric" });
        salesByMonth[month] = (salesByMonth[month] || 0) + Number(order.totalPrice || 0);
      });

      const monthlySales = Object.entries(salesByMonth).map(([month, totalSales]) => ({ month, totalSales }));
      const recentOrders = [...allOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

      setStats({ totalBooks: allBooks.length, totalOrders: allOrders.length, pendingOrders, completedOrders, totalEarnings, popularBooks, monthlySales, recentOrders });
    }
  }, [ordersData, booksData]);

  if (isLoadingOrders || isLoadingBooks) return <Loading />;

  if (isError) {
    toast.error("Error loading dashboard data");
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2 style={{ color: "#f87171", fontSize: "18px" }}>Error Loading Dashboard</h2>
        <button onClick={() => refetch()} style={{ marginTop: "16px", background: "#7c3aed", color: "#fff", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
          Retry
        </button>
      </div>
    );
  }

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-NP", { style: "currency", currency: "NPR" }).format(Number(amount || 0));

  const statCards = [
    { label: "Total Books", value: stats.totalBooks, icon: "ti-books", color: "#7c3aed", bg: "#7c3aed22", border: "#7c3aed44" },
    { label: "Total Orders", value: stats.totalOrders, icon: "ti-shopping-bag", color: "#db2777", bg: "#db277722", border: "#db277744" },
    { label: "Pending", value: stats.pendingOrders, icon: "ti-clock", color: "#d97706", bg: "#d9770622", border: "#d9770644" },
    { label: "Completed", value: stats.completedOrders, icon: "ti-circle-check", color: "#0d9488", bg: "#0d948822", border: "#0d948844" },
    { label: "Earnings", value: formatMoney(stats.totalEarnings), icon: "ti-currency-rupee", color: "#34d399", bg: "#34d39922", border: "#34d39944", small: true },
  ];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>

      {/* HEADER */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#ffffff", margin: 0 }}>
          Dashboard Overview
        </h1>
        <p style={{ fontSize: "13px", color: "#a89fc0", marginTop: "4px" }}>
          Monitor your sales, books, and orders in real time
        </p>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px", marginBottom: "24px" }}>
        {statCards.map((card) => (
          <div key={card.label} style={{ background: "#211f2e", border: `1px solid ${card.border}`, borderRadius: "12px", padding: "18px", borderTop: `3px solid ${card.color}` }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
              <i className={`ti ${card.icon}`} style={{ fontSize: "18px", color: card.color }}></i>
            </div>
            <p style={{ fontSize: "11px", color: "#a89fc0", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: "600", margin: "0 0 6px" }}>
              {card.label}
            </p>
            <p style={{ fontSize: card.small ? "16px" : "24px", fontWeight: "700", color: "#ffffff", margin: 0 }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* CHART + INSIGHTS */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "24px" }}>

        {/* CHART */}
        <div style={{ background: "#211f2e", border: "1px solid #35314a", borderRadius: "12px", padding: "22px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#ffffff", margin: "0 0 16px" }}>
            Monthly Sales
          </h2>
          <SalesChart data={stats.monthlySales} />
        </div>

        {/* QUICK INSIGHTS */}
        <div style={{ background: "#211f2e", border: "1px solid #35314a", borderRadius: "12px", padding: "22px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#ffffff", margin: "0 0 16px" }}>
            Quick Insights
          </h2>
          {[
            { label: "Total Books", value: stats.totalBooks },
            { label: "Total Orders", value: stats.totalOrders },
            { label: "Pending Orders", value: stats.pendingOrders },
            { label: "Completed Orders", value: stats.completedOrders },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #2a2840" }}>
              <span style={{ fontSize: "13px", color: "#a89fc0" }}>{item.label}</span>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff" }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT ORDERS + POPULAR BOOKS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

        {/* RECENT ORDERS */}
        <div style={{ background: "#211f2e", border: "1px solid #35314a", borderRadius: "12px", padding: "22px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#ffffff", margin: "0 0 16px" }}>
            Recent Orders
          </h2>
          {stats.recentOrders.length === 0 && (
            <p style={{ color: "#7a7090", fontSize: "13px" }}>No orders yet.</p>
          )}
          {stats.recentOrders.map((order) => (
            <div key={order._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #2a2840" }}>
              <div>
                <p style={{ fontSize: "13px", color: "#ffffff", fontWeight: "500", margin: 0 }}>
                  #{order._id.slice(-6)}
                </p>
                <p style={{ fontSize: "11px", color: "#7a7090", margin: "2px 0 0" }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "13px", color: "#34d399", fontWeight: "600", margin: 0 }}>
                  Rs {order.totalPrice}
                </p>
                <span style={{
                  fontSize: "10px", padding: "2px 8px", borderRadius: "20px", fontWeight: "600",
                  background: order.paymentStatus === "COMPLETE" ? "#0d948822" : "#d9770622",
                  color: order.paymentStatus === "COMPLETE" ? "#34d399" : "#fcd34d",
                  border: `1px solid ${order.paymentStatus === "COMPLETE" ? "#0d948844" : "#d9770644"}`,
                }}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* POPULAR BOOKS */}
        <div style={{ background: "#211f2e", border: "1px solid #35314a", borderRadius: "12px", padding: "22px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#ffffff", margin: "0 0 16px" }}>
            Popular Books
          </h2>
          {stats.popularBooks.length === 0 && (
            <p style={{ color: "#7a7090", fontSize: "13px" }}>No data yet.</p>
          )}
          {stats.popularBooks.map((book, index) => (
            <div key={book._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #2a2840" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#7c3aed22", color: "#c4b5fd", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #7c3aed44" }}>
                  {index + 1}
                </span>
                <span style={{ fontSize: "13px", color: "#ffffff" }}>{book.title}</span>
              </div>
              <span style={{ fontSize: "12px", background: "#0d948822", color: "#34d399", border: "1px solid #0d948844", padding: "2px 8px", borderRadius: "20px", fontWeight: "600" }}>
                {book.count} sold
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;