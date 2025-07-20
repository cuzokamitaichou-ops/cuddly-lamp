import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Snowflake } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { setAuthUser, isValidOwnerCode, getUserFromCode } from "@/lib/auth";
import Snowfall from "@/components/snowfall";

export default function Login() {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter your access code",
        variant: "destructive",
      });
      return;
    }

    if (!isValidOwnerCode(accessCode.trim())) {
      toast({
        title: "Access Denied",
        description: "Invalid access code. Only bot owners can access this dashboard.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const user = getUserFromCode(accessCode.trim());
      if (!user) throw new Error("Invalid code");
      
      const response = await apiRequest("POST", "/api/auth/login", { userId: user.id });
      const data = await response.json();
      
      setAuthUser(data.user);
      toast({
        title: "Welcome back! ❄️",
        description: "Successfully logged into Snow Dashboard",
      });
      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Unable to authenticate. Please check your access code.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-snow-50 via-winter-50 to-kawaii-50 flex items-center justify-center relative overflow-hidden">
      <Snowfall />
      
      <Card className="w-full max-w-md mx-4 glass-card cute-shadow">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-winter-400 to-winter-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
            <Snowflake className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-snow-800">Snow Dashboard</CardTitle>
          <CardDescription className="text-snow-600">
            ❄️ Kawaii Bot Management - Owner Access Only
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="accessCode" className="block text-sm font-medium text-snow-700 mb-2">
                Access Code
              </label>
              <Input
                id="accessCode"
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter your access code"
                className="bg-white/60 border-snow-300 focus:ring-winter-500 focus:border-winter-500"
                disabled={isLoading}
              />
            </div>
            
            <div className="bg-kawaii-50 border border-kawaii-200 rounded-lg p-3 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-kawaii-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-kawaii-800">
                <p className="font-medium mb-1">Access Code Required</p>
                <p>Enter your special access code to manage Snow bot. Only authorized owners have valid codes.</p>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-winter-500 to-kawaii-500 hover:from-winter-600 hover:to-kawaii-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Access Dashboard ✨"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
