import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { supabase } from '@/lib/supabase';
import Nav from '@/components/Nav';
import { Recipe, CATEGORY_SLUGS } from '@/lib/types';

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) notFound();
  const recipe = data as Recipe;

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Nav isAdmin={session.isAdmin} />
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href={`/category/${CATEGORY_SLUGS[recipe.category]}`}
            className="text-xs text-[#9E9089] hover:text-[#C4622D] transition-colors"
          >
            ← {recipe.category}
          </Link>
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1A1612] mb-6 leading-tight">
          {recipe.title}
        </h1>

        {/* Meta */}
        <div className="space-y-1 mb-8">
          {recipe.prep_time && (
            <p className="text-sm text-[#1A1612]">
              <span className="font-medium">Prep Time:</span> {recipe.prep_time}
            </p>
          )}
          {recipe.cook_time && (
            <p className="text-sm text-[#1A1612]">
              <span className="font-medium">Cook Time:</span> {recipe.cook_time}
            </p>
          )}
          {recipe.servings && (
            <p className="text-sm text-[#1A1612]">
              <span className="font-medium">Servings:</span> {recipe.servings}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-[#E8E0D5] mb-6" />

        {/* All Ingredients */}
        <section className="mb-8">
          <h2 className="font-serif text-xl font-semibold text-[#1A1612] mb-4 tracking-wide uppercase">
            All Ingredients
          </h2>
          <div className="border-t border-[#E8E0D5] mb-4" />
          <ul className="space-y-2">
            {recipe.all_ingredients.map((ing, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#1A1612]">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C4622D] flex-shrink-0" />
                {ing}
              </li>
            ))}
          </ul>
        </section>

        {/* Divider */}
        <div className="border-t border-[#E8E0D5] mb-6" />

        {/* Recipe Steps */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#1A1612] mb-6 tracking-wide uppercase">
            Recipe
          </h2>
          <div className="border-t border-[#E8E0D5] mb-8" />

          <div className="space-y-10">
            {recipe.steps.map((step, i) => (
              <div key={i}>
                {step.title && (
                  <h3 className="font-serif text-lg font-semibold text-[#1A1612] uppercase tracking-wide mb-4">
                    {step.title}
                  </h3>
                )}

                {step.ingredients.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium tracking-widest uppercase text-[#9E9089] mb-2">
                      Ingredients Used
                    </p>
                    <ul className="space-y-1.5">
                      {step.ingredients.map((ing, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-[#1A1612]">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#E8E0D5] flex-shrink-0" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {step.instructions.length > 0 && (
                  <div>
                    <p className="text-xs font-medium tracking-widest uppercase text-[#9E9089] mb-2">
                      Instructions
                    </p>
                    <ul className="space-y-3">
                      {step.instructions.map((inst, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-[#1A1612] leading-relaxed">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C4622D] flex-shrink-0" />
                          {inst}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {i < recipe.steps.length - 1 && (
                  <div className="border-t border-[#E8E0D5] mt-8" />
                )}
              </div>
            ))}
          </div>
        </section>

        {session.isAdmin && (
          <div className="mt-16 pt-8 border-t border-[#E8E0D5]">
            <Link
              href="/admin/add-recipe"
              className="text-sm text-[#9E9089] hover:text-[#C4622D] transition-colors"
            >
              + Add another recipe
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
