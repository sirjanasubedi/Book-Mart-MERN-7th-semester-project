import React from 'react';

const StatsCard = ({ icon, title, value, color = 'blue', description }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800 shadow-blue-100',
    green: 'bg-green-50 border-green-200 text-green-800 shadow-green-100',
    purple: 'bg-purple-50 border-purple-200 text-purple-800 shadow-purple-100',
    orange: 'bg-orange-50 border-orange-200 text-orange-800 shadow-orange-100',
    red: 'bg-red-50 border-red-200 text-red-800 shadow-red-100',
  };

  const iconBgClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    orange: 'bg-orange-100',
    red: 'bg-red-100',
  };

  return (
    <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${colorClasses[color]} hover:shadow-xl transition-shadow duration-200`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${iconBgClasses[color]} mr-4`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;