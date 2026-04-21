#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, "..")

const leavesDir = path.join(repoRoot, "DanishData", "content", "Leaves")
const miljoeportalDatasetsPath = path.join(repoRoot, "data", "miljoeportal_datasets.json")
const miljoeportalCollectionsPath = path.join(repoRoot, "data", "miljoeportal_dataset_collections.json")
const cswPath = path.join(repoRoot, "data", "csw_full.xml")
const outJsonPath = path.join(
  repoRoot,
  "DanishData",
  "content",
  "assets",
  "lookup",
  "dataset-leaf-coverage.v1.json",
)
const outMarkdownPath = path.join(
  repoRoot,
  "DanishData",
  "content",
  "assets",
  "lookup",
  "dataset-leaf-coverage-report.md",
)

const leafKeywordProfiles = {
  addresses: ["adresse", "adgangsadresse", "vejnavn", "husnummer", "address"],
  buildings: ["bygning", "bygninger", "building", "bbr", "bygnings"],
  "administrative-units": ["kommune", "region", "administrativ", "administrative unit"],
  "cadastral-parcels": ["matrikel", "parcel", "jordstykke", "cadastral"],
  "geographical-names": ["stednavn", "place name", "toponym", "navn"],
  elevation: [
    "elevation",
    "terrain",
    "terræn",
    "terraen",
    "terrænmodel",
    "terraenmodel",
    "terrain model",
    "overflade",
    "overflademodel",
    "surface model",
    "punktsky",
    "point cloud",
    "lidar",
    "hojde",
    "højde",
    "højdekurver",
    "hojdekurver",
    "kontur",
    "skyggekort",
    "quick dhm",
    "quickdhm",
    "oprindelse",
    "danmarks hojdemodel",
    "danmarks højdemodel",
    "dhm",
    "dybdekort",
    "depth",
  ],
  orthoimagery: ["ortho", "orto", "imagery", "orthophoto", "ortofoto", "satellite", "aerial", "sentinel"],
  population: ["befolkning", "population", "demografi", "demography", "cpr"],
  "transport-networks": ["vej", "road", "rail", "bane", "transport", "trafik", "network"],
  services: ["service", "amenity", "hospital", "school", "utility", "governmental services"],
  "freshwater-bodies": [
    "vandløb",
    "vandlob",
    "sø",
    "soe",
    "søer",
    "soer",
    "ferskvand",
    "wetland",
    "vådområde",
    "vadomrade",
    "vandopland",
    "hovedvandopland",
    "kystvandopland",
    "afvandingsgrøft",
    "afvandingsgroft",
    "stream",
    "lake",
    "catchment",
  ],
  "flood-hazard-inundation": [
    "havvand pa land",
    "havvand på land",
    "stormflod",
    "oversvoemmelse",
    "oversvømmelse",
    "floodareas",
    "flood area",
    "flood risk zone",
    "floodriskzone",
    "flooded areas",
    "pfra",
    "apsfr",
    "oversvoemmelsesdirektivet",
    "oversvømmelsesdirektivet",
    "gummistovleindeks",
    "gummistøvleindeks",
    "inundation",
    "flood hazard",
  ],
  "groundwater-bodies": [
    "grundvand",
    "grundvands",
    "aquifer",
    "drikkevand",
    "terrænnær",
    "terraennaer",
    "regionale forekomster",
    "dybe forekomster",
    "groundwater",
    "bnbo",
  ],
  "groundwater-chemistry": [
    "grundvandsforekomster",
    "kemisk tilstand",
    "trends",
    "aluminium",
    "arsen",
    "bly",
    "nitrat",
    "klorid",
    "btexn",
    "dybe",
    "regionale",
    "terrænnære",
    "terraennaere",
    "groundwater chemistry",
  ],
  "marine-waters": [
    "kystvand",
    "kystvande",
    "marin",
    "marine",
    "hav",
    "fjord",
    "ålegræs",
    "alegraes",
    "shellfish",
    "skaldyr",
    "coastal water",
    "sea",
  ],
  "aquaculture-sites": [
    "akvakultur",
    "akvakulturanlaeg",
    "fiskeopdraet",
    "skaldyrsopdraet",
    "udledning",
    "indlob",
    "udlob",
    "fish farm",
    "shellfish",
    "aquaculture",
  ],
  "fisheries-intensity": [
    "ais",
    "fiskeri",
    "fiskeriintensitet",
    "redskaber",
    "garn",
    "pelagiske",
    "passive redskaber",
    "bundtrawl",
    "bomtrawl",
    "bundsnurrevod",
    "havplan",
    "fishing effort",
    "fisheries",
  ],
  "planning-zoning-decisions": [
    "fingerplan",
    "landzone",
    "landzonetilladelser",
    "byggefelt",
    "transportkorridorer",
    "kiler",
    "planloven",
    "landsplandirektiv",
    "zoning",
  ],
  "coastal-erosion-risk": [
    "erosion",
    "akut erosion",
    "kyst",
    "kystnaerhed",
    "kystnærhed",
    "kystbeskyttelse",
    "shoreline",
    "coastal",
  ],
  "hydrological-basin-delineations": [
    "hovedvandoplande",
    "kystvandoplande",
    "vandoplande",
    "deloplande",
    "vandomraadedistrikter",
    "vandomraadeplaner",
    "basin",
    "catchment",
  ],
  "surface-flow-systems": [
    "bluespot",
    "lavninger",
    "oversvoemmelse",
    "oversvommelse",
    "oversvømmelse",
    "ekstremregn",
    "flow ekstremregn",
    "hovedvandoplande",
    "kystvandoplande",
    "catchment",
    "runoff",
    "surface flow",
  ],
  "biodiversity-priority-indicators": [
    "biodiversitetskortet",
    "antal truede arter",
    "national prioritering",
    "naturtaethed",
    "naturtæthed",
    "kvaelstofdeposition",
    "kvælstofdeposition",
    "linjetaethed",
    "linjetæthed",
    "kystnaerhed",
    "kystnærhed",
    "biodiversity",
  ],
  "species-conservation-concern": [
    "bilagsarter",
    "habitatdirektiv",
    "iba",
    "internationalt vigtige fugleomraader",
    "internationalt vigtige fugleområder",
    "flagermus",
    "baeklampret",
    "bæklampret",
    "conservation species",
  ],
  "marine-spatial-infrastructure": [
    "soeterritoriet",
    "søterritoriet",
    "anlaeg paa soeterritoriet",
    "anlæg på søterritoriet",
    "dumpet ammunition",
    "havplan",
    "maritim fysisk planlaegning",
    "maritim fysisk planlægning",
    "marine infrastructure",
  ],
  "nautical-traffic": [
    "skibstrafik",
    "hovedhavne",
    "sejlrender",
    "søtransport",
    "soetransport",
    "vessel",
    "shipping",
    "maritime traffic",
    "harbor traffic",
  ],
  "energy-infrastructure": [
    "vindmolle",
    "vindmølle",
    "havvind",
    "solcelleanlaeg",
    "solcelleanlæg",
    "store solcelleanlaeg",
    "store solcelleanlæg",
    "solenergianlaeg",
    "solenergianlæg",
    "solfangeranlaeg",
    "solfangeranlæg",
    "solenergi",
    "pv",
    "solar",
    "el kabel",
    "kabel-trace",
    "luftlednings-trace",
    "opmaerksomhedszone",
    "opmærksomhedszone",
    "gastransmission",
    "olie- og gasroerledninger",
    "olie- og gasrørledninger",
    "energinet",
    "energy infrastructure",
  ],
  "spill-pollution-incidents": [
    "dumpet ammunition",
    "jordforurening",
    "forurening",
    "spild",
    "udledning",
    "blandingszoner",
    "hazard",
    "contamination",
    "pollution",
  ],
  "atmospheric-deposition-emissions": [
    "deposition",
    "emission",
    "nhx",
    "noy",
    "nox",
    "nh3",
    "so2",
    "pm10",
    "pm2.5",
    "svovl",
    "luft",
    "atmospheric",
  ],
  "protected-water-use-zones": [
    "nitratfoelsomme indvindingsomraader",
    "nitratfølsomme indvindingsområder",
    "skaldyrvande",
    "drikkevandsforekomster",
    "bnbo",
    "boringsnaere beskyttelsesomraader",
    "boringsnære beskyttelsesområder",
    "beskyttede omraader",
    "beskyttede områder",
    "protected water",
  ],
  "subsurface-freshwater": [
    "boringer",
    "jupiter",
    "drikkevandets hardhed",
    "drikkevandets hårdhed",
    "feltmaaling grundvand",
    "feltmåling grundvand",
    "grundvand",
    "aquifer",
    "subsurface",
  ],
  "geological-strata": [
    "danmarks undergrund",
    "stratigrafi",
    "stratigraphy",
    "geologisk",
    "geologi",
    "lithologi",
    "litologi",
    "forkastninger",
    "prae-kvartaer",
    "præ-kvartær",
    "kvartaer",
    "kvartær",
  ],
  "nature-protection-areas": [
    "naturbeskyttelse",
    "beskyttede naturtyper",
    "beskyttede vandløb",
    "aabeskyttelseslinjer",
    "åbeskyttelseslinjer",
    "2-metersbræmme",
    "3-metersbræmme",
    "beskyttede sten- og jorddiger",
    "invasive arter",
    "bekendtgørelsesfredninger",
    "naturbeskyttelsesloven",
    "protection area",
  ],
  "land-use-agriculture": [
    "arealanvendelse",
    "landbrug",
    "landbrugsarealer",
    "markudledningskort",
    "oekologiske marker",
    "økologiske marker",
    "markblok",
    "dyrkningspraksis",
    "udledningsklasse",
    "dyrkede marker",
    "oekologisk jordbrug",
    "økologisk jordbrug",
    "agriculture",
    "land use",
  ],
  "soil-properties": [
    "jordbund",
    "jordbundstyper",
    "jordartskort",
    "jordtype",
    "jb1",
    "jb2",
    "jb3",
    "jordlag",
    "redoxgraense",
    "redoxgrænse",
    "soil",
    "pedology",
  ],
  "species-observations": [
    "arter.dk",
    "arter dk",
    "arter resultat",
    "artsfund",
    "naturdatabasen",
    "darwin core",
    "habitatdirektivets bilag iv",
    "bilagsarter",
    "fund",
    "observation",
    "observationer",
    "species",
    "taxon",
    "biodiversitet",
    "occurrence",
    "historiske",
  ],
  "habitat-extent": [
    "kortlaegning af naturtyper",
    "kortlagt natur",
    "habitatomraader",
    "habitatområder",
    "levesteder",
    "naturtyper",
    "bentiske habitater",
    "euseamap",
    "extent",
  ],
  "habitat-condition": [
    "naturtilstand",
    "habitatnatur",
    "bioscore",
    "artsscore",
    "hnv",
    "high nature value",
    "naturvaerdi",
    "naturværdi",
    "skov arter",
    "skov proxy",
    "proxyer",
    "kategori 1 natur",
    "kategori 1 heder",
    "kategori 1 - heder og overdrev",
    "kategori 1 – heder og overdrev",
    "kategori 2 heder",
    "kategori 2 - heder og overdrev",
    "kategori 2 lobeliesøer",
    "kategori 2 lobeliesoeer",
    "kategori 2 - lobeliesøer og højmoser",
    "kategori 2 - lobeliesoeer og hoejmoser",
    "kategori 3 natur",
    "kategori 3 heder",
    "kategori 3 - heder - moser og overdrev",
    "kategori 3 heder, moser og overdrev",
    "ammoniakfølsom skov",
    "ammoniakfoelsom skov",
    "ammoniakfølsomme skove",
    "ammoniakfoelsomme skove",
    "gammel skovjordbund",
    "særlig værdifuld skov",
    "saerlig vaerdifuld skov",
    "25-skov",
    "tilgroet lysåben",
    "tilgroet lysaaben",
    "faunaklasse",
    "kvaelstofdeposition",
    "tilstand",
    "ecological quality",
    "condition",
  ],
  "bathing-water-quality": ["badevand", "bathing", "water quality", "badevands", "kontrolstation"],
  firms: ["virksomhed", "company", "firm", "cvr", "enterprise"],
  "economic-activities": ["economic", "branch", "branche", "industry", "aktivitet", "employment"],
  "business-locations": ["production unit", "produktionsenhed", "business location", "retail", "shop", "office", "industrial site"],
  "corporate-ownership": ["ownership", "ejer", "governance", "board", "holding", "ultimate owner"],
  "business-financials": ["financial", "revenue", "regnskab", "employment", "employees", "økonomi"],
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
}

