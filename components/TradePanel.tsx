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
  const [shares, setShares] = useState('');
  const [quote, setQuote] = useState<TradeQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isActive = question.status === 'active';
  const position = selectedPosition === 'YES';

  const handleGetQuote = async () => {
    if (!shares || parseFloat(shares) <= 0) return;
    
    try {
      setError('');
      const quoteData = await api.getQuote(question.id.toString(), position, parseFloat(shares));
      setQuote(quoteData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleTrade = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!shares || parseFloat(shares) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await api.buyShares(question.id.toString(), position, parseFloat(shares));
      
      setShares('');
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

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Trade</h3>

      {!isActive && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-sm text-yellow-800 font-medium">
            This market is {question.status}. Trading is not available.
          </p>
        </div>
      )}

      {/* Position Selection */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setSelectedPosition('YES')}
          disabled={!isActive}
          className={`p-4 rounded-xl border-2 transition-all font-bold ${
            selectedPosition === 'YES'
              ? 'bg-green-50 border-green-500 text-green-700'
              : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
          } ${!isActive && 'opacity-50 cursor-not-allowed'}`}
        >
          <div className="text-sm mb-1">YES</div>
          <div className="text-2xl">{yesPrice}¢</div>
        </button>

        <button
          onClick={() => setSelectedPosition('NO')}
          disabled={!isActive}
          className={`p-4 rounded-xl border-2 transition-all font-bold ${
            selectedPosition === 'NO'
              ? 'bg-red-50 border-red-500 text-red-700'
              : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
          } ${!isActive && 'opacity-50 cursor-not-allowed'}`}
        >
          <div className="text-sm mb-1">NO</div>
          <div className="text-2xl">{noPrice}¢</div>
        </button>
      </div>

      {/* Shares Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Shares
        </label>
        <input
          type="number"
          value={shares}
          onChange={(e) => {
            setShares(e.target.value);
            setQuote(null);
          }}
          onBlur={handleGetQuote}
          disabled={!isActive}
          placeholder="0.00"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed font-semibold text-lg"
        />
      </div>

      {/* Quote Display */}
      {quote && (
        <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Cost</span>
              <span className="font-bold text-gray-900">{quote.cost.toFixed(2)} credits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Est. Payout (if win)</span>
              <span className="font-bold text-green-600">{parseFloat(shares).toFixed(2)} credits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price per share</span>
              <span className="font-bold text-gray-900">{(quote.cost / parseFloat(shares)).toFixed(3)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* User Credits */}
      {user && (
        <div className="mb-4 p-3 bg-gray-50 rounded-xl">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Your Credits</span>
            <span className="font-bold text-gray-900">{user.influence_credits.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Trade Button */}
      <button
        onClick={handleTrade}
        disabled={!isActive || loading || !shares || parseFloat(shares) <= 0}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
          !isActive || loading || !shares || parseFloat(shares) <= 0
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : selectedPosition === 'YES'
            ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200'
            : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200'
        }`}
      >
        {loading ? 'Processing...' : `Buy ${selectedPosition}`}
      </button>

      {!user && (
        <p className="mt-4 text-center text-sm text-gray-500">
          <button onClick={() => router.push('/login')} className="text-blue-600 hover:underline font-medium">
            Login
          </button> to start trading
        </p>
      )}
    </div>
  );
}