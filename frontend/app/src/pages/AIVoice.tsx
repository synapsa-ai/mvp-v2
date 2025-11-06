import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const emotionalData = [
  { day: "Mon", score: 65 },
  { day: "Tue", score: 70 },
  { day: "Wed", score: 68 },
  { day: "Thu", score: 72 },
  { day: "Fri", score: 75 },
  { day: "Sat", score: 78 },
  { day: "Sun", score: 70 },
];

const AIVoice = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleRecord = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setShowResults(true);
    }, 5000);
  };

  if (isRecording) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto">
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 bg-primary rounded-full animate-wave"
                  style={{
                    height: "48px",
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
          <h2 className="text-2xl font-heading font-semibold mb-2">Analyzing your voice...</h2>
          <p className="text-muted-foreground">Please keep speaking naturally</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">AI Voice Analysis Results</h1>
          <p className="text-muted-foreground">Analysis completed • Just now</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 shadow-card">
            <span className="material-symbols-rounded text-3xl text-secondary mb-3 block">trending_down</span>
            <p className="text-sm text-muted-foreground mb-1">Vocal Energy</p>
            <h3 className="text-2xl font-heading font-bold">-12%</h3>
            <p className="text-xs text-muted-foreground mt-2">vs. last analysis</p>
          </Card>

          <Card className="p-6 shadow-card">
            <span className="material-symbols-rounded text-3xl text-destructive mb-3 block">sentiment_sad</span>
            <p className="text-sm text-muted-foreground mb-1">Emotional Tone</p>
            <h3 className="text-2xl font-heading font-bold">Tense</h3>
            <p className="text-xs text-muted-foreground mt-2">Higher than baseline</p>
          </Card>

          <Card className="p-6 shadow-card">
            <span className="material-symbols-rounded text-3xl text-primary mb-3 block">psychology</span>
            <p className="text-sm text-muted-foreground mb-1">Keywords Detected</p>
            <h3 className="text-2xl font-heading font-bold">Tired, Anxious</h3>
            <p className="text-xs text-muted-foreground mt-2">Stress indicators</p>
          </Card>
        </div>

        <Card className="p-6 shadow-card mb-6">
          <h3 className="font-heading font-semibold mb-4">Emotional Trend (7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={emotionalData}>
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
                stroke="hsl(var(--secondary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--secondary))", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 shadow-card mb-6 border-l-4 border-l-secondary">
          <h3 className="font-heading font-semibold mb-3">AI Summary</h3>
          <p className="text-muted-foreground leading-relaxed">
            Your voice shows mild stress signals. The vocal pattern became slower and more monotone 
            compared to previous recordings. There's a noticeable decrease in vocal energy (-12%) 
            and an increase in tension markers. Keywords like "tired" and "anxious" were frequently detected.
          </p>
        </Card>

        <Card className="p-6 shadow-card mb-6">
          <h3 className="font-heading font-semibold mb-4">AI Recommendations</h3>
          <div className="space-y-3">
            {[
              "Consider practicing breathing exercises for 10 minutes daily",
              "Schedule a follow-up session with your therapist",
              "Try to maintain regular sleep patterns this week",
              "Engage in light physical activity to reduce tension",
            ].map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <span className="material-symbols-rounded text-success mt-0.5">check_circle</span>
                <p className="text-sm">{rec}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 shadow-card bg-destructive/5 border-destructive/20">
          <div className="flex items-start gap-4">
            <span className="material-symbols-rounded text-2xl text-destructive">warning</span>
            <div>
              <h3 className="font-heading font-semibold text-destructive mb-2">Alert Sent to Your Doctor</h3>
              <p className="text-sm text-muted-foreground">
                Due to moderate risk indicators, your doctor has been notified and may reach out for a follow-up.
              </p>
            </div>
          </div>
        </Card>

        <div className="flex gap-4 mt-6">
          <Button onClick={() => setShowResults(false)} variant="outline" className="flex-1">
            Record Again
          </Button>
          <Button className="flex-1">Share with Doctor</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="w-32 h-32 rounded-full gradient-primary flex items-center justify-center mb-8 mx-auto cursor-pointer hover:scale-105 transition-smooth" onClick={handleRecord}>
          <span className="material-symbols-rounded text-6xl text-white">mic</span>
        </div>
        <h2 className="text-2xl font-heading font-semibold mb-3">Ready to Analyze Your Voice</h2>
        <p className="text-muted-foreground mb-8">
          Tap the button and speak naturally for 30-60 seconds. Our AI will analyze your vocal patterns and emotional state.
        </p>
        <Button size="lg" onClick={handleRecord} className="w-full">
          Start Recording
        </Button>
      </div>
    </div>
  );
};

export default AIVoice;
