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
    const radius = 0.045; // ~5km in degrees
    const pointsPerRing = [1, 6, 12, 18]; // Center, inner, middle, outer rings
    
    const riskGrid = [];
    
    // Center point
    riskGrid.push({
      lat: latitude,
      lng: longitude,
      isCenter: true,
      distanceFromCenter: 0
    });
    
    // Generate concentric rings
    for (let ring = 1; ring < pointsPerRing.length; ring++) {
      const ringRadius = (radius / (pointsPerRing.length - 1)) * ring;
      const numPoints = pointsPerRing[ring];
      
      for (let i = 0; i < numPoints; i++) {
        const angle = (2 * Math.PI * i) / numPoints;
        const lat = latitude + ringRadius * Math.cos(angle);
        const lng = longitude + ringRadius * Math.sin(angle);
        
        const distanceFromCenter = ringRadius;
        
        riskGrid.push({
          lat,
          lng,
          isCenter: false,
          distanceFromCenter
        });
      }
    }
    
    // Calculate risk for each point
    const enrichedGrid = riskGrid.map(point => {
      let gridRisk: number;
      
      if (point.isCenter) {
        // Center point uses the actual analyzed risk score
        gridRisk = riskFactors.overallScore;
      } else {
        // Other points have independent risk based on regional characteristics
        const regionalBaseline = riskFactors.overallScore;
        const latVariation = Math.sin(point.lat * 10) * 15;
        const lngVariation = Math.cos(point.lng * 10) * 15;
        const randomVariation = (Math.random() - 0.5) * 20;
        
        gridRisk = Math.max(0, Math.min(100, 
          regionalBaseline + latVariation + lngVariation + randomVariation
        ));
      }
        
      // Estimate population density based on location characteristics
      const basePopulation = 800 + Math.abs(Math.sin(point.lat * 5)) * 1000;
      const urbanBoost = Math.abs(Math.cos(point.lng * 7)) * 500;
      const populationDensity = Math.floor(basePopulation + urbanBoost + Math.random() * 400);
        
      // Generate demographic estimates based on population density
      const urbanizationLevel = populationDensity > 1500 ? 'Urban' : 
                                populationDensity > 800 ? 'Suburban' : 'Rural';
      
      const demographics = {
        population: Math.floor(populationDensity * 0.25),
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
      const densityMultiplier = Math.min(populationDensity / 1000, 2.5);
      const urbanMultiplier = demographics.urbanization === 'Urban' ? 1.5 : 
                              demographics.urbanization === 'Suburban' ? 1.2 : 0.8;
      const baseExposure = 1000000 * densityMultiplier * urbanMultiplier;
      
      // Risk-adjusted payout calculation with exponential scaling
      const riskFactor = gridRisk / 100;
      const exponentialRisk = Math.pow(riskFactor, 1.2);
      
      const payoutEstimate = {
        expected: Math.floor(baseExposure * exponentialRisk * 0.6),
        percentile75: Math.floor(baseExposure * exponentialRisk * 0.85),
        percentile90: Math.floor(baseExposure * exponentialRisk * 1.15),
        worstCase: Math.floor(baseExposure * exponentialRisk * 1.65),
      };
      
      return {
        lat: point.lat,
        lng: point.lng,
        risk: Math.round(gridRisk),
        riskLevel: gridRisk < 25 ? 'low' : gridRisk < 50 ? 'medium' : gridRisk < 75 ? 'high' : 'critical',
        demographics,
        payoutEstimate,
        distance: Math.round(point.distanceFromCenter * 111 * 100) / 100,
      };
    });

    const response = {
      center: { latitude, longitude },
      radius: 5,
      gridData: enrichedGrid,
      summary: {
        totalPoints: enrichedGrid.length,
        avgRisk: Math.round(enrichedGrid.reduce((sum, p) => sum + p.risk, 0) / enrichedGrid.length),
        highRiskZones: enrichedGrid.filter(p => p.risk >= 75).length,
        mediumRiskZones: enrichedGrid.filter(p => p.risk >= 50 && p.risk < 75).length,
        lowRiskZones: enrichedGrid.filter(p => p.risk < 50).length,
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
