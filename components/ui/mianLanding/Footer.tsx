import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="text-gray-300 py-16 px-6 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start mb-12">
          {/* Logo and Description */}
          <div className="mb-8 lg:mb-0">
            <h2 className="text-3xl font-bold text-white">Nafri</h2>
            <p className="text-base mt-3">
              Secure, scalable, and accessible cloud storage for everyone.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-base">
            <div>
              <h3 className="text-white font-semibold mb-3">Company</h3>
              <ul className="space-y-3">
                <li><Link href="aboutus" className="hover:text-white">About Us</Link></li>
                <li><Link href="#careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="#blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Features</h3>
              <ul className="space-y-3">
                <li><Link href="#secure" className="hover:text-white">Secure Storage</Link></li>
                <li><Link href="#share" className="hover:text-white">File Sharing</Link></li>
                <li><Link href="#access" className="hover:text-white">Access Anywhere</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Support</h3>
              <ul className="space-y-3">
                <li><Link href="contactus" className="hover:text-white">Help Center</Link></li>
                <li><Link href="faq" className="hover:text-white">FAQs</Link></li>
                <li><Link href="contactus" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-10"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Social Icons */}
          <div className="flex space-x-5 mb-6 md:mb-0">
            <Link href="#" className="text-gray-300 hover:text-white">
              <Facebook className="w-6 h-6" />
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white">
              <Twitter className="w-6 h-6" />
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white">
              <Instagram className="w-6 h-6" />
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white">
              <Linkedin className="w-6 h-6" />
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-base text-gray-400">
            &copy; {new Date().getFullYear()} Nafri. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
