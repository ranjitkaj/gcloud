import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function TermsConditions() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-500">
            <button
              onClick={() => window.history.back()}
              className="hover:text-primary focus:outline-none"
            >
              ← Back
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Terms and Conditions
          </h1>

          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              Welcome to URGENT SALES. These Terms and Conditions govern your
              use of our website and services. By accessing or using our
              platform, you agree to be bound by these terms.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-4">
              By accessing or using Urgent Sales, you agree to these Terms and
              Conditions and our Privacy Policy. If you do not agree to these
              terms, please do not use our services.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              2. User Accounts
            </h2>
            <p className="text-gray-700 mb-4">
              To access certain features of our platform, you may need to create
              an account. You are responsible for maintaining the
              confidentiality of your account information and for all activities
              that occur under your account.
            </p>
            <p className="text-gray-700 mb-4">
              You agree to provide accurate, current, and complete information
              during the registration process and to update such information to
              keep it accurate, current, and complete.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              3. Property Listings
            </h2>
            <p className="text-gray-700 mb-4">
              Urgent Sales provides a platform for users to list properties for
              sale or rent. Users who list properties ("Sellers") agree to
              provide accurate and complete information about their properties.
            </p>
            <p className="text-gray-700 mb-4">
              Urgent Sales does not verify the accuracy of property listings and
              is not responsible for any inaccuracies or misrepresentations in
              the listings.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              4. Prohibited Activities
            </h2>
            <p className="text-gray-700 mb-4">Users are prohibited from:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>
                Posting false, misleading, or fraudulent property listings
              </li>
              <li>Harassing or intimidating other users</li>
              <li>Posting illegal or unauthorized content</li>
              <li>Attempting to circumvent the platform's fee structure</li>
              <li>Using the platform for any illegal purpose</li>
              <li>
                Attempting to gain unauthorized access to other user accounts or
                our systems
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              5. Fees and Payments
            </h2>
            <p className="text-gray-700 mb-4">
              Some services offered by Urgent Sales may require payment of fees.
              All fees are non-refundable unless otherwise stated. We reserve
              the right to change our fee structure at any time.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              6. Intellectual Property
            </h2>
            <p className="text-gray-700 mb-4">
              The content, organization, graphics, design, and other matters
              related to our platform are protected under applicable copyrights,
              trademarks, and other proprietary rights. Copying, redistribution,
              or publication of any such content is strictly prohibited without
              our express written consent.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              7. Limitation of Liability
            </h2>
            <p className="text-gray-700 mb-4">
              Urgent Sales is provided on an "as is" and "as available" basis.
              We make no warranties, expressed or implied, regarding the
              operation of our platform or the information, content, or
              materials included on our platform.
            </p>
            <p className="text-gray-700 mb-4">
              In no event shall Urgent Sales or its affiliates be liable for any
              indirect, incidental, special, or consequential damages arising
              out of or in any way connected with the use of our platform.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              8. Indemnification
            </h2>
            <p className="text-gray-700 mb-4">
              You agree to indemnify, defend, and hold harmless Urgent Sales,
              its officers, directors, employees, agents, and licensors from and
              against all losses, expenses, damages, and costs, including
              reasonable attorneys' fees, resulting from any violation of these
              Terms and Conditions.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              9. Termination
            </h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to terminate or suspend your account and
              access to our platform at our sole discretion, without notice, for
              conduct that we believe violates these Terms and Conditions or is
              harmful to other users, us, or third parties, or for any other
              reason.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              10. Changes to Terms
            </h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these Terms and Conditions at any
              time. Updated versions will be posted on this page. Your continued
              use of our platform after any such changes constitutes your
              acceptance of the new Terms and Conditions.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              11. Governing Law
            </h2>
            <p className="text-gray-700 mb-4">
              These Terms and Conditions shall be governed by and construed in
              accordance with the laws of India, without regard to its conflict
              of law principles.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              12. Contact Information
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions or concerns about these Terms and
              Conditions, please contact us at:
            </p>
            <p className="text-gray-700 mb-4">
              Email: support@urgentsales.com
              <br />
              Phone: +91 8800123456
              <br />
              Address: 123 Tech Park, Whitefield, Bangalore - 560066, India
            </p>

            <p className="text-gray-700 mt-8">Last Updated: March 19, 2025</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
