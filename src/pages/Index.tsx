import { useState } from "react";
import { Droplets, Flame, Wind, Sun, Download, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import LocationInput from "@/components/LocationInput";
import RiskScoreDisplay from "@/components/RiskScoreDisplay";
import InteractiveRiskCard from "@/components/InteractiveRiskCard";
import RiskMap from "@/components/RiskMap";
import RiskChart from "@/components/RiskChart";
import InteractiveKPISection from "@/components/InteractiveKPISection";
import TransparencyPanel from "@/components/TransparencyPanel";
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
                
                <div className="flex gap-3 flex-wrap">
                  <TransparencyPanel />
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
                <InteractiveRiskCard
                  title="Flood Risk"
                  score={riskData.factors.flood}
                  icon={Droplets}
                  description="Water-related hazards"
                  explanation="Flood risk measures how likely the area is to experience water-related disasters based on elevation, soil saturation, proximity to water bodies, and historical flood events. It considers factors like drainage capacity and topographic vulnerability."
                  transparencyNote="This score is based on open Earth observation data including elevation models, soil moisture data, and historical flood records. No personal or sensitive information is used."
                />
                <InteractiveRiskCard
                  title="Wildfire Risk"
                  score={riskData.factors.wildfire}
                  icon={Flame}
                  description="Fire danger assessment"
                  explanation="Wildfire risk assesses the likelihood of fire hazards based on vegetation density, dryness levels, historical fire patterns, temperature trends, and proximity to fire-prone areas. It includes both natural and human-caused fire susceptibility."
                  transparencyNote="Derived from satellite vegetation indices, climate data, and fire history databases. All data sources are publicly available environmental monitoring systems."
                />
                <InteractiveRiskCard
                  title="Storm Risk"
                  score={riskData.factors.storm}
                  icon={Wind}
                  description="Severe weather patterns"
                  explanation="Storm risk evaluates exposure to severe weather including hurricanes, tornadoes, severe thunderstorms, and high wind events. It considers geographic location, historical storm paths, and atmospheric conditions that favor storm development."
                  transparencyNote="Based on meteorological records, storm tracking data, and climate pattern analysis from open weather databases and atmospheric research data."
                />
                <InteractiveRiskCard
                  title="Drought Risk"
                  score={riskData.factors.drought}
                  icon={Sun}
                  description="Water scarcity potential"
                  explanation="Drought risk measures water scarcity potential by analyzing precipitation patterns, soil moisture levels, temperature trends, and water resource availability. It considers both short-term dry periods and long-term aridification trends."
                  transparencyNote="Calculated using precipitation data, soil moisture sensors, and water resource databases. All measurements come from open environmental monitoring networks."
                />
              </div>
            </section>

            <InteractiveKPISection overallScore={riskData.overallScore} />
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
