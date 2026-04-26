
import React, { useState } from 'react';
import { 
  useGetAllOrdersQuery, 
  useDeleteOrderMutation, 
  useUpdateOrderStatusMutation 
} from '../../../redux/features/orders/ordersApi';
import Loading from '../../../components/Loading';
import OrderDetails from './OrderDetails';
import { toast } from 'react-toastify';
import { FiSearch } from 'react-icons/fi';

const AdminOrders = () => {
  const { data: orders, isLoading, isError, refetch } = useGetAllOrdersQuery();
  const [deleteOrder] = useDeleteOrderMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(orderId).unwrap();
        toast.success('Order deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete order');
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      toast.success('Order status updated');
      refetch();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  // Filter orders based on search term
  const filteredOrders = orders?.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Determine Order Status based on Payment Method and Payment Status
  const getOrderStatus = (order) => {
    if (order.paymentMethod === 'Cash on Delivery') {
      return 'PENDING'; // COD orders start as Pending
    }
    if (order.paymentStatus === 'COMPLETE') {
      return 'PROCESSING'; // Paid orders that are being processed
    }
    return 'PENDING'; // Default fallback
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading orders</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Orders</h1>
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by Order ID or Email..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {selectedOrder ? (
        <OrderDetails 
          order={selectedOrder} 
          onBack={() => setSelectedOrder(null)} 
          onStatusChange={handleStatusChange}
          getOrderStatus={getOrderStatus}
        />
      ) : (
        <div className="bg-white  rounded-lg shadow overflow-auto">
          <table className="min-w-full  divide-y-4  divide-gray-200">
            <thead className="bg-gray-50 ">
              <tr >
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Payment Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const orderStatus = getOrderStatus(order);
                return (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:underline"
                      >
                        {order._id.slice(-8)}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs. {order.totalPrice}</td>
                    
                    {/* Payment Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded ${
                        order.paymentStatus === 'COMPLETE' ? 'bg-green-100 text-green-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    
                    {/* Order Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded ${
                        orderStatus === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {orderStatus}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.paymentMethod}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        View
                      </button>
                      {orderStatus === 'Pending' && (
                        <button 
                          onClick={() => handleDelete(order._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No orders found matching your search
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;