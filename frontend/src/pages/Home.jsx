import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import NeedCard from "../components/NeedCard.jsx";
import Typewriter from "../components/Typewriter.jsx";

export default function Home() {
  const [needs, setNeeds] = useState([]);

  useEffect(() => {
    api
      .get("/needs")
      .then((res) => setNeeds(res.data.slice(0, 4)))
      .catch(() => setNeeds([]));
  }, []);

  return (
    <main className="bg-[#FAFAF8] dark:bg-[#0D0D0F] text-[#171717] dark:text-white overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-orange-200/30 dark:bg-orange-500/10 blur-[120px] rounded-full" />
          <div className="absolute top-40 -left-40 w-[350px] h-[350px] bg-yellow-100/40 dark:bg-yellow-500/5 blur-[100px] rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 pt-20 sm:pt-28 pb-20">

          {/* Badge */}
          <div className="flex justify-center mb-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-md shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>

              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                Built for campus communities
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center max-w-4xl mx-auto">

            <h1 className="font-display font-bold tracking-tight text-5xl sm:text-6xl lg:text-7xl leading-[1.03] text-[#151515] dark:text-white">
              Everything you need,
              <br />

              <span className="relative inline-block mt-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600">
                  already exists here.
                </span>

                <svg
                  className="absolute -bottom-3 left-0 w-full"
                  viewBox="0 0 400 20"
                  fill="none"
                >
                  <path
                    d="M4 14C90 5 270 5 396 12"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-orange-400"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-8 text-base sm:text-lg leading-8 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Need a book, cycle, calculator or study table?
              Find someone around you who already has it.
              <span className="text-gray-800 dark:text-gray-200 font-medium">
                {" "}No middleman. No unnecessary hassle.
              </span>
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-9">

              <Link
                to="/post-need"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#171717] dark:bg-orange-500 text-white dark:text-black font-semibold text-sm shadow-lg shadow-black/10 dark:shadow-orange-500/10 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
              >
                Post a Need
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>

              <Link
                to="/browse"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300"
              >
                Browse Needs
              </Link>

            </div>
          </div>

          {/* Categories */}
          <div className="flex justify-center flex-wrap gap-2 mt-12">
            {[
              ["📚", "Books"],
              ["🚲", "Cycles"],
              ["🪑", "Furniture"],
              ["🧮", "Calculators"],
              ["📝", "Notes"],
            ].map(([icon, name]) => (
              <div
                key={name}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-300 hover:border-orange-300 hover:text-orange-500 transition-all"
              >
                <span>{icon}</span>
                {name}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 border-y border-gray-200 dark:border-white/10 py-7">

          {[
            ["01", "Post", "Tell the community what you need"],
            ["02", "Match", "Find relevant people nearby"],
            ["03", "Connect", "Start a direct conversation"],
            ["04", "Done", "Get what you actually need"],
          ].map(([num, title, desc]) => (
            <div
              key={num}
              className="px-4 sm:px-6 py-3 border-r last:border-r-0 border-gray-200 dark:border-white/10"
            >
              <div className="text-xs font-mono text-orange-500 mb-2">
                {num}
              </div>

              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                {title}
              </h3>

              <p className="text-xs leading-5 text-gray-500 dark:text-gray-500 mt-1">
                {desc}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-24">

        <div className="max-w-2xl mb-12">
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-3">
            Simple by design
          </p>

          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            From "I need this"
            <br />
            to "Got it."
          </h2>

          <p className="mt-4 text-gray-500 dark:text-gray-400 leading-7">
            A simple community-driven system that connects people
            who need something with people who already have it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">

          {[
            {
              number: "01",
              icon: "✦",
              title: "Post what you need",
              description:
                "Tell the community what you're looking for, your preferred option and budget.",
            },
            {
              number: "02",
              icon: "⌁",
              title: "Find a match",
              description:
                "Relevant needs and available items are surfaced based on category and location.",
            },
            {
              number: "03",
              icon: "↗",
              title: "Connect directly",
              description:
                "Once there's a match, connect directly and decide the price, place and time.",
            },
          ].map((item) => (
            <div
              key={item.number}
              className="group relative p-7 rounded-2xl bg-white dark:bg-white/[0.035] border border-gray-200 dark:border-white/10 hover:border-orange-300 dark:hover:border-orange-500/40 hover:-translate-y-1 transition-all duration-300"
            >

              <div className="flex items-start justify-between mb-10">

                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 text-lg">
                  {item.icon}
                </div>

                <span className="font-mono text-xs text-gray-400">
                  {item.number}
                </span>

              </div>

              <h3 className="font-display font-semibold text-xl text-gray-900 dark:text-white">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                {item.description}
              </p>

            </div>
          ))}

        </div>
      </section>

      {/* ================= LIVE NEEDS ================= */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pb-24">

        <div className="rounded-3xl bg-[#151515] dark:bg-[#171719] overflow-hidden relative">

          {/* Decoration */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative p-7 sm:p-10 lg:p-12">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-medium text-green-400 uppercase tracking-wider">
                    Live community
                  </span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  What people need right now
                </h2>

                <p className="text-sm text-gray-400 mt-2">
                  Recent requests from your community.
                </p>
              </div>

              <Link
                to="/browse"
                className="self-start sm:self-auto text-sm font-semibold text-orange-400 hover:text-orange-300 transition-colors"
              >
                View all needs →
              </Link>

            </div>

            {needs.length === 0 ? (

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
                <div className="text-3xl mb-3">📭</div>

                <p className="text-gray-400 text-sm">
                  No needs posted yet.
                </p>

                <Link
                  to="/post-need"
                  className="inline-block mt-4 text-sm font-semibold text-orange-400 hover:underline"
                >
                  Be the first →
                </Link>
              </div>

            ) : (

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {needs.map((need) => (
                  <div key={need._id}>
                    <NeedCard need={need} />
                  </div>
                ))}

              </div>

            )}

          </div>
        </div>

      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative border-t border-gray-200 dark:border-white/10">

        <div className="max-w-4xl mx-auto text-center px-6 py-24">

          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-5">
            Your unused stuff could help someone
          </p>

          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
            Someone needs what
            <br />
            you already have.
          </h2>

          <p className="max-w-lg mx-auto mt-5 text-gray-500 dark:text-gray-400 leading-7">
            Turn unused books, cycles, furniture and other things
            into something useful for someone in your community.
          </p>

          <Link
            to="/post-need"
            className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 rounded-xl bg-orange-500 text-black font-semibold text-sm hover:bg-orange-400 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300"
          >
            Post Your First Need
            <span>→</span>
          </Link>

        </div>

      </section>

    </main>
  );
}