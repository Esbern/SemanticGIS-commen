#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, "..")

const leavesDir = path.join(repoRoot, "DanishData", "content", "Leaves")
const ownerDir = path.join(repoRoot, "DanishData", "content", "Datasets by Owner")
const collectionDir = path.join(repoRoot, "DanishData", "content", "Datasets by Collection")
const outDir = path.join(repoRoot, "DanishData", "content", "assets", "lookup")

const outJson = path.join(outDir, "leaf-realisations-link-audit.v1.json")
const outMd = path.join(outDir, "leaf-realisations-link-audit.md")
const outUnmatchedJson = path.join(outDir, "datasets-unmatched-by-leaf.v1.json")
const outUnmatchedMd = path.join(outDir, "datasets-unmatched-by-leaf.md")

const args = new Set(process.argv.slice(2))
const apply = args.has("--apply")

function norm(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function compactNorm(value) {
  return norm(value).replace(/\s+/g, "")
}

function tokenSet(value) {
  return new Set(norm(value).split(" ").filter(Boolean))
}

function scoreMatch(realisation, candidateTitle) {
  const a = tokenSet(realisation)
  const b = tokenSet(candidateTitle)
  if (!a.size || !b.size) {
    return 0
  }

  let overlap = 0
  for (const token of a) {
    if (b.has(token)) {
      overlap += 1
    }
  }

  const precision = overlap / a.size
  const recall = overlap / b.size
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall)

  return f1
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walk(full)
    } else {
      yield full
    }
  }
}

async function loadDatasets() {
  const datasets = []

  // Owner datasets: every markdown except index pages
  for await (const filePath of walk(ownerDir)) {
    if (!filePath.endsWith(".md")) {
      continue
    }
    if (path.basename(filePath).toLowerCase() === "index.md") {
      continue
    }

    const text = await fs.readFile(filePath, "utf8")
    const parsed = matter(text)
    const title = parsed.data?.title || path.basename(filePath, ".md")
    datasets.push({
      group: "owner",
      title: String(title),
      relPath: path.relative(path.join(repoRoot, "DanishData", "content"), filePath).replace(/\\/g, "/"),
    })
  }

  // Collection datasets: collection index pages
  for await (const filePath of walk(collectionDir)) {
    if (!filePath.endsWith("index.md")) {
      continue
    }
    const text = await fs.readFile(filePath, "utf8")
    const parsed = matter(text)
    const title = parsed.data?.title || path.basename(path.dirname(filePath))
    datasets.push({
      group: "collection",
      title: String(title),
      relPath: path.relative(path.join(repoRoot, "DanishData", "content"), filePath).replace(/\\/g, "/"),
    })
  }

  return datasets
}

function resolveRealisation(realisation, datasetsByNorm, datasetsByCompactNorm, datasets) {
  const key = norm(realisation)
  if (!key) {
    return { matched: null, method: "empty" }
  }

  const exact = datasetsByNorm.get(key) || []
  if (exact.length === 1) {
    return { matched: exact[0], method: "exact" }
  }
  if (exact.length > 1) {
    const ownerFirst = [...exact].sort((a, b) => (a.group === "owner" ? -1 : 1) - (b.group === "owner" ? -1 : 1))
    return { matched: ownerFirst[0], method: "exact-ambiguous" }
  }

  const compactKey = compactNorm(realisation)
  const compactExact = datasetsByCompactNorm.get(compactKey) || []
  if (compactExact.length === 1) {
    return { matched: compactExact[0], method: "compact-exact" }
  }
  if (compactExact.length > 1) {
    const ownerFirst = [...compactExact].sort((a, b) => (a.group === "owner" ? -1 : 1) - (b.group === "owner" ? -1 : 1))
    return { matched: ownerFirst[0], method: "compact-exact-ambiguous" }
  }

  const candidates = []
  for (const ds of datasets) {
    const score = scoreMatch(realisation, ds.title)
    if (score >= 0.6) {
      candidates.push({ ds, score })
    }
  }

  candidates.sort((a, b) => b.score - a.score)
  if (candidates.length === 0) {
    return { matched: null, method: "none" }
  }

  const best = candidates[0]
  if (candidates.length === 1 || best.score - candidates[1].score >= 0.15) {
    return { matched: best.ds, method: "fuzzy" }
  }

  const ownerBest = candidates.find((c) => c.ds.group === "owner")
  if (ownerBest) {
    return { matched: ownerBest.ds, method: "fuzzy-ambiguous-owner" }
  }

  return { matched: best.ds, method: "fuzzy-ambiguous" }
}

function buildSection(matches, misses) {
  const lines = ["## Realised By Links", ""]

  if (matches.length === 0) {
    lines.push("No matched dataset links found from current `realisations` entries.")
  } else {
    for (const item of matches) {
      const label = item.dataset.title
      lines.push(`- [[${item.dataset.relPath}|${label}]] (${item.dataset.group})`)
    }
  }

  if (misses.length > 0) {
    lines.push("")
    lines.push("### Unmatched Realisations")
    lines.push("")
    for (const miss of misses) {
      lines.push(`- ${miss.realisation}`)
    }
  }

  lines.push("")
  return lines.join("\n")
}

function injectSection(content, section) {
  const heading = /^## Realised By Links[\s\S]*?(?=^##\s|^#\s|\Z)/m
  if (heading.test(content)) {
    return content.replace(heading, section)
  }

  const relatedHeading = /^## Related Leaves/m
  if (relatedHeading.test(content)) {
    return content.replace(relatedHeading, `${section}\n$&`)
  }

  const trimmed = content.replace(/\s+$/, "")
  return `${trimmed}\n\n${section}`
}

