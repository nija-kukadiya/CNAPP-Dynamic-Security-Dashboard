import React from 'react';
import type { WidgetMetric } from '../../../types/dashboard';

interface StackedBarChartProps {
  total?: number | string;
  totalLabel?: string;
  metrics?: WidgetMetric[];
}

export const StackedBarChart: React.FC<StackedBarChartProps> = ({
  total,
  totalLabel = 'Total Items',
  metrics = [],
}) => {
  const sum = metrics.reduce((acc, m) => acc + m.value, 0) || 1;

  return (
    <div className="flex flex-col justify-center w-full h-full py-1 gap-3">
      {/* Total Header */}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900 leading-none">
          {total ?? sum}
        </span>
        <span className="text-xs font-medium text-slate-500">
          {totalLabel}
        </span>
      </div>

      {/* Stacked Progress Bar */}
      <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
        {metrics.map((metric, idx) => {
          const widthPercent = (metric.value / sum) * 100;
          if (widthPercent === 0) return null;

          return (
            <div
              key={idx}
              className="h-full transition-all duration-500 hover:opacity-90 relative group"
              style={{
                width: `${widthPercent}%`,
                backgroundColor: metric.color,
              }}
              title={`${metric.label}: ${metric.value}`}
            />
          );
        })}
      </div>

      {/* Legend with colored squares/dots */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs">
        {metrics.map((metric, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: metric.color }}
            />
            <span className="text-slate-600 font-medium">
              {metric.label}
            </span>
            <span className="text-slate-800 font-bold">
              ({metric.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
