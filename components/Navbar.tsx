import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useData } from "../contexts/DataContext";

function Navbar() {
  const router = useRouter();
  const { account, loadWeb3 } = useData();

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8 h-full">
            <Link href="/" passHref>
              <span className="font-bold text-2xl text-blue-700 cursor-pointer tracking-tight">
                Polymarket
              </span>
            </Link>
            {!router.asPath.includes("/market") &&
              !router.asPath.includes("/admin") && (
                <div className="hidden sm:flex space-x-4 h-full">
                  <TabButton
                    title="Market"
                    isActive={router.asPath === "/"}
                    url={"/"}
                  />
                  <TabButton
                    title="Portfolio"
                    isActive={router.asPath === "/portfolio"}
                    url={"/portfolio"}
                  />
                </div>
              )}
          </div>
          <div className="flex items-center">
            {account ? (
              <div className="bg-blue-50 px-4 py-2 rounded-full border border-blue-200 shadow-sm transition-all hover:bg-blue-100 cursor-pointer group">
                <span className="text-sm font-medium text-blue-700">
                  {account.substr(0, 6)}...{account.substr(-4)}
                </span>
              </div>
            ) : (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-md active:scale-95"
                onClick={() => {
                  loadWeb3();
                }}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

const TabButton = ({
  title,
  isActive,
  url,
}: {
  title: string;
  isActive: boolean;
  url: string;
}) => {
  return (
    <Link href={url} passHref>
      <div
        className={`h-full px-1 flex items-center border-b-2 font-semibold transition-all cursor-pointer relative top-[1px] ${
          isActive
            ? "border-blue-700 text-blue-700 text-sm sm:text-base"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 text-sm sm:text-base"
        }`}
      >
        <span>{title}</span>
      </div>
    </Link>
  );
};
