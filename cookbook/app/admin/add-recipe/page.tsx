'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/types';

interface Step {
  id: number;
  title: string;
  ingredients: string[];
  instructions: string[];
}

let stepIdCounter = 0;

export default function AddRecipePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [masterIngredients, setMasterIngredients] = useState<string[]>(['', '']);
  const [steps, setSteps] = useState<Step[]>([
    { id: ++stepIdCounter, title: '', ingredients: [''], instructions: [''] },
  ]);

  const filledIngredients = masterIngredients.filter(i => i.trim());

  const updateMasterIngredient = (idx: number, val: string) => {
    setMasterIngredients(prev => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const addMasterIngredient = () => setMasterIngredients(prev => [...prev, '']);

  const removeMasterIngredient = (idx: number) => {
    setMasterIngredients(prev => prev.filter((_, i) => i !== idx));
  };

  const addStep = () => {
    setSteps(prev => [
      ...prev,
      { id: ++stepIdCounter, title: '', ingredients: [''], instructions: [''] },
    ]);
  };

  const removeStep = (id: number) => {
    setSteps(prev => prev.filter(s => s.id !== id));
  };

  const updateStep = useCallback((id: number, field: keyof Step, value: unknown) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  }, []);

  const addStepIngredient = (id: number) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, ingredients: [...s.ingredients, ''] } : s));
  };

  const removeStepIngredient = (id: number, idx: number) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, ingredients: s.ingredients.filter((_, i) => i !== idx) } : s));
  };

  const updateStepIngredient = (id: number, idx: number, val: string) => {
    setSteps(prev => prev.map(s => {
      if (s.id !== id) return s;
      const next = [...s.ingredients];
      next[idx] = val;
      return { ...s, ingredients: next };
    }));
  };

  const addStepInstruction = (id: number) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, instructions: [...s.instructions, ''] } : s));
  };

  const removeStepInstruction = (id: number, idx: number) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, instructions: s.instructions.filter((_, i) => i !== idx) } : s));
  };

  const updateStepInstruction = (id: number, idx: number, val: string) => {
    setSteps(prev => prev.map(s => {
      if (s.id !== id) return s;
      const next = [...s.instructions];
      next[idx] = val;
      return { ...s, instructions: next };
    }));
  };

  async function handleSave() {
    setError('');
    if (!title.trim()) return setError('Recipe title is required');
    if (!category) return setError('Please select a category');
    if (filledIngredients.length === 0) return setError('Add at least one ingredient');

    setSaving(true);
    const payload = {
      title: title.trim(),
      category,
      prep_time: prepTime,
      cook_time: cookTime,
      servings,
      all_ingredients: filledIngredients,
      steps: steps.map(s => ({
        title: s.title.trim(),
        ingredients: s.ingredients.filter(i => i.trim()),
        instructions: s.instructions.filter(i => i.trim()),
      })),
    };

    const res = await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const { id } = await res.json();
      router.push(`/recipe/${id}`);
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to save recipe');
      setSaving(false);
    }
  }

  const inputClass = "w-full bg-white border border-[#E8E0D5] rounded-xl px-4 py-2.5 text-sm text-[#1A1612] outline-none focus:border-[#C4622D] transition-colors";
  const labelClass = "block text-xs font-medium tracking-wide uppercase text-[#9E9089] mb-1.5";

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <nav className="border-b border-[#E8E0D5] bg-[#FAF7F2]">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl tracking-wide text-[#1A1612] hover:text-[#C4622D] transition-colors">
            My Cookbook
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="text-sm text-[#9E9089] hover:text-[#1A1612] transition-colors">Sign out</button>
          </form>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10 pb-20">
        <h1 className="font-serif text-4xl text-[#1A1612] mb-1">Add recipe</h1>
        <p className="text-sm text-[#9E9089] mb-10">Add all ingredients first — you'll select them per step below.</p>

        {/* Recipe Info */}
        <section className="mb-8">
          <p className="text-xs font-medium tracking-widest uppercase text-[#9E9089] mb-3">Recipe info</p>
          <div className="bg-white border border-[#E8E0D5] rounded-2xl p-6 space-y-4">
            <div>
              <label className={labelClass}>Recipe title</label>
              <input className={inputClass} type="text" placeholder="e.g. French Bread" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select className={inputClass} value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Select a category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Prep time</label>
                <input className={inputClass} type="text" placeholder="20 minutes" value={prepTime} onChange={e => setPrepTime(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Cook time</label>
                <input className={inputClass} type="text" placeholder="25 minutes" value={cookTime} onChange={e => setCookTime(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Servings</label>
                <input className={inputClass} type="text" placeholder="2 loaves" value={servings} onChange={e => setServings(e.target.value)} />
              </div>
            </div>
          </div>
        </section>

        {/* All Ingredients */}
        <section className="mb-8">
          <p className="text-xs font-medium tracking-widest uppercase text-[#9E9089] mb-3">All ingredients</p>
          <div className="bg-white border border-[#E8E0D5] rounded-2xl p-6">
            <div className="space-y-2">
              {masterIngredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C4622D] flex-shrink-0" />
                  <input
                    className="flex-1 bg-[#FAF7F2] border border-[#E8E0D5] rounded-lg px-3 py-2 text-sm text-[#1A1612] outline-none focus:border-[#C4622D] transition-colors"
                    type="text"
                    placeholder="e.g. 4½ cups unbleached bread flour"
                    value={ing}
                    onChange={e => updateMasterIngredient(idx, e.target.value)}
                  />
                  <button
                    onClick={() => removeMasterIngredient(idx)}
                    className="w-6 h-6 rounded-full border border-[#E8E0D5] text-[#9E9089] hover:border-red-300 hover:text-red-400 transition-colors flex items-center justify-center text-sm flex-shrink-0"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addMasterIngredient}
              className="mt-3 text-xs text-[#9E9089] hover:text-[#C4622D] transition-colors"
            >
              + Add ingredient
            </button>
          </div>
        </section>

        {/* Steps */}
        <section className="mb-8">
          <p className="text-xs font-medium tracking-widest uppercase text-[#9E9089] mb-3">Recipe steps</p>

          <div className="space-y-4">
            {steps.map((step, stepIdx) => (
              <div key={step.id} className="bg-white border border-[#E8E0D5] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-medium text-[#9E9089] bg-[#FAF7F2] border border-[#E8E0D5] px-3 py-1 rounded-full">
                    Step {stepIdx + 1}
                  </span>
                  <button
                    onClick={() => removeStep(step.id)}
                    className="text-xs text-red-400 border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
                  >
                    Remove step
                  </button>
                </div>

                <div className="mb-5">
                  <label className={labelClass}>Section title</label>
                  <input
                    className={inputClass}
                    type="text"
                    placeholder="e.g. DOUGH, SAUCE, BREADING"
                    value={step.title}
                    onChange={e => updateStep(step.id, 'title', e.target.value)}
                  />
                </div>

                <div className="border-t border-[#E8E0D5] pt-4 mb-5">
                  <p className="text-xs font-medium text-[#9E9089] mb-3">Ingredients used</p>
                  <div className="space-y-2">
                    {step.ingredients.map((ing, ingIdx) => (
                      <div key={ingIdx} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E8E0D5] flex-shrink-0" />
                        <select
                          className="flex-1 bg-[#FAF7F2] border border-[#E8E0D5] rounded-lg px-3 py-2 text-sm text-[#1A1612] outline-none focus:border-[#C4622D] transition-colors"
                          value={ing}
                          onChange={e => updateStepIngredient(step.id, ingIdx, e.target.value)}
                        >
                          <option value="">
                            {filledIngredients.length === 0 ? 'Add ingredients above first' : 'Select ingredient'}
                          </option>
                          {filledIngredients.map((fi, fi_idx) => (
                            <option key={fi_idx} value={fi}>{fi}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => removeStepIngredient(step.id, ingIdx)}
                          className="w-6 h-6 rounded-full border border-[#E8E0D5] text-[#9E9089] hover:border-red-300 hover:text-red-400 transition-colors flex items-center justify-center text-sm flex-shrink-0"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addStepIngredient(step.id)}
                    className="mt-3 text-xs text-[#9E9089] hover:text-[#C4622D] transition-colors"
                  >
                    + Add ingredient
                  </button>
                </div>

                <div className="border-t border-[#E8E0D5] pt-4">
                  <p className="text-xs font-medium text-[#9E9089] mb-3">Instructions</p>
                  <div className="space-y-2">
                    {step.instructions.map((inst, instIdx) => (
                      <div key={instIdx} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E8E0D5] flex-shrink-0" />
                        <input
                          className="flex-1 bg-[#FAF7F2] border border-[#E8E0D5] rounded-lg px-3 py-2 text-sm text-[#1A1612] outline-none focus:border-[#C4622D] transition-colors"
                          type="text"
                          placeholder="e.g. Mix until a smooth dough forms"
                          value={inst}
                          onChange={e => updateStepInstruction(step.id, instIdx, e.target.value)}
                        />
                        <button
                          onClick={() => removeStepInstruction(step.id, instIdx)}
                          className="w-6 h-6 rounded-full border border-[#E8E0D5] text-[#9E9089] hover:border-red-300 hover:text-red-400 transition-colors flex items-center justify-center text-sm flex-shrink-0"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addStepInstruction(step.id)}
                    className="mt-3 text-xs text-[#9E9089] hover:text-[#C4622D] transition-colors"
                  >
                    + Add instruction
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addStep}
            className="mt-4 w-full border border-dashed border-[#C4622D33] rounded-2xl py-3 text-sm text-[#9E9089] hover:bg-white hover:text-[#C4622D] hover:border-[#C4622D] transition-all"
          >
            + Add step
          </button>
        </section>

        {error && <p className="text-sm text-[#C4622D] mb-4">{error}</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#1A1612] text-[#FAF7F2] rounded-2xl py-3.5 text-sm font-medium hover:bg-[#2d2520] transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save recipe'}
        </button>
      </main>
    </div>
  );
}
