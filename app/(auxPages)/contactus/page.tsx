'use client'

import { saveContactMessage } from "@/app/actions/auxQueries";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const {toast} = useToast()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const response = await saveContactMessage(formData);

    if (response.success) {
      toast({
        title: 'Message sent successfully'
      })
    } else {
      toast({
        title: 'Message sent successfully',
        variant: 'destructive'
      })    }
  }

  return (
    <div className="text-gray-300 min-h-screen py-16 px-6 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-lg">
            Have questions, feedback, or need assistance? Reach out to us, and we’ll be happy to help.
          </p>
        </header>

        {/* Contact Form Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">Our Office</h2>
              <p className="text-lg">123 YourCloud Street, TechCity, TX 12345</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">Email Us</h2>
              <p className="text-lg">
                <a
                  href="mailto:support@yourcloud.com"
                  className="text-blue-500 hover:underline"
                >
                  support@yourcloud.com
                </a>
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">Call Us</h2>
              <p className="text-lg">+1 (123) 456-7890</p>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your message"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition duration-300"
            >
              Send Message
            </button>
          </form>
        </section>

        {/* Footer Section */}
        <footer className="text-center mt-16">
          <p className="text-sm text-gray-400">
            We’ll respond to your inquiries as soon as possible. Thank you for reaching out!
          </p>
        </footer>
      </div>
    </div>
  );
}
