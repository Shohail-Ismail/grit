import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, Shield, Database, Lock } from "lucide-react";

const TransparencyPanel = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Info className="h-4 w-4" />
          About this AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Transparency & Ethics
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            GRIT is designed following transparent AI principles
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Open Data Sources</h4>
                <p className="text-sm text-muted-foreground">
                  All results are based on open geospatial and environmental data from public sources. We use Earth
                  observation data, historical climate records, and terrain analysis.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Privacy First</h4>
                <p className="text-sm text-muted-foreground">
                  No personal data is collected, stored, or used. Only geographic coordinates are processed to generate
                  risk assessments. Your privacy is fully protected.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Demonstrative Purpose</h4>
                <p className="text-sm text-muted-foreground">
                  Risk scores are approximate and carry with them inherent statistical uncertainty. These demonstrative
                  estimates should not be used as the sole basis for actual insurance underwriting or financial
                  decisions.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">How Scores Are Calculated</h4>
            <p className="text-sm text-muted-foreground">
              Each risk factor (Flood, Wildfire, Storm, Drought) is assessed using multiple environmental indicators.
              The Composite Risk Score combines these factors with appropriate weighting to provide an overall
              assessment. All methodology is transparent and explainable.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransparencyPanel;
