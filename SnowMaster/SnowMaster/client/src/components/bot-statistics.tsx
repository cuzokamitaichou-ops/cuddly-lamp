import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import type { BotStats } from "@shared/schema";

export default function BotStatistics() {
  const { data: stats, isLoading } = useQuery<BotStats>({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <Card className="glass-card cute-shadow rounded-2xl">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-snow-200 rounded w-1/4"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/40 rounded-xl p-4">
                  <div className="h-4 bg-snow-200 rounded mb-2"></div>
                  <div className="h-2 bg-snow-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPercentage = (value: number, max: number) => {
    return Math.min((value / max) * 100, 100);
  };

  return (
    <Card className="glass-card cute-shadow rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-snow-800 flex items-center">
          <BarChart3 className="w-5 h-5 text-winter-500 mr-2" />
          Bot Statistics
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-white/40 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-snow-700">Servers</span>
            <span className="text-lg font-bold text-winter-600">{stats?.servers || 0}</span>
          </div>
          <div className="w-full bg-snow-200 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-winter-400 to-winter-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${getPercentage(stats?.servers || 0, 50)}%` }}
            />
          </div>
        </div>
        
        <div className="bg-white/40 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-snow-700">Users</span>
            <span className="text-lg font-bold text-kawaii-600">{stats?.users?.toLocaleString() || 0}</span>
          </div>
          <div className="w-full bg-snow-200 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-kawaii-400 to-kawaii-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${getPercentage(stats?.users || 0, 2000)}%` }}
            />
          </div>
        </div>
        
        <div className="bg-white/40 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-snow-700">Commands Used</span>
            <span className="text-lg font-bold text-green-600">{stats?.commands?.toLocaleString() || 0}</span>
          </div>
          <div className="w-full bg-snow-200 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${getPercentage(stats?.commands || 0, 10000)}%` }}
            />
          </div>
        </div>
        
        <div className="bg-white/40 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-snow-700">Blacklisted Users</span>
            <span className="text-lg font-bold text-red-600">{stats?.blacklisted || 0}</span>
          </div>
          <div className="w-full bg-snow-200 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${getPercentage(stats?.blacklisted || 0, 50)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
