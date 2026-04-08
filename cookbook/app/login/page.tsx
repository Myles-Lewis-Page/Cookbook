'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      router.push('/admin/add-recipe');
    } else {
      setError('Incorrect username or password');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <nav className="border-b border-[#E8E0D5] bg-[#FAF7F2]">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center">
          <Link href="/" className="font-serif text-xl tracking-wide text-[#1A1612] hover:text-[#C4622D] transition-colors">
            My Cookbook
          </Link>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-3xl text-[#1A1612] mb-1">Admin login</h1>
          <p className="text-sm text-[#9E9089] mb-8">Sign in to add and manage recipes</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium tracking-wide uppercase text-[#9E9089] mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-white border border-[#E8E0D5] rounded-xl px-4 py-2.5 text-sm text-[#1A1612] outline-none focus:border-[#C4622D] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium tracking-wide uppercase text-[#9E9089] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white border border-[#E8E0D5] rounded-xl px-4 py-2.5 text-sm text-[#1A1612] outline-none focus:border-[#C4622D] transition-colors"
                required
              />
            </div>
            {error && <p className="text-sm text-[#C4622D]">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A1612] text-[#FAF7F2] rounded-xl py-2.5 text-sm font-medium hover:bg-[#2d2520] transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
