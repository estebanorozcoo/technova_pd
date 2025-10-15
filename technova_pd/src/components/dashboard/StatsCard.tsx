import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  change?: {
    value: string;
    positive: boolean;
  };
  description?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  change,
  description,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          
          {change && (
            <div className="flex items-center space-x-1">
              <span
                className={`text-sm font-medium ${
                  change.positive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change.positive ? '↗' : '↘'} {change.value}
              </span>
              <span className="text-xs text-gray-500">vs. mes anterior</span>
            </div>
          )}
          
          {description && (
            <p className="text-xs text-gray-500 mt-2">{description}</p>
          )}
        </div>

        <div className="flex-shrink-0 ml-4">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <span className="text-2xl">{icon}</span>
          </div>
        </div>
      </div>
    </div>
  );
}