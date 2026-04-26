import React from 'react';
import { useGetAllOrdersQuery } from '../../../redux/features/orders/ordersApi';
import Loading from '../../../components/Loading';

const PaymentReports = () => {
  const { data: orders, isLoading, isError } = useGetAllOrdersQuery();

  // Filter only completed payments
  const completedPayments = orders?.filter(order => order.paymentStatus === 'COMPLETE') || [];

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading payment reports</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Payment Reports</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {completedPayments.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order._id.slice(-8)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs. {order.totalPrice}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentReports;