// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useGetOrderByEmailQuery, useDeleteOrderMutation } from '../../../redux/features/orders/ordersApi';
// import { useAuth } from '../../../context/AuthContext';

// const OrderHistory = () => {
//   const navigate = useNavigate();
//   const { currentUser } = useAuth();
//   const { data: orders = [], isLoading, error } = useGetOrderByEmailQuery(currentUser?.email);
//   const [deleteOrder] = useDeleteOrderMutation();
//   const [filter, setFilter] = useState('all');

//   const filteredOrders = orders.filter(order => {
//     if (filter === 'all') return true;
//     return order.paymentStatus === filter.toUpperCase();
//   });

//   const handleDeleteOrder = async (orderId) => {
//     if (window.confirm('Are you sure you want to delete this order?')) {
//       try {
//         await deleteOrder(orderId).unwrap();
//         alert('Order deleted successfully');
//       } catch (error) {
//         alert('Failed to delete order');
//         console.error('Error deleting order:', error);
//       }
//     }
//   };


//   const handleViewDetails = (orderId) => {
//     navigate(`/user-dashboard/orders/${orderId}`);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-white p-8 rounded-lg shadow text-center text-red-500">
//         Error loading orders: {error.message}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">My Orders</h1>
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="border rounded-md px-3 py-1"
//         >
//           <option value="all">All Orders</option>
//           <option value="complete">Completed</option>
//           <option value="pending">Pending</option>
//         </select>
//       </div>

//       {filteredOrders.length === 0 ? (
//         <div className="bg-white p-8 rounded-lg shadow text-center">
//           <p className="text-gray-600">No orders found matching your criteria.</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {filteredOrders.map((order) => (
//             <div key={order._id} className="bg-white p-6 rounded-lg shadow">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h2 className="text-lg font-semibold">Order #{order._id.slice(-6)}</h2>
//                   <p className="text-gray-600">
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                   order.paymentStatus === "COMPLETE" 
//                     ? "bg-green-100 text-green-800" 
//                     : "bg-yellow-100 text-yellow-800"
//                 }`}>
//                   {order.paymentStatus}
//                 </span>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                 <div>
//                   <h3 className="font-medium text-gray-700">Products</h3>
//                   <ul className="mt-1">
//                     {order.productIds?.map((product) => (
//                       <li key={product._id} className="text-gray-600">
//                         {product.title || product._id} - Rs. {product.price}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-gray-700">Total</h3>
//                   <p className="text-gray-600">Rs.{order.totalPrice}</p>
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-gray-700">Payment Method</h3>
//                   <p className="text-gray-600">{order.paymentMethod}</p>
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-2">
//                 {order.paymentStatus === "PENDING" && (
//                   <button
//                     onClick={() => handleDeleteOrder(order._id)}
//                     className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//                   >
//                     Cancel Order
//                   </button>
//                 )}
//                 <button
//                   onClick={() => handleViewDetails(order._id)}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                 >
//                   View Details
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderHistory;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetOrderByEmailQuery, useDeleteOrderMutation } from '../../../redux/features/orders/ordersApi';
import { useAuth } from '../../../context/AuthContext';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { data: orders = [], isLoading, error } = useGetOrderByEmailQuery(currentUser?.email);
  const [deleteOrder] = useDeleteOrderMutation();
  const [filter, setFilter] = useState('all');

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.paymentStatus === filter.toUpperCase();
  });

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(orderId).unwrap();
        alert('Order deleted successfully');
      } catch (error) {
        alert('Failed to delete order');
        console.error('Error deleting order:', error);
      }
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/user-dashboard/orders/${orderId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center text-red-500">
        Error loading orders: {error.message}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-md px-3 py-1"
        >
          <option value="all">All Orders</option>
          <option value="complete">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600">No orders found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Order #{order._id.slice(-6)}</h2>
                  <p className="text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.paymentStatus === "COMPLETE" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {order.paymentStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <h3 className="font-medium text-gray-700">Products</h3>
                  <ul className="mt-1">
                    {order.productIds?.map((product) => (
                      <li key={product._id || product} className="text-gray-600">
                        {typeof product === 'object' 
                          ? `${product.title || 'Product'}`
                          : 
                          `Product ID: ${product}
                          `}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Total</h3>
                  <p className="text-gray-600">Rs. {order.totalPrice}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Payment Method</h3>
                  <p className="text-gray-600">{order.paymentMethod}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                {order.paymentStatus === "PENDING" && (
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Cancel Order
                  </button>
                )}
                <button
                  onClick={() => handleViewDetails(order._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;