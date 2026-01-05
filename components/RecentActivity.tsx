import React from "react";
import moment from "moment";

interface Activity {
  id: string;
  account: string;
  type: "YES" | "NO";
  amount: string;
  timestamp: number;
}

const RecentActivity = () => {
  const MOCK_ACTIVITIES: Activity[] = [
    { id: "1", account: "0x1234...5678", type: "YES", amount: "500", timestamp: Date.now() - 1000 * 60 * 5 },
    { id: "2", account: "0x8765...4321", type: "NO", amount: "1200", timestamp: Date.now() - 1000 * 60 * 15 },
    { id: "3", account: "0xabcd...efgh", type: "YES", amount: "250", timestamp: Date.now() - 1000 * 60 * 45 },
    { id: "4", account: "0x9999...1111", type: "YES", amount: "3000", timestamp: Date.now() - 1000 * 60 * 120 },
  ];

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm md:text-base">
        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Recent Activity
      </h3>
      <div className="space-y-3">
        {MOCK_ACTIVITIES.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between text-[11px] md:text-sm">
            <div className="flex flex-col">
              <span className="text-gray-900 font-bold truncate max-w-[80px] md:max-w-none">{activity.account}</span>
              <span className="text-gray-400 text-[9px]">{moment(activity.timestamp).fromNow()}</span>
            </div>
            <div className="text-right">
              <span className={`font-black ${activity.type === "YES" ? "text-green-600" : "text-red-600"}`}>
                {activity.type} {activity.amount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
