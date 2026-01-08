'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Question, TradeQuote } from '../types';

interface TradePanelProps {
  question: Question;
  onTradeComplete: () => void;
}

export default function TradePanel({ question, onTradeComplete }: TradePanelProps) {
  const router = useRouter();
  const { user, refetchUser } = useAuth();
  const [selectedPosition, setSelectedPosition] = useState<'YES' | 'NO'>('YES');
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<TradeQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isActive = question.status === 'active';
  const position = selectedPosition === 'YES';

  const handleGetQuote = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    try {
      setError('');
      const quoteData = await api.getQuote(question.id.toString(), position, parseFloat(amount));
      setQuote(quoteData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await api.buyShares(question.id.toString(), position, parseFloat(amount));
      
      setAmount('');
      setQuote(null);
      await refetchUser();
      onTradeComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const yesPrice = Math.round(question.market.yes_price * 100);
  const noPrice = Math.round(question.market.no_price * 100);

  // Calculate estimated probability after trade
  const estimatedNewPrice = quote ? Math.round(quote.price_per_share * 100) : yesPrice;
  const potentialReturn = quote && parseFloat(amount) > 0 ? parseFloat(amount) - quote.cost : 0;

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border-b border-slate-200">
        <h3 className="text-2xl font-black text-slate-900 mb-1">Express Your Opinion</h3>
        <p className="text-sm text-slate-600 font-medium">How confident are you about this outcome?</p>
      </div>

      <div className="p-6">
        {!isActive && (
          <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm text-yellow-800 font-bold mb-1">Market {question.status}</p>
                <p className="text-xs text-yellow-700">You can no longer participate in this market</p>
              </div>
            </div>
          </div>
        )}

        {/* Position Selection - Large Buttons */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-3">
            What's your prediction?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedPosition('YES')}
              disabled={!isActive}
              className={`relative p-6 rounded-2xl border-3 transition-all font-bold group ${
                selectedPosition === 'YES'
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105'
                  : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-300 hover:text-emerald-600'
              } ${!isActive && 'opacity-50 cursor-not-allowed'}`}
            >
              <div className="text-center">
                <div className="text-lg mb-2 font-black">YES</div>
                <div className="text-3xl font-black">{yesPrice}¢</div>
                {selectedPosition === 'YES' && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>

            <button
              onClick={() => setSelectedPosition('NO')}
              disabled={!isActive}
              className={`relative p-6 rounded-2xl border-3 transition-all font-bold group ${
                selectedPosition === 'NO'
                  ? 'bg-gradient-to-br from-rose-500 to-rose-600 border-rose-600 text-white shadow-lg shadow-rose-200 scale-105'
                  : 'bg-white border-slate-200 text-slate-400 hover:border-rose-300 hover:text-rose-600'
              } ${!isActive && 'opacity-50 cursor-not-allowed'}`}
            >
              <div className="text-center">
                <div className="text-lg mb-2 font-black">NO</div>
                <div className="text-3xl font-black">{noPrice}¢</div>
                {selectedPosition === 'NO' && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            How much to stake?
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setQuote(null);
              }}
              onBlur={handleGetQuote}
              disabled={!isActive}
              placeholder="Enter amount"
              className="w-full px-4 py-4 text-2xl font-bold border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
              credits
            </span>
          </div>
        </div>

        {/* Prediction Summary */}
        {quote && parseFloat(amount) > 0 && (
          <div className="mb-6 p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-200">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Estimated Impact</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">
                    {estimatedNewPrice}%
                  </span>
                  <span className="text-sm text-slate-500 font-semibold">
                    {selectedPosition} probability
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">If you're right:</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 font-medium">You invested</span>
                  <span className="text-sm font-bold text-slate-900">{quote.cost.toFixed(2)} credits</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 font-medium">You'll receive</span>
                  <span className="text-sm font-bold text-emerald-600">{parseFloat(amount).toFixed(2)} credits</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                  <span className="text-sm text-slate-700 font-bold">Potential return</span>
                  <span className={`text-lg font-black ${
                    potentialReturn > 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {potentialReturn > 0 ? '+' : ''}{potentialReturn.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border-2 border-rose-200 rounded-xl">
            <p className="text-sm text-rose-700 font-semibold">{error}</p>
          </div>
        )}

        {/* User Balance */}
        {user && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 font-semibold">Your balance</span>
              <span className="text-lg font-black text-blue-600">{user.influence_credits.toLocaleString()} credits</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isActive || loading || !amount || parseFloat(amount) <= 0}
          className={`w-full py-5 rounded-xl font-black text-lg transition-all transform active:scale-95 ${
            !isActive || loading || !amount || parseFloat(amount) <= 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : selectedPosition === 'YES'
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-200 hover:shadow-xl'
              : 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-200 hover:shadow-xl'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Express ${selectedPosition} Opinion`
          )}
        </button>

        {!user && (
          <div className="mt-6 text-center p-4 bg-slate-50 rounded-xl">
            <p className="text-sm text-slate-600 mb-3 font-medium">
              Sign in to express your opinion
            </p>
            <button 
              onClick={() => router.push('/login')} 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Login to Participate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}