import React, { useState } from 'react';
import { Clock, MoreVertical, Plus, RotateCw } from 'lucide-react';
import { useAppDispatch } from '../../store';
import { openDrawer, resetDashboard } from '../../store/dashboardSlice';

export const ActionBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isRotating, setIsRotating] = useState(false);
  const [timeRange, setTimeRange] = useState('Last 2 days');
  const [showTimeMenu, setShowTimeMenu] = useState(false);

  const handleRefresh = () => {
    setIsRotating(true);
    setTimeout(() => {
      dispatch(resetDashboard());
      setIsRotating(false);
    }, 400);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
          CNAPP Dashboard
        </h1>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Add Widget Button */}
        <button
          onClick={() => dispatch(openDrawer())}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm transition-all duration-150 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <span>Add Widget</span>
          <Plus className="w-3.5 h-3.5 text-slate-500" />
        </button>

        {/* Refresh to Initial State Button */}
        <button
          onClick={handleRefresh}
          className="p-2 text-slate-600 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm transition-all duration-150 hover:border-slate-400 focus:outline-none"
          title="Reset Dashboard to Default"
          aria-label="Reset Dashboard"
        >
          <RotateCw
            className={`w-3.5 h-3.5 text-slate-600 transition-transform ${
              isRotating ? 'animate-spin' : ''
            }`}
          />
        </button>

        {/* More Options */}
        <button
          type="button"
          className="p-2 text-slate-600 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm transition-all duration-150 hover:border-slate-400 focus:outline-none"
          title="More Options"
          aria-label="More Options"
        >
          <MoreVertical className="w-3.5 h-3.5 text-slate-600" />
        </button>

        {/* Time Filter Select */}
        <div className="relative">
          <button
            onClick={() => setShowTimeMenu(!showTimeMenu)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-indigo-950 bg-white border border-indigo-900/30 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-900" />
            <span className="border-l border-slate-300 pl-2">{timeRange}</span>
            <span className="text-[10px] text-slate-500">▼</span>
          </button>

          {showTimeMenu && (
            <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 text-xs">
              {['Last 24 hours', 'Last 2 days', 'Last 7 days', 'Last 30 days'].map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setTimeRange(range);
                    setShowTimeMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 ${
                    timeRange === range ? 'font-semibold text-indigo-600 bg-indigo-50/50' : 'text-slate-700'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
