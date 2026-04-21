import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const repoRoot = '/Users/holmes/local_dev/semanticGIS';
const leavesDir = path.join(repoRoot, 'DanishData/content/Leaves');
const unmatchedPath = path.join(repoRoot, 'DanishData/content/assets/lookup/datasets-unmatched-by-leaf.v1.json');
const outputDir = path.join(repoRoot, 'DanishData/content/assets/lookup');

// Load unmatched datasets
const unmatchedData = JSON.parse(fs.readFileSync(unmatchedPath, 'utf-8'));
const unmatchedDatasets = unmatchedData.unmatched;

// Load all leaves
function loadLeaves() {
  const leaves = [];
  const files = fs.readdirSync(leavesDir).filter(f => f.endsWith('.md') && f !== 'index.md');
  
  for (const file of files) {
    const filePath = path.join(leavesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(content);
    
    leaves.push({
      file,
      title: data.title,
      concept: data.concept || '',
      question: data.question || '',
      realisations: Array.isArray(data.realisations) ? data.realisations : [],
      sphere: data.sphere,
      subsphere: data.subsphere,
      tags: data.tags || [],
      entities: data.entities || []
    });
  }
  
  return leaves;
}

// Normalize and tokenize text
function norm(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2)
    .join(' ');
}

// Compute token overlap F1 score
function tokenSetF1(str1, str2) {
  const tokens1 = new Set(norm(str1).split(/\s+/));
  const tokens2 = new Set(norm(str2).split(/\s+/));
  
  const intersection = [...tokens1].filter(t => tokens2.has(t)).length;
  const precision = tokens1.size > 0 ? intersection / tokens1.size : 0;
  const recall = tokens2.size > 0 ? intersection / tokens2.size : 0;
  
  if (precision === 0 || recall === 0) return 0;
  return (2 * precision * recall) / (precision + recall);
}

// Score a dataset against a leaf
function scoreDatasetToLeaf(dataset, leaf) {
  let maxScore = 0;
  let matchMethod = null;
  
  // Score against leaf title
  const titleScore = tokenSetF1(dataset.title, leaf.title);
  if (titleScore > maxScore) {
    maxScore = titleScore;
    matchMethod = 'title';
  }
  
  // Score against realisations
  for (const realisation of leaf.realisations) {
    const realisationScore = tokenSetF1(dataset.title, realisation);
    if (realisationScore > maxScore) {
      maxScore = realisationScore;
      matchMethod = `realisation: ${realisation}`;
    }
  }
  
  // Score against concept
  const conceptScore = tokenSetF1(dataset.title, leaf.concept);
  if (conceptScore > maxScore) {
    maxScore = conceptScore;
    matchMethod = 'concept';
  }
  
  // Score against question
  const questionScore = tokenSetF1(dataset.title, leaf.question);
  if (questionScore > maxScore) {
    maxScore = questionScore;
    matchMethod = 'question';
  }
  
  return { score: maxScore, method: matchMethod };
}

// Main analysis
function analyzeDatasets() {
  const leaves = loadLeaves();
  const matches = [];
  const remaining = [];
  const threshold = 0.45; // Lower threshold to be inclusive
  
  console.log(`Analyzing ${unmatchedDatasets.length} unmatched datasets against ${leaves.length} leaves...`);
  
  for (const dataset of unmatchedDatasets) {
    let bestLeaf = null;
    let bestScore = 0;
    let bestMethod = null;
    
    for (const leaf of leaves) {
      const { score, method } = scoreDatasetToLeaf(dataset, leaf);
      if (score > bestScore) {
        bestScore = score;
        bestLeaf = leaf;
        bestMethod = method;
      }
    }
    
    if (bestScore >= threshold && bestLeaf) {
      matches.push({
        dataset: {
          title: dataset.title,
          relPath: dataset.relPath,
          group: dataset.group
        },
        leaf: {
          file: bestLeaf.file,
          title: bestLeaf.title,
          sphere: bestLeaf.sphere
        },
        score: bestScore.toFixed(3),
        method: bestMethod
      });
    } else {
      remaining.push({
        dataset: {
          title: dataset.title,
          relPath: dataset.relPath,
          group: dataset.group
        },
        bestMatchScore: bestScore.toFixed(3),
        bestLeafTitle: bestLeaf ? bestLeaf.title : null
      });
    }
  }
  
  // Analyze gaps in remaining datasets
  const gapAnalysis = analyzeGaps(remaining, leaves);
  
  return { matches, remaining, gapAnalysis, leaves };
}

function analyzeGaps(remaining, leaves) {
  const keywords = {};
  const ownerGroups = {};
  
  for (const item of remaining) {
    const titleTokens = norm(item.dataset.title).split(/\s+/);
    for (const token of titleTokens) {
      if (token.length > 3) {
        keywords[token] = (keywords[token] || 0) + 1;
      }
    }
    
    const owner = item.dataset.relPath.match(/Datasets by Owner\/([^/]+)/)?.[1] || 'unknown';
    ownerGroups[owner] = (ownerGroups[owner] || 0) + 1;
  }
  
  // Find top keywords that don't appear in leaf titles
  const leafKeywords = new Set();
  for (const leaf of leaves) {
    const tokens = norm(leaf.title + ' ' + leaf.concept).split(/\s+/);
    tokens.forEach(t => leafKeywords.add(t));
  }
  
  const uniqueKeywords = Object.entries(keywords)
    .filter(([k]) => !leafKeywords.has(k) && k.length > 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([k, count]) => ({ keyword: k, count }));
  
  const topOwners = Object.entries(ownerGroups)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([owner, count]) => ({ owner, count }));
  
  return {
    totalRemaining: remaining.length,
    topKeywords: uniqueKeywords,
    topOwners
  };
}

