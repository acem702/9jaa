import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import { DataProvider } from "../contexts/DataContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DataProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Component {...pageProps} />
      </div>
    </DataProvider>
  );
}
export default MyApp;
