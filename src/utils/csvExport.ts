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

export const downloadCSV = (riskData: RiskData) => {
  // Calculate payout estimates with exponential risk scaling
  const baseExposure = 2500000; // Increased base for aggregate portfolio exposure
  const riskFactor = riskData.overallScore / 100;
  const exponentialRisk = Math.pow(riskFactor, 1.2); // Exponential scaling matches demographics function
  
  const expected = Math.floor(baseExposure * exponentialRisk * 0.6);
  const percentile75 = Math.floor(baseExposure * exponentialRisk * 0.85);
  const percentile90 = Math.floor(baseExposure * exponentialRisk * 1.15);
  const worstCase = Math.floor(baseExposure * exponentialRisk * 1.65);

  const csvContent = [
    ['Metric', 'Value'],
    ['Latitude', riskData.latitude],
    ['Longitude', riskData.longitude],
    ['Composite Risk Score', riskData.overallScore],
    ['Flood Risk (%)', riskData.factors.flood],
    ['Wildfire Risk (%)', riskData.factors.wildfire],
    ['Storm Risk (%)', riskData.factors.storm],
    ['Drought Risk (%)', riskData.factors.drought],
    ['Expected Annual Loss ($)', expected],
    ['Payout 75th Percentile ($)', percentile75],
    ['Payout 90th Percentile ($)', percentile90],
    ['Probable Maximum Loss ($)', worstCase],
  ]
    .map(row => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `georisk_report_${riskData.latitude}_${riskData.longitude}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