function unique(values) {
  return [...new Set(values)]
}

function buildLexicalForms(value) {
  const normalized = normalizeText(value)
  const tokens = normalized.split(/[^\p{L}\p{N}]+/u).filter(Boolean)
  return {
    normalized,
    tokenSet: new Set(tokens),
  }
}

function matchesKeyword(forms, keyword) {
  const normalizedKeyword = normalizeText(keyword)
  if (normalizedKeyword.includes(" ")) {
    return forms.normalized.includes(normalizedKeyword)
  }

  return forms.tokenSet.has(normalizedKeyword)
}

async function loadLeaves() {
  const entries = await fs.readdir(leavesDir, { withFileTypes: true })
  const leaves = []

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md") || entry.name === "index.md") {
      continue
    }

    const filePath = path.join(leavesDir, entry.name)
    const raw = await fs.readFile(filePath, "utf8")
    const { data } = matter(raw)
    const leafId = path.basename(entry.name, ".md")
    leaves.push({
      id: leafId,
      title: data.title ?? leafId,
      question: data.question ?? "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      realisations: Array.isArray(data.realisations) ? data.realisations : [],
      sphere: data.sphere ?? null,
      subsphere: data.subsphere ?? null,
    })
  }

  return leaves.sort((left, right) => left.id.localeCompare(right.id))
}

