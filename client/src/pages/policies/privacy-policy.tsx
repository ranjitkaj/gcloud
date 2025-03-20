import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            1. Introduction
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              This Privacy Policy ("Policy") governs the manner in which
              UrgentSales.in. (“Company”, “we”, “us”, or “our”), operating under
              the brand UrgentSales.in, collects, uses, discloses, stores, and
              protects the personal information of users (“User”, “you”, “your”)
              accessing or using our platform, including but not limited to our
              website www.urgentsales.in, mobile application, APIs, and any
              other service (collectively “Platform”).
            </p>
            <p>
              By accessing or using the Platform, you consent to the practices
              described in this Policy. If you do not agree, you must
              immediately cease use of the Platform.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              2. Legal Compliance
            </h2>
            <p className="text-gray-700 mb-4">
              This Policy is published in compliance with:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>
                Section 43A and 72A of the Information Technology Act, 2000
              </li>
              <li>
                <b>
                  Information Technology (Reasonable Security Practices and
                  Procedures and Sensitive Personal Data or Information) Rules,
                  2011
                </b>
              </li>
              <li>Other applicable laws and regulations of India.</li>
            </ul>
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              3. Categories of Information Collected
            </h2>
            <h3 className="text-gray-700 mb-4">a) Personal Information</h3>
            <p className="text-gray-700 mb-4">
              We may collect information that identifies or relates to an
              individual, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Name, contact number, address, email ID</li>
              <li> Identity documents (e.g., PAN, Aadhaar, Passport, etc.)</li>
              <li> Property ownership documents and photos</li>
              <li>Payment and billing details</li>
              <li>User-generated content (messages, feedback, reviews)</li>
            </ul>
            <h3 className="text-gray-700 mb-4">
              b) Non-Personal/Technical Information
            </h3>
            <p className="text-gray-700 mb-4">
              Automatically collected data includes:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>IP address, device identifiers, browser type</li>
              <li>
                {" "}
                Geolocation (approximate), cookies, time zone, access times
              </li>
              <li>Browsing behavior and usage analytics</li>
            </ul>
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              4. Purpose of Data Collection
            </h2>
            <p className="text-gray-700 mb-4">
              We collect and process information for the following purposes:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>To provide, personalize, and improve our services</li>
              <li>
                {" "}
                To verify identity and ensure compliance with applicable laws
                (e.g., RERA)
              </li>
              <li>For customer support and dispute resolution</li>
              <li> For legal, accounting, tax, and audit purposes</li>
              <li>
                For internal analytics, marketing, and promotional campaigns
              </li>
              <li>	To detect fraud, unauthorized access, or security breaches</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We may use the information we collect for various purposes,
              including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Providing and maintaining our services</li>
              <li>Processing transactions and managing your account</li>
              <li>Facilitating communication between buyers and sellers</li>
              <li>Personalizing your experience and recommending properties</li>
              <li>
                Sending you newsletters, promotions, and marketing
                communications
              </li>
              <li>Improving our platform and developing new features</li>
              <li>Analyzing usage patterns and trends</li>
              <li>Preventing fraud and enhancing security</li>
              <li>Complying with legal obligations</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              4. Information Sharing and Disclosure
            </h2>
            <p className="text-gray-700 mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>
                Other users as necessary to facilitate property transactions
              </li>
              <li>Service providers who assist us in operating our platform</li>
              <li>Business partners and affiliates</li>
              <li>
                Legal authorities when required by law or to protect our rights
              </li>
              <li>
                In connection with a business merger, sale, or acquisition
              </li>
            </ul>
            <p className="text-gray-700 mb-4">
              We do not sell your personal information to third parties.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              5. Your Choices and Rights
            </h2>
            <p className="text-gray-700 mb-4">
              You have certain rights regarding your personal information,
              including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Accessing and updating your personal information</li>
              <li>Opting out of marketing communications</li>
              <li>Requesting deletion of your account and data</li>
              <li>Managing cookie preferences</li>
              <li>Objecting to certain data processing activities</li>
            </ul>
            <p className="text-gray-700 mb-4">
              To exercise these rights, please contact us using the information
              provided at the end of this policy.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              6. Data Security
            </h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate security measures to protect your
              personal information from unauthorized access, alteration,
              disclosure, or destruction. However, no method of transmission
              over the internet or electronic storage is 100% secure, and we
              cannot guarantee absolute security.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              7. Data Retention
            </h2>
            <p className="text-gray-700 mb-4">
              We retain your personal information for as long as necessary to
              fulfill the purposes outlined in this Privacy Policy, unless a
              longer retention period is required or permitted by law.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              8. Children's Privacy
            </h2>
            <p className="text-gray-700 mb-4">
              Our platform is not intended for children under 18 years of age.
              We do not knowingly collect personal information from children
              under 18. If you believe we have collected information from a
              child under 18, please contact us immediately.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              9. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last Updated" date. You are advised to
              review this Privacy Policy periodically for any changes.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              10. Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions or concerns about this Privacy Policy,
              please contact us at:
            </p>
            <p className="text-gray-700 mb-4">
              Email: privacy@homedirectly.com
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
