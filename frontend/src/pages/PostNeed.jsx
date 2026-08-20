import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

export default function PostNeed() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", category: "Books", type: "Buy", budget: "", location: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { ...form, budget: form.budget ? Number(form.budget) : undefined };
      const res = await api.post("/needs", payload);
      navigate(`/needs/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Post nahi ho paya, dobara try karo");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-line dark:border-darkborder bg-white dark:bg-darkcard text-ink dark:text-paper focus:outline-none focus:ring-2 focus:ring-marigold";
  const labelClass = "text-sm font-medium text-charcoal dark:text-darkmuted block mb-1.5";

  return (
    <div className="max-w-lg mx-auto px-5 sm:px-7 py-12 sm:py-14">
      <span className="font-mono text-xs text-marigold uppercase tracking-wider block mb-2">Post a Need</span>
      <h1 className="font-display text-3xl font-bold text-ink dark:text-paper mb-1.5">Apni zarurat likho</h1>
      <p className="text-muted dark:text-darkmuted text-sm mb-8">Jitna specific hoga, utna jaldi match hoga</p>

      {error && (
        <div className="bg-[#FBE0E0] dark:bg-[#9E4A4A]/20 text-[#9E4A4A] dark:text-[#F0A9A9] text-sm px-4 py-3 rounded-lg mb-5">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Title</label>
          <input name="title" required value={form.title} onChange={handleChange}
            placeholder="e.g. Data Structures ki book chahiye" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Description (optional)</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3}
            placeholder="Thoda detail mein batao..." className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category</label>
            <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
              {["Books", "Furniture", "Electronics", "Stationery", "Other"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Type</label>
            <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
              {["Buy", "Borrow", "Exchange", "Free"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Budget ₹ (optional)</label>
            <input type="number" name="budget" value={form.budget} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input name="location" required value={form.location} onChange={handleChange}
              placeholder="e.g. Block C" className={inputClass} />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-lg bg-ink dark:bg-marigold text-paper dark:text-ink font-semibold text-sm hover:-translate-y-0.5 transition-transform disabled:opacity-60">
          {loading ? "Post ho raha hai..." : "📌 Need Post Karo"}
        </button>
      </form>
    </div>
  );
}
