import React from 'react';
import type { Category, Widget } from '../../types/dashboard';
import { AddWidgetCard } from './AddWidgetCard';
import { WidgetCard } from './WidgetCard';

interface CategorySectionProps {
  category: Category;
  filteredWidgets: Widget[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  filteredWidgets,
}) => {
  return (
    <section className="mb-6">
      {/* Category Title */}
      <h2 className="text-sm font-bold text-slate-800 tracking-tight mb-3">
        {category.name}
      </h2>

      {/* Grid of Widget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWidgets.map((widget) => (
          <WidgetCard
            key={widget.id}
            widget={widget}
            categoryId={category.id}
          />
        ))}

        {/* Add Widget placeholder card */}
        <AddWidgetCard categoryId={category.id} />
      </div>
    </section>
  );
};
