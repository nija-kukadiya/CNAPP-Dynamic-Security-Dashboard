import React from 'react';
import { Bell, ChevronRight, Search, User, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setSearchQuery } from '../../store/dashboardSlice';

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.dashboard.searchQuery);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-6 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium select-none">
          <span className="hover:text-slate-600 cursor-pointer transition-colors">Home</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-800 font-bold">Dashboard V2</span>
        </nav>

        {/* Global Live Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Search anything..."
              className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-800 placeholder-slate-400 pl-9 pr-8 py-2 rounded-lg border border-slate-200/80 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all duration-150"
            />
            {searchQuery && (
              <button
                onClick={() => dispatch(setSearchQuery(''))}
                className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* User & Notification Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white" />
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-indigo-600/10 text-indigo-700 flex items-center justify-center font-semibold text-xs border border-indigo-200">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
              Nija K.
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
