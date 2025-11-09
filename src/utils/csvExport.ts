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
  // Calculate payout estimates
  const baseExposure = 1000000;
  const percentile25 = Math.floor(baseExposure * (riskData.overallScore / 100) * 0.5);
  const percentile50 = Math.floor(baseExposure * (riskData.overallScore / 100) * 0.75);
  const percentile75 = Math.floor(baseExposure * (riskData.overallScore / 100));
  const worstCase = Math.floor(baseExposure * (riskData.overallScore / 100) * 1.5);

  const csvContent = [
    ['Metric', 'Value'],
    ['Latitude', riskData.latitude],
    ['Longitude', riskData.longitude],
    ['Composite Risk Score', riskData.overallScore],
    ['Flood Risk (%)', riskData.factors.flood],
    ['Wildfire Risk (%)', riskData.factors.wildfire],
    ['Storm Risk (%)', riskData.factors.storm],
    ['Drought Risk (%)', riskData.factors.drought],
    ['Payout 25th Percentile ($)', percentile25],
    ['Payout 50th Percentile ($)', percentile50],
    ['Payout 75th Percentile ($)', percentile75],
    ['Worst-Case Exposure ($)', worstCase],
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
