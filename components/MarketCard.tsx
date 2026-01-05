import Img from "next/image";
import Link from "next/link";
import React from "react";
import Web3 from "web3";
import { MarketProps } from "../pages";

export const MarketCard: React.FC<MarketProps> = ({
  id,
  title,
  totalAmount,
  totalYes,
  totalNo,
  imageHash,
}) => {
  const calculatePrice = (amount: string, total: string) => {
    if (!total || total === "0") return "50.0";
    return ((parseFloat(amount) * 100) / parseFloat(total)).toFixed(1);
  };

  const formatVolume = (wei: string) => {
    const ether = parseFloat(wei) / 1e18;
    if (ether >= 1000) return (ether / 1000).toFixed(1) + "k";
    return ether.toFixed(1);
  };

  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 p-2">
      <Link href={`/market/${id}`} passHref>
        <div className="group bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-xl hover:border-blue-100 transition-all duration-300 cursor-pointer flex flex-col h-full shadow-sm">
          <div className="flex items-start space-x-4 mb-6">
            <div className="relative w-12 h-12 flex-shrink-0">
              <img
                src={`https://images.unsplash.com/photo-1621504450181-5d356f63d3ee?auto=format&fit=crop&w=100&q=80`}
                alt="Market"
                className="rounded-xl object-cover w-12 h-12 shadow-sm group-hover:scale-105 transition-transform"
              />
            </div>
            <h3 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Volume</span>
                <span className="text-sm font-black text-gray-900">{formatVolume(totalAmount)} POLY</span>
              </div>
              <div className="flex space-x-2">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-green-500">Yes</span>
                  <span className="text-sm font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-lg border border-green-100">
                    {calculatePrice(totalYes, totalAmount)}¢
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-red-500">No</span>
                  <span className="text-sm font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-100">
                    {calculatePrice(totalNo, totalAmount)}¢
                  </span>
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-50 rounded-full h-1.5 overflow-hidden flex">
              <div 
                className="bg-green-500 h-full transition-all duration-500" 
                style={{ width: `${calculatePrice(totalYes, totalAmount)}%` }}
              />
              <div 
                className="bg-red-500 h-full transition-all duration-500" 
                style={{ width: `${calculatePrice(totalNo, totalAmount)}%` }}
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
