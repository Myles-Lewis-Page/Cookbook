import Link from 'next/link';
import { getSession } from '@/lib/session';
import { supabase } from '@/lib/supabase';
import Nav from '@/components/Nav';
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_SLUGS, Category } from '@/lib/types';

export default async function HomePage() {
  const session = await getSession();

  const { data: recipes } = await supabase
    .from('recipes')
    .select('id, title, category, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: counts } = await supabase
    .from('recipes')
    .select('category');

  const categoryCounts: Record<string, number> = {};
  (counts || []).forEach((r: { category: string }) => {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Nav isAdmin={session.isAdmin} />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-14 text-center">
          <h1 className="font-serif text-5xl text-[#1A1612] mb-3">My Cookbook</h1>
          <p className="text-[#9E9089] text-lg">A personal collection of tried-and-true recipes</p>
          <div className="w-16 h-px bg-[#C4622D] mx-auto mt-6" />
        </div>

        <div className="mb-4">
          <p className="text-xs font-medium tracking-widest uppercase text-[#9E9089]">Browse by category</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/category/${CATEGORY_SLUGS[cat as Category]}`}
              className="group border border-[#E8E0D5] rounded-2xl p-5 bg-white hover:border-[#C4622D] transition-all duration-200 hover:shadow-sm"
            >
              <div className="text-2xl mb-3">{CATEGORY_ICONS[cat as Category]}</div>
              <div className="font-medium text-[#1A1612] text-sm group-hover:text-[#C4622D] transition-colors">{cat}</div>
              <div className="text-xs text-[#9E9089] mt-1">
                {categoryCounts[cat] || 0} {categoryCounts[cat] === 1 ? 'recipe' : 'recipes'}
              </div>
            </Link>
          ))}
        </div>

        {recipes && recipes.length > 0 && (
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-[#9E9089] mb-4">Recently added</p>
            <div className="border-t border-[#E8E0D5]">
              {recipes.map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipe/${recipe.id}`}
                  className="flex items-center justify-between py-4 border-b border-[#E8E0D5] group"
                >
                  <span className="text-sm text-[#1A1612] group-hover:text-[#C4622D] transition-colors font-medium">
                    {recipe.title}
                  </span>
                  <span className="text-xs text-[#9E9089] bg-[#FAF7F2] border border-[#E8E0D5] px-3 py-1 rounded-full">
                    {recipe.category}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
