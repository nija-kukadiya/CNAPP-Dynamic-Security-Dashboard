import React, { useMemo } from 'react';
import { Clock, SearchX } from 'lucide-react';
import { ActionBar } from './components/dashboard/ActionBar';
import { CategorySection } from './components/dashboard/CategorySection';
import { Navbar } from './components/dashboard/Navbar';
import { AddWidgetDrawer } from './components/drawer/AddWidgetDrawer';
import { useAppDispatch, useAppSelector } from './store';
import { setSearchQuery, setTimeRange } from './store/dashboardSlice';
import type { TimeRange, Widget } from './types/dashboard';

const TIME_RANGE_CONFIG: Record<
  TimeRange,
  { factor: number; label: string }
> = {
  'Last 24 hours': { factor: 0.38, label: 'Past 24 Hours' },
  'Last 2 days': { factor: 1.0, label: 'Past 48 Hours' },
  'Last 7 days': { factor: 2.75, label: 'Past 7 Days' },
  'Last 30 days': { factor: 9.4, label: 'Past 30 Days' },
};

const scaleWidgetForTimeRange = (widget: Widget, range: TimeRange): Widget => {
  const cfg = TIME_RANGE_CONFIG[range];
  if (!cfg || cfg.factor === 1.0) return widget;

  if (widget.metrics && widget.metrics.length > 0) {
    const scaledMetrics = widget.metrics.map((m) => {
      const scaledVal = Math.max(1, Math.round(m.value * cfg.factor));
      return {
        ...m,
        value: scaledVal,
      };
    });

    let newTotal = widget.total;
    if (typeof widget.total === 'number') {
      newTotal = scaledMetrics.reduce((sum, m) => sum + m.value, 0);
    } else if (typeof widget.total === 'string') {
      const numTotal = Number(widget.total);
      if (!isNaN(numTotal)) {
        newTotal = String(Math.round(numTotal * cfg.factor));
      }
    }

    return {
      ...widget,
      total: newTotal,
      metrics: scaledMetrics,
    };
  }

  return widget;
};

export const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, searchQuery, timeRange } = useAppSelector((state) => state.dashboard);

  // Filter widgets across all categories based on live search query and active time range
  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return categories.map((cat) => {
      // 1. Filter by search query
      const matchingWidgets = cat.widgets.filter((w) => {
        if (!query) return true;
        const nameMatch = w.name.toLowerCase().includes(query);
        const textMatch = w.text?.toLowerCase().includes(query) ?? false;
        const metricMatch =
          w.metrics?.some((m) => m.label.toLowerCase().includes(query)) ?? false;
        return nameMatch || textMatch || metricMatch;
      });

      // 2. Scale metrics based on the selected time range
      const timeScaledWidgets = matchingWidgets.map((w) =>
        scaleWidgetForTimeRange(w, timeRange)
      );

      return {
        category: cat,
        widgets: timeScaledWidgets,
      };
    });
  }, [categories, searchQuery, timeRange]);

  const totalMatchingWidgets = useMemo(() => {
    return filteredCategories.reduce((sum, item) => sum + item.widgets.length, 0);
  }, [filteredCategories]);

  return (
    <div className="min-h-screen bg-[#f0f5fa] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ActionBar />

        {/* Time Range Active Filter Notice (if not default) */}
        {timeRange !== 'Last 2 days' && (
          <div className="mb-4 flex items-center justify-between bg-indigo-50/80 border border-indigo-200/90 px-4 py-2.5 rounded-xl text-xs text-indigo-950 shadow-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-700 shrink-0" />
              <span>
                Time window active: <strong>{timeRange}</strong> ({TIME_RANGE_CONFIG[timeRange].label}). Metrics and chart distributions have updated.
              </span>
            </div>
            <button
              onClick={() => dispatch(setTimeRange('Last 2 days'))}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 underline ml-3 cursor-pointer shrink-0"
            >
              Reset to Last 2 days
            </button>
          </div>
        )}

        {/* Live Search Indicator if active */}
        {searchQuery.trim() && (
          <div className="mb-6 flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-indigo-100 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <span className="font-semibold text-indigo-700">Search active:</span>
              <span>
                Found <strong>{totalMatchingWidgets}</strong> widget
                {totalMatchingWidgets === 1 ? '' : 's'} matching &ldquo;{searchQuery}&rdquo;
              </span>
            </div>
            <button
              onClick={() => dispatch(setSearchQuery(''))}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Categories and Widgets */}
        {totalMatchingWidgets === 0 && searchQuery.trim() ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto my-12">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <SearchX className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              No widgets found
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              We couldn&apos;t find any widget matching &ldquo;{searchQuery}&rdquo;. Try another search term.
            </p>
            <button
              onClick={() => dispatch(setSearchQuery(''))}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCategories.map(({ category, widgets }) => (
              <CategorySection
                key={category.id}
                category={category}
                filteredWidgets={widgets}
              />
            ))}
          </div>
        )}
      </main>

      {/* Slide-out Add Widget Drawer */}
      <AddWidgetDrawer />

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 px-6 text-center text-xs text-slate-400">
        <span>CNAPP Security Dashboard &bull; Built with React, TypeScript & Redux Toolkit</span>
      </footer>
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
