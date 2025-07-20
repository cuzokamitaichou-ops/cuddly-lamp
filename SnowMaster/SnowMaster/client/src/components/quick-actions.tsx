import { Button } from "@/components/ui/button";
import { Power, UserCog, TrendingUp, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function QuickActions() {
  const { toast } = useToast();

  const handleQuickAction = (action: string) => {
    toast({
      title: `${action} activated! ❄️`,
      description: "Action completed successfully",
    });
  };

  return (
    <div className="glass-card cute-shadow rounded-2xl p-6 mb-8">
      <h2 className="text-lg font-semibold text-snow-800 mb-4 flex items-center">
        <span className="text-winter-500 mr-2">✨</span>
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          onClick={() => handleQuickAction("Bot Status Toggle")}
          className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white rounded-xl p-4 h-auto flex-col space-y-2 transition-all duration-300 transform hover:scale-105 cute-shadow"
        >
          <Power className="w-6 h-6" />
          <span className="text-sm font-medium">Toggle Status</span>
        </Button>
        
        <Button
          onClick={() => handleQuickAction("Profile Editor")}
          className="bg-gradient-to-r from-winter-400 to-winter-500 hover:from-winter-500 hover:to-winter-600 text-white rounded-xl p-4 h-auto flex-col space-y-2 transition-all duration-300 transform hover:scale-105 cute-shadow"
        >
          <UserCog className="w-6 h-6" />
          <span className="text-sm font-medium">Edit Profile</span>
        </Button>
        
        <Button
          onClick={() => handleQuickAction("Statistics View")}
          className="bg-gradient-to-r from-kawaii-400 to-kawaii-500 hover:from-kawaii-500 hover:to-kawaii-600 text-white rounded-xl p-4 h-auto flex-col space-y-2 transition-all duration-300 transform hover:scale-105 cute-shadow"
        >
          <TrendingUp className="w-6 h-6" />
          <span className="text-sm font-medium">View Stats</span>
        </Button>
        
        <Button
          onClick={() => handleQuickAction("Blacklist Manager")}
          className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-xl p-4 h-auto flex-col space-y-2 transition-all duration-300 transform hover:scale-105 cute-shadow"
        >
          <Shield className="w-6 h-6" />
          <span className="text-sm font-medium">Blacklist</span>
        </Button>
      </div>
    </div>
  );
}
