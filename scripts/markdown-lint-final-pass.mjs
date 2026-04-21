#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"

const root = path.join(process.cwd(), "DanishData/content")
const files = []

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      walk(p)
    } else if (ent.isFile() && p.endsWith(".md")) {
      files.push(p)
    }
  }
}

function isOrdered(line) {
  return /^(\s*)(\d+)\.\s+/.test(line)
}

function isUnordered(line) {
  return /^\s*[-*+]\s+/.test(line)
}

walk(root)
let changed = 0

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8")
  let lines = raw.split("\n")

  // MD009: trailing spaces
  lines = lines.map((line) => line.replace(/[ \t]+$/g, ""))

  // MD023: headings must start at column 1
  lines = lines.map((line) => line.replace(/^\s+(#{1,6}\s+)/, "$1"))

  // MD007: reduce common 4-space list indentation to 2 spaces
  lines = lines.map((line) => line.replace(/^ {4}([-*+]\s+)/, "  $1"))

  // MD029: normalize ordered list numbering per contiguous indent block
  const counters = new Map()
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const m = line.match(/^(\s*)(\d+)\.\s+(.*)$/)
    if (!m) {
      if (line.trim() === "") {
        counters.clear()
      }
      continue
    }

    const indent = m[1].length
    const prev = counters.get(indent) ?? 0
    const nextNumber = prev + 1
    counters.set(indent, nextNumber)
    lines[i] = `${m[1]}${nextNumber}. ${m[3]}`
  }

  // MD022 and MD032: heading/list blank-line hygiene and MD012 blank compression
  const out = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    const prev = out.length ? out[out.length - 1] : ""
    const next = i + 1 < lines.length ? lines[i + 1] : ""

    const isHeading = /^#{1,6}\s+/.test(trimmed)
    const isList = isOrdered(line) || isUnordered(line)

    if (isHeading && prev.trim() !== "" && prev.trim() !== "---") {
      out.push("")
    }

    if (isList && prev.trim() !== "" && !isOrdered(prev) && !isUnordered(prev) && !/^>\s*$/.test(prev.trim()) && !/^#{1,6}\s+/.test(prev.trim())) {
      out.push("")
    }

    out.push(line)

    if (isHeading && next.trim() !== "") {
      out.push("")
      continue
    }

    if (isList) {
      const nextTrim = next.trim()
      if (nextTrim !== "" && !isOrdered(next) && !isUnordered(next) && !/^\|/.test(nextTrim) && !/^\s{2,}\S/.test(next)) {
        out.push("")
      }
    }
  }

  // MD012: collapse multiple blank lines
  const collapsed = []
  let blankRun = 0
  for (const line of out) {
    if (line.trim() === "") {
      blankRun += 1
      if (blankRun <= 1) {
        collapsed.push("")
      }
    } else {
      blankRun = 0
      collapsed.push(line)
    }
  }

  const nextRaw = `${collapsed.join("\n").replace(/\n*$/, "")}\n`
  if (nextRaw !== raw) {
    fs.writeFileSync(file, nextRaw, "utf8")
    changed += 1
  }
}

console.log(`Applied final markdown lint formatting fixes in ${changed} files`)
