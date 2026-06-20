import Link from "next/link";
import { RiBookOpenLine, RiFacebookFill, RiTwitterFill, RiInstagramFill, RiLinkedinFill } from "react-icons/ri";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-400 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-[#6366f1] mb-3">
              <RiBookOpenLine />
              Fable
            </Link>
            <p className="text-sm leading-relaxed">
              Discover and read original ebooks from talented writers around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-[#6366f1] transition">Home</Link></li>
              <li><Link href="/browse" className="hover:text-[#6366f1] transition">Browse Ebooks</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#6366f1] transition">Dashboard</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Info</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-[#6366f1] transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-[#6366f1] transition">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-[#6366f1] transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-sm mb-3">Stay updated with new ebooks and writers.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-[#1e293b] text-white text-sm px-3 py-2 rounded-lg w-full outline-none focus:ring-1 focus:ring-[#6366f1]"
              />
              <button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white text-sm px-4 py-2 rounded-lg transition">
                Go
              </button>
            </div>
          </div>
        </div>

        {/* Social + Copyright */}
        <div className="border-t border-[#1e293b] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">© 2025 Fable. All rights reserved.</p>
          <div className="flex gap-4 text-xl">
            <a href="#" className="hover:text-[#6366f1] transition"><RiFacebookFill /></a>
            <a href="#" className="hover:text-[#6366f1] transition"><RiTwitterFill /></a>
            <a href="#" className="hover:text-[#6366f1] transition"><RiInstagramFill /></a>
            <a href="#" className="hover:text-[#6366f1] transition"><RiLinkedinFill /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}