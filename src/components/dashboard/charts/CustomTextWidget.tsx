import React from 'react';
import { Layers } from 'lucide-react';

interface CustomTextWidgetProps {
  text?: string;
  createdAt?: string;
}

export const CustomTextWidget: React.FC<CustomTextWidgetProps> = ({
  text,
  createdAt,
}) => {
  return (
    <div className="flex flex-col justify-between w-full h-full py-2">
      <div className="flex items-start gap-2.5">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0 mt-0.5">
          <Layers className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">
            {text || 'No description provided.'}
          </p>
        </div>
      </div>
      {createdAt && (
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Added custom widget</span>
          <span>{createdAt}</span>
        </div>
      )}
    </div>
  );
};