function makeReportMarkdown(audit, datasetSummary) {
  const lines = []
  lines.push("# Leaf Realisations Link Audit")
  lines.push("")
  lines.push(`Generated: ${new Date().toISOString()}`)
  lines.push("")
  lines.push("## Summary")
  lines.push("")
  lines.push(`- Leaves scanned: ${audit.leaves.length}`)
  lines.push(`- Realisations scanned: ${audit.totalRealisations}`)
  lines.push(`- Realisations matched: ${audit.totalMatched}`)
  lines.push(`- Realisations unmatched: ${audit.totalUnmatched}`)
  lines.push("")
  lines.push("## Leaf-by-Leaf")
  lines.push("")

  for (const leaf of audit.leaves) {
    lines.push(`### ${leaf.title} (${leaf.slug})`)
    lines.push("")
    lines.push(`- Matched: ${leaf.matched.length}`)
    lines.push(`- Unmatched: ${leaf.unmatched.length}`)
    if (leaf.unmatched.length > 0) {
      lines.push(`- Missing: ${leaf.unmatched.map((item) => item.realisation).join(", ")}`)
    }
    lines.push("")
  }

  lines.push("## Dataset Coverage Summary")
  lines.push("")
  lines.push(`- Datasets in owner+collection groups: ${datasetSummary.total}`)
  lines.push(`- Datasets matched by >=1 leaf: ${datasetSummary.matched}`)
  lines.push(`- Datasets unmatched by leaves: ${datasetSummary.unmatched}`)
  lines.push("")

  return lines.join("\n") + "\n"
}

async function main() {
  const datasets = await loadDatasets()
  const datasetsByNorm = new Map()
  const datasetsByCompactNorm = new Map()

  for (const ds of datasets) {
    const key = norm(ds.title)
    if (!datasetsByNorm.has(key)) {
      datasetsByNorm.set(key, [])
    }
    datasetsByNorm.get(key).push(ds)

    const compactKey = compactNorm(ds.title)
    if (!datasetsByCompactNorm.has(compactKey)) {
      datasetsByCompactNorm.set(compactKey, [])
    }
    datasetsByCompactNorm.get(compactKey).push(ds)
  }

  const leafFiles = []
  for await (const filePath of walk(leavesDir)) {
    if (!filePath.endsWith(".md")) {
      continue
    }
    if (path.basename(filePath).toLowerCase() === "index.md") {
      continue
    }
    leafFiles.push(filePath)
  }

  const audit = {
    generatedAt: new Date().toISOString(),
    totalRealisations: 0,
    totalMatched: 0,
    totalUnmatched: 0,
    leaves: [],
  }

  const matchedDatasetPaths = new Set()

  for (const filePath of leafFiles.sort()) {
    const raw = await fs.readFile(filePath, "utf8")
    const parsed = matter(raw)
    const rels = Array.isArray(parsed.data?.realisations) ? parsed.data.realisations : []

    const matched = []
    const unmatched = []

    for (const value of rels) {
      const realisation = String(value).trim()
      if (!realisation) {
        continue
      }
      audit.totalRealisations += 1
      const resolved = resolveRealisation(realisation, datasetsByNorm, datasetsByCompactNorm, datasets)
      if (resolved.matched) {
        matched.push({ realisation, dataset: resolved.matched, method: resolved.method })
        matchedDatasetPaths.add(resolved.matched.relPath)
        audit.totalMatched += 1
      } else {
        unmatched.push({ realisation, method: resolved.method })
        audit.totalUnmatched += 1
      }
    }

    const leafEntry = {
      slug: path.basename(filePath, ".md"),
      title: String(parsed.data?.title || path.basename(filePath, ".md")),
      path: path.relative(path.join(repoRoot, "DanishData", "content"), filePath).replace(/\\/g, "/"),
      matched,
      unmatched,
    }

    audit.leaves.push(leafEntry)

    if (apply) {
      const section = buildSection(matched, unmatched)
      const nextContent = injectSection(parsed.content, section)
      const out = matter.stringify(nextContent, parsed.data)
      await fs.writeFile(filePath, out, "utf8")
    }
  }

  const unmatchedDatasets = datasets.filter((ds) => !matchedDatasetPaths.has(ds.relPath))
  const datasetSummary = {
    total: datasets.length,
    matched: datasets.length - unmatchedDatasets.length,
    unmatched: unmatchedDatasets.length,
  }

  const unmatchedPayload = {
    generatedAt: new Date().toISOString(),
    summary: datasetSummary,
    unmatched: unmatchedDatasets,
  }

  await fs.mkdir(outDir, { recursive: true })
  await fs.writeFile(outJson, JSON.stringify(audit, null, 2) + "\n", "utf8")
  await fs.writeFile(outUnmatchedJson, JSON.stringify(unmatchedPayload, null, 2) + "\n", "utf8")
  await fs.writeFile(outMd, makeReportMarkdown(audit, datasetSummary), "utf8")

  const unmatchedLines = [
    "# Datasets Unmatched By Leaves",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    `- Total datasets: ${datasetSummary.total}`,
    `- Unmatched datasets: ${datasetSummary.unmatched}`,
    "",
    "| Group | Title | Path |",
    "| --- | --- | --- |",
  ]

  for (const row of unmatchedDatasets.slice(0, 1000)) {
    unmatchedLines.push(`| ${row.group} | ${row.title.replace(/\|/g, "\\|")} | ${row.relPath} |`)
  }

  await fs.writeFile(outUnmatchedMd, unmatchedLines.join("\n") + "\n", "utf8")

  console.log(
    `Leaf realisation reconciliation complete | leaves=${audit.leaves.length} realisations=${audit.totalRealisations} matched=${audit.totalMatched} unmatched=${audit.totalUnmatched} datasets_unmatched=${datasetSummary.unmatched} apply=${apply}`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
