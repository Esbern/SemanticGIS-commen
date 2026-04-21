#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const repoRoot = path.resolve(__dirname, "..")
const contentRoot = path.join(repoRoot, "DanishData", "content")
const leavesDir = path.join(contentRoot, "Leaves")
const indexPath = path.join(contentRoot, "assets", "sphere-index.v1.json")

const FIELDS_TO_BACKFILL = [
  "primary_collection",
  "primary_collection_path",
  "entities",
  "key_attributes",
  "services",
]

function isArray(value) {
  return Array.isArray(value)
}

function isObject(value) {
  return value != null && typeof value === "object" && !Array.isArray(value)
}

function shouldBackfill(currentValue, fieldName) {
  if (currentValue == null) {
    return true
  }

  if ((fieldName === "entities" || fieldName === "key_attributes") && !isArray(currentValue)) {
    return true
  }

  if (fieldName === "services" && !isObject(currentValue)) {
    return true
  }

  return false
}

async function main() {
  const rawIndex = await fs.readFile(indexPath, "utf8")
  const index = JSON.parse(rawIndex)
  const indexLeaves = new Map(index.leaves.map((leaf) => [leaf.id, leaf]))

  const entries = await fs.readdir(leavesDir, { withFileTypes: true })
  const leafFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && entry.name !== "index.md")
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))

  let changedCount = 0

  for (const fileName of leafFiles) {
    const filePath = path.join(leavesDir, fileName)
    const leafId = path.basename(fileName, ".md")
    const sourceLeaf = indexLeaves.get(leafId)

    if (!sourceLeaf) {
      continue
    }

    const raw = await fs.readFile(filePath, "utf8")
    const parsed = matter(raw)
    const data = { ...parsed.data }

    if (data.type !== "leaf") {
      continue
    }

    let changed = false

    for (const fieldName of FIELDS_TO_BACKFILL) {
      const sourceValue = sourceLeaf[fieldName]
      if (sourceValue == null) {
        continue
      }

      if (shouldBackfill(data[fieldName], fieldName)) {
        data[fieldName] = sourceValue
        changed = true
      }
    }

    if (!changed) {
      continue
    }

    const next = matter.stringify(parsed.content, data)
    await fs.writeFile(filePath, next, "utf8")
    changedCount += 1
  }

  console.log(`Backfilled frontmatter fields in ${changedCount} leaf notes`)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
