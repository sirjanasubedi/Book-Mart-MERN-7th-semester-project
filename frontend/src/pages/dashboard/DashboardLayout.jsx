import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const adminLinks = [
  { name: "Overview", to: "/dashboard", icon: "ti-layout-dashboard" },
  { name: "Add Book", to: "/dashboard/add-book", icon: "ti-circle-plus" },
  { name: "Manage Books", to: "/dashboard/manage-books", icon: "ti-books" },
  { name: "Manage Categories", to: "/dashboard/manage-categories", icon: "ti-category" },
  { name: "Orders", to: "/dashboard/orders", icon: "ti-shopping-cart" },
  { name: "Payment Reports", to: "/dashboard/payment-reports", icon: "ti-report-money" },
  { name: "Users", to: "/dashboard/users", icon: "ti-users" },
];

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css";
    document.head.appendChild(link);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setAdminData(decoded);
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin");
  };

  const getInitials = (email) => {
    if (!email) return "A";
    return email.charAt(0).toUpperCase();
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#1a1825", color: "#f0eeff", fontFamily: "system-ui, sans-serif" }}>

      {/* SIDEBAR */}
      <aside style={{ width: "230px", flexShrink: 0, background: "#211f2e", borderRight: "1px solid #35314a", display: "flex", flexDirection: "column", justifyContent: "space-between", paddingBottom: "24px" }}>

        <div>
          {/* LOGO */}
          <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #35314a", marginBottom: "16px" }}>
            <div style={{ fontSize: "20px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.5px" }}>
              📚 Book-Mart
            </div>
            <div style={{ fontSize: "12px", color: "#a89fc0", marginTop: "4px", fontWeight: "500" }}>
              Admin Dashboard
            </div>
          </div>

          {/* NAV */}
          <nav style={{ padding: "0 12px" }}>
            <div style={{ fontSize: "10px", color: "#7a7090", padding: "8px 10px 8px", letterSpacing: "1.2px", textTransform: "uppercase", fontWeight: "600" }}>
              Navigation
            </div>
            {adminLinks.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "11px 14px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: isActive ? "600" : "500",
                    color: isActive ? "#ffffff" : "#c8bfe0",
                    background: isActive ? "#7c3aed" : "transparent",
                    textDecoration: "none",
                    marginBottom: "3px",
                    transition: "all 0.15s",
                    border: isActive ? "none" : "1px solid transparent",
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.background = "#35314a";
                      e.currentTarget.style.border = "1px solid #4a4560";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#c8bfe0";
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.border = "1px solid transparent";
                    }
                  }}
                >
                  <i className={`ti ${item.icon}`} style={{ fontSize: "17px", opacity: isActive ? 1 : 0.85 }}></i>
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
              onClick={handleLogout}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "11px 14px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#ff8080",
                background: "#3a1a1a",
                border: "1px solid #5a2a2a",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#ef444433";
                e.currentTarget.style.color = "#ffaaaa";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "#3a1a1a";
                e.currentTarget.style.color = "#ff8080";
              }}
            >
              <i className="ti ti-logout" style={{ fontSize: "17px" }}></i>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT SIDE */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>

        {/* TOPBAR */}
        <div style={{ padding: "16px 32px", borderBottom: "1px solid #35314a", background: "#211f2e", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#ffffff", margin: 0 }}>
              Welcome back, {adminData?.email || "Admin"} 👋
            </h1>
            <p style={{ fontSize: "13px", color: "#a89fc0", marginTop: "3px", fontWeight: "400" }}>
              Manage your store, books, and orders
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ background: "#2d2a40", color: "#d4c8ff", border: "1px solid #4a4560", borderRadius: "20px", padding: "7px 16px", fontSize: "13px", fontWeight: "500" }}>
              <i className="ti ti-bell" style={{ fontSize: "14px", marginRight: "6px" }}></i>
              Notifications
            </div>
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #db2777)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "700", color: "#fff", flexShrink: 0 }}>
              {getInitials(adminData?.email)}
            </div>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <main style={{ flex: 1, padding: "32px", background: "#1a1825" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;