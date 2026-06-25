export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">About Fable</h1>
        <p className="text-gray-300 leading-relaxed mb-4">
          Fable is a digital platform that connects ebook lovers, readers, and collectors with talented writers. The platform allows users to browse, discover, and read original ebooks.
        </p>
        <p className="text-gray-300 leading-relaxed mb-4">
          Writers can upload and manage their creations, while an admin oversees the entire system. Our mission is to democratize access to literature and enable emerging writers to reach global audiences.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Built with Next.js, Express.js, MongoDB, and Stripe — Fable demonstrates advanced full-stack development concepts.
        </p>
      </div>
    </div>
  );
}