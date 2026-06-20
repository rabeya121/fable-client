"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { RiUploadLine, RiBookOpenLine, RiArrowLeftLine } from "react-icons/ri";
import Link from "next/link";
import toast from "react-hot-toast";

const genres = ["Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", "Horror", "Biography", "Self-Help", "Thriller"];

export default function AddEbookPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [coverImage, setCoverImage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    price: "",
    genre: "Fiction",
    status: "published",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const formDataImg = new FormData();
      formDataImg.append("image", file);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        { method: "POST", body: formDataImg }
      );
      const data = await res.json();
      setCoverImage(data.data.url);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Image upload failed!");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coverImage) {
      toast.error("Please upload a cover image!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/ebooks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          coverImage,
          writerName: user?.name,
          writerEmail: user?.email,
        }),
      });
      const data = await res.json();
      if (data.insertedId) {
        toast.success("Ebook published!");
        router.push("/dashboard/writer/ebooks");
      }
    } catch {
      toast.error("Failed to publish!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/writer" className="text-gray-400 hover:text-white transition">
          <RiArrowLeftLine className="text-xl" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Add New Ebook</h1>
          <p className="text-gray-400 text-sm">Publishing as <span className="text-[#6366f1]">{user?.name}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left - Cover Image */}
        <div className="space-y-4">
          <div className="bg-[#1e293b] rounded-2xl border border-gray-800 p-6">
            <h2 className="text-white font-semibold mb-4">Cover Image</h2>
            <div className="h-72 bg-[#0f172a] rounded-xl overflow-hidden flex items-center justify-center mb-4 border border-gray-700">
              {coverImage ? (
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <RiBookOpenLine className="text-5xl text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No image uploaded</p>
                </div>
              )}
            </div>
            <label className="w-full flex items-center justify-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white py-3 rounded-xl text-sm font-medium transition cursor-pointer">
              <RiUploadLine />
              {imageUploading ? "Uploading..." : "Upload Cover Image"}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {/* Publishing Info */}
          <div className="bg-[#1e293b] rounded-2xl border border-gray-800 p-6">
            <h2 className="text-white font-semibold mb-4">Publishing</h2>
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-[#0f172a] text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#6366f1] border border-gray-700 text-sm"
                >
                  <option value="published">Published</option>
                  <option value="unpublished">Save as Draft</option>
                </select>
              </div>
              <div className="bg-[#0f172a] rounded-xl p-3">
                <p className="text-gray-400 text-xs">Publishing as</p>
                <p className="text-white text-sm font-medium">{user?.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className="lg:col-span-2 bg-[#1e293b] rounded-2xl border border-gray-800 p-6">
          <h2 className="text-white font-semibold mb-6">Ebook Details</h2>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <div>
              <label className="text-gray-300 text-sm mb-1.5 block">Book Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. The Last Ember of Valtheria"
                required
                className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#6366f1] border border-gray-700 text-sm"
              />
            </div>

            {/* Genre + Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 text-sm mb-1.5 block">Genre *</label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#6366f1] border border-gray-700 text-sm"
                >
                  {genres.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1.5 block">Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="9.99"
                  required
                  min="0"
                  step="0.01"
                  className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#6366f1] border border-gray-700 text-sm"
                />
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="text-gray-300 text-sm mb-1.5 block">Short Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a compelling summary of your ebook..."
                required
                rows={3}
                className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#6366f1] border border-gray-700 text-sm resize-none"
              />
            </div>

            {/* Ebook Content */}
            <div>
              <label className="text-gray-300 text-sm mb-1.5 block">Ebook Content *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Paste the content of your ebook here..."
                required
                rows={8}
                className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#6366f1] border border-gray-700 text-sm resize-none"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || imageUploading}
                className="bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl transition"
              >
                {loading ? "Publishing..." : "Publish Ebook"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}