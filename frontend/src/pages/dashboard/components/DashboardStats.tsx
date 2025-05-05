import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

interface DashboardStatsProps {
  title: string;
  value: string;
  trend: number;
  trendDirection: 'up' | 'down';
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  title,
  value,
  trend,
  trendDirection,
  icon,
  iconBg,
  iconColor,
}) => {
  return (
    <Card className="p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
          
          <div className="mt-2 flex items-center">
            <span
              className={`flex items-center text-xs font-medium ${
                trendDirection === 'up' ? 'text-success-700' : 'text-error-700'
              }`}
            >
              {trendDirection === 'up' ? (
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 mr-1" />
              )}
              {Math.abs(trend)}%
            </span>
            <span className="text-xs text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        
        <div className={`${iconBg} ${iconColor} h-10 w-10 rounded-full flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default DashboardStats;