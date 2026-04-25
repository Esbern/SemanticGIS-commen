#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { validateLeafFrontmatterStrict } from "./validate-leaf-frontmatter.mjs"
import { validateRealisationFrontmatterStrict } from "./validate-realisation-frontmatter.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const repoRoot = path.resolve(__dirname, "..", "..")

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

function stableRealisationOrder(existingRealisations, rebuiltRealisations) {
  const existingOrder = new Map((existingRealisations ?? []).map((rel, index) => [rel.id, index]))

  return [...rebuiltRealisations].sort((left, right) => {
    const leftIndex = existingOrder.get(left.id)
    const rightIndex = existingOrder.get(right.id)

    if (leftIndex != null && rightIndex != null) {
      return leftIndex - rightIndex
    }

    if (leftIndex != null) return -1
    if (rightIndex != null) return 1

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

async function rebuildLeavesAndThreads(existingIndex, leavesDir) {
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
    const threads = toArray(data.threads)
    const tags = toArray(data.tags)
    const twigMembership = toArray(data.twig_membership)
    const primaryLens = data.primary_lens
    const flowMode = data.flow_mode
    const temporalMmu = data.temporal_mmu

    const rebuiltLeaf = {
      id: leafId,
      title,
      path: `/Leaves/${leafId}`,
      sphere: normalizeSphereId(sphere),
      subsphere,
    }

    rebuiltLeaf.question = question
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

async function rebuildRealisations(existingIndex, realisationsDir) {
  const { validatedRealisations } = await validateRealisationFrontmatterStrict({ realisationsDir })
  const rebuiltRealisations = []

  for (const entry of validatedRealisations) {
    const { realisationId, data } = entry
    rebuiltRealisations.push({
      id: realisationId,
      title: data.title,
      path: `/Realisations/${realisationId}`,
      leaf: data.leaf,
      dataset: data.dataset,
      tags: toArray(data.tags),
    })
  }

  return stableRealisationOrder(existingIndex.realisations, rebuiltRealisations)
}

async function processSite(siteName) {
  const contentRoot = path.join(repoRoot, siteName, "content")
  const leavesDir = path.join(contentRoot, "Leaves")
  const realisationsDir = path.join(contentRoot, "Realisations")
  const indexPath = path.join(contentRoot, "assets", "sphere-index.v1.json")

  const raw = await fs.readFile(indexPath, "utf8").catch(() => null)
  if (!raw) {
    console.log(`Skipping ${siteName}: index not found at ${indexPath}`)
    return
  }
  const existingIndex = JSON.parse(raw)

  const { orderedLeaves, orderedThreads } = await rebuildLeavesAndThreads(existingIndex, leavesDir)
  const orderedRealisations = await rebuildRealisations(existingIndex, realisationsDir)

  const rebuiltIndex = {
    ...existingIndex,
    version: "0.3.0",
    generated: isoDateToday(),
    leaves: orderedLeaves,
    realisations: orderedRealisations,
    threads: orderedThreads,
  }

  const nextJson = `${JSON.stringify(rebuiltIndex, null, 2)}\n`
  const currentJson = `${JSON.stringify(existingIndex, null, 2)}\n`

  if (checkOnly) {
    if (nextJson !== currentJson) {
      console.error(`sphere-index.v1.json for ${siteName} is out of date relative to the notes`)
      process.exitCode = 1
      return
    }
    console.log(`sphere-index.v1.json for ${siteName} is up to date`)
    return
  }

  await fs.writeFile(indexPath, nextJson, "utf8")
  console.log(`Rebuilt ${path.relative(repoRoot, indexPath)} from ${orderedLeaves.length} leaf notes`) 
}

async function main() {
  await processSite("dk")
  await processSite("org")
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})