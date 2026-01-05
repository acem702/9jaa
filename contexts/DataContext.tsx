declare let window: any;
import { createContext, useContext, useState } from "react";
import Web3 from "web3";
import Polymarket from "../abis/Polymarket.json";
import PolyToken from "../abis/PolyToken.json";

export interface MarketProps {
  id: string;
  title: string;
  imageHash: string;
  totalAmount: string;
  totalYes: string;
  totalNo: string;
  description?: string;
  endTimestamp?: number;
  resolverUrl?: string;
}

interface DataContextProps {
  account: string;
  loading: boolean;
  loadWeb3: () => Promise<void>;
  polymarket: any;
  polyToken: any;
  markets: MarketProps[];
}

const DataContext = createContext<DataContextProps>({
  account: "",
  loading: true,
  loadWeb3: async () => {},
  polymarket: null,
  polyToken: null,
  markets: [],
});

export const DataProvider: React.FC = ({ children }) => {
  const data = useProviderData();

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useData = () => useContext<DataContextProps>(DataContext);

const MOCK_MARKETS: MarketProps[] = [
  {
    id: "1",
    title: "Will Bitcoin reach $100k by the end of 2026?",
    imageHash: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    totalAmount: "1500000000000000000000",
    totalYes: "800000000000000000000",
    totalNo: "700000000000000000000",
    description: "This market resolves to Yes if Bitcoin reaches a price of $100,000 or higher at any point before January 1, 2027. The resolution source will be the CoinGecko Bitcoin price index.",
    endTimestamp: 1798761600000,
    resolverUrl: "https://www.coingecko.com/en/coins/bitcoin"
  },
  {
    id: "2",
    title: "Will the next iPhone have a foldable screen?",
    imageHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    totalAmount: "500000000000000000000",
    totalYes: "100000000000000000000",
    totalNo: "400000000000000000000",
    description: "This market resolves to Yes if Apple announces or releases a foldable iPhone by the end of 2026. Official Apple press releases or product pages will be the primary source.",
    endTimestamp: 1798761600000,
    resolverUrl: "https://www.apple.com/newsroom/"
  },
  {
    id: "3",
    title: "Will Real Madrid win the Champions League 2026?",
    imageHash: "Qme7ss3ARVgxv6rXqVPiikmj8u2NLgmgszg13pYrDKEoiu",
    totalAmount: "2500000000000000000000",
    totalYes: "1500000000000000000000",
    totalNo: "1000000000000000000000",
    description: "This market resolves to Yes if Real Madrid C.F. wins the 2025-26 UEFA Champions League tournament.",
    endTimestamp: 1748726400000,
    resolverUrl: "https://www.uefa.com/uefachampionsleague/"
  }
];

export const useProviderData = () => {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState("0xMockAccount123456789");
  const [polymarket, setPolymarket] = useState<any>(null);
  const [polyToken, setPolyToken] = useState<any>(null);
  const [markets, setMarkets] = useState<MarketProps[]>(MOCK_MARKETS);

  const loadWeb3 = async () => {
    console.log("Mocking Web3 connection...");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return {
    account,
    polymarket,
    polyToken,
    loading,
    loadWeb3,
    markets,
  };
};
