import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

const wellbeingData = [
  { day: "Mon", score: 65 },
  { day: "Tue", score: 70 },
  { day: "Wed", score: 68 },
  { day: "Thu", score: 72 },
  { day: "Fri", score: 75 },
  { day: "Sat", score: 78 },
  { day: "Sun", score: 80 },
];

const Home = () => {
  const [userRole, setUserRole] = useState<"patient" | "doctor">("patient");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole") as "patient" | "doctor" || "patient";
    setUserRole(role);
  }, []);

  if (userRole === "patient") {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">Welcome back! 👋</h1>
            <p className="text-muted-foreground">How are you feeling today?</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 shadow-card hover:shadow-elevated transition-smooth cursor-pointer" onClick={() => navigate("/ai-voice")}>
            <div className="flex items-start justify-between mb-4">
              <span className="material-symbols-rounded text-3xl text-primary">psychology</span>
              <span className="text-xs text-muted-foreground">2 days ago</span>
            </div>
            <h3 className="font-heading font-semibold mb-2">Last AI Analysis</h3>
            <p className="text-sm text-muted-foreground mb-3">Moderate stress detected</p>
            <p className="text-xs text-primary">View details →</p>
          </Card>

          <Card className="p-6 shadow-card hover:shadow-elevated transition-smooth cursor-pointer" onClick={() => navigate("/schedule")}>
            <div className="flex items-start justify-between mb-4">
              <span className="material-symbols-rounded text-3xl text-secondary">event</span>
              <span className="text-xs text-muted-foreground">Tomorrow</span>
            </div>
            <h3 className="font-heading font-semibold mb-2">Next Appointment</h3>
            <p className="text-sm text-muted-foreground mb-3">Dr. João Silva - 3:00 PM</p>
            <p className="text-xs text-secondary">View schedule →</p>
          </Card>

          <Card className="p-6 shadow-card gradient-primary">
            <span className="material-symbols-rounded text-3xl text-white mb-4 block">mic</span>
            <h3 className="font-heading font-semibold text-white mb-2">Record New Audio</h3>
            <p className="text-sm text-white/80 mb-4">Quick emotional check-in</p>
            <Button variant="secondary" size="sm" onClick={() => navigate("/ai-voice")}>
              Start Recording
            </Button>
          </Card>
        </div>

        <Card className="p-6 shadow-card">
          <h3 className="font-heading font-semibold mb-4">Your Well-being This Week</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={wellbeingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem"
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    );
  }

  // Doctor view
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Good morning, Dr. João 👋</h1>
          <p className="text-muted-foreground">Here's your practice overview</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 shadow-card">
          <span className="material-symbols-rounded text-3xl text-primary mb-3 block">group</span>
          <p className="text-sm text-muted-foreground mb-1">Active Patients</p>
          <h3 className="text-3xl font-heading font-bold">24</h3>
        </Card>

        <Card className="p-6 shadow-card">
          <span className="material-symbols-rounded text-3xl text-destructive mb-3 block">notifications_active</span>
          <p className="text-sm text-muted-foreground mb-1">New AI Alerts</p>
          <h3 className="text-3xl font-heading font-bold">3</h3>
        </Card>

        <Card className="p-6 shadow-card">
          <span className="material-symbols-rounded text-3xl text-success mb-3 block">payments</span>
          <p className="text-sm text-muted-foreground mb-1">Monthly Revenue</p>
          <h3 className="text-3xl font-heading font-bold">$7,450</h3>
        </Card>
      </div>

      <Card className="p-6 shadow-card">
        <h3 className="font-heading font-semibold mb-4">Recent Patients</h3>
        <div className="space-y-4">
          {[
            { name: "Maria Santos", risk: "high", lastAnalysis: "1 hour ago" },
            { name: "João Silva", risk: "medium", lastAnalysis: "2 days ago" },
            { name: "Ana Costa", risk: "low", lastAnalysis: "1 week ago" },
          ].map((patient, i) => (
            <div 
              key={i} 
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-smooth cursor-pointer"
              onClick={() => navigate("/medical-record")}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-rounded text-primary">person</span>
                </div>
                <div>
                  <p className="font-semibold">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">Last analysis: {patient.lastAnalysis}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  patient.risk === "high" && "bg-destructive/10 text-destructive",
                  patient.risk === "medium" && "bg-secondary/10 text-secondary",
                  patient.risk === "low" && "bg-success/10 text-success"
                )}>
                  {patient.risk.toUpperCase()}
                </div>
                <span className="material-symbols-rounded text-muted-foreground">chevron_right</span>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/medical-record")}>
          View All Patients
        </Button>
      </Card>
    </div>
  );
};

export default Home;
