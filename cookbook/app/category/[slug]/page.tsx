import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/session';
import { supabase } from '@/lib/supabase';
import Nav from '@/components/Nav';
import { SLUG_TO_CATEGORY, CATEGORY_ICONS } from '@/lib/types';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = SLUG_TO_CATEGORY[slug];
  if (!category) notFound();

  const session = await getSession();

  const { data: recipes } = await supabase
    .from('recipes')
    .select('id, title, prep_time, cook_time, servings, created_at')
    .eq('category', category)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Nav isAdmin={session.isAdmin} />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <Link href="/" className="text-xs text-[#9E9089] hover:text-[#C4622D] transition-colors">
            ← Back
          </Link>
          <div className="flex items-center gap-3 mt-4 mb-2">
            <span className="text-3xl">{CATEGORY_ICONS[category]}</span>
            <h1 className="font-serif text-4xl text-[#1A1612]">{category}</h1>
          </div>
          <p className="text-sm text-[#9E9089]">{recipes?.length || 0} {recipes?.length === 1 ? 'recipe' : 'recipes'}</p>
          <div className="w-12 h-px bg-[#C4622D] mt-4" />
        </div>

        {!recipes || recipes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#9E9089] text-sm">No recipes yet in this category.</p>
            {session.isAdmin && (
              <Link href="/admin/add-recipe" className="inline-block mt-4 text-sm text-[#C4622D] hover:underline">
                Add the first one →
              </Link>
            )}
          </div>
        ) : (
          <div className="border-t border-[#E8E0D5]">
            {recipes.map(recipe => (
              <Link
                key={recipe.id}
                href={`/recipe/${recipe.id}`}
                className="flex items-center justify-between py-5 border-b border-[#E8E0D5] group"
              >
                <div>
                  <p className="font-serif text-lg text-[#1A1612] group-hover:text-[#C4622D] transition-colors">
                    {recipe.title}
                  </p>
                  <p className="text-xs text-[#9E9089] mt-1">
                    {[recipe.prep_time && `Prep ${recipe.prep_time}`, recipe.cook_time && `Cook ${recipe.cook_time}`, recipe.servings].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <span className="text-[#C4622D] opacity-0 group-hover:opacity-100 transition-opacity text-sm">→</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
