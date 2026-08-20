import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-[#FAFAF8] dark:bg-[#0D0D0F] text-gray-900 dark:text-white px-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-500 mb-4">
          404
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
          Ye page nahi mila
        </h1>
        <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-7">
          Jo page aap dhundh rahe hain wo exist nahi karta ya move ho gaya hai.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-7 px-6 py-3 rounded-xl bg-gray-950 dark:bg-orange-500 text-white dark:text-black text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/15 transition-all duration-300"
        >
          Home par jaayein
          <span>→</span>
        </Link>
      </div>
    </main>
  );
}
