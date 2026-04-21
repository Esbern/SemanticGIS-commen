#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, "..")

const indexPaths = [
  path.join(repoRoot, "DanishData", "content", "assets", "sphere-index.v1.json"),
  path.join(repoRoot, "DanishData", "content", "assets", "sphere-index.v1 copy.json"),
]

const subsphereMap = new Map([
  ["socio_technical_ict", "socio_technical_ict_flows"],
  ["toposphere_imagery", "toposphere_imagery_evidence"],
  ["Topography", "toposphere_topography_bathymetry"],
  ["landuselancover_classified_products", "socio_technical_perception_thematics"],
  ["landuselancover_change_monitoring", "socio_technical_perception_thematics"],
  ["landuselancover_general_reference", "socio_technical_perception_thematics"],
])

const threadIdMap = new Map([
  ["economic-activities-to-lulc-classified-products", "economic-activities-to-perception-thematics"],
  ["business-locations-to-lulc-classified-products", "business-locations-to-perception-thematics"],
  ["orthoimagery-to-lulc-classified-products", "orthoimagery-to-perception-thematics"],
])

const requiredThreads = [
  {
    id: "economic-activities-to-perception-thematics",
    leaf: "economic-activities",
    twig: "socio_technical_perception_thematics",
    relation_type: "cross_twig_relevance",
    question: "How does economic activity connect to thematic spatial interpretation?",
    rationale:
      "Industry composition is frequently represented through interpreted thematic products used in planning and territorial analysis.",
  },
  {
    id: "business-locations-to-perception-thematics",
    leaf: "business-locations",
    twig: "socio_technical_perception_thematics",
    relation_type: "cross_twig_relevance",
    question: "How do business locations connect to thematic spatial interpretation?",
    rationale:
      "Business clustering contributes to interpreted thematic layers such as retail corridors, employment zones, and functional districts.",
  },
  {
    id: "orthoimagery-to-imagery-evidence",
    leaf: "orthoimagery",
    twig: "toposphere_imagery_evidence",
    relation_type: "cross_twig_relevance",
    question: "How does orthoimagery function as evidence?",
    rationale:
      "Orthoimagery provides direct observational evidence of surface state prior to thematic interpretation.",
  },
  {
    id: "orthoimagery-to-perception-thematics",
    leaf: "orthoimagery",
    twig: "socio_technical_perception_thematics",
    relation_type: "cross_twig_relevance",
    question: "How does orthoimagery connect to thematic interpretation products?",
    rationale:
      "Thematic products often result from interpreted classification workflows using orthoimagery as an input signal.",
  },
]

const replaceValue = (value) => {
  if (typeof value !== "string") {
    return value
  }
  return subsphereMap.get(value) ?? value
}

const replaceThreadId = (value) => {
  if (typeof value !== "string") {
    return value
  }
  return threadIdMap.get(value) ?? value
}

function dedupe(arr) {
  return [...new Set(arr)]
}

async function updateIndex(indexPath) {
  try {
    const raw = await fs.readFile(indexPath, "utf8")
    const data = JSON.parse(raw)

    data.version = "0.2.1"
    data.generated = new Date().toISOString().slice(0, 10)

    data.spheres = (data.spheres ?? [])
      .filter((sphere) => sphere.id !== "land-use-land-cover")
      .map((sphere) => {
        if (sphere.id === "socio-technical") {
          const mapped = (sphere.subspheres ?? []).map((entry) => replaceValue(entry))
          sphere.subspheres = dedupe([
            ...mapped,
            "socio_technical_perception_thematics",
            "socio_technical_informal_ephemeral",
          ])
          sphere.description =
            "Human-created systems: infrastructure, services, socioeconomic patterns, governance, ICT and flows, thematic perception, informal systems, risk"
        }

        if (sphere.id === "toposphere") {
          sphere.subspheres = dedupe((sphere.subspheres ?? []).map((entry) => replaceValue(entry)))
          sphere.description = "Terrain, bathymetry, surface properties, and imagery evidence"
        }

        sphere.subspheres = dedupe((sphere.subspheres ?? []).map((entry) => replaceValue(entry)))
        return sphere
      })

    data.leaves = (data.leaves ?? []).map((leaf) => {
      const next = { ...leaf }
      next.subsphere = replaceValue(next.subsphere)

      if (Array.isArray(next.tags)) {
        next.tags = dedupe(next.tags.map((entry) => replaceValue(entry)))
      }

      if (Array.isArray(next.twig_membership)) {
        next.twig_membership = dedupe(next.twig_membership.map((entry) => replaceValue(entry)))
      }

      if (Array.isArray(next.threads)) {
        next.threads = dedupe(next.threads.map((entry) => replaceThreadId(entry)))
      }

      if (next.id === "orthoimagery") {
        const existing = Array.isArray(next.threads) ? next.threads : []
        next.threads = dedupe([
          ...existing,
          "orthoimagery-to-imagery-evidence",
          "orthoimagery-to-perception-thematics",
        ])
      }

      return next
    })

    data.threads = (data.threads ?? []).map((thread) => {
      const next = { ...thread }
      next.id = replaceThreadId(next.id)
      next.twig = replaceValue(next.twig)
      if (typeof next.rationale === "string") {
        next.rationale = next.rationale.replaceAll("LandUseLandCover", "Perception and Thematics")
      }
      return next
    })

    const existingThreadIds = new Set(data.threads.map((thread) => thread.id))
    for (const thread of requiredThreads) {
      if (!existingThreadIds.has(thread.id)) {
        data.threads.push(thread)
      }
    }

    data.threads = dedupe(data.threads.map((thread) => JSON.stringify(thread))).map((rawThread) =>
      JSON.parse(rawThread),
    )

    await fs.writeFile(indexPath, `${JSON.stringify(data, null, 2)}\n`, "utf8")
    return true
  } catch {
    return false
  }
}

async function main() {
  let updated = 0
  for (const indexPath of indexPaths) {
    // eslint-disable-next-line no-await-in-loop
    const ok = await updateIndex(indexPath)
    if (ok) {
      updated += 1
      console.log(`Updated ${path.relative(repoRoot, indexPath)}`)
    }
  }
  if (updated === 0) {
    throw new Error("No sphere-index files were updated")
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
