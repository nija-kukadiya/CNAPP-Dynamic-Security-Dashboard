import React from 'react';
import { X } from 'lucide-react';
import { useAppDispatch } from '../../store';
import { removeWidget } from '../../store/dashboardSlice';
import type { Widget } from '../../types/dashboard';
import { CustomTextWidget } from './charts/CustomTextWidget';
import { DonutChart } from './charts/DonutChart';
import { EmptyStateChart } from './charts/EmptyStateChart';
import { StackedBarChart } from './charts/StackedBarChart';

interface WidgetCardProps {
  widget: Widget;
  categoryId: string;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({ widget, categoryId }) => {
  const dispatch = useAppDispatch();

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeWidget({ categoryId, widgetId: widget.id }));
  };

  return (
    <div className="group relative flex flex-col justify-between bg-white rounded-2xl p-4 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-300 transition-all duration-200 min-h-[220px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight select-none">
          {widget.name}
        </h3>
        
        {/* Cross / Remove Icon Button */}
        <button
          onClick={handleRemove}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150"
          title="Remove widget from dashboard"
          aria-label={`Remove ${widget.name}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Widget Content Area */}
      <div className="flex-1 flex items-center justify-center w-full">
        {widget.type === 'donut' && (
          <DonutChart
            total={widget.total}
            totalLabel={widget.totalLabel}
            metrics={widget.metrics}
          />
        )}
        {widget.type === 'stacked-bar' && (
          <StackedBarChart
            total={widget.total}
            totalLabel={widget.totalLabel}
            metrics={widget.metrics}
          />
        )}
        {widget.type === 'empty-graph' && (
          <EmptyStateChart message={widget.text} />
        )}
        {widget.type === 'custom-text' && (
          <CustomTextWidget
            text={widget.text}
            createdAt={widget.createdAt}
          />
        )}
      </div>
    </div>
  );
};
