import React from 'react';
import { Plus } from 'lucide-react';
import { useAppDispatch } from '../../store';
import { openDrawer } from '../../store/dashboardSlice';

interface AddWidgetCardProps {
  categoryId: string;
}

export const AddWidgetCard: React.FC<AddWidgetCardProps> = ({ categoryId }) => {
  const dispatch = useAppDispatch();

  const handleOpen = () => {
    dispatch(openDrawer(categoryId));
  };

  return (
    <div
      onClick={handleOpen}
      className="flex items-center justify-center bg-white/70 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200 cursor-pointer min-h-[220px] group"
    >
      <button
        type="button"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 group-hover:text-indigo-600 bg-white border border-slate-200 group-hover:border-indigo-300 shadow-sm transition-all duration-150"
      >
        <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
        <span>Add Widget</span>
      </button>
    </div>
  );
};
