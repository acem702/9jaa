import Plotly from "plotly.js-dist-min";
import React, { useEffect } from "react";
import Web3 from "web3";
import { useData } from "../../contexts/DataContext";

interface Props {
  questionId: string;
}

interface ChartData {
  time: Date[];
  amount: number[];
}

const ChartContainer: React.FC<Props> = ({ questionId }) => {
  const { polymarket } = useData();

  const fetchGraphData = async () => {
    let yesData: ChartData = { time: [], amount: [] };
    let noData: ChartData = { time: [], amount: [] };

    if (!polymarket) {
      console.log("Mocking graph data for", questionId);
      const now = new Date();
      // Start price at 50%
      let currentYes = 50;
      
      for (let i = 24; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 60 * 60 * 1000); // Hourly data for 24h
        yesData.time.push(date);
        noData.time.push(date);
        
        // Smoother random walk
        const change = (Math.random() - 0.5) * 4;
        currentYes = Math.max(15, Math.min(85, currentYes + change));
        
        yesData.amount.push(currentYes);
        noData.amount.push(100 - currentYes);
      }
    } else {
      // ... blockchain data loading
    }

    const yes = {
      x: [...yesData.time],
      y: [...yesData.amount],
      mode: "lines",
      name: "Yes",
      line: { color: "#2563eb", width: 4, shape: "spline" },
      fill: "tozeroy",
      fillcolor: "rgba(37, 99, 235, 0.08)",
      hoverinfo: "y+x" as const,
    };

    const no = {
      x: [...noData.time],
      y: [...noData.amount],
      mode: "lines",
      name: "No",
      line: { color: "#ef4444", width: 4, shape: "spline" },
      fill: "tozeroy",
      fillcolor: "rgba(239, 68, 68, 0.08)",
      hoverinfo: "y+x" as const,
    };

    const layout = {
      autosize: true,
      margin: { l: 40, r: 20, t: 10, b: 40 },
      showlegend: true,
      legend: { orientation: "h" as const, y: -0.2 },
      paper_bgcolor: "white",
      plot_bgcolor: "white",
      hovermode: "x unified" as const,
      xaxis: { 
        gridcolor: "#f8fafc", 
        zeroline: false,
        showline: false,
        tickfont: { size: 10, color: "#94a3b8", family: "Inter, sans-serif" },
        type: 'date' as const
      },
      yaxis: { 
        gridcolor: "#f8fafc", 
        zeroline: false,
        showline: false,
        range: [0, 100], 
        ticksuffix: "¢",
        tickfont: { size: 10, color: "#94a3b8", family: "Inter, sans-serif" }
      },
    };

    const chartDiv = document.getElementById("myDiv");
    if (chartDiv) {
      Plotly.newPlot("myDiv", [yes, no], layout, { 
        displayModeBar: false,
        responsive: true 
      });
    }
  };

  useEffect(() => {
    // Small delay to ensure container is rendered
    const timer = setTimeout(fetchGraphData, 100);
    return () => clearTimeout(timer);
  }, [questionId]);

  return (
    <>
      <div id="myDiv"></div>
    </>
  );
};

export default ChartContainer;
