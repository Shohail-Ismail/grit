import { useState } from "react";
import { Droplets, Flame, Wind, Sun, Download, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import LocationInput from "@/components/LocationInput";
import RiskScoreDisplay from "@/components/RiskScoreDisplay";
import RiskFactorCard from "@/components/RiskFactorCard";
import RiskMap from "@/components/RiskMap";
import RiskChart from "@/components/RiskChart";
import KPISection from "@/components/KPISection";
import Footer from "@/components/Footer";
import { downloadCSV } from "@/utils/csvExport";
import { toast } from "sonner";

interface RiskData {
  latitude: number;
  longitude: number;
  overallScore: number;
  factors: {
    flood: number;
    wildfire: number;
    storm: number;
    drought: number;
  };
}

const Index = () => {
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeLocation = (lat: number, lng: number) => {
    setIsAnalyzing(true);
    toast.info("Analyzing location...");
    
    // Simulate API call with random risk scores
    setTimeout(() => {
      const generateScore = () => Math.floor(Math.random() * 100);
      
      const factors = {
        flood: generateScore(),
        wildfire: generateScore(),
        storm: generateScore(),
        drought: generateScore(),
      };
      
      const overallScore = Math.floor(
        Object.values(factors).reduce((a, b) => a + b, 0) / 4
      );
      
      setRiskData({
        latitude: lat,
        longitude: lng,
        overallScore,
        factors,
      });
      
      setIsAnalyzing(false);
      toast.success("Analysis complete!");
    }, 2000);
  };

  const handleBackToHome = () => {
    setRiskData(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownload = () => {
    if (riskData) {
      downloadCSV(riskData);
      toast.success("Report downloaded successfully!");
    }
  };

  const scrollToAnalysis = () => {
    document.getElementById("analysis-section")?.scrollIntoView({ 
      behavior: "smooth" 
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Hero onGetStarted={scrollToAnalysis} />
      
      <main className="container mx-auto px-4 py-12 space-y-12 flex-1">
        <section id="analysis-section" className="max-w-4xl mx-auto">
          <LocationInput onAnalyze={analyzeLocation} />
        </section>

        {riskData && (
          <>
            <section className="max-w-6xl mx-auto space-y-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="text-center space-y-2 flex-1">
                  <h2 className="text-3xl font-bold text-foreground">Risk Assessment Results</h2>
                  <p className="text-muted-foreground">
                    Comprehensive analysis based on climate risk factors
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleBackToHome}
                    className="gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Back to Home
                  </Button>
                  <Button 
                    onClick={handleDownload}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Results
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <RiskScoreDisplay
                    overallScore={riskData.overallScore}
                    latitude={riskData.latitude}
                    longitude={riskData.longitude}
                  />
                </div>
                
                <div className="lg:col-span-2">
                  <RiskMap
                    latitude={riskData.latitude}
                    longitude={riskData.longitude}
                    riskScore={riskData.overallScore}
                  />
                </div>
              </div>
            </section>

            <section className="max-w-6xl mx-auto">
              <RiskChart factors={riskData.factors} />
            </section>

            <section className="max-w-6xl mx-auto space-y-6">
              <h3 className="text-2xl font-bold text-foreground text-center">
                Risk Factor Summary
              </h3>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <RiskFactorCard
                  title="Flood Risk"
                  score={riskData.factors.flood}
                  icon={Droplets}
                  description="Water-related hazards"
                />
                <RiskFactorCard
                  title="Wildfire Risk"
                  score={riskData.factors.wildfire}
                  icon={Flame}
                  description="Fire danger assessment"
                />
                <RiskFactorCard
                  title="Storm Risk"
                  score={riskData.factors.storm}
                  icon={Wind}
                  description="Severe weather patterns"
                />
                <RiskFactorCard
                  title="Drought Risk"
                  score={riskData.factors.drought}
                  icon={Sun}
                  description="Water scarcity potential"
                />
              </div>
            </section>

            <KPISection overallScore={riskData.overallScore} />
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
