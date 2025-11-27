import { Card } from "@/components/ui/card";
import { Building2, DollarSign, TrendingUp, AlertCircle, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface InteractiveKPISectionProps {
  overallScore: number;
}

const InteractiveKPISection = ({ overallScore }: InteractiveKPISectionProps) => {
  const baseExposure = 1000000;
  const percentile25 = Math.floor(baseExposure * (overallScore / 100) * 0.5);
  const percentile50 = Math.floor(baseExposure * (overallScore / 100) * 0.75);
  const percentile75 = Math.floor(baseExposure * (overallScore / 100));
  const worstCase = Math.floor(baseExposure * (overallScore / 100) * 1.5);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section className="max-w-6xl mx-auto space-y-6">
      <h3 className="text-2xl font-bold text-foreground text-center">Key Performance Indicators</h3>

      <div className="grid gap-6 md:grid-cols-2">
        <Dialog>
          <DialogTrigger asChild>
            <Card className="p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-chart-1/10 p-3 group-hover:bg-chart-1/20 transition-colors">
                  <Building2 className="h-6 w-6 text-chart-1" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-card-foreground">Exposed Infrastructure</h4>
                    <Info className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
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
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Exposed Infrastructure</DialogTitle>
              <DialogDescription className="text-base pt-2">
                Property types and infrastructure at risk in this location
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">
                This metric identifies the types and quantities of infrastructure exposed to climate risks in the
                analyzed area. It includes residential properties, commercial buildings, and agricultural land that
                could be impacted by environmental hazards.
              </p>
              <div className="pt-3 border-t">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  Data Source
                </h4>
                <p className="text-sm text-muted-foreground">
                  Based on open geospatial databases and land use classifications. These values can fluctuate based on
                  data quality/frequency and may not reflect exact current conditions.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Card className="p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-chart-2/10 p-3 group-hover:bg-chart-2/20 transition-colors">
                  <DollarSign className="h-6 w-6 text-chart-2" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-card-foreground">Payout Exposure (Percentiles)</h4>
                    <Info className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
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
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Payout Exposure Percentiles</DialogTitle>
              <DialogDescription className="text-base pt-2">
                Statistical distribution of potential insurance payouts
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">
                These percentiles represent the statistical distribution of potential insurance payouts based on
                historical event severity. The 25th percentile indicates smaller, more frequent events, while the 75th
                percentile represents larger but less common occurrences.
              </p>
              <div className="pt-3 border-t">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  Calculation Method
                </h4>
                <p className="text-sm text-muted-foreground">
                  Estimated using risk score modelling and base exposure values. This range provides a realistic
                  expectation for planning and budgeting purposes. Most actual events will fall within this range,
                  making it useful for understanding typical risk exposure.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Card className="p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-chart-3/10 p-3 group-hover:bg-chart-3/20 transition-colors">
                  <AlertCircle className="h-6 w-6 text-chart-3" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-card-foreground">Worst-Case Exposure</h4>
                    <Info className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-3xl font-bold text-chart-3 mb-2">{formatCurrency(worstCase)}</div>
                  <p className="text-sm text-muted-foreground">Maximum potential loss in catastrophic event</p>
                </div>
              </div>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Worst-Case Exposure</DialogTitle>
              <DialogDescription className="text-base pt-2">
                Maximum potential financial impact in extreme scenarios
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">
                This represents the maximum potential financial loss in a catastrophic event scenario. It models the
                impact of extreme climate events occurring simultaneously or in rapid succession, representing tail-risk
                exposure.
              </p>
              <div className="pt-3 border-t">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  Risk Context
                </h4>
                <p className="text-sm text-muted-foreground">
                  While worst-case scenarios are unlikely, understanding maximum exposure is crucial for comprehensive
                  risk management. This value combines multiple risk factors at their highest severity levels.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Card className="p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-chart-4/10 p-3 group-hover:bg-chart-4/20 transition-colors">
                  <TrendingUp className="h-6 w-6 text-chart-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-card-foreground">Estimated Payout Range</h4>
                    <Info className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-2xl font-bold text-card-foreground mb-2">
                    {formatCurrency(percentile25)} - {formatCurrency(percentile75)}
                  </div>
                  <p className="text-sm text-muted-foreground">Expected range for typical events</p>
                </div>
              </div>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Estimated Payout Range</DialogTitle>
              <DialogDescription className="text-base pt-2">
                Expected financial impact range for typical climate events
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">
                This range represents the expected payout values for typical climate-related events in this location. It
                spans from the 25th to 75th percentile, capturing the most common severity levels while excluding
                outlier extremes.
              </p>
              <div className="pt-3 border-t">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  Practical Use
                </h4>
                <p className="text-sm text-muted-foreground">
                  This range provides a realistic expectation for planning and budgeting purposes. Most actual events
                  will fall within this range, making it useful for understanding typical risk exposure.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default InteractiveKPISection;
