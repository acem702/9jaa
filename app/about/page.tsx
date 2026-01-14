import Navbar from "@/components/Navbar";
import PageHeader from "@/components/ui/PageHeader";
import MobileBottomNav from "@/components/ui/MobileBottomNav";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12 pb-32">
        <PageHeader 
          title="About 9ja Markets" 
          subtitle="Empowering Nigerians through political forecasting and collective wisdom." 
        />

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                9ja Markets is Nigeria's premier political prediction platform. Our mission is to provide a transparent, data-driven space where citizens can express their opinions on political outcomes and track the pulse of the nation in real-time.
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-violet-600">The Power of Markets</h3>
                <p className="text-slate-600 leading-relaxed text-sm font-medium">
                  Prediction markets are proven to be more accurate than traditional polling. By allowing participants to trade based on their beliefs, we aggregate collective intelligence into actionable insights.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-purple-600">Transparency First</h3>
                <p className="text-slate-600 leading-relaxed text-sm font-medium">
                  Every trade and price movement is recorded on our platform. We believe in providing open access to political sentiment data for all Nigerians.
                </p>
              </div>
            </section>

            <section className="bg-gradient-to-br from-slate-50 to-violet-50/30 rounded-2xl p-6 border border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 mb-4">How it Works</h2>
              <div className="space-y-4 text-slate-600 font-medium">
                <p>
                  Participants use <strong>Influence Credits</strong> to buy shares in YES or NO outcomes for specific political events. As more people trade, the price reflects the aggregate probability of that event occurring.
                </p>
                <p>
                  If your prediction is correct, your shares are resolved at 100% value. If incorrect, they resolve at 0%. Your success builds your standing on our global leaderboard.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4">Non-Partisan Platform</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                9ja Markets is strictly non-partisan. We do not endorse candidates or parties. Our goal is solely to provide a platform for sentiment analysis and forecasting. We believe that by quantifying political belief, we can foster a more informed and engaged electorate.
              </p>
            </section>
          </div>
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
