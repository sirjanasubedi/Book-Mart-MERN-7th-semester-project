// import React from 'react';
// import { useGetAllUsersQuery } from '../../../redux/usersApi';
// import Loading from '../../../components/Loading';

// const UsersList = () => {
//   const { data: users, isLoading, isError } = useGetAllUsersQuery();

//   if (isLoading) return <Loading />;
//   if (isError) return <div>Error loading users</div>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">All Users</h1>
      
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {users?.map((user) => (
//               <tr key={user._id}>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                     ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
//                     {user.role}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <button className="text-red-600 hover:text-red-900">Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default UsersList;






import React, { useState } from 'react';
import { 
  useGetAllOrdersQuery, 
  useDeleteOrderMutation, 
  useUpdateOrderStatusMutation 
} from '../../../redux/features/orders/ordersApi';
import Loading from '../../../components/Loading';
import OrderDetails from '../orders/OrderDetails';
import { toast } from 'react-toastify';

const UserList = () => {
  const { data: orders, isLoading, isError, refetch } = useGetAllOrdersQuery();
  const [deleteOrder] = useDeleteOrderMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading orders</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
      
      {selectedOrder ? (
        <OrderDetails 
          order={selectedOrder} 
          onBack={() => setSelectedOrder(null)} 
          onStatusChange={handleStatusChange}
        />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders?.map((order) => (
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`px-2 py-1 text-xs rounded ${
                        order.paymentStatus === 'COMPLETE' ? 'bg-green-100 text-green-800' : 
                        order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="COMPLETE">COMPLETE</option>
                      <option value="FAILED">FAILED</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.paymentMethod}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      View
                    </button>
                    {order.paymentStatus === 'PENDING' && (
                      <button 
                        onClick={() => handleDelete(order._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;