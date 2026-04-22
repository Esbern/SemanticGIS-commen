import fs from 'fs';
import path from 'path';

const unmatchedPath = '/Users/holmes/local_dev/SemanticGIS/dk/content/assets/lookup/datasets-remaining-unmatched.json';

// Load unmatched data
const data = JSON.parse(fs.readFileSync(unmatchedPath, 'utf-8'));

// Group by organization
const byOrg = {};
for (const item of data.remaining) {
  const relPath = item.dataset.relPath;
  const match = relPath.match(/Datasets by Owner\/([^/]+)\//);
  const org = match ? match[1] : 'unknown';
  
  if (!byOrg[org]) {
    byOrg[org] = [];
  }
  byOrg[org].push({
    title: item.dataset.title,
    bestLeafTitle: item.bestLeafTitle,
    bestMatchScore: item.bestMatchScore
  });
}

// Sort organizations by count (descending)
const sorted = Object.entries(byOrg)
  .sort((a, b) => b[1].length - a[1].length);

// Create summary JSON
const summary = {
  generated_at: new Date().toISOString(),
  total_unmatched: data.remaining.length,
  total_organizations: sorted.length,
  by_organization: {}
};

for (const [org, datasets] of sorted) {
  summary.by_organization[org] = {
    count: datasets.length,
    datasets: datasets.map(d => ({
      title: d.title,
      best_leaf_match: d.bestLeafTitle,
      best_match_score: parseFloat(d.bestMatchScore)
    }))
  };
}

fs.writeFileSync(
  '/Users/holmes/local_dev/SemanticGIS/dk/content/assets/lookup/unmatched-datasets-by-organization.json',
  JSON.stringify(summary, null, 2)
);

console.log(`✓ Created unmatched-datasets-by-organization.json`);
console.log(`\nSummary:`);
console.log(`  Total unmatched: ${summary.total_unmatched}`);
console.log(`  Organizations: ${summary.total_organizations}`);
console.log(`\nTop 10 organizations:`);

Object.entries(summary.by_organization).slice(0, 10).forEach(([org, data], idx) => {
  console.log(`  ${idx + 1}. ${org}: ${data.count} datasets`);
});