function scoreLeaf(record, leaf) {
  const profile = leafKeywordProfiles[leaf.id] ?? []
  if (profile.length === 0) {
    return 0
  }

  const title = buildLexicalForms(record.title)
  const description = buildLexicalForms(record.description)
  const subjects = buildLexicalForms((record.subjects ?? []).join(" "))
  const identifiers = buildLexicalForms([record.id, ...(record.tags ?? []), record.category ?? ""].join(" "))
  const leafTitle = buildLexicalForms(leaf.title)

  let score = 0
  for (const keyword of profile) {
    if (matchesKeyword(title, keyword)) {
      score += 5
    }
    if (matchesKeyword(subjects, keyword)) {
      score += 3
    }
    if (matchesKeyword(identifiers, keyword)) {
      score += 2
    }
    if (matchesKeyword(description, keyword)) {
      score += 1
    }
  }

  if (record.title && title.normalized.includes(leafTitle.normalized)) {
    score += 4
  }

  return score
}

function suggestLeaves(record, leaves) {
  const ranked = leaves
    .map((leaf) => ({
      leafId: leaf.id,
      score: scoreLeaf(record, leaf),
    }))
    .filter((entry) => entry.score >= 3)
    .sort((left, right) => right.score - left.score || left.leafId.localeCompare(right.leafId))

  return ranked.slice(0, 3)
}

