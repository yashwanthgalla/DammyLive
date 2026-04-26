/**
 * TermsPage - Terms of Service
 * Luxury Editorial Edition
 */

export default function TermsPage() {
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
            Terms of <em className="text-[#D4AF37]">Service</em>
          </h1>
          <p className="font-sans text-sm text-[#6C6863] mt-6">
            Last updated: April 27, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12 font-sans text-[#1A1A1A]">
          {/* Section 1 */}
          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">1. Acceptance of Terms</h2>
            <p className="text-sm leading-relaxed text-[#6C6863] mb-4">
              By accessing and using DammyLive ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">2. Use License</h2>
            <p className="text-sm leading-relaxed text-[#6C6863] mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on DammyLive for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-[#6C6863]">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on DammyLive</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">3. Disclaimer</h2>
            <p className="text-sm leading-relaxed text-[#6C6863] mb-4">
              The materials on DammyLive are provided on an 'as is' basis. DammyLive makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">4. Limitations</h2>
            <p className="text-sm leading-relaxed text-[#6C6863] mb-4">
              In no event shall DammyLive or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on DammyLive.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">5. Accuracy of Materials</h2>
            <p className="text-sm leading-relaxed text-[#6C6863] mb-4">
              The materials appearing on DammyLive could include technical, typographical, or photographic errors. DammyLive does not warrant that any of the materials on its website are accurate, complete, or current. DammyLive may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">6. Links</h2>
            <p className="text-sm leading-relaxed text-[#6C6863] mb-4">
              DammyLive has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by DammyLive of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">7. Modifications</h2>
            <p className="text-sm leading-relaxed text-[#6C6863] mb-4">
              DammyLive may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">8. Governing Law</h2>
            <p className="text-sm leading-relaxed text-[#6C6863] mb-4">
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction where DammyLive operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          {/* Contact */}
          <section className="mt-16 pt-12 border-t border-[#1A1A1A]/10">
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">Questions?</h2>
            <p className="text-sm leading-relaxed text-[#6C6863]">
              If you have any questions about these Terms of Service, please contact us through our website contact form.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
