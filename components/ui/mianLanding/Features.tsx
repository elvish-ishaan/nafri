import { ShieldCheck, Globe, Share, Cloud, Settings, Terminal } from 'lucide-react';

export default function Features() {
  return (
    <section className="bg-card text-card-foreground min-h-screen py-16 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Why Choose Us?</h2>
        <p className="text-lg text-muted-foreground mb-12">
          Experience secure, seamless, and efficient cloud storage with features designed for modern needs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Secure */}
          <div className="flex flex-col items-center p-6 bg-secondary rounded-lg">
            <ShieldCheck className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Powered by AWS Security</h3>
            <p className="text-muted-foreground text-center">
            Your files are encrypted and securely stored using advanced AWS cloud
            infrastructure.
            </p>
          </div>

          {/* Access Anywhere */}
          <div className="flex flex-col items-center p-6 bg-secondary rounded-lg">
            <Globe className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Access Anywhere</h3>
            <p className="text-muted-foreground text-center">
              Access your files anytime, anywhere, on any device with ease.
            </p>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center p-6 bg-secondary rounded-lg">
            <Share className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Share</h3>
            <p className="text-muted-foreground text-center">
              Collaborate and share files with teammates or friends securely.
            </p>
          </div>

          {/* Cloud Storage */}
          <div className="flex flex-col items-center p-6 bg-secondary rounded-lg">
            <Cloud className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Cloud Storage</h3>
            <p className="text-muted-foreground text-center">
              Enjoy scalable storage for all your files, photos, and videos.
            </p>
          </div>

          {/* devlopers */}
          <div className="flex flex-col items-center p-6 bg-secondary rounded-lg">
           <Terminal className="w-12 h-12 text-green-500 mb-4" />
           <h3 className="text-xl font-semibold mb-2">Developer Tools</h3>
           <p className="text-muted-foreground text-center">
           Easily integrate our APIs to manage and optimize
            assets with robust SDKs and expert support.
           </p>
         </div>

          {/* Customizable Settings */}
          <div className="flex flex-col items-center p-6 bg-secondary rounded-lg">
            <Settings className="w-12 h-12 text-teal-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Customizable Settings</h3>
            <p className="text-muted-foreground text-center">
              Tailor the experience to suit your preferences with flexible settings.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
