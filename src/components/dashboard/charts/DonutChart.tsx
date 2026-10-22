import React from 'react';
import type { WidgetMetric } from '../../../types/dashboard';

interface DonutChartProps {
  total?: number | string;
  totalLabel?: string;
  metrics?: WidgetMetric[];
}

export const DonutChart: React.FC<DonutChartProps> = ({
  total,
  totalLabel = 'Total',
  metrics = [],
}) => {
  const sum = metrics.reduce((acc, m) => acc + m.value, 0) || 1;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  // Calculate cumulative stroke dash offset for each segment
  let accumulatedPercent = 0;

  return (
    <div className="flex items-center justify-between w-full h-full py-2 gap-4">
      {/* Donut graphic */}
      <div className="relative flex items-center justify-center shrink-0 w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#f1f5f9"
            strokeWidth="14"
            fill="transparent"
          />

          {metrics.map((metric, idx) => {
            const percent = metric.value / sum;
            const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
            const strokeDashoffset = -circumference * accumulatedPercent;
            accumulatedPercent += percent;

            return (
              <circle
                key={idx}
                cx="50"
                cy="50"
                r={radius}
                stroke={metric.color}
                strokeWidth="14"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                fill="transparent"
                className="transition-all duration-500 ease-out hover:opacity-80"
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-xl font-bold tracking-tight text-slate-800 leading-none">
            {total !== undefined ? total : sum}
          </span>
          <span className="text-[11px] font-medium text-slate-500 mt-0.5">
            {totalLabel}
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="flex flex-col gap-1.5 flex-1 pl-2 text-xs">
        {metrics.map((metric, idx) => (
          <div key={idx} className="flex items-center justify-between group">
            <div className="flex items-center gap-2 truncate">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: metric.color }}
              />
              <span className="text-slate-600 truncate font-medium">
                {metric.label}
              </span>
            </div>
            <span className="text-slate-800 font-semibold ml-2">
              ({metric.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
