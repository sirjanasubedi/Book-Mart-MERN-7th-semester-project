
import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cartItems.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        existingItem.quantity += 1;
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Quantity increased!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 });
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Product added to cart!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Product removed from cart",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    clearCart: (state) => {
      state.cartItems = [];
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Cart cleared!",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    incrementQuantity: (state, action) => {
      const item = state.cartItems.find((item) => item._id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action) => {
      const item = state.cartItems.find((item) => item._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else if (item && item.quantity === 1) {
        Swal.fire({
          title: "Remove item?",
          text: "Decreasing further will remove the item from cart",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Remove it!",
        }).then((result) => {
          if (result.isConfirmed) {
            state.cartItems = state.cartItems.filter(
              (cartItem) => cartItem._id !== action.payload
            );
          }
        });
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;