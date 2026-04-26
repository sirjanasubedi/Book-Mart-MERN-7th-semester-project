
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/firebase.config';
import Loading from '../../../components/Loading';
import { toast } from 'react-toastify';
import { FiSearch, FiTrash2, FiEye, FiAlertCircle } from 'react-icons/fi';
import UserDetailModal from '../orders/UserDetailModal';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Fetch all users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = [];
        
        querySnapshot.forEach((doc) => {
          usersData.push({
            id: doc.id,
            ...doc.data()
          });
        });

        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (uid) => {
    if (!window.confirm('Delete this user from Firebase?')) return;
    try {
      
      toast.success('User deleted');
      setUsers(users.filter(user => user.id !== uid));
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return <Loading />;
  if (error) return <div>Error loading users: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}

      {/* Main Content */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <FiAlertCircle className="mx-auto text-4xl text-gray-400 mb-3" />
          <p className="text-gray-600">No users found matching "{searchTerm}"</p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="mt-3 text-blue-500 hover:text-blue-700"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.fullName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-3">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-500 hover:text-blue-700 transition-colors flex items-center"
                        title="View user details"
                      >
                        <FiEye className="mr-1" /> View
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="text-red-500 hover:text-red-700 transition-colors flex items-center"
                        title="Delete user"
                      >
                        <FiTrash2 className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;