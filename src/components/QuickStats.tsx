import { Card } from "@/components/ui/card";
import { TrendingUp, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface QuickStatsProps {
  factors: {
    flood: number;
    wildfire: number;
    storm: number;
    drought: number;
  };
}

const QuickStats = ({ factors }: QuickStatsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const highestRisk = Math.max(factors.flood, factors.wildfire, factors.storm, factors.drought);
  const lowestRisk = Math.min(factors.flood, factors.wildfire, factors.storm, factors.drought);
  const riskSpread = highestRisk - lowestRisk;
  
  const getDominantFactor = () => {
    const factorEntries = Object.entries(factors);
    const highest = factorEntries.reduce((a, b) => a[1] > b[1] ? a : b);
    return highest[0].charAt(0).toUpperCase() + highest[0].slice(1);
  };

  return (
    <Card className="p-4 border-border bg-card/50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm font-semibold text-foreground hover:text-primary transition-colors"
      >
        <span className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Quick Analysis
        </span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      
      {isExpanded && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Dominant Risk</p>
            <p className="text-sm font-semibold text-foreground">{getDominantFactor()}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Risk Spread</p>
            <p className="text-sm font-semibold text-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              {riskSpread.toFixed(0)} pts
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Analysis Radius</p>
            <p className="text-sm font-semibold text-foreground">5km</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default QuickStats;
