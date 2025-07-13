export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="mb-6 text-gray-700">We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us.</p>

            <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>To provide, maintain, and improve our services</li>
              <li>To process transactions and send related information</li>
              <li>To send technical notices and support messages</li>
              <li>To communicate with you about products, services, and events</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">3. Information Sharing</h2>
            <p className="mb-6 text-gray-700">We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>

            <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
            <p className="mb-6 text-gray-700">We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

            <h2 className="text-xl font-semibold mb-4">5. Student Privacy (FERPA Compliance)</h2>
            <p className="mb-6 text-gray-700">We comply with the Family Educational Rights and Privacy Act (FERPA) and maintain strict confidentiality of student educational records.</p>

            <h2 className="text-xl font-semibold mb-4">6. Your Rights</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">7. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@greenwoodacademy.edu
              <br />
              Phone: (555) 123-4567
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
