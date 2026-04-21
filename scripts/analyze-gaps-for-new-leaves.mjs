import fs from 'fs';
import path from 'path';

const repoRoot = '/Users/holmes/local_dev/semanticGIS';
const outputDir = path.join(repoRoot, 'DanishData/content/assets/lookup');
const matchedPath = path.join(outputDir, 'datasets-matched-to-leaves.json');
const remainingPath = path.join(outputDir, 'datasets-remaining-unmatched.json');

const matched = JSON.parse(fs.readFileSync(matchedPath, 'utf-8'));
const remaining = JSON.parse(fs.readFileSync(remainingPath, 'utf-8'));

// Cluster remaining datasets by keyword themes
function clusterByKeyword(datasets) {
  const clusters = {
    'environmental-noise': [],
    'land-planning': [],
    'spatial-planning': [],
    'industry-facilities': [],
    'waste-landfill': [],
    'emissions-pollution': [],
    'water-protection': [],
    'biodiversity-natura2000': [],
    'geological-precambrian': [],
    'greenland': [],
    'opendata-inspire-service': [],
    'agricultural-practices': [],
    'fisheries-data': [],
    'shipping-maritime': [],
    'transport-infrastructure': [],
    'cultural-heritage': [],
    'tourism-recreation': [],
    'climate-change': [],
    'forest-woodland': [],
    'peatland-bog': [],
    'research-monitoring': [],
    'other': []
  };

  for (const item of datasets) {
    const title = item.dataset.title.toLowerCase();
    
    if (title.includes('støj') || title.includes('noise') || title.includes('lden') || title.includes('lnight')) {
      clusters['environmental-noise'].push(item);
    } else if (title.includes('plandk') || title.includes('lokalplan') || title.includes('kommuneplan') || title.includes('regionplan') || title.includes('fredning')) {
      clusters['land-planning'].push(item);
    } else if (title.includes('spatial') || title.includes('planning') && !title.includes('plandk')) {
      clusters['spatial-planning'].push(item);
    } else if (title.includes('industri') || title.includes('virksomhed') || title.includes('fabrik') || title.includes('kemikalier')) {
      clusters['industry-facilities'].push(item);
    } else if (title.includes('deponi') || title.includes('affald') || title.includes('waste') || title.includes('lossing')) {
      clusters['waste-landfill'].push(item);
    } else if (title.includes('emission') || title.includes('forurening') || title.includes('pollution') || title.includes('pm10') || title.includes('partikler')) {
      clusters['emissions-pollution'].push(item);
    } else if (title.includes('drikkevandsforekomster') || title.includes('vandrampe') || title.includes('vandlø') && !title.includes('ikkejorden')) {
      clusters['water-protection'].push(item);
    } else if (title.includes('natura 2000') || title.includes('natura2000') || title.includes('fuglebeskyttelse') || title.includes('habitatdirektivet')) {
      clusters['biodiversity-natura2000'].push(item);
    } else if (title.includes('prækvartær') || title.includes('precambrian') || title.includes('tertiær') || title.includes('bornholm')) {
      clusters['geological-precambrian'].push(item);
    } else if (title.includes('grønland') || title.includes('greenland')) {
      clusters['greenland'].push(item);
    } else if (title.includes('inspire') || title.includes('service') || title.includes('wms') || title.includes('wfs') || title.includes('api')) {
      clusters['opendata-inspire-service'].push(item);
    } else if (title.includes('økologisk') || title.includes('økologiske') || title.includes('gødning') || title.includes('pesticid') || title.includes('jordbrug') || title.includes('landbrugsjord')) {
      clusters['agricultural-practices'].push(item);
    } else if (title.includes('fiskeri') || title.includes('fishing') || title.includes('ais') || title.includes('redskab')) {
      clusters['fisheries-data'].push(item);
    } else if (title.includes('skip') || title.includes('maritime') || title.includes('havne') || title.includes('cargo')) {
      clusters['shipping-maritime'].push(item);
    } else if (title.includes('vej') || title.includes('bane') || title.includes('jernbane') || title.includes('transport')) {
      clusters['transport-infrastructure'].push(item);
    } else if (title.includes('arkæ') || title.includes('kulturarv') || title.includes('kulturminde') || title.includes('fredede')) {
      clusters['cultural-heritage'].push(item);
    } else if (title.includes('turis') || title.includes('fritid') || title.includes('recreation')) {
      clusters['tourism-recreation'].push(item);
    } else if (title.includes('klima') || title.includes('climate')) {
      clusters['climate-change'].push(item);
    } else if (title.includes('skov') || title.includes('forest') || title.includes('wood')) {
      clusters['forest-woodland'].push(item);
    } else if (title.includes('tørv') || title.includes('mose') || title.includes('peatland') || title.includes('bog')) {
      clusters['peatland-bog'].push(item);
    } else if (title.includes('feltmål') || title.includes('monitoring') || title.includes('novana') || title.includes('undersøgelse')) {
      clusters['research-monitoring'].push(item);
    } else {
      clusters['other'].push(item);
    }
  }

  return clusters;
}

const clusters = clusterByKeyword(remaining.remaining);

