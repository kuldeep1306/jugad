import { Link } from "react-router-dom";

const tagStyles = {
  Buy: "bg-[#FDE8CC] text-[#8A5A0D] dark:bg-[#8A5A0D]/25 dark:text-[#F7C877]",
  Borrow: "bg-[#DCEEE5] text-[#1F6B4C] dark:bg-[#1F6B4C]/25 dark:text-[#7CD6AD]",
  Free: "bg-[#E3E1F5] text-[#4A3F9E] dark:bg-[#4A3F9E]/25 dark:text-[#B6ACF2]",
  Exchange: "bg-[#FBE0E0] text-[#9E4A4A] dark:bg-[#9E4A4A]/25 dark:text-[#F0A9A9]",
};

export default function NeedCard({ need, tilt = 0, isMine = false }) {
  return (
    <Link
      to={`/needs/${need._id}`}
      className="block bg-white dark:bg-darkcard border border-transparent dark:border-darkborder rounded-t rounded-b-xl p-5 pb-4 relative shadow-lg dark:shadow-black/30 hover:shadow-xl hover:-translate-y-1 hover:rotate-0 transition-all"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-marigold shadow" />
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className={`inline-block font-mono text-[10.5px] px-2 py-1 rounded font-medium ${tagStyles[need.type] || "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-darkmuted"}`}>
          {need.type?.toUpperCase()}
        </span>
        {isMine && (
          <span className="font-mono text-[10.5px] px-2 py-1 rounded font-medium bg-marigold/20 text-[#8A5A0D] dark:text-marigold">
            YOURS
          </span>
        )}
      </div>
      <h3 className="font-display text-[15.5px] font-semibold text-ink dark:text-paper leading-snug mb-1.5">
        {need.title}
      </h3>
      <div className="flex justify-between text-xs text-muted dark:text-darkmuted mt-3.5 pt-3 border-t border-dashed border-line dark:border-darkborder">
        <span>{need.userId?.city || "City"}</span>
        <span>{need.location}</span>
      </div>
    </Link>
  );
}
