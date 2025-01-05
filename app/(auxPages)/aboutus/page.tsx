export default function About() {
    return (
      <div className=" text-gray-300 min-h-screen py-16 px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <header className="text-center mb-16">
            <h1 className="text-4xl font-bold text-white mb-4">About Us</h1>
            <p className="text-lg">
              Learn more about who we are, what we do, and why we’re passionate about providing the best cloud storage solutions.
            </p>
          </header>
  
          {/* About Us Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">Who We Are</h2>
            <p className="text-lg leading-relaxed">
              At Next-Cloud, we believe that everyone deserves secure, scalable, and accessible cloud storage solutions. 
              We’re a team of technology enthusiasts and problem solvers dedicated to simplifying how you store and share your data. 
              Our mission is to empower individuals and businesses to focus on what matters most while we handle their data storage needs.
            </p>
          </section>
  
          {/* Our Values Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">Our Values</h2>
            <ul className="list-disc pl-6 text-lg space-y-4">
              <li>
                <span className="font-semibold">Security:</span> Your data’s safety is our top priority, with industry-leading encryption and robust security measures.
              </li>
              <li>
                <span className="font-semibold">Innovation:</span> We constantly improve and evolve to bring you cutting-edge cloud technology.
              </li>
              <li>
                <span className="font-semibold">Accessibility:</span> Easy-to-use interfaces and affordable plans for everyone.
              </li>
            </ul>
          </section>
  
          {/* Our Mission Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">Our Mission</h2>
            <p className="text-lg leading-relaxed">
              To provide seamless, secure, and scalable cloud storage solutions that enhance productivity, foster collaboration, and inspire trust in our users.
            </p>
          </section>
  
          {/* Team Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">Meet Our Team</h2>
            <p className="text-lg leading-relaxed">
              Our team is made up of talented engineers, designers, and support staff who are passionate about creating the best experience for our users. 
              We work tirelessly to bring you innovative features and reliable service.
            </p>
          </section>
  
          {/* Call to Action */}
          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold text-white mb-4">Join Us on This Journey</h3>
            <p className="text-lg">
              Whether you’re an individual, a business, or a tech enthusiast, Next-Cloud is here to meet your storage needs. 
              <a href="#contact" className="text-blue-500 hover:underline"> Contact us</a> to learn more or get started today.
            </p>
          </div>
        </div>
      </div>
    );
  }
  