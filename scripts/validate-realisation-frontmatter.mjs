#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import matter from "gray-matter"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const repoRoot = path.resolve(__dirname, "..", "..")
const contentRoot = path.join(repoRoot, "dk", "content")
const realisationsDir = path.join(contentRoot, "Realisations")

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : ""
}

function expectStringField(data, fieldName, errors, { optional = false } = {}) {
  if (!hasOwn(data, fieldName)) {
    if (!optional) {
      errors.push(`Missing required field: ${fieldName}`)
    }
    return null
  }

  const value = normalizeString(data[fieldName])
  if (!optional && value === "") {
    errors.push(`Field must be a non-empty string: ${fieldName}`)
    return null
  }

  if (optional && value === "") {
    errors.push(`Optional field must be a non-empty string when present: ${fieldName}`)
    return null
  }

  return value
}

function expectStringArrayField(data, fieldName, errors, { minItems = 0 } = {}) {
  if (!hasOwn(data, fieldName)) {
    if (minItems === 0) return []
    errors.push(`Missing required field: ${fieldName}`)
    return null
  }

  const raw = data[fieldName]
  if (!Array.isArray(raw)) {
    errors.push(`Field must be an array: ${fieldName}`)
    return null
  }

  const normalized = raw
    .filter((item) => item != null)
    .map((item) => String(item).trim())
    .filter((item) => item.length > 0)

  if (normalized.length < minItems) {
    errors.push(`Field must contain at least ${minItems} item(s): ${fieldName}`)
  }

  if (normalized.length !== raw.length) {
    errors.push(`Field contains empty or null entries: ${fieldName}`)
  }

  return normalized
}

function validateRealisationFrontmatter(data, filePath) {
  const errors = []
  const normalizedType = normalizeString(data.type)
  if (normalizedType !== "realisation") {
    errors.push(`Field must be string 'realisation': type`)
  }

  const title = expectStringField(data, "title", errors)
  const leaf = expectStringField(data, "leaf", errors)
  const dataset = expectStringField(data, "dataset", errors)
  const tags = expectStringArrayField(data, "tags", errors)

  if (errors.length > 0) {
    const relPath = path.relative(repoRoot, filePath)
    return {
      ok: false,
      relPath,
      errors,
    }
  }

  return {
    ok: true,
    value: {
      title,
      leaf,
      dataset,
      tags,
    },
  }
}

export async function validateRealisationFrontmatterStrict(options = {}) {
  const targetRealisationsDir = options.realisationsDir ?? realisationsDir
  
  let dirEntries = []
  try {
    dirEntries = await fs.readdir(targetRealisationsDir, { withFileTypes: true })
  } catch (err) {
    if (err.code === "ENOENT") {
      return { validatedRealisations: [] }
    }
    throw err
  }

  const realPaths = dirEntries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && entry.name !== "index.md")
    .map((entry) => path.join(targetRealisationsDir, entry.name))
    .sort((left, right) => left.localeCompare(right))

  const validatedRealisations = []
  const problems = []

  for (const filePath of realPaths) {
    const raw = await fs.readFile(filePath, "utf8")
    const { data } = matter(raw)
    const result = validateRealisationFrontmatter(data, filePath)

    if (!result.ok) {
      problems.push(result)
      continue
    }

    validatedRealisations.push({
      filePath,
      realisationId: path.basename(filePath, ".md"),
      data: result.value,
    })
  }

  if (problems.length > 0) {
    const lines = [
      `Realisation frontmatter validation failed in ${problems.length} file(s):`,
      ...problems.flatMap((problem) => [
        `- ${problem.relPath}`,
        ...problem.errors.map((entry) => `  - ${entry}`),
      ]),
    ]

    throw new Error(lines.join("\n"))
  }

  return { validatedRealisations }
}

async function main() {
  const { validatedRealisations } = await validateRealisationFrontmatterStrict()
  console.log(`Realisation frontmatter is valid in ${validatedRealisations.length} files`) 
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
