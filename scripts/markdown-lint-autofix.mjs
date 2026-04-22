#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"

const root = path.join(process.cwd(), "dk/content")
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

function isListLine(line) {
  return /^\s{0,3}(?:[-*+]\s+|\d+\.\s+)/.test(line)
}

function isTableLine(line) {
  return /^\|.*\|\s*$/.test(line.trim())
}

function isTableSeparator(line) {
  return /^\|(?:\s*:?-{1,}:?\s*\|)+\s*$/.test(line.trim())
}

walk(root)
let changed = 0

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8")
  let lines = raw.split("\n")

  lines = lines.map((l) => l.replace(/\t/g, "    "))

  if (lines[0] === "---") {
    let end = 1
    let hasTitle = false
    while (end < lines.length && lines[end] !== "---") {
      if (/^title\s*:/i.test(lines[end])) {
        hasTitle = true
      }
      end++
    }

    if (hasTitle && end < lines.length) {
      let i = end + 1
      while (i < lines.length && lines[i].trim() === "") {
        i++
      }

      if (i < lines.length && /^#\s+/.test(lines[i])) {
        lines.splice(i, 1)
        if (i < lines.length && lines[i].trim() === "") {
          lines.splice(i, 1)
        }
      }
    }
  }

  lines = lines.map((line) => {
    let next = line
    if (isTableLine(next)) {
      next = next.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "[[$1\\|$2]]")
    }

    if (isTableSeparator(next)) {
      const cells = next
        .trim()
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim())
      return `| ${cells.join(" | ")} |`
    }

    return next
  })

  const out = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const prev = out.length ? out[out.length - 1] : ""
    const next = i + 1 < lines.length ? lines[i + 1] : ""

    const heading = /^#{1,6}\s+/.test(line.trim())
    if (heading && prev.trim() !== "" && prev.trim() !== "---") {
      out.push("")
    }

    const list = isListLine(line)
    if (
      list &&
      prev.trim() !== "" &&
      !isListLine(prev) &&
      !/^>\s*$/.test(prev.trim()) &&
      !/^#{1,6}\s+/.test(prev.trim())
    ) {
      out.push("")
    }

    out.push(line)

    if (heading && next.trim() !== "") {
      out.push("")
      continue
    }

    if (list) {
      const nextTrim = next.trim()
      if (nextTrim !== "" && !isListLine(next) && !/^\|/.test(nextTrim) && !/^\s{2,}\S/.test(next)) {
        out.push("")
      }
    }
  }

  const nextRaw = out.join("\n")
  if (nextRaw !== raw) {
    fs.writeFileSync(file, nextRaw, "utf8")
    changed++
  }
}

console.log(`Applied non-line-length markdown autofixes in ${changed} files`)
