import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  addNewWidget,
  closeDrawer,
  setActiveDrawerTab,
  toggleWidgetSelection,
} from '../../store/dashboardSlice';

export const AddWidgetDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    isDrawerOpen,
    categories,
    widgetRegistry,
    activeDrawerTab,
  } = useAppSelector((state) => state.dashboard);

  // Form states for creating a new custom widget
  const [customName, setCustomName] = useState('');
  const [customText, setCustomText] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  if (!isDrawerOpen) return null;

  // Tabs list derived from categories
  const tabs = categories.map((cat) => ({
    id: cat.id,
    label: cat.shortCode,
    name: cat.name,
  }));

  const currentCategory = categories.find((cat) => cat.id === activeDrawerTab) || categories[0];
  const registeredWidgets = widgetRegistry[activeDrawerTab] || [];
  const activeWidgetIds = new Set(currentCategory?.widgets.map((w) => w.id) || []);

  const handleCheckboxChange = (widgetId: string, currentlyChecked: boolean) => {
    dispatch(
      toggleWidgetSelection({
        categoryId: activeDrawerTab,
        widgetId,
        isSelected: !currentlyChecked,
      })
    );
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

    dispatch(
      addNewWidget({
        categoryId: activeDrawerTab,
        name: customName.trim(),
        text: customText.trim(),
      })
    );

    setCustomName('');
    setCustomText('');
    setError('');
    setShowForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => dispatch(closeDrawer())}
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
            <h2 id="drawer-title" className="text-sm font-semibold tracking-wide">
              Add Widget
            </h2>
            <button
              onClick={() => dispatch(closeDrawer())}
              className="p-1 text-slate-300 hover:text-white rounded-md hover:bg-white/10 transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Subtitle & Category Tabs */}
          <div className="border-b border-slate-200 bg-white">
            <p className="px-6 pt-4 pb-2 text-xs text-slate-600 font-medium">
              Personalise your dashboard by adding or removing the following widgets
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
                    className={`pb-2.5 pt-1 border-b-2 transition-colors whitespace-nowrap ${
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
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Checklist of Registered Widgets */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Available in {currentCategory?.shortCode}
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {currentCategory?.widgets.length} of {registeredWidgets.length} displayed
                </span>
              </div>

              {registeredWidgets.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  No pre-defined widgets in this category. Use the form below to create one!
                </div>
              ) : (
                <div className="space-y-2">
                  {registeredWidgets.map((widget) => {
                    const isChecked = activeWidgetIds.has(widget.id);
                    return (
                      <label
                        key={widget.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all duration-150 ${
                          isChecked
                            ? 'border-indigo-200 bg-indigo-50/40 text-slate-900'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCheckboxChange(widget.id, isChecked)}
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

            {/* Custom Widget Addition Accordion / Form */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Create New Widget
                </span>
                {!showForm && (
                  <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New</span>
                  </button>
                )}
              </div>

              {showForm && (
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
                      placeholder="e.g. Compliance Health Check"
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
                        setShowForm(false);
                        setError('');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                    >
                      Create Widget
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
              onClick={() => dispatch(closeDrawer())}
              className="px-4 py-2 text-xs font-semibold text-indigo-950 bg-white border border-indigo-950 rounded-lg hover:bg-slate-100 transition-colors shadow-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => dispatch(closeDrawer())}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-950 rounded-lg hover:bg-indigo-900 transition-colors shadow-xs"
            >
              Confirm
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