// Generate output reports
function generateReports(analysis) {
  const { matches, remaining, gapAnalysis } = analysis;
  
  // JSON report: matched datasets
  const matchedReport = {
    generatedAt: new Date().toISOString(),
    summary: {
      total: unmatchedDatasets.length,
      matched: matches.length,
      unmatched: remaining.length,
      matchPercentage: (matches.length / unmatchedDatasets.length * 100).toFixed(1)
    },
    matched: matches.sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
  };
  
  fs.writeFileSync(
    path.join(outputDir, 'datasets-matched-to-leaves.json'),
    JSON.stringify(matchedReport, null, 2)
  );
  
  // Markdown report: matched datasets
  let mdMatched = `# Datasets Matched to Existing Leaves\n\n`;
  mdMatched += `Generated: ${new Date().toISOString()}\n\n`;
  mdMatched += `**Summary:** ${matches.length} / ${unmatchedDatasets.length} datasets matched to existing leaves (${matchedReport.summary.matchPercentage}%)\n\n`;
  mdMatched += `| Dataset | Leaf | Score | Method |\n`;
  mdMatched += `|---------|------|-------|--------|\n`;
  
  for (const match of matchedReport.matched.slice(0, 500)) {
    const datasetName = match.dataset.title.replace(/\|/g, '\\|');
    const leafName = match.leaf.title.replace(/\|/g, '\\|');
    const method = match.method.substring(0, 40).replace(/\|/g, '\\|');
    mdMatched += `| ${datasetName} | ${leafName} | ${match.score} | ${method} |\n`;
  }
  
  if (matchedReport.matched.length > 500) {
    mdMatched += `\n*... and ${matchedReport.matched.length - 500} more matches (see JSON for full list)*\n`;
  }
  
  fs.writeFileSync(
    path.join(outputDir, 'datasets-matched-to-leaves.md'),
    mdMatched
  );
  
  // JSON report: remaining unmatched
  const remainingReport = {
    generatedAt: new Date().toISOString(),
    summary: {
      total: remaining.length,
      gaps: gapAnalysis
    },
    remaining: remaining.sort((a, b) => parseFloat(b.bestMatchScore) - parseFloat(a.bestMatchScore))
  };
  
  fs.writeFileSync(
    path.join(outputDir, 'datasets-remaining-unmatched.json'),
    JSON.stringify(remainingReport, null, 2)
  );
  
  // Markdown report: remaining + gap analysis
  let mdRemaining = `# Remaining Unmatched Datasets & Gap Analysis\n\n`;
  mdRemaining += `Generated: ${new Date().toISOString()}\n\n`;
  mdRemaining += `## Summary\n\n`;
  mdRemaining += `- **Total unmatched:** ${remaining.length}\n`;
  mdRemaining += `- **Top keyword themes:** ${gapAnalysis.topKeywords.slice(0, 5).map(k => k.keyword).join(', ')}\n\n`;
  
  mdRemaining += `## Top Data Owners with Unmatched Datasets\n\n`;
  mdRemaining += `| Owner | Count | Potential Sphere |\n`;
  mdRemaining += `|-------|-------|------------------|\n`;
  
  for (const owner of gapAnalysis.topOwners) {
    mdRemaining += `| ${owner.owner} | ${owner.count} | *See datasets below* |\n`;
  }
  
  mdRemaining += `\n## Top Emerging Keywords (Not in Current Leaves)\n\n`;
  mdRemaining += `| Keyword | Frequency |\n`;
  mdRemaining += `|---------|----------|\n`;
  for (const kw of gapAnalysis.topKeywords) {
    mdRemaining += `| ${kw.keyword} | ${kw.count} |\n`;
  }
  
  mdRemaining += `\n## Top Unmatched Datasets (by best match score to existing leaves)\n\n`;
  mdRemaining += `| Dataset | Best Match Leaf | Score |\n`;
  mdRemaining += `|---------|-----------------|-------|\n`;
  
  for (const item of remaining.slice(0, 100)) {
    const datasetName = item.dataset.title.replace(/\|/g, '\\|');
    const leafName = (item.bestLeafTitle || 'N/A').replace(/\|/g, '\\|');
    mdRemaining += `| ${datasetName} | ${leafName} | ${item.bestMatchScore} |\n`;
  }
  
  if (remaining.length > 100) {
    mdRemaining += `\n*... and ${remaining.length - 100} more unmatched datasets (see JSON for full list)*\n`;
  }
  
  fs.writeFileSync(
    path.join(outputDir, 'datasets-remaining-unmatched.md'),
    mdRemaining
  );
  
  console.log(`\n✓ Reports generated:`);
  console.log(`  - datasets-matched-to-leaves.json (${matches.length} matches)`);
  console.log(`  - datasets-matched-to-leaves.md`);
  console.log(`  - datasets-remaining-unmatched.json (${remaining.length} remaining)`);
  console.log(`  - datasets-remaining-unmatched.md`);
  console.log(`\nSummary: ${matches.length}/${unmatchedDatasets.length} datasets mapped to existing leaves`);
  console.log(`\nTop unmatched owner: ${gapAnalysis.topOwners[0]?.owner} (${gapAnalysis.topOwners[0]?.count} datasets)`);
  console.log(`Top emerging keyword: ${gapAnalysis.topKeywords[0]?.keyword} (${gapAnalysis.topKeywords[0]?.count} mentions)`);
}

// Run analysis
try {
  const analysis = analyzeDatasets();
  generateReports(analysis);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
