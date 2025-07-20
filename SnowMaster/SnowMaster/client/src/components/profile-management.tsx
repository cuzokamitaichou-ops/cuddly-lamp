import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IdCard, Upload, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { BotSettings } from "@shared/schema";

export default function ProfileManagement() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    avatar: "",
    banner: "",
  });

  const { data: botSettings, isLoading } = useQuery<BotSettings>({
    queryKey: ["/api/bot/settings"],
    onSuccess: (data) => {
      setFormData({
        username: data.username,
        bio: data.bio,
        avatar: data.avatar || "",
        banner: data.banner || "",
      });
    },
  });

  const updateBotMutation = useMutation({
    mutationFn: async (settings: Partial<BotSettings>) => {
      const response = await apiRequest("PUT", "/api/bot/settings", settings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bot/settings"] });
      toast({
        title: "Profile saved! ✨",
        description: "Bot profile updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update bot profile",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!botSettings) return;
    
    updateBotMutation.mutate({
      ...botSettings,
      ...formData,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <Card className="glass-card cute-shadow rounded-2xl">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-snow-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="h-8 bg-snow-200 rounded"></div>
                <div className="h-24 bg-snow-200 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-16 bg-snow-200 rounded"></div>
                <div className="h-20 bg-snow-200 rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card cute-shadow rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-snow-800 flex items-center">
          <IdCard className="w-5 h-5 text-kawaii-500 mr-2" />
          Profile Management
        </CardTitle>
      </CardHeader>
      
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-snow-700 mb-2">Bot Username</label>
            <Input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className="bg-white/60 border-snow-300 focus:ring-winter-500 focus:border-winter-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-snow-700 mb-2">Bio</label>
            <Textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="bg-white/60 border-snow-300 focus:ring-winter-500 focus:border-winter-500 h-24 resize-none"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-snow-700 mb-2">Avatar</label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-winter-200 to-kawaii-200 border-4 border-white shadow-lg flex items-center justify-center">
                {formData.avatar ? (
                  <img 
                    src={formData.avatar} 
                    alt="Bot Avatar" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-snow-400 text-xs">No Image</span>
                )}
              </div>
              <Button
                onClick={() => {
                  toast({
                    title: "Upload feature",
                    description: "Avatar upload will be implemented with file handling",
                  });
                }}
                className="bg-winter-500 hover:bg-winter-600 text-white"
              >
                <Upload className="w-4 h-4 mr-1" />
                Update
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-snow-700 mb-2">Banner</label>
            <div className="border-2 border-dashed border-snow-300 rounded-lg p-4 text-center bg-white/20">
              <div className="w-full h-20 bg-gradient-to-r from-winter-200 to-kawaii-200 rounded-lg mb-2 flex items-center justify-center">
                {formData.banner ? (
                  <img 
                    src={formData.banner} 
                    alt="Bot Banner" 
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <span className="text-snow-400 text-2xl">🖼️</span>
                )}
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  toast({
                    title: "Upload feature",
                    description: "Banner upload will be implemented with file handling",
                  });
                }}
                className="text-winter-600 hover:text-winter-700 font-medium"
              >
                <Upload className="w-4 h-4 mr-1" />
                Upload Banner
              </Button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={updateBotMutation.isPending}
            className="bg-gradient-to-r from-winter-500 to-kawaii-500 hover:from-winter-600 hover:to-kawaii-600 text-white cute-shadow"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
