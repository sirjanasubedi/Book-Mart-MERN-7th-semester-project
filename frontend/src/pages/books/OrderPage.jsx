
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../../redux/features/orders/ordersApi';
import { useAuth } from '../../context/AuthContext';

const OrderPage = () => {
  const { orderId } = useParams();
  const { currentUser } = useAuth();
  const { data: order, isLoading, isError } = useGetOrderByIdQuery(orderId);

  if (isLoading) return <div className="text-center p-8">Loading order details...</div>;
  if (isError) return <div className="text-center p-8 text-red-600">Error loading order details</div>;
  if (!order) return <div className="text-center p-8">Order not found</div>;

  return (
    <div className='container mx-auto p-6'>
      <h2 className='text-2xl font-semibold mb-6'>Order Details</h2>
      
      <div className="border rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold">Order ID: {order._id}</h2>
            <p className="text-gray-600">
              {new Date(order.createdAt).toLocaleString()}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-medium text-gray-700">Customer Details</h3>
            <p className="text-gray-600">Name: {order.name}</p>
            <p className="text-gray-600">Email: {order.email}</p>
            <p className="text-gray-600">Phone: {order.phone}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Payment Details</h3>
            <p className="text-gray-600">Total: Rs.{order.totalPrice}</p>
            <p className="text-gray-600">Method: {order.paymentMethod}</p>
            <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-gray-700">Shipping Address</h3>
          <p className="text-gray-600">
            {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
          </p>
        </div>

        <div>
          

           <h3 className="font-medium text-gray-700">Products</h3>
                  <ul className="mt-1">
                    {order.productIds?.map((product) => (
                      <li key={product._id || product} className="text-gray-600">
    {typeof product === 'object' 
      ? `${product.title || 'Product'}`
      : `Product ID: ${product}`
      }
  </li>
))}

                    
                  </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;