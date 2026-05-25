import React from "react";
import { useGetOrderByEmailQuery } from "../../../redux/features/orders/ordersApi";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";

const DashboardOverview = () => {
  const { currentUser } = useAuth();
  const { data: orders = [], isLoading } = useGetOrderByEmailQuery(currentUser?.email);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px", color: "#c8bfe0", fontSize: "15px" }}>
        Loading dashboard...
      </div>
    );
  }

  const totalOrders = orders.length;
  const totalSpent = orders.filter(o => o.paymentStatus === "COMPLETE").reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingOrders = orders.filter(o => o.paymentStatus === "PENDING").length;
  const completedOrders = orders.filter(o => o.paymentStatus === "COMPLETE").length;
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-NP", { style: "currency", currency: "NPR" }).format(amount || 0);

  const statCards = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: "ti-shopping-bag",
      color: "#60a5fa",
      bg: "#1e3a5f",
      border: "#2563eb44",
    },
    {
      label: "Total Spent",
      value: formatMoney(totalSpent),
      icon: "ti-currency-rupee",
      color: "#34d399",
      bg: "#0d948822",
      border: "#0d948844",
      small: true,
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: "ti-clock",
      color: "#fcd34d",
      bg: "#d9770622",
      border: "#d9770644",
    },
    {
      label: "Completed Orders",
      value: completedOrders,
      icon: "ti-circle-check",
      color: "#c4b5fd",
      bg: "#7c3aed22",
      border: "#7c3aed44",
    },
  ];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>

      {/* HEADER */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#ffffff", margin: 0 }}>
          Welcome back, {currentUser?.fullName || currentUser?.email} 👋
        </h1>
        <p style={{ fontSize: "13px", color: "#a89fc0", marginTop: "4px" }}>
          Here is your account overview
        </p>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "28px" }}>
        {statCards.map((card) => (
          <div key={card.label} style={{
            background: "#211f2e",
            border: `1px solid ${card.border}`,
            borderRadius: "12px",
            padding: "20px",
            borderTop: `3px solid ${card.color}`,
          }}>
            <div style={{
              width: "38px", height: "38px", borderRadius: "10px",
              background: card.bg, display: "flex", alignItems: "center",
              justifyContent: "center", marginBottom: "14px",
            }}>
              <i className={`ti ${card.icon}`} style={{ fontSize: "20px", color: card.color }}></i>
            </div>
            <p style={{ fontSize: "11px", color: "#a89fc0", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: "600", margin: "0 0 8px" }}>
              {card.label}
            </p>
            <p style={{ fontSize: card.small ? "16px" : "26px", fontWeight: "700", color: "#ffffff", margin: 0 }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* BOTTOM GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

        {/* RECENT ORDERS */}
        <div style={{ background: "#211f2e", border: "1px solid #35314a", borderRadius: "12px", padding: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#ffffff", margin: 0 }}>
              Recent Orders
            </h2>
            <Link to="/user-dashboard/orders" style={{ fontSize: "12px", color: "#c4b5fd", textDecoration: "none", fontWeight: "500" }}>
              View All →
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div>
              {recentOrders.map((order) => (
                <div key={order._id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 0", borderBottom: "1px solid #2a2840",
                }}>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: "600", color: "#ffffff", margin: 0 }}>
                      Order #{order._id.slice(-6)}
                    </p>
                    <p style={{ fontSize: "11px", color: "#7a7090", margin: "3px 0 0" }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "13px", fontWeight: "600", color: "#34d399", margin: 0 }}>
                      {formatMoney(order.totalPrice)}
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
          ) : (
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <p style={{ color: "#7a7090", fontSize: "13px" }}>No orders yet</p>
              <Link to="/" style={{ display: "inline-block", marginTop: "12px", background: "#7c3aed", color: "#fff", padding: "8px 18px", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>
                Start Shopping
              </Link>
            </div>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div style={{ background: "#211f2e", border: "1px solid #35314a", borderRadius: "12px", padding: "22px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#ffffff", margin: "0 0 18px" }}>
            Quick Actions
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link to="/" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              background: "#7c3aed", color: "#ffffff",
              padding: "12px", borderRadius: "10px",
              textDecoration: "none", fontSize: "14px", fontWeight: "600",
            }}>
              🛍️ Continue Shopping
            </Link>

            <Link to="/user-dashboard/orders" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              background: "#2a2840", color: "#ffffff",
              border: "1px solid #35314a",
              padding: "12px", borderRadius: "10px",
              textDecoration: "none", fontSize: "14px", fontWeight: "500",
            }}>
              📦 Order History
            </Link>

            <Link to="/user-dashboard/payment-history" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              background: "#2a2840", color: "#ffffff",
              border: "1px solid #35314a",
              padding: "12px", borderRadius: "10px",
              textDecoration: "none", fontSize: "14px", fontWeight: "500",
            }}>
              💳 Payment History
            </Link>
          </div>

          {/* SUMMARY */}
          <div style={{ marginTop: "20px", padding: "14px", background: "#1a1825", borderRadius: "10px", border: "1px solid #2a2840" }}>
            <p style={{ fontSize: "11px", color: "#7a7090", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: "600", margin: "0 0 10px" }}>
              Account Summary
            </p>
            {[
              { label: "Total Orders", value: totalOrders },
              { label: "Completed", value: completedOrders },
              { label: "Pending", value: pendingOrders },
              { label: "Total Spent", value: formatMoney(totalSpent) },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #2a2840" }}>
                <span style={{ fontSize: "12px", color: "#a89fc0" }}>{item.label}</span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#ffffff" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;