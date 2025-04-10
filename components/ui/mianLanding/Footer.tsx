import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground py-16 px-6 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start mb-12">
          {/* Logo and Description */}
          <div className="mb-8 lg:mb-0">
            <h2 className="text-3xl font-bold">Nafri</h2>
            <p className="text-base mt-3">
              Secure, scalable, and accessible cloud storage for everyone.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-base">
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-3">
                <li><Link href="aboutus" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="#careers" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="#blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Features</h3>
              <ul className="space-y-3">
                <li><Link href="#secure" className="text-muted-foreground hover:text-foreground transition-colors">Secure Storage</Link></li>
                <li><Link href="#share" className="text-muted-foreground hover:text-foreground transition-colors">File Sharing</Link></li>
                <li><Link href="#access" className="text-muted-foreground hover:text-foreground transition-colors">Access Anywhere</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-3">
                <li><Link href="contactus" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQs</Link></li>
                <li><Link href="contactus" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-10"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Social Icons */}
          <div className="flex space-x-5 mb-6 md:mb-0">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Facebook className="w-6 h-6" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="w-6 h-6" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Instagram className="w-6 h-6" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="w-6 h-6" />
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-base text-muted-foreground">
            &copy; {new Date().getFullYear()} Nafri. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
