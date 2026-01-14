import Navbar from "@/components/Navbar";
import PageHeader from "@/components/ui/PageHeader";
import MobileBottomNav from "@/components/ui/MobileBottomNav";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12 pb-32">
        <PageHeader 
          title="Disclaimer" 
          subtitle="Legal information regarding the use of 9ja Markets." 
        />

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-12 prose prose-slate max-w-none">
          <section className="mb-10">
            <h2 className="text-xl font-black text-slate-900 mb-4">Informational Purposes Only</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              The content provided on 9ja Markets, including market data, prices, and outcome predictions, is for informational and educational purposes only. It does not constitute financial, investment, or political advice.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-black text-slate-900 mb-4">No Monetary Value</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              <strong>Influence Credits</strong> used on this platform are virtual points with no real-world monetary value. They cannot be withdrawn, exchanged for cash, or used to purchase goods or services outside of the platform.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-black text-slate-900 mb-4">Accuracy of Information</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              While we strive to ensure that all information on the site is accurate, 9ja Markets does not guarantee the completeness or accuracy of any market description, resolution criteria, or user-generated content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-4">Platform Availability</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              9ja Markets reserves the right to suspend or terminate any market or the platform as a whole at any time without prior notice. We are not responsible for any perceived loss of virtual credits due to platform downtime or technical issues.
            </p>
          </section>
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
