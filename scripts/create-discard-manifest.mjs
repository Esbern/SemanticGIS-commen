import fs from 'fs';
import path from 'path';

const repoRoot = '/Users/holmes/local_dev/SemanticGIS';
const dataPath = path.join(repoRoot, 'geodata_full.json');
const unmatchedPath = path.join(repoRoot, 'dk/content/assets/lookup/datasets-remaining-unmatched.json');
const outputDir = path.join(repoRoot, 'dk/content/assets/lookup');

// Load data
console.log('Loading data...');
const geodataFull = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const unmatched = JSON.parse(fs.readFileSync(unmatchedPath, 'utf-8'));

// Build index: sgis_id → original dataset
const sgisIndex = {};
for (const record of geodataFull.records || []) {
  if (record.sgis_id) {
    sgisIndex[record.sgis_id] = record;
  }
}

console.log(`Indexed ${Object.keys(sgisIndex).length} sgis_ids from geodata_full.json`);

// Identify datasets to discard (INSPIRE services + Greenland)
const discardedDatasets = {
  inspire_services: [],
  greenland: [],
  inspire_service_sgis_ids: [],
  greenland_sgis_ids: []
};

for (const item of unmatched.remaining) {
  const title = item.dataset.title.toLowerCase();
  const relPath = item.dataset.relPath;
  
  // Extract sgis_id from relPath (last segment without .md)
  const sgisId = relPath.split('/').pop().replace('.md', '');
  
  if (title.includes('inspire') || title.includes('service') || relPath.includes('inspire-')) {
    discardedDatasets.inspire_services.push({
      title: item.dataset.title,
      relPath,
      sgis_id: sgisId,
      geodata_record: sgisIndex[sgisId] || null
    });
    discardedDatasets.inspire_service_sgis_ids.push(sgisId);
  } else if (title.includes('grønland') || title.includes('greenland')) {
    discardedDatasets.greenland.push({
      title: item.dataset.title,
      relPath,
      sgis_id: sgisId,
      geodata_record: sgisIndex[sgisId] || null
    });
    discardedDatasets.greenland_sgis_ids.push(sgisId);
  }
}

console.log(`\nDiscarded datasets identified:`);
console.log(`  - INSPIRE services: ${discardedDatasets.inspire_services.length}`);
console.log(`  - Greenland: ${discardedDatasets.greenland.length}`);
console.log(`  - Total discarded sgis_ids: ${discardedDatasets.inspire_service_sgis_ids.length + discardedDatasets.greenland_sgis_ids.length}`);

// Create discard manifest
const discardManifest = {
  created_at: new Date().toISOString(),
  description: 'Discard manifest for datasets excluded from SemanticGIS',
  exclusion_reasons: {
    inspire_services: 'INSPIRE service metadata records - already exposed as web service access paths, not raw data datasets',
    greenland: 'Greenland datasets - out of scope (Denmark-focused)'
  },
  summary: {
    total_discarded: discardedDatasets.inspire_services.length + discardedDatasets.greenland.length,
    inspire_services_count: discardedDatasets.inspire_services.length,
    greenland_count: discardedDatasets.greenland.length
  },
  discard_by_category: {
    inspire_services: {
      count: discardedDatasets.inspire_services.length,
      sgis_ids: discardedDatasets.inspire_service_sgis_ids,
      datasets: discardedDatasets.inspire_services.slice(0, 5).map(d => ({title: d.title, sgis_id: d.sgis_id}))
    },
    greenland: {
      count: discardedDatasets.greenland.length,
      sgis_ids: discardedDatasets.greenland_sgis_ids,
      datasets: discardedDatasets.greenland.map(d => ({title: d.title, sgis_id: d.sgis_id}))
    }
  },
  future_harvest_policy: 'Exclude sgis_ids in excluded_from_dataset_generation list below from future dataset note generation',
  excluded_from_dataset_generation: [
    ...discardedDatasets.inspire_service_sgis_ids,
    ...discardedDatasets.greenland_sgis_ids
  ]
};

// Write manifest
fs.writeFileSync(
  path.join(outputDir, 'discard-manifest.json'),
  JSON.stringify(discardManifest, null, 2)
);

// Write deletion list (for cleanup script)
const filestoDelete = [];
for (const dataset of [...discardedDatasets.inspire_services, ...discardedDatasets.greenland]) {
  filestoDelete.push(path.join(repoRoot, 'dk/content', dataset.relPath));
}

fs.writeFileSync(
  path.join(outputDir, 'files-to-delete.json'),
  JSON.stringify({
    count: filestoDelete.length,
    files: filestoDelete
  }, null, 2)
);

// Create markdown discard list for human reference
let discardMD = `# Discarded Datasets Manifest\n\n`;
discardMD += `Generated: ${new Date().toISOString()}\n\n`;
discardMD += `## Summary\n\n`;
discardMD += `- **Total discarded:** ${discardManifest.summary.total_discarded}\n`;
discardMD += `- **INSPIRE services:** ${discardManifest.summary.inspire_services_count}\n`;
discardMD += `- **Greenland datasets:** ${discardManifest.summary.greenland_count}\n\n`;

discardMD += `## INSPIRE Service Metadata (${discardedDatasets.inspire_services.length} records)\n\n`;
discardMD += `These are **metadata records for web services**, not data datasets. Already available as INSPIRE WMS/WFS endpoints.\n\n`;
discardMD += `| SGIS ID | Title |\n`;
discardMD += `|---------|-------|\n`;
for (const d of discardedDatasets.inspire_services.slice(0, 50)) {
  const title = d.title.replace(/\|/g, '').substring(0, 100);
  discardMD += `| ${d.sgis_id} | ${title} |\n`;
}
if (discardedDatasets.inspire_services.length > 50) {
  discardMD += `| ... | ... (${discardedDatasets.inspire_services.length - 50} more) |\n`;
}

discardMD += `\n## Greenland Datasets (${discardedDatasets.greenland.length} records)\n\n`;
discardMD += `Out of scope: Denmark-focused SemanticGIS project.\n\n`;
discardMD += `| SGIS ID | Title |\n`;
discardMD += `|---------|-------|\n`;
for (const d of discardedDatasets.greenland) {
  const title = d.title.replace(/\|/g, '').substring(0, 100);
  discardMD += `| ${d.sgis_id} | ${title} |\n`;
}

fs.writeFileSync(
  path.join(outputDir, 'discard-manifest.md'),
  discardMD
);

console.log(`\n✓ Discard manifest created:`);
console.log(`  - discard-manifest.json (${discardManifest.summary.total_discarded} records)`);
console.log(`  - discard-manifest.md (human-readable)`);
console.log(`  - files-to-delete.json (${filestoDelete.length} markdown files)`);
console.log(`\nNext: Review and run cleanup script to delete markdown files`);
