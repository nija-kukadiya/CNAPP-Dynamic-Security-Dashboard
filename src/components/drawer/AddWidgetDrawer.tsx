import React, { useEffect, useState } from 'react';
import { Check, Plus, Search, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  addNewWidget,
  closeDrawer,
  setActiveDrawerTab,
  syncCategoryWidgets,
} from '../../store/dashboardSlice';

export const AddWidgetDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    isDrawerOpen,
    categories,
    widgetRegistry,
    activeDrawerTab,
  } = useAppSelector((state) => state.dashboard);

  // Staged widget selection for all categories (categoryId -> array of widgetIds)
  const [stagedMap, setStagedMap] = useState<Record<string, string[]>>({});

  // Filter inside the drawer
  const [drawerSearch, setDrawerSearch] = useState('');

  // Form states for creating a new custom widget
  const [customName, setCustomName] = useState('');
  const [customText, setCustomText] = useState('');
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Initialize staged map whenever drawer opens
  useEffect(() => {
    if (isDrawerOpen) {
      const initialMap: Record<string, string[]> = {};
      categories.forEach((cat) => {
        initialMap[cat.id] = cat.widgets.map((w) => w.id);
      });
      setStagedMap(initialMap);
      setDrawerSearch('');
      setError('');
    }
  }, [isDrawerOpen, categories]);

  if (!isDrawerOpen) return null;

  // Tabs list derived from categories
  const tabs = categories.map((cat) => ({
    id: cat.id,
    label: cat.shortCode,
    name: cat.name,
  }));

  const currentCategory = categories.find((cat) => cat.id === activeDrawerTab) || categories[0];
  const registeredWidgets = widgetRegistry[activeDrawerTab] || [];
  const stagedActiveIds = new Set(stagedMap[activeDrawerTab] || []);

  // Filter widgets inside drawer by search query
  const filteredRegisteredWidgets = registeredWidgets.filter((w) => {
    if (!drawerSearch.trim()) return true;
    const q = drawerSearch.toLowerCase();
    return (
      w.name.toLowerCase().includes(q) ||
      (w.text && w.text.toLowerCase().includes(q))
    );
  });

  const handleToggleCheckbox = (widgetId: string) => {
    setStagedMap((prev) => {
      const currentList = prev[activeDrawerTab] || [];
      const isAlreadyChecked = currentList.includes(widgetId);
      const updatedList = isAlreadyChecked
        ? currentList.filter((id) => id !== widgetId)
        : [...currentList, widgetId];

      return {
        ...prev,
        [activeDrawerTab]: updatedList,
      };
    });
  };

  const handleCreateCustomWidget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) {
      setError('Please provide a widget name');
      return;
    }
    if (!customText.trim()) {
      setError('Please provide widget text or description');
      return;
    }

    const newWidgetId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    dispatch(
      addNewWidget({
        categoryId: activeDrawerTab,
        name: customName.trim(),
        text: customText.trim(),
      })
    );

    // Automatically stage the newly created widget so it gets included on Confirm
    setStagedMap((prev) => ({
      ...prev,
      [activeDrawerTab]: [...(prev[activeDrawerTab] || []), newWidgetId],
    }));

    setCustomName('');
    setCustomText('');
    setError('');
    setIsFormOpen(false);
  };

  const handleConfirm = () => {
    dispatch(syncCategoryWidgets(stagedMap));
    dispatch(closeDrawer());
  };

  const handleCancel = () => {
    dispatch(closeDrawer());
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={handleCancel}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
          className="w-screen max-w-lg bg-white shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="bg-[#14142b] text-white px-6 py-4 flex items-center justify-between">
            <div>
              <h2 id="drawer-title" className="text-sm font-semibold tracking-wide">
                Add Widget
              </h2>
            </div>
            <button
              onClick={handleCancel}
              className="p-1 text-slate-300 hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Subtitle & Category Tabs */}
          <div className="border-b border-slate-200 bg-white">
            <p className="px-6 pt-3.5 pb-2 text-xs text-slate-600 font-medium">
              Personalise your dashboard by adding the following widget
            </p>

            {/* Horizontal Tabs */}
            <div className="flex px-6 space-x-6 overflow-x-auto text-xs font-semibold scrollbar-none">
              {tabs.map((tab) => {
                const isActive = tab.id === activeDrawerTab;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      dispatch(setActiveDrawerTab(tab.id));
                      setError('');
                    }}
                    className={`pb-2.5 pt-1 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'border-indigo-900 text-indigo-950 font-bold'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
            {/* Quick Search inside Drawer */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={drawerSearch}
                onChange={(e) => setDrawerSearch(e.target.value)}
                placeholder={`Search widgets in ${currentCategory?.shortCode}...`}
                className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Checklist of Registered Widgets */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Available in {currentCategory?.shortCode} ({registeredWidgets.length})
                </span>
                <span className="text-slate-400 font-medium text-[11px]">
                  {stagedActiveIds.size} selected
                </span>
              </div>

              {filteredRegisteredWidgets.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  {drawerSearch
                    ? 'No matching widgets found.'
                    : 'No widgets available in this category. Create one below!'}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredRegisteredWidgets.map((widget) => {
                    const isChecked = stagedActiveIds.has(widget.id);
                    return (
                      <label
                        key={widget.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all duration-150 ${
                          isChecked
                            ? 'border-indigo-200 bg-indigo-50/50 text-slate-900'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleCheckbox(widget.id)}
                          className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                        />
                        <div className="flex-1 truncate">
                          <span className="text-xs font-semibold block truncate">
                            {widget.name}
                          </span>
                          {widget.text && (
                            <span className="text-[11px] text-slate-400 block truncate">
                              {widget.text}
                            </span>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Create Custom Widget Form */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Add Custom Widget to {currentCategory?.shortCode}
                </span>
                {!isFormOpen && (
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Widget</span>
                  </button>
                )}
              </div>

              {isFormOpen && (
                <form
                  onSubmit={handleCreateCustomWidget}
                  className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200"
                >
                  {error && (
                    <div className="p-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Widget Name
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => {
                        setCustomName(e.target.value);
                        setError('');
                      }}
                      placeholder="e.g. Workload Vulnerabilities Summary"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Widget Text / Content
                    </label>
                    <textarea
                      value={customText}
                      onChange={(e) => {
                        setCustomText(e.target.value);
                        setError('');
                      }}
                      placeholder="Enter random text or details for this widget..."
                      rows={3}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsFormOpen(false);
                        setError('');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Create & Select</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Drawer Footer Buttons */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-xs font-semibold text-indigo-950 bg-white border border-indigo-950 rounded-lg hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-950 rounded-lg hover:bg-indigo-900 transition-colors shadow-xs cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