async function loadMiljoeportalDatasets() {
  const raw = await fs.readFile(miljoeportalDatasetsPath, "utf8")
  const parsed = JSON.parse(raw)
  return (parsed.data ?? []).map((entry) => ({
    source: "miljoeportal_dataset",
    id: entry.id,
    title: entry.attributes?.title ?? entry.id,
    description: entry.attributes?.description ?? "",
    metadata: entry.attributes?.metadata ?? null,
    subjects: [],
    tags: (entry.relationships?.tags?.data ?? []).map((tag) => tag.id),
    category: entry.relationships?.category?.data?.id ?? null,
  }))
}

async function loadMiljoeportalCollections() {
  const raw = await fs.readFile(miljoeportalCollectionsPath, "utf8")
  const parsed = JSON.parse(raw)
  return (parsed.data ?? []).map((entry) => ({
    source: "miljoeportal_collection",
    id: entry.id,
    title: entry.attributes?.title ?? entry.id,
    description: entry.attributes?.description ?? "",
    metadata: null,
    subjects: [],
    tags: [],
    category: null,
    member_count: (entry.relationships?.datasetCollectionItems?.data ?? []).length,
  }))
}

function extractAll(block, tagName) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, "g")
  const results = []
  for (const match of block.matchAll(regex)) {
    results.push(
      match[1]
        .replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .trim(),
    )
  }
  return results.filter(Boolean)
}

function extractFirst(block, tagName) {
  return extractAll(block, tagName)[0] ?? ""
}

async function loadCswRecords() {
  const raw = await fs.readFile(cswPath, "utf8")
  const records = []
  const recordRegex = /<csw:Record>([\s\S]*?)<\/csw:Record>/g

  for (const match of raw.matchAll(recordRegex)) {
    const block = match[1]
    const type = extractFirst(block, "dc:type")
    if (type && type !== "dataset") {
      continue
    }

    records.push({
      source: "csw_dataset",
      id: extractFirst(block, "dc:identifier"),
      title: extractFirst(block, "dc:title"),
      description: extractFirst(block, "dct:abstract") || extractFirst(block, "dc:description"),
      metadata: null,
      subjects: unique(extractAll(block, "dc:subject")),
      tags: [],
      category: null,
    })
  }

  return records
}

