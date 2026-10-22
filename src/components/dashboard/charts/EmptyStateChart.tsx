import React from 'react';
import { BarChart3 } from 'lucide-react';

interface EmptyStateChartProps {
  message?: string;
}

export const EmptyStateChart: React.FC<EmptyStateChartProps> = ({
  message = 'No Graph data available!',
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full py-8 text-center">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2.5 shadow-sm">
        <BarChart3 className="w-7 h-7 text-slate-400" />
      </div>
      <p className="text-xs font-medium text-slate-500 tracking-wide">
        {message}
      </p>
    </div>
  );
};