// Generate gap analysis report
let report = `# Gap Analysis: Potential New Leaves Based on Unmatched Datasets

Generated: ${new Date().toISOString()}

## Executive Summary

- **Total unmatched datasets:** ${remaining.summary.total}
- **Total matched to existing leaves:** ${matched.summary.matched}
- **Dataset-to-leaf coverage:** ${((matched.summary.matched) / (matched.summary.matched + remaining.summary.total) * 100).toFixed(1)}%

### Recommended Priority for New Leaves

1. **Environmental Noise** - ${clusters['environmental-noise'].length} datasets (regulatory requirement: EU Noise Directive)
2. **Land Planning (PlanDK)** - ${clusters['land-planning'].length} datasets (critical for spatial planning)
3. **Natura 2000 & Biodiversity Directives** - ${clusters['biodiversity-natura2000'].length} additional datasets
4. **Industrial Facilities & Contamination Risk** - ${clusters['industry-facilities'].length} datasets
5. **Emissions & Air Quality** - ${clusters['emissions-pollution'].length} datasets
6. **Agricultural Practices/Land Management** - ${clusters['agricultural-practices'].length} datasets (partially covered)

---

## Detailed Cluster Analysis

`;

// Process each cluster
const clusterOrder = [
  'environmental-noise',
  'land-planning',
  'biodiversity-natura2000',
  'industry-facilities',
  'emissions-pollution',
  'agricultural-practices',
  'water-protection',
  'geological-precambrian',
  'forest-woodland',
  'research-monitoring',
  'waste-landfill',
  'climate-change',
  'peatland-bog',
  'shipping-maritime',
  'transport-infrastructure',
  'fisheries-data',
  'greenland',
  'spatial-planning',
  'cultural-heritage',
  'tourism-recreation',
  'opendata-inspire-service',
  'other'
];

for (const cluster of clusterOrder) {
  const items = clusters[cluster];
  if (items.length === 0) continue;
  
  const clusterName = cluster.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  report += `\n### ${clusterName}\n\n`;
  report += `**Count:** ${items.length} datasets\n\n`;
  
  if (items.length > 0) {
    report += `**Sample datasets:**\n`;
    for (const item of items.slice(0, 5)) {
      const title = item.dataset.title.replace(/\n/g, ' - ').substring(0, 80);
      report += `- ${title}...\n`;
    }
  }
  
  // Recommend action
  if (cluster === 'environmental-noise') {
    report += `\n**Recommendation:** Create new leaf "Environmental Noise & Air Transport". EU Noise Directive requires noise mapping. Integration with air quality monitoring suggested.\n`;
  } else if (cluster === 'land-planning') {
    report += `\n**Recommendation:** Consider creating "Spatial Planning Decisions" or "Municipal & Regional Plans" leaf. PlanDK is critical INSPIRE theme. May warrant 2-3 separate leaves (municipal, regional, national).\n`;
  } else if (cluster === 'industry-facilities') {
    report += `\n**Recommendation:** Create "Industrial Facilities & Contaminated Sites" leaf. Links to EU INSPIRE PRTR theme and existing Spoil/Pollution leaf.\n`;
  } else if (cluster === 'waste-landfill') {
    report += `\n**Recommendation:** Could extend "Spill and Pollution Incidents" leaf or create new "Waste Management & Landfills" leaf.\n`;
  } else if (cluster === 'emissions-pollution') {
    report += `\n**Recommendation:** Create "Air Quality & Emissions Inventories" leaf (PM10, NOx, VOC - regulatory reporting). Can reference existing "Atmospheric Deposition and Emissions" leaf.\n`;
  } else if (cluster === 'water-protection') {
    report += `\n**Recommendation:** Create "Drinking Water & Water Source Protection" leaf. Partly covered by existing leaves but drinking water infrastructure deserves dedicated coverage.\n`;
  } else if (cluster === 'biodiversity-natura2000') {
    report += `\n**Recommendation:** Create "Natura 2000 & Protected Habitat Networks" leaf. Complement existing "Nature Protection Areas" leaf with INSPIRE PS/AM themes.\n`;
  } else if (cluster === 'agricultural-practices') {
    report += `\n**Recommendation:** Extend existing "Agricultural Land Management" leaf with crop rotation, pesticide application, fertilizer management datasets.\n`;
  } else if (cluster === 'forest-woodland') {
    report += `\n**Recommendation:** Create "Forest Ecosystems & Management" leaf. Cover Forest Type Map, management units, harvest plans.\n`;
  } else if (cluster === 'research-monitoring') {
    report += `\n**Recommendation:** These are monitoring datasets (NOVANA, field surveys). May represent multiple leaves or a meta-leaf for "Environmental Monitoring Networks".\n`;
  } else if (cluster === 'greenland') {
    report += `\n**Recommendation:** Limited coverage for Greenland datasets. Consider scope: are we including Greenlandic data alongside Danish?\n`;
  }
  
  report += `\n`;
}

report += `\n---\n\n## Next Steps\n\n`;
report += `1. **Review prioritized recommendations** above with domain experts\n`;
report += `2. **No new leaves without human consent** - this report is for analysis only\n`;
report += `3. **For each approved new leaf:**\n`;
report += `   - Define concept, question, and primary collection (realisation)\n`;
report += `   - Map realisations from unmatched datasets list\n`;
report += `   - Test matching against dataset titles\n`;
report += `4. **Re-run matching script** after new leaves are created\n`;

fs.writeFileSync(path.join(outputDir, 'gap-analysis-potential-new-leaves.md'), report);

console.log(`✓ Gap analysis report generated: gap-analysis-potential-new-leaves.md`);
console.log(`\nCluster summary:`);
for (const cluster of clusterOrder) {
  if (clusters[cluster].length > 0) {
    console.log(`  ${cluster}: ${clusters[cluster].length}`);
  }
}
