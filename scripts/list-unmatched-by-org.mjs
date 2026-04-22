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

// Output as formatted table
console.log('\n# Unmatched Datasets by Organization\n');
console.log('Total unmatched: ' + data.remaining.length + '\n');

for (const [org, datasets] of sorted) {
  const displayOrg = org.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  console.log(`## ${displayOrg}\n**Count:** ${datasets.length}\n`);
  
  // Show top 5 most unmatched datasets for this org
  const sorted_datasets = datasets.sort((a, b) => parseFloat(a.bestMatchScore) - parseFloat(b.bestMatchScore)).slice(0, 5);
  
  console.log('| Dataset | Best Leaf Match | Score |');
  console.log('|---------|-----------------|-------|');
  for (const d of sorted_datasets) {
    const title = d.title.replace(/\n/g, ' ').substring(0, 70);
    const leaf = (d.bestLeafTitle || 'N/A').substring(0, 30);
    console.log(`| ${title}... | ${leaf}... | ${d.bestMatchScore} |`);
  }
  console.log('');
}

console.log('\n---\n');
console.log(`**Total organizations:** ${sorted.length}`);
console.log(`**Top org:** ${sorted[0][0]} (${sorted[0][1].length} datasets)`);
