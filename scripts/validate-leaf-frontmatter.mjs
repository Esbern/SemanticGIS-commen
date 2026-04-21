#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import matter from "gray-matter"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const repoRoot = path.resolve(__dirname, "..")
const contentRoot = path.join(repoRoot, "DanishData", "content")
const leavesDir = path.join(contentRoot, "Leaves")

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

function expectObjectField(data, fieldName, errors) {
  if (!hasOwn(data, fieldName)) {
    errors.push(`Missing required field: ${fieldName}`)
    return null
  }

  const value = data[fieldName]
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    errors.push(`Field must be an object: ${fieldName}`)
    return null
  }

  return value
}

function validateLeafFrontmatter(data, filePath) {
  const errors = []
  const normalizedType = normalizeString(data.type)
  if (normalizedType !== "leaf") {
    errors.push(`Field must be string 'leaf': type`)
  }

  const title = expectStringField(data, "title", errors)
  const sphere = expectStringField(data, "sphere", errors)
  const subsphere = expectStringField(data, "subsphere", errors)
  const question = expectStringField(data, "question", errors)
  const primaryCollection = expectStringField(data, "primary_collection", errors)
  const primaryCollectionPath = expectStringField(data, "primary_collection_path", errors, {
    optional: true,
  })

  const realisations = expectStringArrayField(data, "realisations", errors, { minItems: 1 })
  const threads = expectStringArrayField(data, "threads", errors)
  const tags = expectStringArrayField(data, "tags", errors)
  const entities = expectStringArrayField(data, "entities", errors, { minItems: 1 })
  const keyAttributes = expectStringArrayField(data, "key_attributes", errors, { minItems: 1 })

  const twigMembership = hasOwn(data, "twig_membership")
    ? expectStringArrayField(data, "twig_membership", errors)
    : undefined

  const primaryLens = hasOwn(data, "primary_lens")
    ? expectStringField(data, "primary_lens", errors, { optional: true })
    : undefined

  const flowMode = hasOwn(data, "flow_mode")
    ? expectStringField(data, "flow_mode", errors, { optional: true })
    : undefined

  const temporalMmu = hasOwn(data, "temporal_mmu")
    ? expectStringField(data, "temporal_mmu", errors, { optional: true })
    : undefined

  const services = expectObjectField(data, "services", errors)

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
      sphere,
      subsphere,
      question,
      primary_collection: primaryCollection,
      primary_collection_path: primaryCollectionPath ?? undefined,
      realisations,
      threads,
      tags,
      entities,
      key_attributes: keyAttributes,
      services,
      twig_membership: twigMembership,
      primary_lens: primaryLens,
      flow_mode: flowMode,
      temporal_mmu: temporalMmu,
    },
  }
}

export async function validateLeafFrontmatterStrict(options = {}) {
  const targetLeavesDir = options.leavesDir ?? leavesDir
  const dirEntries = await fs.readdir(targetLeavesDir, { withFileTypes: true })
  const leafPaths = dirEntries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && entry.name !== "index.md")
    .map((entry) => path.join(targetLeavesDir, entry.name))
    .sort((left, right) => left.localeCompare(right))

  const validatedLeaves = []
  const problems = []

  for (const filePath of leafPaths) {
    const raw = await fs.readFile(filePath, "utf8")
    const { data } = matter(raw)
    const result = validateLeafFrontmatter(data, filePath)

    if (!result.ok) {
      problems.push(result)
      continue
    }

    validatedLeaves.push({
      filePath,
      leafId: path.basename(filePath, ".md"),
      data: result.value,
    })
  }

  if (problems.length > 0) {
    const lines = [
      `Leaf frontmatter validation failed in ${problems.length} file(s):`,
      ...problems.flatMap((problem) => [
        `- ${problem.relPath}`,
        ...problem.errors.map((entry) => `  - ${entry}`),
      ]),
    ]

    throw new Error(lines.join("\n"))
  }

  return { validatedLeaves }
}

async function main() {
  const { validatedLeaves } = await validateLeafFrontmatterStrict()
  console.log(`Leaf frontmatter is valid in ${validatedLeaves.length} files`) 
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
