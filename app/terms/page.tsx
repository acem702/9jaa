import Navbar from "@/components/Navbar";
import PageHeader from "@/components/ui/PageHeader";
import MobileBottomNav from "@/components/ui/MobileBottomNav";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12 pb-32">
        <PageHeader 
          title="Terms of Service" 
          subtitle="Last updated: January 2026" 
        />

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-12 prose prose-slate max-w-none">
          <section className="mb-10">
            <h2 className="text-xl font-black text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              By accessing or using FOREKAST, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-black text-slate-900 mb-4">2. Eligibility</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              You must be at least 18 years old to use this platform. By using the platform, you represent and warrant that you have the right, authority, and capacity to enter into this agreement.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-black text-slate-900 mb-4">3. Nature of Platform</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              FOREKAST is an informational prediction platform. <strong>Influence Credits</strong> have no real-world monetary value and cannot be exchanged for currency. The platform is for entertainment and sentiment analysis purposes only.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-black text-slate-900 mb-4">4. User Conduct</h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-4">
              Users agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 font-medium">
              <li>Manipulate market outcomes through fraudulent means;</li>
              <li>Create multiple accounts to gain an unfair advantage;</li>
              <li>Use the platform for any illegal activities;</li>
              <li>Harass or abuse other users.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-black text-slate-900 mb-4">5. Disclaimer of Warranty</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              The services are provided "as is" without warranty of any kind. FOREKAST does not guarantee the accuracy of predictions or market data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-4">6. Limitation of Liability</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              FOREKAST shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform.
            </p>
          </section>
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