function buildMarkdownReport(summary, leafCounts, unmatched, examples) {
  const lines = [
    "# Dataset-to-Leaf Coverage Audit",
    "",
    `Generated: ${summary.generated}`,
    "",
    "## Coverage Summary",
    "",
    `- Total records audited: ${summary.total_records}`,
    `- Records with at least one suggested leaf: ${summary.matched_records}`,
    `- Records without a suggested leaf: ${summary.unmatched_records}`,
    `- Coverage ratio: ${summary.coverage_ratio}`,
    "",
    "## Leaf Suggestion Counts",
    "",
    "| Leaf | Suggested records |",
    "| --- | ---: |",
    ...leafCounts.map((entry) => `| ${entry.leafId} | ${entry.count} |`),
    "",
    "## Unmatched Sample",
    "",
    "| Source | Id | Title |",
    "| --- | --- | --- |",
    ...unmatched.slice(0, 30).map((entry) => `| ${entry.source} | ${entry.id} | ${entry.title.replace(/\|/g, "/")} |`),
    "",
    "## Example Suggestions",
    "",
    "| Source | Title | Suggested leaves |",
    "| --- | --- | --- |",
    ...examples.map(
      (entry) =>
        `| ${entry.source} | ${entry.title.replace(/\|/g, "/")} | ${entry.suggestions
          .map((suggestion) => `${suggestion.leafId} (${suggestion.score})`)
          .join(", ")} |`,
    ),
    "",
    "## Notes",
    "",
    "- This is a first-pass lexical audit, not a final semantic classifier.",
    "- Multiple datasets may validly map to the same leaf.",
    "- Low-confidence and unmatched records should drive new leaves or richer keyword profiles.",
    "",
  ]

  return `${lines.join("\n")}\n`
}

async function main() {
  const leaves = await loadLeaves()
  const [miljoeportalDatasets, miljoeportalCollections, cswDatasets] = await Promise.all([
    loadMiljoeportalDatasets(),
    loadMiljoeportalCollections(),
    loadCswRecords(),
  ])

  const records = [...miljoeportalDatasets, ...miljoeportalCollections, ...cswDatasets]
  const audited = records.map((record) => ({
    ...record,
    suggestions: suggestLeaves(record, leaves),
  }))

  const matched = audited.filter((entry) => entry.suggestions.length > 0)
  const unmatched = audited.filter((entry) => entry.suggestions.length === 0)

  const leafCountMap = new Map()
  for (const entry of matched) {
    for (const suggestion of entry.suggestions) {
      leafCountMap.set(suggestion.leafId, (leafCountMap.get(suggestion.leafId) ?? 0) + 1)
    }
  }

  const leafCounts = [...leafCountMap.entries()]
    .map(([leafId, count]) => ({ leafId, count }))
    .sort((left, right) => right.count - left.count || left.leafId.localeCompare(right.leafId))

  const summary = {
    generated: new Date().toISOString(),
    total_records: audited.length,
    matched_records: matched.length,
    unmatched_records: unmatched.length,
    coverage_ratio: `${((matched.length / Math.max(audited.length, 1)) * 100).toFixed(1)}%`,
    source_breakdown: {
      miljoeportal_dataset: miljoeportalDatasets.length,
      miljoeportal_collection: miljoeportalCollections.length,
      csw_dataset: cswDatasets.length,
    },
  }

  const output = {
    summary,
    leaf_counts: leafCounts,
    records: audited,
  }

  await fs.writeFile(outJsonPath, `${JSON.stringify(output, null, 2)}\n`, "utf8")
  await fs.writeFile(
    outMarkdownPath,
    buildMarkdownReport(summary, leafCounts, unmatched, matched.slice(0, 40)),
    "utf8",
  )

  console.log(`Audited ${audited.length} records`)
  console.log(`Matched ${matched.length} records to at least one leaf`)
  console.log(`Wrote ${path.relative(repoRoot, outJsonPath)}`)
  console.log(`Wrote ${path.relative(repoRoot, outMarkdownPath)}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
