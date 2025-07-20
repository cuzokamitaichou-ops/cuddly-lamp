import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Plus, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { BlacklistedUser } from "@shared/schema";

export default function BlacklistManagement() {
  const { toast } = useToast();
  const [newUserId, setNewUserId] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newReason, setNewReason] = useState("");

  const { data: blacklistedUsers = [], isLoading } = useQuery<BlacklistedUser[]>({
    queryKey: ["/api/blacklist"],
  });

  const addToBlacklistMutation = useMutation({
    mutationFn: async (user: { id: string; username: string; reason: string }) => {
      const response = await apiRequest("POST", "/api/blacklist", user);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blacklist"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setNewUserId("");
      setNewUsername("");
      setNewReason("");
      toast({
        title: "User blacklisted! 🛡️",
        description: "User has been added to the blacklist successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add user to blacklist",
        variant: "destructive",
      });
    },
  });

  const removeFromBlacklistMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("DELETE", `/api/blacklist/${userId}`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blacklist"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "User removed! ✨",
        description: "User has been removed from blacklist",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove user from blacklist",
        variant: "destructive",
      });
    },
  });

  const handleAddToBlacklist = () => {
    if (!newUserId.trim() || !newUsername.trim() || !newReason.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    addToBlacklistMutation.mutate({
      id: newUserId.trim(),
      username: newUsername.trim(),
      reason: newReason.trim(),
    });
  };

  const handleExportBlacklist = async () => {
    try {
      const response = await fetch("/api/blacklist/export", {
        headers: {
          "x-user-id": "1346484101388959774", // Would get from auth context
        },
      });
      
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "blacklisted.json";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful! 📋",
        description: "Blacklist has been exported to blacklisted.json",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Unable to export blacklist",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-card cute-shadow rounded-2xl">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-snow-200 rounded w-1/4"></div>
            <div className="h-8 bg-snow-200 rounded"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-red-50 rounded"></div>
              ))}
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
          <Shield className="w-5 h-5 text-red-500 mr-2" />
          Blacklist Management
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Discord User ID"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
            className="bg-white/60 border-snow-300 focus:ring-red-500 focus:border-red-500"
          />
          <Input
            type="text"
            placeholder="Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="bg-white/60 border-snow-300 focus:ring-red-500 focus:border-red-500"
          />
          <Input
            type="text"
            placeholder="Reason for blacklisting"
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            className="bg-white/60 border-snow-300 focus:ring-red-500 focus:border-red-500"
          />
          <Button
            onClick={handleAddToBlacklist}
            disabled={addToBlacklistMutation.isPending}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add to Blacklist
          </Button>
        </div>
        
        <ScrollArea className="h-40">
          <div className="space-y-2">
            {blacklistedUsers.length === 0 ? (
              <div className="text-center py-8 text-snow-600">
                <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No blacklisted users</p>
              </div>
            ) : (
              blacklistedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-red-800 truncate">{user.username}</p>
                    <p className="text-sm text-red-600 truncate">{user.id}</p>
                    <p className="text-xs text-red-500 truncate">{user.reason}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromBlacklistMutation.mutate(user.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-100 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={handleExportBlacklist}
            className="text-winter-600 hover:text-winter-700 font-medium"
          >
            <Download className="w-4 h-4 mr-1" />
            Export blacklisted.json
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
