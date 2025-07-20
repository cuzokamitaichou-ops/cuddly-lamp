import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, Eye, EyeOff, Copy, RotateCcw, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { BotSettings } from "@shared/schema";

export default function TokenManagement() {
  const { toast } = useToast();
  const [showToken, setShowToken] = useState(false);

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
        title: "Token updated! 🔑",
        description: "Bot token has been regenerated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update bot token",
        variant: "destructive",
      });
    },
  });

  const handleCopyToken = async () => {
    if (!botSettings?.token) return;
    
    try {
      await navigator.clipboard.writeText(botSettings.token);
      toast({
        title: "Token copied! 📋",
        description: "Bot token has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy token to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleRegenerateToken = () => {
    if (!botSettings) return;
    
    // Generate a new mock token
    const newToken = "MTM0NjQ4NDEwMTM4ODk1OTc3NA.GZkR7Q." + Math.random().toString(36).substring(2, 15);
    
    updateBotMutation.mutate({
      ...botSettings,
      token: newToken,
    });
  };

  const maskToken = (token: string) => {
    if (token.length <= 8) return token;
    return token.substring(0, 8) + "...";
  };

  if (isLoading) {
    return (
      <Card className="glass-card cute-shadow rounded-2xl">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-snow-200 rounded w-1/4"></div>
            <div className="h-12 bg-yellow-50 rounded"></div>
            <div className="h-8 bg-snow-200 rounded"></div>
            <div className="h-8 bg-red-500 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card cute-shadow rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-snow-800 flex items-center">
          <Key className="w-5 h-5 text-yellow-500 mr-2" />
          Bot Token
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 font-medium">
            Keep your token secure!
          </AlertDescription>
        </Alert>
        
        <div className="relative">
          <Input
            type={showToken ? "text" : "password"}
            value={showToken ? botSettings?.token || "" : maskToken(botSettings?.token || "")}
            className="w-full bg-white/60 border-snow-300 focus:ring-winter-500 focus:border-winter-500 pr-20"
            readOnly
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowToken(!showToken)}
              className="text-snow-500 hover:text-snow-700 h-auto p-1"
            >
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyToken}
              className="text-snow-500 hover:text-snow-700 h-auto p-1"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <Button
          onClick={handleRegenerateToken}
          disabled={updateBotMutation.isPending}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Regenerate Token
        </Button>
      </CardContent>
    </Card>
  );
}
