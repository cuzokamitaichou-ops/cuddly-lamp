import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Circle, MinusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { BotSettings } from "@shared/schema";

export default function BotStatusControl() {
  const { toast } = useToast();
  const [customStatus, setCustomStatus] = useState("");

  const { data: botSettings, isLoading } = useQuery<BotSettings>({
    queryKey: ["/api/bot/settings"],
  });

  const updateBotMutation = useMutation({
    mutationFn: async (settings: Partial<BotSettings>) => {
      const response = await apiRequest("PUT", "/api/bot/settings", settings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bot/settings"] });
      toast({
        title: "Success! ❄️",
        description: "Bot settings updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update bot settings",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (status: string) => {
    if (!botSettings) return;
    
    updateBotMutation.mutate({
      ...botSettings,
      status,
    });
  };

  const handleCustomStatusUpdate = () => {
    if (!botSettings) return;
    
    updateBotMutation.mutate({
      ...botSettings,
      customStatus,
    });
    setCustomStatus("");
  };

  if (isLoading) {
    return (
      <Card className="glass-card cute-shadow rounded-2xl">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-snow-200 rounded w-1/4"></div>
            <div className="h-8 bg-snow-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card cute-shadow rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-snow-800 flex items-center">
          <Bot className="w-5 h-5 text-winter-500 mr-2" />
          Bot Status Control
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white/40 rounded-xl">
          <div>
            <p className="font-medium text-snow-800">Current Status</p>
            <p className="text-sm text-snow-600">
              {botSettings?.status === "online" && "Online & Ready ✨"}
              {botSettings?.status === "dnd" && "Do Not Disturb 🚫"}
              {botSettings?.status === "offline" && "Offline 💤"}
            </p>
            {botSettings?.customStatus && (
              <p className="text-sm text-winter-600 mt-1">{botSettings.customStatus}</p>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => handleStatusChange("online")}
              size="sm"
              className={`${
                botSettings?.status === "online" 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              <Circle className="w-3 h-3 mr-1" />
              Online
            </Button>
            <Button
              onClick={() => handleStatusChange("dnd")}
              size="sm"
              className={`${
                botSettings?.status === "dnd" 
                  ? "bg-red-600 hover:bg-red-700" 
                  : "bg-red-500 hover:bg-red-600"
              } text-white`}
            >
              <MinusCircle className="w-3 h-3 mr-1" />
              DND
            </Button>
            <Button
              onClick={() => handleStatusChange("offline")}
              size="sm"
              className={`${
                botSettings?.status === "offline" 
                  ? "bg-gray-600 hover:bg-gray-700" 
                  : "bg-gray-500 hover:bg-gray-600"
              } text-white`}
            >
              <Circle className="w-3 h-3 mr-1" />
              Offline
            </Button>
          </div>
        </div>

        <div className="bg-white/40 rounded-xl p-4">
          <label className="block text-sm font-medium text-snow-700 mb-2">Custom Status</label>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="❄️ Spreading kawaii vibes..."
              value={customStatus}
              onChange={(e) => setCustomStatus(e.target.value)}
              className="flex-1 bg-white/60 border-snow-300 focus:ring-winter-500 focus:border-winter-500"
            />
            <Button
              onClick={handleCustomStatusUpdate}
              disabled={!customStatus.trim() || updateBotMutation.isPending}
              className="bg-winter-500 hover:bg-winter-600 text-white"
            >
              Update
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
