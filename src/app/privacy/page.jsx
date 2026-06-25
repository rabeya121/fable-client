export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">Privacy Policy</h1>
        <div className="space-y-6 text-gray-300">
          <div>
            <h2 className="text-white font-semibold text-lg mb-2">Data Collection</h2>
            <p>We collect only necessary information to provide our services, including your name, email, and purchase history.</p>
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg mb-2">Data Usage</h2>
            <p>Your data is used solely to provide and improve our services. We never sell your personal information to third parties.</p>
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg mb-2">Security</h2>
            <p>We use industry-standard encryption and security measures to protect your data.</p>
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg mb-2">Contact</h2>
            <p>For privacy concerns, contact us at privacy@fable.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}