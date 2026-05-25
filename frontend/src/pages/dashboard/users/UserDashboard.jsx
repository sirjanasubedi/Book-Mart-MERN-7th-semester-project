import React, { useEffect } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useGetOrderByEmailQuery } from "../../../redux/features/orders/ordersApi";

const userLinks = [
  { name: "Dashboard", to: "/user-dashboard", icon: "ti-layout-dashboard" },
  { name: "My Orders", to: "/user-dashboard/orders", icon: "ti-shopping-bag" },
  { name: "Payment History", to: "/user-dashboard/payment-history", icon: "ti-report-money" },
];

const UserDashboard = () => {
  const { currentUser, logout } = useAuth();
  const { data: orders = [], isLoading } = useGetOrderByEmailQuery(currentUser?.email);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css";
    document.head.appendChild(link);
  }, []);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#1a1825", color: "#c8bfe0", fontSize: "15px" }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#1a1825", color: "#f0eeff", fontFamily: "system-ui, sans-serif" }}>

      {/* SIDEBAR */}
      <aside style={{ width: "230px", flexShrink: 0, background: "#211f2e", borderRight: "1px solid #35314a", display: "flex", flexDirection: "column", justifyContent: "space-between", paddingBottom: "24px" }}>

        <div>
          {/* USER INFO */}
          <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #35314a", marginBottom: "16px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #db2777)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>
              {getInitials(currentUser?.fullName)}
            </div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "#ffffff" }}>
              {currentUser?.fullName || "User"}
            </div>
            <div style={{ fontSize: "12px", color: "#a89fc0", marginTop: "3px" }}>
              {currentUser?.email}
            </div>
            <div style={{ marginTop: "8px", background: "#7c3aed22", color: "#c4b5fd", border: "1px solid #7c3aed44", borderRadius: "20px", padding: "3px 10px", fontSize: "11px", fontWeight: "600", display: "inline-block" }}>
              {orders.length} Orders
            </div>
          </div>

          {/* NAV */}
          <nav style={{ padding: "0 12px" }}>
            <div style={{ fontSize: "10px", color: "#7a7090", padding: "8px 10px", letterSpacing: "1.2px", textTransform: "uppercase", fontWeight: "600" }}>
              My Account
            </div>
            {userLinks.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "11px 14px", borderRadius: "10px",
                    fontSize: "14px", fontWeight: active ? "600" : "500",
                    color: active ? "#ffffff" : "#c8bfe0",
                    background: active ? "#7c3aed" : "transparent",
                    textDecoration: "none", marginBottom: "3px",
                    border: active ? "none" : "1px solid transparent",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.background = "#35314a";
                      e.currentTarget.style.border = "1px solid #4a4560";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.color = "#c8bfe0";
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.border = "1px solid transparent";
                    }
                  }}
                >
                  <i className={`ti ${item.icon}`} style={{ fontSize: "17px" }}></i>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* LOGOUT */}
        <div style={{ padding: "0 12px" }}>
          <div style={{ borderTop: "1px solid #35314a", paddingTop: "16px" }}>
            <button
              onClick={() => { logout(); navigate("/"); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "10px",
                padding: "11px 14px", borderRadius: "10px",
                fontSize: "14px", fontWeight: "500",
                color: "#ff8080", background: "#3a1a1a",
                border: "1px solid #5a2a2a", cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#ef444433"; e.currentTarget.style.color = "#ffaaaa"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#3a1a1a"; e.currentTarget.style.color = "#ff8080"; }}
            >
              <i className="ti ti-logout" style={{ fontSize: "17px" }}></i>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* TOPBAR */}
        <div style={{ padding: "16px 32px", borderBottom: "1px solid #35314a", background: "#211f2e", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", margin: 0 }}>
              Welcome back, {currentUser?.fullName?.split(" ")[0] || "User"} 👋
            </h1>
            <p style={{ fontSize: "13px", color: "#a89fc0", marginTop: "3px" }}>
              Here is your account overview
            </p>
          </div>
          <Link
            to="/"
            style={{ background: "#7c3aed", color: "#ffffff", padding: "9px 18px", borderRadius: "10px", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}
          >
            🛍 Continue Shopping
          </Link>
        </div>

        {/* CONTENT */}
        <main style={{ flex: 1, padding: "32px", background: "#1a1825" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;