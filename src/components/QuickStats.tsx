import { Card } from "@/components/ui/card";
import { TrendingUp, MapPin, Shield, Activity } from "lucide-react";

interface QuickStatsProps {
  factors: {
    flood: number;
    wildfire: number;
    storm: number;
    drought: number;
  };
}

const QuickStats = ({ factors }: QuickStatsProps) => {
  const highestRisk = Math.max(factors.flood, factors.wildfire, factors.storm, factors.drought);
  const lowestRisk = Math.min(factors.flood, factors.wildfire, factors.storm, factors.drought);
  const riskSpread = highestRisk - lowestRisk;
  
  const getDominantFactor = () => {
    const factorEntries = Object.entries(factors);
    const highest = factorEntries.reduce((a, b) => a[1] > b[1] ? a : b);
    return highest[0].charAt(0).toUpperCase() + highest[0].slice(1);
  };

  return (
    <Card className="p-6 border-border bg-card/50">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" />
        Quick Stats
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Dominant Risk</p>
            <p className="text-sm font-semibold text-foreground">{getDominantFactor()}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Risk Spread</p>
            <p className="text-sm font-semibold text-foreground">{riskSpread.toFixed(0)} pts</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Analysis Range</p>
            <p className="text-sm font-semibold text-foreground">5km radius</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QuickStats;
