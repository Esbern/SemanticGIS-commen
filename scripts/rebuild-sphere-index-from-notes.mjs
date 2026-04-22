#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { validateLeafFrontmatterStrict } from "./validate-leaf-frontmatter.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const repoRoot = path.resolve(__dirname, "..")
const contentRoot = path.join(repoRoot, "dk", "content")
const leavesDir = path.join(contentRoot, "Leaves")
const indexPath = path.join(contentRoot, "assets", "sphere-index.v1.json")

const args = new Set(process.argv.slice(2))
const checkOnly = args.has("--check")

function toArray(value) {
  if (value == null) {
    return []
  }

  if (Array.isArray(value)) {
    return value.filter((item) => item != null).map((item) => String(item))
  }

  return [String(value)]
}

function toObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {}
}

function normalizeSphereId(value) {
  return String(value).trim().toLowerCase().replaceAll("_", "-")
}

function isoDateToday() {
  return new Date().toISOString().slice(0, 10)
}

function stableLeafOrder(existingLeaves, rebuiltLeaves) {
  const existingOrder = new Map(existingLeaves.map((leaf, index) => [leaf.id, index]))

  return [...rebuiltLeaves].sort((left, right) => {
    const leftIndex = existingOrder.get(left.id)
    const rightIndex = existingOrder.get(right.id)

    if (leftIndex != null && rightIndex != null) {
      return leftIndex - rightIndex
    }

    if (leftIndex != null) {
      return -1
    }

    if (rightIndex != null) {
      return 1
    }

    return left.id.localeCompare(right.id)
  })
}

function stableThreadOrder(existingThreads, referencedThreadIds) {
  const wanted = new Set(referencedThreadIds)
  const ordered = existingThreads.filter((thread) => wanted.has(thread.id))
  const foundIds = new Set(ordered.map((thread) => thread.id))
  const missing = referencedThreadIds.filter((threadId) => !foundIds.has(threadId))

  if (missing.length > 0) {
    throw new Error(
      `Thread ids referenced by notes are missing from the current JSON index: ${missing.join(", ")}`,
    )
  }

  return ordered
}

async function loadExistingIndex() {
  const raw = await fs.readFile(indexPath, "utf8")
  return JSON.parse(raw)
}

async function rebuildLeavesAndThreads(existingIndex) {
  const { validatedLeaves } = await validateLeafFrontmatterStrict({ leavesDir })
  const rebuiltLeaves = []
  const referencedThreadIds = []
  const seenThreadIds = new Set()

  for (const entry of validatedLeaves) {
    const { leafId, data } = entry

    const title = data.title
    const question = data.question
    const sphere = data.sphere
    const subsphere = data.subsphere
    const realisations = toArray(data.realisations)
    const threads = toArray(data.threads)
    const tags = toArray(data.tags)
    const twigMembership = toArray(data.twig_membership)
    const primaryLens = data.primary_lens
    const flowMode = data.flow_mode
    const temporalMmu = data.temporal_mmu
    const entities = toArray(data.entities)
    const keyAttributes = toArray(data.key_attributes)
    const services = toObject(data.services)
    const primaryCollection = data.primary_collection
    const primaryCollectionPath = data.primary_collection_path

    const rebuiltLeaf = {
      id: leafId,
      title,
      path: `/Leaves/${leafId}`,
      sphere: normalizeSphereId(sphere),
      subsphere,
    }

    if (primaryCollection) {
      rebuiltLeaf.primary_collection = primaryCollection
    }

    if (primaryCollectionPath) {
      rebuiltLeaf.primary_collection_path = primaryCollectionPath
    }

    rebuiltLeaf.realisations = realisations
    rebuiltLeaf.question = question
    rebuiltLeaf.entities = entities
    rebuiltLeaf.key_attributes = keyAttributes
    rebuiltLeaf.services = services
    rebuiltLeaf.tags = tags

    if (twigMembership.length > 0) {
      rebuiltLeaf.twig_membership = twigMembership
    }

    if (primaryLens) {
      rebuiltLeaf.primary_lens = String(primaryLens)
    }

    if (flowMode) {
      rebuiltLeaf.flow_mode = String(flowMode)
    }

    if (temporalMmu) {
      rebuiltLeaf.temporal_mmu = String(temporalMmu)
    }

    rebuiltLeaf.threads = threads

    for (const threadId of threads) {
      if (!seenThreadIds.has(threadId)) {
        seenThreadIds.add(threadId)
        referencedThreadIds.push(threadId)
      }
    }

    rebuiltLeaves.push(rebuiltLeaf)
  }

  const orderedLeaves = stableLeafOrder(existingIndex.leaves, rebuiltLeaves)
  const orderedThreads = stableThreadOrder(existingIndex.threads, referencedThreadIds)

  return { orderedLeaves, orderedThreads }
}

async function main() {
  const existingIndex = await loadExistingIndex()
  const { orderedLeaves, orderedThreads } = await rebuildLeavesAndThreads(existingIndex)

  const rebuiltIndex = {
    ...existingIndex,
    generated: isoDateToday(),
    leaves: orderedLeaves,
    threads: orderedThreads,
  }

  const nextJson = `${JSON.stringify(rebuiltIndex, null, 2)}\n`
  const currentJson = `${JSON.stringify(existingIndex, null, 2)}\n`

  if (checkOnly) {
    if (nextJson !== currentJson) {
      console.error("sphere-index.v1.json is out of date relative to the notes")
      process.exitCode = 1
      return
    }

    console.log("sphere-index.v1.json is up to date")
    return
  }

  await fs.writeFile(indexPath, nextJson, "utf8")
  console.log(`Rebuilt ${path.relative(repoRoot, indexPath)} from ${orderedLeaves.length} leaf notes`) 
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})