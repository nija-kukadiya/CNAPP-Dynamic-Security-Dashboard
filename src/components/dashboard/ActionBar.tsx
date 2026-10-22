import React, { useEffect, useRef, useState } from 'react';
import { Clock, MoreVertical, Plus, RotateCw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { openDrawer, resetDashboard, setTimeRange } from '../../store/dashboardSlice';
import type { TimeRange } from '../../types/dashboard';

export const ActionBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const timeRange = useAppSelector((state) => state.dashboard.timeRange);

  const [isRotating, setIsRotating] = useState(false);
  const [showTimeMenu, setShowTimeMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowTimeMenu(false);
      }
    };
    if (showTimeMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showTimeMenu]);

  const handleRefresh = () => {
    setIsRotating(true);
    setTimeout(() => {
      dispatch(resetDashboard());
      setIsRotating(false);
    }, 400);
  };

  const handleSelectTimeRange = (range: TimeRange) => {
    dispatch(setTimeRange(range));
    setShowTimeMenu(false);
  };

  const timeOptions: TimeRange[] = [
    'Last 24 hours',
    'Last 2 days',
    'Last 7 days',
    'Last 30 days',
  ];

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
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-all duration-150 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
        >
          <span>Add Widget</span>
          <Plus className="w-3.5 h-3.5 text-slate-500" />
        </button>

        {/* Refresh to Initial State Button */}
        <button
          onClick={handleRefresh}
          className="p-2 text-slate-600 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-all duration-150 hover:border-slate-400 focus:outline-none cursor-pointer"
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
          className="p-2 text-slate-600 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-all duration-150 hover:border-slate-400 focus:outline-none cursor-pointer"
          title="More Options"
          aria-label="More Options"
        >
          <MoreVertical className="w-3.5 h-3.5 text-slate-600" />
        </button>

        {/* Time Filter Select */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowTimeMenu(!showTimeMenu)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-indigo-950 bg-white border border-indigo-900/30 rounded-lg shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
            aria-expanded={showTimeMenu}
            aria-haspopup="true"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-900 shrink-0" />
            <span className="border-l border-slate-300 pl-2">{timeRange}</span>
            <span className="text-[10px] text-slate-500 ml-0.5">▼</span>
          </button>

          {showTimeMenu && (
            <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                Select Time Window
              </div>
              {timeOptions.map((range) => {
                const isSelected = timeRange === range;
                return (
                  <button
                    key={range}
                    type="button"
                    onClick={() => handleSelectTimeRange(range)}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'font-bold text-indigo-700 bg-indigo-50/70'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{range}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
