/**
 * PrivacyPage - Privacy Policy
 * Luxury Editorial Edition
 */

import { Link } from 'react-router-dom'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <div className="max-w-3xl mx-auto px-8 md:px-16 py-20 md:py-32">
        {/* Header */}
        <div className="mb-16 border-b border-[#1A1A1A]/10 pb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-8 md:w-12 bg-[#D4AF37]" />
            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#6C6863]">
              Legal
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-[#1A1A1A] leading-[0.9] tracking-tight">
            Privacy <em className="text-[#D4AF37]">Policy</em>
          </h1>
          <p className="font-sans text-sm text-[#6C6863] mt-6">
            Last updated: April 27, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12 font-sans text-[#1A1A1A]">
          {/* Section 1 */}
          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">1. Introduction</h2>
            <p className="text-sm leading-relaxed text-[#6C6863] mb-4">
              DammyLive ("we" or "us" or "our") operates the dammylive.com website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">2. Information Collection and Use</h2>
            <p className="text-sm leading-relaxed text-[#6C6863] mb-4">
              We collect several different types of information for various purposes to provide and improve our Service to you.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-[#1A1A1A] mb-2">2.1 Personal Data</h3>
                <p className="text-sm leading-relaxed text-[#6C6863]">
                  While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-[#6C6863] mt-2">
                  <li>Email address</li>
                  <li>First name and last name</li>
                  <li>Phone number</li>
                  <li>Address, State, Province, ZIP/Postal code, City</li>
                  <li>Cookies and Usage Data</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[#1A1A1A] mb-2">2.2 Usage Data</h3>
                <p className="text-sm leading-relaxed text-[#6C6863]">
                  We may also collect information about how the Service is accessed and used ("Usage Data"). This may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">3. Use of Data</h2>
            <p className="text-sm leading-relaxed text-[#6C6863] mb-4">
              DammyLive uses the collected data for various purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-[#6C6863]">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">4. Security of Data</h2>
            <p className="text-sm leading-relaxed text-[#6C6863] mb-4">
              The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">5. Changes to This Privacy Policy</h2>
            <p className="text-sm leading-relaxed text-[#6C6863] mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">6. Your Rights</h2>
            <p className="text-sm leading-relaxed text-[#6C6863] mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-[#6C6863]">
              <li>Access your Personal Data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of certain uses of your data</li>
              <li>Data portability</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">7. Cookies</h2>
            <p className="text-sm leading-relaxed text-[#6C6863] mb-4">
              We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">8. Third-Party Links</h2>
            <p className="text-sm leading-relaxed text-[#6C6863] mb-4">
              Our Service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third-party sites or services.
            </p>
          </section>

          {/* Contact */}
          <section className="mt-16 pt-12 border-t border-[#1A1A1A]/10">
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">Contact Us</h2>
            <p className="text-sm leading-relaxed text-[#6C6863]">
              If you have any questions about this Privacy Policy, please <Link to="/contact" className="text-[#D4AF37] hover:text-[#1A1A1A] transition-colors duration-300">contact us</Link> through our editorial pit wall.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
