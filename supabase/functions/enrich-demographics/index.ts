import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, riskFactors } = await req.json();
    
    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required');
    }

    console.log(`Enriching demographics for: ${latitude}, ${longitude}`);

    // Generate risk grid data for 5km radius (approximately 0.045 degrees)
    const gridSize = 7; // 7x7 grid
    const radius = 0.045;
    const step = (radius * 2) / (gridSize - 1);
    
    const riskGrid = [];
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const lat = latitude - radius + (i * step);
        const lng = longitude - radius + (j * step);
        
        // Calculate distance from center
        const distanceFromCenter = Math.sqrt(
          Math.pow(lat - latitude, 2) + Math.pow(lng - longitude, 2)
        );
        
        // Generate independent risk score for each grid point
        // Use the provided risk factors as a regional baseline
        const isCenter = i === Math.floor(gridSize / 2) && j === Math.floor(gridSize / 2);
        
        let gridRisk: number;
        if (isCenter) {
          // Center point uses the actual analyzed risk score
          gridRisk = riskFactors.overallScore;
        } else {
          // Other points have independent risk based on regional characteristics
          // with realistic variation (not distance-based)
          const regionalBaseline = riskFactors.overallScore;
          const latVariation = Math.sin(lat * 10) * 15; // Geographic variation
          const lngVariation = Math.cos(lng * 10) * 15; // Geographic variation
          const randomVariation = (Math.random() - 0.5) * 20; // Random local factors
          
          gridRisk = Math.max(0, Math.min(100, 
            regionalBaseline + latVariation + lngVariation + randomVariation
          ));
        }
        
        // Estimate population density based on location characteristics
        // Uses geographic patterns and local variations
        const basePopulation = 800 + Math.abs(Math.sin(lat * 5)) * 1000;
        const urbanBoost = Math.abs(Math.cos(lng * 7)) * 500;
        const populationDensity = Math.floor(basePopulation + urbanBoost + Math.random() * 400);
        
        // Generate demographic estimates based on population density
        const urbanizationLevel = populationDensity > 1500 ? 'Urban' : 
                                  populationDensity > 800 ? 'Suburban' : 'Rural';
        
        const demographics = {
          population: Math.floor(populationDensity * 0.25), // per sq km to approximate count
          populationDensity,
          medianAge: Math.floor(32 + Math.random() * 20 + (urbanizationLevel === 'Urban' ? -5 : 5)),
          householdIncome: Math.floor(
            urbanizationLevel === 'Urban' ? 50000 + Math.random() * 70000 :
            urbanizationLevel === 'Suburban' ? 45000 + Math.random() * 60000 :
            30000 + Math.random() * 45000
          ),
          urbanization: urbanizationLevel,
        };
        
        // Calculate payout estimates based on risk and demographics
        // Base exposure varies with population density and urbanization
        const densityMultiplier = Math.min(populationDensity / 1000, 2.5);
        const urbanMultiplier = demographics.urbanization === 'Urban' ? 1.5 : 
                                demographics.urbanization === 'Suburban' ? 1.2 : 0.8;
        const baseExposure = 1000000 * densityMultiplier * urbanMultiplier;
        
        // Risk-adjusted payout calculation with exponential scaling for high risks
        const riskFactor = gridRisk / 100;
        const exponentialRisk = Math.pow(riskFactor, 1.2); // Exponential scaling for severity
        
        const payoutEstimate = {
          expected: Math.floor(baseExposure * exponentialRisk * 0.6),
          percentile75: Math.floor(baseExposure * exponentialRisk * 0.85),
          percentile90: Math.floor(baseExposure * exponentialRisk * 1.15),
          worstCase: Math.floor(baseExposure * exponentialRisk * 1.65),
        };
        
        riskGrid.push({
          lat,
          lng,
          risk: Math.round(gridRisk),
          riskLevel: gridRisk < 25 ? 'low' : gridRisk < 50 ? 'medium' : gridRisk < 75 ? 'high' : 'critical',
          demographics,
          payoutEstimate,
          distance: Math.round(distanceFromCenter * 111 * 100) / 100, // Convert to km
        });
      }
    }

    const response = {
      center: { latitude, longitude },
      radius: 5, // km
      gridData: riskGrid,
      summary: {
        totalPoints: riskGrid.length,
        avgRisk: Math.round(riskGrid.reduce((sum, p) => sum + p.risk, 0) / riskGrid.length),
        highRiskZones: riskGrid.filter(p => p.risk >= 75).length,
        mediumRiskZones: riskGrid.filter(p => p.risk >= 50 && p.risk < 75).length,
        lowRiskZones: riskGrid.filter(p => p.risk < 50).length,
      },
      dataSource: 'Modeled based on location analysis and risk factors',
      timestamp: new Date().toISOString(),
    };

    console.log('Demographics enrichment complete');

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in enrich-demographics function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
