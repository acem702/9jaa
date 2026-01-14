import Navbar from "@/components/Navbar";
import PageHeader from "@/components/ui/PageHeader";
import MobileBottomNav from "@/components/ui/MobileBottomNav";

export default function FAQPage() {
  const faqs = [
    {
      question: "What are Influence Credits?",
      answer: "Influence Credits are the virtual currency used on 9ja Markets. They have no real-world monetary value and are used to represent the weight of your predictions in the market."
    },
    {
      question: "How do I earn more credits?",
      answer: "You earn credits by making correct predictions. When a market resolves in your favor, you receive a payout based on the number of shares you hold. You can also earn credits through daily logins or special community events."
    },
    {
      question: "Is this gambling?",
      answer: "No. 9ja Markets is a prediction platform used for sentiment analysis and collective forecasting. Since Influence Credits cannot be bought with or exchanged for real money, it does not constitute gambling."
    },
    {
      question: "How are markets resolved?",
      answer: "Markets are resolved based on verified real-world outcomes from reputable news sources, official government announcements, or other public records. Each market has specific resolution criteria listed in its description."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12 pb-32">
        <PageHeader 
          title="Frequently Asked Questions" 
          subtitle="Everything you need to know about 9ja Markets." 
        />

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 mb-3">{faq.question}</h3>
              <p className="text-slate-600 font-medium leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
