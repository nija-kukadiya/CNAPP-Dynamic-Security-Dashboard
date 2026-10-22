import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import dashboardReducer, {
  addNewWidget,
  removeWidget,
  resetDashboard,
  toggleWidgetSelection,
} from './dashboardSlice';

const LOCAL_STORAGE_KEY = 'cnapp_dashboard_state_v1';

// Listener middleware for localStorage persistence
const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(addNewWidget, removeWidget, toggleWidgetSelection, resetDashboard),
  effect: (_action, listenerApi) => {
    try {
      const state = (listenerApi.getState() as RootState).dashboard;
      const dataToSave = {
        categories: state.categories,
        widgetRegistry: state.widgetRegistry,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {
      // LocalStorage error fallback
    }
  },
});

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
