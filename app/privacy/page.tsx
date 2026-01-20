import Navbar from "@/components/Navbar";
import PageHeader from "@/components/ui/PageHeader";
import MobileBottomNav from "@/components/ui/MobileBottomNav";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12 pb-32">
        <PageHeader 
          title="Privacy Policy" 
          subtitle="Last updated: January 2026" 
        />

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-12 prose prose-slate max-w-none">
          <section className="mb-10">
            <h2 className="text-xl font-black text-slate-900 mb-4">1. Information We Collect</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              We collect information you provide directly to us when you create an account, participate in our markets, or communicate with us. This includes your name, email address, and transaction history on the platform.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-black text-slate-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 font-medium">
              <li>Provide, maintain, and improve our services;</li>
              <li>Process your transactions and show your portfolio;</li>
              <li>Send you technical notices, updates, and security alerts;</li>
              <li>Monitor and analyze trends, usage, and activities.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-black text-slate-900 mb-4">3. Data Security</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-black text-slate-900 mb-4">4. Sharing of Information</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              We do not share your personal information with third parties except as described in this policy or with your consent. Public data, such as your leaderboard ranking and trading activity, is visible to other users of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-4">5. Contact Us</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at support@forekast.io.
            </p>
          </section>
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
