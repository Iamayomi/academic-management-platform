export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-6 text-gray-700">By accessing and using the Greenwood Academy School Management System, you accept and agree to be bound by the terms and provision of this agreement.</p>

            <h2 className="text-xl font-semibold mb-4">2. Use License</h2>
            <p className="mb-6 text-gray-700">
              Permission is granted to temporarily access the materials on Greenwood Academy's school management system for personal, non-commercial transitory viewing only.
            </p>

            <h2 className="text-xl font-semibold mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Use the system only for educational purposes</li>
              <li>Respect the privacy and rights of other users</li>
              <li>Report any security vulnerabilities or inappropriate content</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">4. Privacy and Data Protection</h2>
            <p className="mb-6 text-gray-700">
              We are committed to protecting your privacy. All personal information collected through this system is handled in accordance with our Privacy Policy and applicable data protection laws.
            </p>

            <h2 className="text-xl font-semibold mb-4">5. Prohibited Uses</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Attempting to gain unauthorized access to any part of the system</li>
              <li>Sharing account credentials with unauthorized individuals</li>
              <li>Using the system for any illegal or unauthorized purpose</li>
              <li>Interfering with or disrupting the system's operation</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">6. Contact Information</h2>
            <p className="text-gray-700">
              If you have any questions about these Terms of Service, please contact us at:
              <br />
              Email: legal@greenwoodacademy.edu
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
