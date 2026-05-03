import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import App from "../App";
import Home from "../pages/home/Home";
import About from "../components/About";
import Contact from "../pages/Contact";
import Register from "../components/Register";
import CartPage from "../pages/books/CartPage";
import CheckoutPage from "../pages/books/CheckoutPage";
import PrivateRoute from "./PrivateRoute";
import SingleBook from "../pages/books/SingleBook";
import OrderPage from "../pages/books/OrderPage";
import AdminRoute from "../routers/AdminRoute";
import AdminLogin from "../components/AdminLogin";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import ManageBooks from "../pages/dashboard/manageBooks/ManageBooks";
import AddBook from "../pages/dashboard/addBook/AddBook";
import UpdateBook from "../pages/dashboard/EditBook/UpdateBook";
import UserDashboard from "../pages/dashboard/users/UserDashboard";
import LoginChoice from "../components/LoginChoice";
import UserLogin from "../components/UserLogin";
import PasswordInput from "../pages/PasswordInput";
import Success from "../components/Success";
import Failure from "../components/Failure";
import PaymentForm from "../components/PaymentForm";
import OrderConfirmation from "../components/OrderConfirmation";
import UserProfile from "../pages/UserProfile";
import DashboardOverview from "../pages/dashboard/users/DashboardOverview";
import OrderHistory from "../pages/dashboard/users/OrderHistory";
import PaymentHistory from "../pages/dashboard/users/PaymentHistory";
import DashboardHome from "../pages/dashboard/DashboardHome";
import AdminOrders from "../pages/dashboard/orders/AdminOrders";
import PaymentReports from "../pages/dashboard/payments/PaymentReports";
import AdminUsers from "../pages/dashboard/orders/AdminUsers";
import Categories from "../pages/Categories";

import { getAnonymousUserId } from "../utils/userTracking";

if (!localStorage.getItem("uid")) {
  getAnonymousUserId();
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* MAIN APP ROUTES */}
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />

        {/* ✅ THIS IS YOUR FIX */}
        <Route path="/shop" element={<Categories />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<UserProfile />} />

        <Route path="/password" element={<PasswordInput />} />
        <Route path="/login" element={<LoginChoice />} />
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />

        <Route path="/payment" element={<PaymentForm />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/payment-success" element={<Success />} />
        <Route path="/payment-failure" element={<Failure />} />

        <Route path="/books/:id" element={<SingleBook />} />

        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />

        {/* USER DASHBOARD */}
        <Route
          path="/user-dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route
            path="orders/:orderId"
            element={
              <PrivateRoute>
                <OrderPage />
              </PrivateRoute>
            }
          />
          <Route path="payment-history" element={<PaymentHistory />} />
        </Route>
      </Route>

      {/* ADMIN */}
      <Route path="/admin" element={<AdminLogin />} />

      <Route element={<AdminRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="add-book" element={<AddBook />} />
          <Route path="edit-book/:id" element={<UpdateBook />} />
          <Route path="manage-books" element={<ManageBooks />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="payment-reports" element={<PaymentReports />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Route>
    </>
  )
);

export default router;
