import React from 'react';

const page = () => {
  return (
    <div className="p-6 rounded-lg text-foreground">
      <h2 className="text-2xl font-semibold mb-4">Terms and Conditions</h2>

      <h3 className="text-xl font-semibold mb-2">1. Introduction</h3>
      <p>
        Welcome to [Your Web App Name]. By accessing or using our web app, you agree to comply with these Terms and Conditions `&quot;`Terms`&quot;`. If you do not agree to these Terms, please refrain from using our web app.
      </p>

      <h3 className="text-xl font-semibold mb-2">2. User Registration</h3>
      <p>
        To use our web app, you must create an account. You agree to provide accurate and complete information during registration and to keep your account information up to date.
      </p>

      <h3 className="text-xl font-semibold mb-2">3. Account Security</h3>
      <p>
        You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately if you suspect any unauthorized access to your account.
      </p>

      <h3 className="text-xl font-semibold mb-2">4. Use of the Web App</h3>
      <p>
        You agree to use our web app solely for lawful purposes and in accordance with these Terms. You may not:
      </p>
      <ul className="list-disc pl-6">
        <li>Violate any applicable laws or regulations.</li>
        <li>Upload or share content that is illegal, harmful, or infringing on the rights of others.</li>
        <li>Interfere with the operation or security of the web app.</li>
      </ul>

      <h3 className="text-xl font-semibold mb-2">5. Content Ownership</h3>
      <p>
        You retain ownership of the content you upload to the web app. However, by uploading content, you grant us a non-exclusive, worldwide, royalty-free license to store, process, and transmit that content as necessary for providing our services.
      </p>

      <h3 className="text-xl font-semibold mb-2">6. Data Storage</h3>
      <p>
        We provide cloud storage for your files. While we take reasonable precautions to protect your data, we cannot guarantee the complete security or integrity of your content.
      </p>

      <h3 className="text-xl font-semibold mb-2">7. Termination of Account</h3>
      <p>
        We reserve the right to suspend or terminate your account if you violate these Terms. You may also close your account at any time by contacting us.
      </p>

      <h3 className="text-xl font-semibold mb-2">8. Limitation of Liability</h3>
      <p>
        We are not liable for any indirect, incidental, or consequential damages arising from the use or inability to use our web app.
      </p>

      <h3 className="text-xl font-semibold mb-2">9. Governing Law</h3>
      <p>
        These Terms are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved in the courts of [Your Jurisdiction].
      </p>

      <h3 className="text-xl font-semibold mb-2">10. Changes to Terms</h3>
      <p>
        We reserve the right to modify these Terms at any time. We will notify you of significant changes via email or through the web app.
      </p>

      <h3 className="text-xl font-semibold mb-2">11. Contact Us</h3>
      <p>
        If you have any questions or concerns, please contact us at [Your Contact Information].
      </p>
    </div>
  );
};

export default page;
