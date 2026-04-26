

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/orders`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Orders', 'Order'], // Added 'Order' tag type for individual orders
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: "/",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ['Orders']
    }),
    
    getOrderByEmail: builder.query({
      query: (email) => `/email/${email}`,
      providesTags: ['Orders']
    }),
    
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Orders', 'Order'],
      async onQueryStarted(orderId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          ordersApi.util.updateQueryData('getAllOrders', undefined, (draft) => {
            return draft.filter(order => order._id !== orderId);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),
    
    getAllOrders: builder.query({
      query: () => "/",
      providesTags: ['Orders']
    }),
    
    getOrderById: builder.query({
      query: (orderId) => `/${orderId}`, // Fixed the URL (removed duplicate /orders)
      providesTags: (result, error, orderId) => [{ type: 'Order', id: orderId }],
    }),
    
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ['Orders', 'Order'],
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          ordersApi.util.updateQueryData('getAllOrders', undefined, (draft) => {
            const order = draft.find(order => order._id === id);
            if (order) {
              order.paymentStatus = status;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    })
  })
});

export const {
  useCreateOrderMutation,
  useGetOrderByEmailQuery,
  useDeleteOrderMutation,
  useGetOrderByIdQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation
} = ordersApi;

export default ordersApi;