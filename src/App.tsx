import React, { useMemo } from 'react';
import { ActionBar } from './components/dashboard/ActionBar';
import { CategorySection } from './components/dashboard/CategorySection';
import { Navbar } from './components/dashboard/Navbar';
import { AddWidgetDrawer } from './components/drawer/AddWidgetDrawer';
import { useAppDispatch, useAppSelector } from './store';
import { setSearchQuery } from './store/dashboardSlice';
import { SearchX } from 'lucide-react';

export const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, searchQuery } = useAppSelector((state) => state.dashboard);

  // Filter widgets across all categories based on the live search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return categories.map((cat) => ({
        category: cat,
        widgets: cat.widgets,
      }));
    }

    const query = searchQuery.toLowerCase().trim();

    return categories.map((cat) => {
      const matchingWidgets = cat.widgets.filter((w) => {
        const nameMatch = w.name.toLowerCase().includes(query);
        const textMatch = w.text?.toLowerCase().includes(query) ?? false;
        const metricMatch =
          w.metrics?.some((m) => m.label.toLowerCase().includes(query)) ?? false;
        return nameMatch || textMatch || metricMatch;
      });

      return {
        category: cat,
        widgets: matchingWidgets,
      };
    });
  }, [categories, searchQuery]);

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

        {/* Live Search Indicator if active */}
        {searchQuery.trim() && (
          <div className="mb-6 flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-indigo-100 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <span className="font-semibold text-indigo-700">Filter active:</span>
              <span>
                Found <strong>{totalMatchingWidgets}</strong> widget
                {totalMatchingWidgets === 1 ? '' : 's'} matching &ldquo;{searchQuery}&rdquo;
              </span>
            </div>
            <button
              onClick={() => dispatch(setSearchQuery(''))}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
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
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
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
