import Navbar from "@/components/Navbar";
import PageHeader from "@/components/ui/PageHeader";
import MobileBottomNav from "@/components/ui/MobileBottomNav";

export default function HowToPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12 pb-32">
        <PageHeader 
          title="How to Participate" 
          subtitle="A step-by-step guide to predicting political outcomes on 9ja Markets." 
        />

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200/80 shadow-lg p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-lg shadow-violet-200">
                1
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4">Create your Account</h2>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Join the community by registering with your email. Every new participant receives a starting balance of <strong>Influence Credits</strong> to begin their journey.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200/80 shadow-lg p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-lg shadow-purple-200">
                2
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4">Explore Markets</h2>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Browse through active markets covering elections, policy decisions, and political appointments. Each market displays the current "Sentiment" (price) representing the community's prediction.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200/80 shadow-lg p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-lg shadow-blue-200">
                3
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4">Place your Prediction</h2>
                <p className="text-slate-600 leading-relaxed font-medium mb-4">
                  Decide if you think an event will happen (YES) or not (NO). 
                </p>
                <ul className="space-y-3 text-sm text-slate-500 font-bold uppercase tracking-wide">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Buy YES if you believe it will occur
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Buy NO if you believe it will not
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200/80 shadow-lg p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-lg shadow-emerald-200">
                4
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4">Resolve and Rank</h2>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Once the real-world event occurs, the market is resolved. Correct predictions earn full payouts, increasing your credits and propelling you up the leaderboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
