
import React from 'react';
import { FiX, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiClock } from 'react-icons/fi';

const UserDetailModal = ({ user, onClose }) => {
  
  const formatDate = (date) => {
    if (!date) return 'Not available';
    
    try {
      
      if (typeof date?.toDate === 'function') {
        return date.toDate().toLocaleString();
      }
      
      const jsDate = new Date(date);
      if (!isNaN(jsDate.getTime())) {
        return jsDate.toLocaleString();
      }
      return 'Invalid date';
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Date error';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">User Details</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <FiUser className="text-gray-500 mt-1 mr-3" size={18} />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">
                  {user.fullName || 'Not provided'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FiMail className="text-gray-500 mt-1 mr-3" size={18} />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FiPhone className="text-gray-500 mt-1 mr-3" size={18} />
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">{user.phone || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FiMapPin className="text-gray-500 mt-1 mr-3" size={18} />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{user.address || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">User ID</p>
              <p className="text-sm font-mono break-all">{user.id}</p>
            </div>

            <div className="flex items-start">
              <FiCalendar className="text-gray-500 mt-1 mr-3" size={18} />
              <div>
                <p className="text-sm text-gray-500">Account Created</p>
                <p className="text-sm font-medium">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <FiClock className="text-gray-500 mt-1 mr-3" size={18} />
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-sm font-medium">
                  {formatDate(user.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;