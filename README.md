# Geographical Risk Insurance Tool (GRIT)

* [Description](#description)
* [Running the app](#running-the-app)
* [Guide](#guide)
* [Future developments](#future-development)


## Description

> Prototype built in 24 hours for the MIT Sloan AI Club x Google Cloud x OpenAI Hack-Nation Global Hackathon
> - Placed 3rd (VC track) out of >2800 participants
> - Selected as 1 of 15 ventures to receive mentorship from Stanford, Harvard, and Microsoft to develop and scale idea (ongoing)

GRIT is a rapid-response climate risk assessment tool for insurance, reinsurance, and catastrophe-modelling teams It delivers sub-10m geospatial analysis, <60-second risk scoring, and parametric payout estimates, combining satellite imagery, climate feeds, and a lightweight geospatial backend

Designed to answer the core underwriting question: *What is the exposure in this area right now?*

### Key outcomes (quantitative)

* 49-point grid per query (7x7 tiles around target coordinate)
* 7 hazard composites (flood, wildfire, storm, drought, exposure, vulnerability, overall)
* <60 second average end-to-end analysis time
* 10m resolution using Sentinel-1/2 data
* 30% improvement in high-severity loss estimation vs linear baseline (via exponential scaling)
* 85% reduction in external API calls using caching + batching
* Serverless auto-scaling via Supabase Edge + Lovable Cloud

---

## Running the app

### Requirements

* Nodejs 18+
* npm

### Environment setup (auto-configured in production)

```
VITE_SUPABASE_URL=<>
VITE_SUPABASE_PUBLISHABLE_KEY=<>
VITE_SUPABASE_PROJECT_ID=<>
```

### Satellite analysis API

```
COPERNICUS_CLIENT_ID=
COPERNICUS_CLIENT_SECRET=
```

### Run

```bash
# Environment setup auto-configured in production
npm install
npm run dev
```

App runs at:
`http://localhost:5173`

---

## Guide

1 Enter a location in the frontend
   GRIT builds a 7x7 geospatial grid and fetches climate, demographic, and satellite features

2 Edge Functions run hazard modules:

   * Flood (Sentinel-1 SAR change detection)
   * Wildfire (Sentinel-2 NBR/dNBR)
   * Storm / drought (Open-Meteo + short-term conditions)

3 Risk algorithm calculates:

   * Hazard severity
   * Exposure (population x urbanisation weighting)
   * Parametric payout ranges (expected, 75th, 90th, PML)

4 Frontend displays:

   * Interactive heatmap (Leaflet + heat layer)
   * Metric breakdowns (Recharts)
   * CSV export for underwriting / reinsurance submissions

---

## Future Development

### 1 Satellite methods are production-aligned

The SAR and NBR pipelines follow standard remote-sensing practice:

* SAR flood detection
* NBR/dNBR wildfire classification using USGS thresholds

These methods are simplified for serverless limits but retain the correct scientific structure

### 2 Data pipeline designed for real underwriting workflows

* Supabase PostGIS stores analysis results, enabling multi-location queries
* pg_cron supports scheduled ingestion for near-real-time updates
* GeoTIFF/Shapefile export allows integration with internal GIS systems

### 3 Scoring model intentionally transparent

Recruiters and risk teams favour explainability over black box ML
GRIT uses clear, auditable components:

* 7 hazard metrics
* demographic-weighted exposure
* exponential severity scaling (`riskFactor^12`)
* percentile-based payout estimates

### 4 Built for speed, reliability, and handover

During the hackathon, major constraints included:

* no GDAL
* strict serverless timeouts
* unpredictable API rates

The solution is in:

* lightweight GeoTIFF generation
* request batching (85% fewer calls)
* clean modular edge functions suitable for rewrite/re-deployment

### 5 Future extensions planned during mentorship

* Portfolio-level correlation modelling
* Real-time parametric alerts (webhook-based triggers)
* Direct GDAL-backed satellite band processing
* Integration with BigQuery / ecosystem datasets
* Time-series hazard trends (5-10 year lookback)
  

<!--
Next steps

Plan of Action: Next Steps and Time Breakdown (5 hours)
1 Understanding the Judging Criteria (10 minutes)

Insurance Relevance: Does the tool help assess risk and process claims accurately and quickly? Ensure the app provides meaningful risk scores based on real disaster data

Use of Earth Intelligence/Satellite Data: Leverage satellite data (historical and real-time) for risk assessment Ensure that geospatial data powers the app, such as storm data, soil moisture, or satellite imagery (Google Earth Engine is a good tool here)

Accuracy of Risk or Claim Assessment: Use real-world disaster data and reliable risk models to generate believable and actionable results

Automation & Scalability: The back-end system (real-time risk processing) should scale well with new data (automated data processing pipelines)

Clarity of Demonstration: Ensure a simple user flow: User selects a location → system provides risk score and visual impact mapping (disaster impact vs insured assets) Clean UI and report

2 Technical Foundation Setup (30 minutes)

Back-End Setup (Google Cloud)

Set up Google Cloud Storage for managing disaster data and Google BigQuery to store geospatial information (risk data, disaster zones, etc) Use your $25k Google credits to optimize this step

Google Cloud Storage: Store the datasets (historical disaster data, insured assets)

BigQuery: Fast querying of disaster zones, asset data, and risk score aggregation

Google Vertex AI (optional): To host and manage any ML models, but could be simplified with rule-based risk models for speed

Use of Lovable API: Leverage Lovable API for geospatial UI and multi-factor risk scoring

Your colleague’s UI (GRIT) needs real-time integration with risk data, so ensure Lovable API is called on the back-end when new risk data arrives This will pull the relevant disaster event data and generate real-time risk assessments

3 Real-Time Data Integration (1 hour)

Integrate Satellite Data (Google Earth Engine)

Use Google Earth Engine (GEE) for real-time disaster impact mapping (eg, wildfires, floods) For example, if you’re working with flood risk:

Pull Sentinel-1 imagery (SAR) pre- and post-disaster to map the flood extent Apply change detection to identify the flood zone

Leverage NOAA storm events for storm data (wind speeds, rainfall) and FEMA Flood Zones for understanding the location of insured properties in flood-prone areas

Query historical data for risk scoring (eg, past storm/flood frequency in a location)

Google Cloud Integration for Real-Time Updates

Create a pipeline where, for every new disaster event, data is ingested from Google Earth Engine, processed, and stored in BigQuery

Use Google Cloud Functions to automatically trigger updates in your system when new satellite imagery or disaster data is available

4 Risk Assessment Algorithms (1 hour 15 minutes)

Rule-Based Risk Scoring Model

For Floods: Use pre-defined thresholds based on flood depth (eg, based on SAR imagery) Classify properties as low-risk, medium-risk, high-risk based on proximity to the disaster and historical flood zone

For Wildfires: Use Burn Severity Index (NBR/dNBR) from Sentinel-2 to classify the burn severity of affected areas Then map that to your insured assets

Worst-Case Exposure:

Calculate potential financial exposure based on the affected property values Multiply damage severity by coverage value to estimate the loss

Integrate a basic Monte Carlo simulation or loss calculation model for a quick stress test based on current property risk

5 Merging the Back-End with Front-End (1 hour)

Connecting Back-End with Lovable UI (Real-Time Integration)

Once risk assessment algorithms are working, the real-time updates should be piped to the GRIT UI

Use RESTful API endpoints to send risk data to the front-end This includes:

Risk score for the selected AOI

Risk breakdown (eg, flood vs wildfire, property exposure)

Map visualization showing risk zones and properties at risk

UI Updates:

Your colleague’s Liveable UI is responsible for the interactive map and user experience

Ensure smooth integration: back-end risk processing data should automatically update the UI, and the user should receive real-time feedback based on their AOI selection

6 Google Credits and Optimized Use (45 minutes)

Google Cloud for Scalable ML: Use Vertex AI to deploy any additional models that could help assess risk, for example, a quick damage detection model using AutoML for burn area classification or flood detection

Real-Time Data Processing: Set up Google Cloud Pub/Sub and Cloud Functions for real-time data ingestion and processing (every new event triggers an update in the system)

Ensure that your usage of the $25k Google Cloud credits optimizes storage, data queries, and real-time updates without incurring unnecessary costs

7 Final Polishing (1 hour)

Testing: Test the integration between the back-end and front-end Run the risk calculation and ensure the visual feedback in the UI is accurate

Video & Documentation: Prepare the 1-minute pitch video explaining the workflow: from input (location or asset), through AI analysis, to the final risk report/claim output

Code & Documentation: Write clean, well-commented code and prepare a README for the GitHub repository Ensure that the code is modular, reusable, and well-documented

Final Deliverables

Web app with interactive map + risk scoring

Risk analysis report in both CSV and PDF format, with full breakdown of the risk exposure

Demonstration video showcasing real-time risk analysis

Code repo with clear structure, well-commented code, and README

Backup data (raw satellite data, processed results, generated risk reports)

Summary: Tasks Split Between You and Your Colleague

Your Task:

Back-end Setup: Google Cloud Storage, BigQuery, real-time data pipeline

Satellite Data Integration: Google Earth Engine, processing flood/wildfire data

Risk Assessment: Implement risk scoring and worst-case exposure

API Integration: Set up real-time data processing pipelines (Pub/Sub, Cloud Functions)

Testing & Documentation: Ensure the system works end-to-end, create final pitch video

Colleague’s Task:

GRIT UI Setup: Work on the interactive map and risk display

UI Integration: Ensure that your back-end (risk score, map) integrates seamlessly into the UI

Polishing: Focus on making the UI look good and intuitive
-->

