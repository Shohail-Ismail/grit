import { Card } from "@/components/ui/card";
import { Building2, DollarSign, TrendingUp, AlertCircle } from "lucide-react";

interface KPISectionProps {
  overallScore: number;
}

const KPISection = ({ overallScore }: KPISectionProps) => {
  // Calculate mock payout exposure based on risk score
  const baseExposure = 1000000;
  const percentile25 = Math.floor(baseExposure * (overallScore / 100) * 0.5);
  const percentile50 = Math.floor(baseExposure * (overallScore / 100) * 0.75);
  const percentile75 = Math.floor(baseExposure * (overallScore / 100));
  const worstCase = Math.floor(baseExposure * (overallScore / 100) * 1.5);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section className="max-w-6xl mx-auto space-y-6">
      <h3 className="text-2xl font-bold text-foreground text-center">
        Key Performance Indicators
      </h3>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-chart-1/10 p-3">
              <Building2 className="h-6 w-6 text-chart-1" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-card-foreground mb-2">Exposed Infrastructure</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Residential</span>
                  <span className="font-medium">245 units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Commercial</span>
                  <span className="font-medium">78 buildings</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Agricultural</span>
                  <span className="font-medium">1,230 acres</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-chart-2/10 p-3">
              <DollarSign className="h-6 w-6 text-chart-2" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-card-foreground mb-2">Payout Exposure (Percentiles)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">25th Percentile</span>
                  <span className="font-medium">{formatCurrency(percentile25)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">50th Percentile</span>
                  <span className="font-medium">{formatCurrency(percentile50)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">75th Percentile</span>
                  <span className="font-medium">{formatCurrency(percentile75)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-chart-3/10 p-3">
              <AlertCircle className="h-6 w-6 text-chart-3" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-card-foreground mb-2">Worst-Case Exposure</h4>
              <div className="text-3xl font-bold text-chart-3 mb-2">
                {formatCurrency(worstCase)}
              </div>
              <p className="text-sm text-muted-foreground">
                Maximum potential loss in catastrophic event
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-chart-4/10 p-3">
              <TrendingUp className="h-6 w-6 text-chart-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-card-foreground mb-2">Estimated Payout Range</h4>
              <div className="text-2xl font-bold text-card-foreground mb-2">
                {formatCurrency(percentile25)} - {formatCurrency(percentile75)}
              </div>
              <p className="text-sm text-muted-foreground">
                Expected range for typical events
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default KPISection;
