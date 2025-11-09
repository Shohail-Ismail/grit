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
    const { latitude, longitude } = await req.json();
    
    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required');
    }

    console.log(`Analyzing location: ${latitude}, ${longitude}`);

    // Fetch real climate data from Open-Meteo API (free, no API key needed)
    const climateResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`
    );

    if (!climateResponse.ok) {
      throw new Error('Failed to fetch climate data');
    }

    const climateData = await climateResponse.json();
    console.log('Climate data received:', climateData);

    // Fetch elevation data from Open-Meteo
    const elevationResponse = await fetch(
      `https://api.open-meteo.com/v1/elevation?latitude=${latitude}&longitude=${longitude}`
    );
    
    const elevationData = await elevationResponse.json();
    const elevation = elevationData.elevation?.[0] || 0;
    console.log('Elevation:', elevation);

    // Calculate risk scores based on real data
    const current = climateData.current;
    const daily = climateData.daily;

    // Flood Risk Calculation (0-100)
    // Based on: precipitation, elevation, humidity
    const avgPrecipitation = daily.precipitation_sum.reduce((a: number, b: number) => a + b, 0) / daily.precipitation_sum.length;
    const maxPrecipitationProb = Math.max(...daily.precipitation_probability_max);
    const floodRisk = Math.min(100, Math.round(
      (avgPrecipitation * 2) + 
      (maxPrecipitationProb * 0.3) + 
      (elevation < 50 ? 30 : elevation < 200 ? 15 : 0) +
      (current.relative_humidity_2m > 80 ? 15 : 0)
    ));

    // Wildfire Risk Calculation (0-100)
    // Based on: temperature, humidity, wind speed, precipitation
    const avgTemp = (daily.temperature_2m_max.reduce((a: number, b: number) => a + b, 0) / daily.temperature_2m_max.length);
    const maxWindSpeed = Math.max(...daily.wind_speed_10m_max);
    const wildfireRisk = Math.min(100, Math.round(
      (avgTemp > 30 ? (avgTemp - 30) * 3 : 0) +
      (current.relative_humidity_2m < 30 ? 30 : 0) +
      (maxWindSpeed > 20 ? 20 : maxWindSpeed) +
      (avgPrecipitation < 2 ? 20 : 0)
    ));

    // Storm Risk Calculation (0-100)
    // Based on: wind speed, precipitation probability, temperature variations
    const tempVariation = Math.max(...daily.temperature_2m_max) - Math.min(...daily.temperature_2m_min);
    const stormRisk = Math.min(100, Math.round(
      (maxWindSpeed * 2) +
      (maxPrecipitationProb * 0.4) +
      (tempVariation > 15 ? 20 : tempVariation)
    ));

    // Drought Risk Calculation (0-100)
    // Based on: low precipitation, high temperature, low humidity
    const droughtRisk = Math.min(100, Math.round(
      (avgPrecipitation < 5 ? 40 : avgPrecipitation < 10 ? 20 : 0) +
      (avgTemp > 25 ? (avgTemp - 25) * 2 : 0) +
      (current.relative_humidity_2m < 40 ? 30 : current.relative_humidity_2m < 60 ? 15 : 0)
    ));

    // Calculate overall risk score
    const overallScore = Math.round((floodRisk + wildfireRisk + stormRisk + droughtRisk) / 4);

    const riskData = {
      latitude,
      longitude,
      overallScore,
      factors: {
        flood: floodRisk,
        wildfire: wildfireRisk,
        storm: stormRisk,
        drought: droughtRisk,
      },
      metadata: {
        elevation,
        currentTemp: current.temperature_2m,
        currentHumidity: current.relative_humidity_2m,
        currentPrecipitation: current.precipitation,
        currentWindSpeed: current.wind_speed_10m,
        avgPrecipitation,
        maxWindSpeed,
        dataSource: 'Open-Meteo API',
        timestamp: new Date().toISOString(),
      }
    };

    console.log('Risk analysis complete:', riskData);

    return new Response(JSON.stringify(riskData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-location function:', error);
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
