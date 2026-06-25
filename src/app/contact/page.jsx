export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">Contact Us</h1>
        <p className="text-gray-400 mb-8">Have questions? We'd love to hear from you.</p>
        <div className="bg-[#1e293b] rounded-2xl border border-gray-800 p-8 space-y-4">
          <div>
            <p className="text-gray-400 text-sm">Email</p>
            <p className="text-white font-medium">support@fable.com</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Location</p>
            <p className="text-white font-medium">Dhaka, Bangladesh</p>
          </div>
        </div>
      </div>
    </div>
  );
}