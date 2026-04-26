
import React from 'react';

const OrderDetails = ({ order, onBack, onStatusChange, getOrderStatus }) => {
  const orderStatus = getOrderStatus(order);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <button 
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Back to Orders
      </button>
      
      <h2 className="text-xl font-bold mb-4">Order Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold mb-2">Order Information</h3>
          <p><span className="font-medium">Order ID:</span> {order._id}</p>
          <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
          
          <div className="mt-2">
            <p className="font-medium">Payment Status:</p>
            <span className={`px-2 py-1 text-xs rounded ${
              order.paymentStatus === 'COMPLETE' ? 'bg-green-100 text-green-800' : 
              'bg-yellow-100 text-yellow-800'
            }`}>
              {order.paymentStatus}
            </span>
          </div>
          
          <div className="mt-2">
            <p className="font-medium">Order Status:</p>
            <span className={`px-2 py-1 text-xs rounded ${
              orderStatus === 'Processing' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {orderStatus}
            </span>
          </div>
          
          <p className="mt-2"><span className="font-medium">Payment Method:</span> {order.paymentMethod}</p>
          <p><span className="font-medium">Total Amount:</span> Rs. {order.totalPrice}</p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Customer Information</h3>
          <p><span className="font-medium">Name:</span> {order.name}</p>
          <p><span className="font-medium">Email:</span> {order.email}</p>
          <p><span className="font-medium">Phone:</span> {order.phone}</p>
          <p><span className="font-medium">Address:</span> 
            {order.address.city}, {order.address.state}, {order.address.country}
          </p>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold mb-2">Order Items</h3>
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.productIds?.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded" src={product.coverImage} alt={product.title} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rs. {product.price} 
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.quantity || 1}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;