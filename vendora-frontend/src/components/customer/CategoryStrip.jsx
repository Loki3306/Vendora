// @module customer-frontend | Vendora v1.0 | SPIT Mini Project AY 2026-27
const fallback = [
  { category_id: '', name: 'All', emoji: '' },
  { category_id: 1, name: 'Electronics', emoji: '📱' },
  { category_id: 2, name: 'Clothing', emoji: '👕' },
  { category_id: 3, name: 'Books', emoji: '📚' },
  { category_id: 4, name: 'Home & Kitchen', emoji: '🏠' },
  { category_id: 5, name: 'Sports', emoji: '🏋️' },
  { category_id: 6, name: 'Beauty', emoji: '💄' },
  { category_id: 7, name: 'Toys', emoji: '🎮' },
];
export default function CategoryStrip({ selectedCategory, onSelect, categories = fallback }) {
  const items = categories[0]?.name === 'All' ? categories : [fallback[0], ...categories];
  return <div className="scrollbar-hide flex gap-2 overflow-x-auto py-4">{items.map((category) => {
    const active = String(selectedCategory || '') === String(category.category_id || '');
    return <button key={`${category.category_id}-${category.name}`} onClick={() => onSelect(category.category_id || '')} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold ${active ? 'border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-100' : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-600'}`}>{category.emoji && <span className="mr-1.5">{category.emoji}</span>}{category.name}</button>;
  })}</div>;
}
