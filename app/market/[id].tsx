import dynamic from "next/dynamic";
import moment from "moment";
import Head from "next/head";
import Img from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import Navbar from "../../components/Navbar";
import RecentActivity from "../../components/RecentActivity";
import { useData } from "../../contexts/DataContext";

const ChartContainer = dynamic(() => import("../../components/Chart/ChartContainer"), {
  ssr: false,
});

export interface MarketProps {
  id: string;
  title: string;
  imageHash: string;
  totalAmount: number;
  totalYes: number;
  totalNo: number;
  description: string;
  endTimestamp: number;
  resolverUrl: string;
}

const Details = () => {
  const router = useRouter();
  const { id } = router.query;
  const { polymarket, account, loadWeb3, loading, polyToken, markets: mockMarkets } = useData();
  const [market, setMarket] = useState<any>();
  const [selected, setSelected] = useState<string>("YES");
  const [dataLoading, setDataLoading] = useState(true);
  const [button, setButton] = useState<string>("Trade");

  const [input, setInput] = useState("");

  const getMarketData = useCallback(async () => {
    if (polymarket && id) {
      try {
        var data = await polymarket.methods.questions(id).call({ from: account });
        setMarket({
          id: data.id,
          title: data.question,
          imageHash: data.creatorImageHash,
          totalAmount: data.totalAmount,
          totalYes: data.totalYesAmount,
          totalNo: data.totalNoAmount,
          description: data.description,
          endTimestamp: parseInt(data.endTimestamp),
          resolverUrl: data.resolverUrl,
        });
      } catch (e) {
        console.error("Error fetching market data", e);
      }
    } else if (id) {
      const mockMarket = mockMarkets.find((m) => m.id === id);
      if (mockMarket) {
        setMarket(mockMarket);
      }
    }
    setDataLoading(false);
  }, [account, id, polymarket, mockMarkets]);

  const handleTrade = async () => {
    if (!polymarket) {
      setButton("Processing...");
      setTimeout(() => {
        alert(`Successfully traded ${input} POLY on ${selected}`);
        setButton("Trade");
        setInput("");
      }, 1000);
      return;
    }
    var bal = await polyToken.methods.balanceOf(account).call();
    setButton("Please wait");

    if (input && selected === "YES") {
      if (parseInt(input) < parseInt(Web3.utils.fromWei(bal, "ether"))) {
        await polyToken.methods
          .approve(polymarket._address, Web3.utils.toWei(input, "ether"))
          .send({ from: account });
        await polymarket.methods
          .addYesBet(id, Web3.utils.toWei(input, "ether"))
          .send({ from: account });
      }
    } else if (input && selected === "NO") {
      if (parseInt(input) < parseInt(Web3.utils.fromWei(bal, "ether"))) {
        await polyToken.methods
          .approve(polymarket._address, Web3.utils.toWei(input, "ether"))
          .send({ from: account });
        await polymarket.methods
          .addNoBet(id, Web3.utils.toWei(input, "ether"))
          .send({ from: account });
      }
    }
    await getMarketData();
    setButton("Trade");
  };

  useEffect(() => {
    if (id) {
      if (polymarket) {
        loadWeb3().then(() => {
          if (!loading) getMarketData();
        });
      } else {
        getMarketData();
      }
    }
  }, [loading, id, polymarket]);

  const calculatePercentage = (amount: string, total: string) => {
    if (!total || total === "0") return "50.00";
    return ((parseFloat(amount) * 100) / parseFloat(total)).toFixed(2);
  };

  const formatEther = (wei: string) => {
    if (!wei) return "0";
    try {
      const eth = parseFloat(wei) / 1e18;
      if (eth >= 1000) {
        return (eth / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 }) + "k";
      }
      return eth.toLocaleString(undefined, { maximumFractionDigits: 2 });
    } catch (e) {
      return "0";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>{market?.title || "Polymarket"}</title>
        <meta name="description" content="Prediction Market" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {dataLoading ? (
          <div className="flex flex-col justify-center items-center h-64 w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow space-y-6 lg:w-2/3">
              {/* Market Header Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="flex gap-4 md:gap-6 items-start">
                    <div className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0">
                      <img
                        src={`https://images.unsplash.com/photo-1621504450181-5d356f63d3ee?auto=format&fit=crop&w=150&q=80`}
                        alt="Market Icon"
                        className="rounded-xl object-cover h-16 w-16 md:h-20 md:w-20 shadow-md border-2 border-white"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] md:text-[9px] font-black rounded-full uppercase tracking-widest border border-blue-100 whitespace-nowrap">
                          {market?.category || "Prediction"}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[8px] md:text-[9px] font-bold rounded-full uppercase tracking-widest border border-gray-100 whitespace-nowrap">
                          Ends {market?.endTimestamp ? moment(market.endTimestamp).format("MMM D, YY") : "N/A"}
                        </span>
                      </div>
                      <h1 className="text-lg md:text-2xl font-black text-gray-900 leading-tight tracking-tight break-words">
                        {market?.title}
                      </h1>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 md:gap-4 mt-6 pt-6 border-t border-gray-50">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Volume</span>
                      <p className="text-base md:text-lg font-black text-gray-900 tracking-tighter">{formatEther(market?.totalAmount)} POLY</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black text-green-500 uppercase tracking-widest block">Yes</span>
                      <p className="text-base md:text-lg font-black text-green-600 tracking-tighter">{calculatePercentage(market?.totalYes, market?.totalAmount)}¢</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black text-red-500 uppercase tracking-widest block">No</span>
                      <p className="text-base md:text-lg font-black text-red-600 tracking-tighter">{calculatePercentage(market?.totalNo, market?.totalAmount)}¢</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart Card */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="space-y-1">
                    <h3 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">Market Forecast</h3>
                    <p className="text-[10px] md:text-xs text-gray-400 font-medium">Historical price movement</p>
                  </div>
                  <div className="flex p-1 bg-gray-50 rounded-lg border border-gray-200 shadow-inner overflow-x-auto w-full sm:w-auto">
                    {["1D", "1W", "1M", "ALL"].map((p) => (
                      <button key={p} className={`flex-1 sm:flex-none px-3 py-1.5 text-[9px] font-black rounded-md transition-all ${p === "ALL" ? "bg-white text-blue-600 shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-[300px] md:h-[450px] w-full bg-white relative">
                  <ChartContainer questionId={market?.id ?? "0"} />
                </div>
              </div>

              {/* Description Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">About this market</h3>
                <div className="prose prose-blue max-w-none text-gray-600">
                  <p>{market?.description}</p>
                </div>
                {market?.resolverUrl && (
                  <div className="mt-6 pt-6 border-t border-gray-50">
                    <span className="text-xs text-gray-400 font-medium uppercase block mb-2 tracking-wider">Resolution Source</span>
                    <a href={market.resolverUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-semibold break-all flex items-center gap-1 group">
                      {market.resolverUrl}
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Trading Sidebar */}
            <div className="lg:w-1/3 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">Trade</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelected("YES")}
                      className={`py-4 rounded-xl font-bold transition-all border-2 flex flex-col items-center gap-1 ${
                        selected === "YES"
                          ? "bg-green-50 border-green-600 text-green-700 shadow-sm"
                          : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                      }`}
                    >
                      <span className="text-sm">Yes</span>
                      <span className="text-xl">{calculatePercentage(market?.totalYes, market?.totalAmount)}¢</span>
                    </button>
                    <button
                      onClick={() => setSelected("NO")}
                      className={`py-4 rounded-xl font-bold transition-all border-2 flex flex-col items-center gap-1 ${
                        selected === "NO"
                          ? "bg-red-50 border-red-600 text-red-700 shadow-sm"
                          : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                      }`}
                    >
                      <span className="text-sm">No</span>
                      <span className="text-xl">{calculatePercentage(market?.totalNo, market?.totalAmount)}¢</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Amount</label>
                    <div className="relative group">
                      <input
                        type="number"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl py-4 pl-4 pr-16 text-lg font-bold text-gray-900 outline-none transition-all"
                        placeholder="0.00"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-400">POLY</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50/50 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Est. Payout</span>
                      <span className="text-gray-900 font-bold">
                        {input ? (parseFloat(input) / (parseFloat(calculatePercentage(selected === "YES" ? market?.totalYes : market?.totalNo, market?.totalAmount)) / 100)).toFixed(2) : "0.00"} POLY
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Outcome</span>
                      <span className={`font-bold ${selected === "YES" ? "text-green-600" : "text-red-600"}`}>{selected}</span>
                    </div>
                  </div>

                  <button
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                      button === "Trade"
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                    onClick={handleTrade}
                    disabled={button !== "Trade" || !input}
                  >
                    {button === "Trade" ? `Buy ${selected}` : button}
                    {button === "Trade" && (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-gray-400 px-4">
                    By trading, you agree to our Terms of Service. Please trade responsibly.
                  </p>
                </div>
              </div>

              <RecentActivity />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Details;
