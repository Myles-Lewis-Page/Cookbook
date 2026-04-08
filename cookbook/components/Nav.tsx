'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavProps {
  isAdmin?: boolean;
}

export default function Nav({ isAdmin }: NavProps) {
  const pathname = usePathname();

  return (
    <nav className="border-b border-[#E8E0D5] bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-xl tracking-wide text-[#1A1612] hover:text-[#C4622D] transition-colors"
        >
          My Cookbook
        </Link>
        <div className="flex items-center gap-4">
          {isAdmin ? (
            <>
              <Link
                href="/admin/add-recipe"
                className="text-sm text-[#FAF7F2] bg-[#C4622D] px-4 py-1.5 rounded-full hover:bg-[#a8501f] transition-colors"
              >
                + Add Recipe
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="text-sm text-[#9E9089] hover:text-[#1A1612] transition-colors"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm text-[#9E9089] hover:text-[#1A1612] transition-colors"
            >
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
