import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, Coins, Laugh, Bot, Shield, Image } from "lucide-react";

const commandCategories = [
  { name: "Economy", icon: Coins, count: "12 commands", status: "active", color: "text-yellow-500" },
  { name: "Fun", icon: Laugh, count: "8 commands", status: "active", color: "text-kawaii-500" },
  { name: "AI Chatbot", icon: Bot, count: "Always On", status: "active", color: "text-winter-500" },
  { name: "Moderation", icon: Shield, count: "15 commands", status: "active", color: "text-red-500" },
  { name: "Image Gen", icon: Image, count: "6 commands", status: "active", color: "text-purple-500" },
];

export default function CommandCategories() {
  return (
    <Card className="glass-card cute-shadow rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-snow-800 flex items-center">
          <Terminal className="w-5 h-5 text-winter-500 mr-2" />
          Command Categories
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {commandCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <div
              key={category.name}
              className="flex items-center justify-between p-3 bg-white/40 rounded-lg hover:bg-white/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <IconComponent className={`w-5 h-5 ${category.color}`} />
                <span className="font-medium text-snow-800">{category.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-snow-600">{category.count}</span>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
