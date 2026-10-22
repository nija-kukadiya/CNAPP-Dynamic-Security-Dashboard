import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import initialData from '../data/initialDashboardData.json';
import type { Category, Widget } from '../types/dashboard';

interface DashboardState {
  categories: Category[];
  // Registry tracks all widgets ever known for each category so they can be toggled on/off
  widgetRegistry: Record<string, Widget[]>;
  searchQuery: string;
  isDrawerOpen: boolean;
  selectedCategoryId: string;
  activeDrawerTab: string;
}

const LOCAL_STORAGE_KEY = 'cnapp_dashboard_state_v1';

// Seed initial registry from initial data
const buildInitialRegistry = (categories: Category[]): Record<string, Widget[]> => {
  const registry: Record<string, Widget[]> = {};
  categories.forEach((cat) => {
    registry[cat.id] = [...cat.widgets];
  });
  // Ensure ticket category has some pre-built widgets as well
  if (!registry['ticket']) {
    registry['ticket'] = [];
  }
  return registry;
};

const loadPersistedState = (): { categories: Category[]; widgetRegistry: Record<string, Widget[]> } | null => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const persisted = loadPersistedState();

const initialCategories: Category[] = persisted?.categories || (initialData.categories as Category[]);
const initialRegistry: Record<string, Widget[]> = persisted?.widgetRegistry || buildInitialRegistry(initialData.categories as Category[]);

const initialState: DashboardState = {
  categories: initialCategories,
  widgetRegistry: initialRegistry,
  searchQuery: '',
  isDrawerOpen: false,
  selectedCategoryId: 'cspm',
  activeDrawerTab: 'cspm',
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    openDrawer: (state, action: PayloadAction<string | undefined>) => {
      state.isDrawerOpen = true;
      if (action.payload) {
        state.selectedCategoryId = action.payload;
        state.activeDrawerTab = action.payload;
      }
    },

    closeDrawer: (state) => {
      state.isDrawerOpen = false;
    },

    setActiveDrawerTab: (state, action: PayloadAction<string>) => {
      state.activeDrawerTab = action.payload;
    },

    // Remove widget directly from category (via ✕ icon or uncheck)
    removeWidget: (
      state,
      action: PayloadAction<{ categoryId: string; widgetId: string }>
    ) => {
      const { categoryId, widgetId } = action.payload;
      const cat = state.categories.find((c) => c.id === categoryId);
      if (cat) {
        cat.widgets = cat.widgets.filter((w) => w.id !== widgetId);
      }
    },

    // Add a brand-new custom widget (created from form)
    addNewWidget: (
      state,
      action: PayloadAction<{ categoryId: string; name: string; text: string }>
    ) => {
      const { categoryId, name, text } = action.payload;
      const newWidget: Widget = {
        id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name,
        type: 'custom-text',
        text,
        createdAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      // Add to category widgets
      const cat = state.categories.find((c) => c.id === categoryId);
      if (cat) {
        cat.widgets.push(newWidget);
      }

      // Add to registry so it appears in the drawer checklist
      if (!state.widgetRegistry[categoryId]) {
        state.widgetRegistry[categoryId] = [];
      }
      state.widgetRegistry[categoryId].push(newWidget);
    },

    // Toggle widget presence on dashboard via drawer checkbox
    toggleWidgetSelection: (
      state,
      action: PayloadAction<{
        categoryId: string;
        widgetId: string;
        isSelected: boolean;
      }>
    ) => {
      const { categoryId, widgetId, isSelected } = action.payload;
      const cat = state.categories.find((c) => c.id === categoryId);
      if (!cat) return;

      if (isSelected) {
        // Add if not already present
        const alreadyExists = cat.widgets.some((w) => w.id === widgetId);
        if (!alreadyExists) {
          const widgetFromRegistry = state.widgetRegistry[categoryId]?.find(
            (w) => w.id === widgetId
          );
          if (widgetFromRegistry) {
            cat.widgets.push(widgetFromRegistry);
          }
        }
      } else {
        // Remove
        cat.widgets = cat.widgets.filter((w) => w.id !== widgetId);
      }
    },

    // Reset everything back to the initial seed data
    resetDashboard: (state) => {
      state.categories = initialData.categories as Category[];
      state.widgetRegistry = buildInitialRegistry(initialData.categories as Category[]);
      state.searchQuery = '';
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch {
        // ignore
      }
    },
  },
});

export const {
  setSearchQuery,
  openDrawer,
  closeDrawer,
  setActiveDrawerTab,
  removeWidget,
  addNewWidget,
  toggleWidgetSelection,
  resetDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
