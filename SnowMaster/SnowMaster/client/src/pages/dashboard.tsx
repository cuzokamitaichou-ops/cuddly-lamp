import { getAuthUser } from "@/lib/auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Snowflake } from "lucide-react";
import Snowfall from "@/components/snowfall";
import QuickActions from "@/components/quick-actions";
import BotStatusControl from "@/components/bot-status-control";
import ProfileManagement from "@/components/profile-management";
import AiChatbotSettings from "@/components/ai-chatbot-settings";
import BotStatistics from "@/components/bot-statistics";
import BlacklistManagement from "@/components/blacklist-management";
import CommandCategories from "@/components/command-categories";
import TokenManagement from "@/components/token-management";

export default function Dashboard() {
  const user = getAuthUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-snow-50 via-winter-50 to-kawaii-50 relative">
      <Snowfall />
      
      {/* Header Navigation */}
      <header className="glass-card cute-shadow sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-winter-400 to-winter-600 flex items-center justify-center animate-float">
                <Snowflake className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-snow-800">Snow Dashboard</h1>
                <p className="text-sm text-snow-600">❄️ Kawaii Bot Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Bot Status Indicator */}
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse-soft"></div>
                <span className="text-sm font-medium text-snow-700">Online</span>
              </div>
              
              {/* Owner Info */}
              <div className="flex items-center space-x-3 bg-white/30 rounded-full px-4 py-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-kawaii-400 to-kawaii-600"></div>
                <div className="text-sm">
                  <p className="font-medium text-snow-800">{user.username}</p>
                  <p className="text-snow-600 text-xs">{user.role === "owner" ? "Main Owner" : "Co-Owner"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions Bar */}
        <QuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <BotStatusControl />
            <ProfileManagement />
            <AiChatbotSettings />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <BotStatistics />
            <BlacklistManagement />
            <CommandCategories />
            <TokenManagement />
          </div>
        </div>
      </div>
    </div>
  );
}
