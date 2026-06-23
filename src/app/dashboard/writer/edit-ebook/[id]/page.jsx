"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { RiUploadLine, RiBookOpenLine, RiArrowLeftLine } from "react-icons/ri";
import Link from "next/link";
import toast from "react-hot-toast";

const genres = ["Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", "Horror", "Biography", "Self-Help", "Thriller"];

export default function EditEbookPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ebooks/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          title: data.title || "",
          description: data.description || "",
          content: data.content || "",
          price: data.price || "",
          genre: data.genre || "Fiction",
          status: data.status || "published",
        });
        setCoverImage(data.coverImage || "");
      })
      .catch(() => toast.error("Failed to load ebook!"))
      .finally(() => setFetching(false));
  }, [id]);

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
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ebooks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          coverImage,
        }),
      });
      const data = await res.json();
      if (data.modifiedCount > 0 || data.matchedCount > 0) {
        toast.success("Ebook updated!");
        router.push("/dashboard/writer/ebooks");
      }
    } catch {
      toast.error("Failed to update!");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/writer/ebooks" className="text-gray-400 hover:text-white transition">
          <RiArrowLeftLine className="text-xl" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Ebook</h1>
          <p className="text-gray-400 text-sm">Update your ebook details</p>
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
                  <p className="text-gray-500 text-sm">No image</p>
                </div>
              )}
            </div>
            <label className="w-full flex items-center justify-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white py-3 rounded-xl text-sm font-medium transition cursor-pointer">
              <RiUploadLine />
              {imageUploading ? "Uploading..." : "Change Cover Image"}
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
                  <option value="unpublished">Unpublished</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className="lg:col-span-2 bg-[#1e293b] rounded-2xl border border-gray-800 p-6">
          <h2 className="text-white font-semibold mb-6">Ebook Details</h2>
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="text-gray-300 text-sm mb-1.5 block">Book Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#6366f1] border border-gray-700 text-sm"
              />
            </div>

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
                  required
                  min="0"
                  step="0.01"
                  className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#6366f1] border border-gray-700 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-1.5 block">Short Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#6366f1] border border-gray-700 text-sm resize-none"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-1.5 block">Ebook Content *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={8}
                className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#6366f1] border border-gray-700 text-sm resize-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Link
                href="/dashboard/writer/ebooks"
                className="bg-[#0f172a] border border-gray-700 text-white px-6 py-3 rounded-xl text-sm transition hover:border-gray-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || imageUploading}
                className="bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl transition"
              >
                {loading ? "Updating..." : "Update Ebook"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}