import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { AiSettings } from "@shared/schema";

export default function AiChatbotSettings() {
  const { toast } = useToast();
  const [newTrait, setNewTrait] = useState("");
  const [formData, setFormData] = useState({
    responseSpeed: "",
    securityLevel: "",
    personalityTraits: [] as string[],
  });

  const { data: aiSettings, isLoading } = useQuery<AiSettings>({
    queryKey: ["/api/ai/settings"],
    onSuccess: (data) => {
      setFormData({
        responseSpeed: data.responseSpeed,
        securityLevel: data.securityLevel,
        personalityTraits: data.personalityTraits,
      });
    },
  });

  const updateAiMutation = useMutation({
    mutationFn: async (settings: Partial<AiSettings>) => {
      const response = await apiRequest("PUT", "/api/ai/settings", settings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai/settings"] });
      toast({
        title: "AI settings updated! 🧠",
        description: "Personality settings saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update AI settings",
        variant: "destructive",
      });
    },
  });

  const handleUpdate = (field: string, value: string) => {
    if (!aiSettings) return;
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    updateAiMutation.mutate({
      ...aiSettings,
      [field]: value,
    });
  };

  const addTrait = () => {
    if (!newTrait.trim() || !aiSettings) return;
    
    const updatedTraits = [...formData.personalityTraits, newTrait.trim()];
    setFormData(prev => ({ ...prev, personalityTraits: updatedTraits }));
    
    updateAiMutation.mutate({
      ...aiSettings,
      personalityTraits: updatedTraits,
    });
    
    setNewTrait("");
  };

  const removeTrait = (index: number) => {
    if (!aiSettings) return;
    
    const updatedTraits = formData.personalityTraits.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, personalityTraits: updatedTraits }));
    
    updateAiMutation.mutate({
      ...aiSettings,
      personalityTraits: updatedTraits,
    });
  };

  if (isLoading) {
    return (
      <Card className="glass-card cute-shadow rounded-2xl">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-snow-200 rounded w-1/4"></div>
            <div className="h-20 bg-kawaii-100 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-8 bg-snow-200 rounded"></div>
              <div className="h-8 bg-snow-200 rounded"></div>
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
          <Brain className="w-5 h-5 text-kawaii-500 mr-2" />
          AI Chatbot Personality
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-kawaii-50 border border-kawaii-200 rounded-xl p-4">
          <h4 className="font-medium text-kawaii-800 mb-2">Current Personality Profile</h4>
          <div className="text-sm text-kawaii-700 space-y-1">
            <p><strong>Name:</strong> {aiSettings?.name}</p>
            <p><strong>Age:</strong> {aiSettings?.age} (Virtual)</p>
            <p><strong>Vibe:</strong> {aiSettings?.vibe}</p>
            <p><strong>Theme:</strong> {aiSettings?.theme}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-snow-700 mb-2">Response Speed</label>
            <Select value={formData.responseSpeed} onValueChange={(value) => handleUpdate("responseSpeed", value)}>
              <SelectTrigger className="bg-white/60 border-snow-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Human-like Typing Speed">Human-like Typing Speed</SelectItem>
                <SelectItem value="Fast Response">Fast Response</SelectItem>
                <SelectItem value="Slow & Thoughtful">Slow & Thoughtful</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-snow-700 mb-2">Security Level</label>
            <Select value={formData.securityLevel} onValueChange={(value) => handleUpdate("securityLevel", value)}>
              <SelectTrigger className="bg-white/60 border-snow-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Auto-detect & Blacklist">Auto-detect & Blacklist</SelectItem>
                <SelectItem value="Warning Only">Warning Only</SelectItem>
                <SelectItem value="Manual Review">Manual Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-snow-700 mb-2">Personality Traits</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.personalityTraits.map((trait, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-kawaii-100 text-kawaii-800 hover:bg-kawaii-200 pr-1"
              >
                {trait}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTrait(index)}
                  className="ml-1 h-auto p-0 text-red-500 hover:text-red-700 hover:bg-transparent"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTrait}
              onChange={(e) => setNewTrait(e.target.value)}
              placeholder="Add new trait..."
              className="flex-1 px-3 py-2 border border-snow-300 rounded-lg focus:ring-2 focus:ring-winter-500 focus:border-transparent bg-white/60 text-sm"
              onKeyPress={(e) => e.key === "Enter" && addTrait()}
            />
            <Button
              onClick={addTrait}
              disabled={!newTrait.trim()}
              size="sm"
              className="bg-snow-200 text-snow-700 hover:bg-snow-300"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
