#!/usr/bin/env node
/**
 * Changelog entry validator.
 *
 * Rules per entry file under .changelog/unreleased/:
 *   1. Filename must match  {pr-number}-{slug}.md   (e.g. 42-fix-login.md)
 *   2. `pr:` field must be a positive integer (not "TBD")
 *   3. `type:` must be one of: feat | fix | chore | docs | refactor | perf | test | security
 *   4. `breaking:` must be present (true or false)
 *   5. Body (text after front-matter) must be ≤ 500 characters
 *
 * Front-matter is expected to be YAML fenced with `---`.
 * Example valid entry:
 *
 *   ---
 *   pr: 42
 *   type: security
 *   breaking: false
 *   ---
 *   Removed unowned third-party oracle worker.
 */

import { readdir, readFile } from "node:fs/promises"
import { join, basename } from "node:path"

const UNRELEASED_DIR = join(process.cwd(), ".changelog", "unreleased")

const VALID_TYPES = new Set(["feat", "fix", "chore", "docs", "refactor", "perf", "test", "security"])
// Filename: one or more digits, a hyphen, at least one kebab-case word, .md extension
const FILENAME_RE = /^\d+-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/

/**
 * Parse YAML-style front-matter from a markdown string.
 * Returns { data: Record<string,string>, body: string } or null if no front-matter found.
 */
function parseFrontMatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/m)
  if (!match) return null
  const raw = match[1]
  const body = match[2] ?? ""
  const data = {}
  for (const line of raw.split(/\r?\n/)) {
    const colon = line.indexOf(":")
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const value = line.slice(colon + 1).trim()
    data[key] = value
  }
  return { data, body }
}

async function main() {
  let files
  try {
    const entries = await readdir(UNRELEASED_DIR, { withFileTypes: true })
    files = entries
      .filter((e) => e.isFile() && e.name.endsWith(".md") && e.name !== ".gitkeep")
      .map((e) => e.name)
  } catch (err) {
    console.error(`✖  Cannot read ${UNRELEASED_DIR}: ${err.message}`)
    process.exit(1)
  }

  if (files.length === 0) {
    console.log("✔  No unreleased changelog entries to validate.")
    process.exit(0)
  }

  const errors = []

  for (const filename of files.sort()) {
    const filePath = join(UNRELEASED_DIR, filename)
    const content = await readFile(filePath, "utf8")
    const fileErrors = []

    // Rule 1 — filename format
    if (!FILENAME_RE.test(filename)) {
      fileErrors.push(
        `Filename must match {pr-number}-{description}.md (e.g. 42-fix-login.md). Got: "${filename}"`,
      )
    }

    // Parse front-matter
    const parsed = parseFrontMatter(content)
    if (!parsed) {
      fileErrors.push("Missing or malformed YAML front-matter (expected --- ... --- block)")
      errors.push({ filename, errors: fileErrors })
      continue
    }

    const { data, body } = parsed

    // Rule 2 — pr must be a positive integer
    if (!data.pr) {
      fileErrors.push('Missing required field: "pr"')
    } else if (data.pr.toUpperCase() === "TBD" || !/^\d+$/.test(data.pr) || parseInt(data.pr, 10) <= 0) {
      fileErrors.push(`"pr" must be a positive integer, got: "${data.pr}"`)
    }

    // Rule 3 — type must be valid
    if (!data.type) {
      fileErrors.push('Missing required field: "type"')
    } else if (!VALID_TYPES.has(data.type)) {
      fileErrors.push(`"type" must be one of [${[...VALID_TYPES].join(", ")}], got: "${data.type}"`)
    }

    // Rule 4 — breaking must be present
    if (!("breaking" in data)) {
      fileErrors.push('Missing required field: "breaking" (must be true or false)')
    } else if (data.breaking !== "true" && data.breaking !== "false") {
      fileErrors.push(`"breaking" must be true or false, got: "${data.breaking}"`)
    }

    // Rule 5 — body length
    const bodyTrimmed = body.trim()
    if (bodyTrimmed.length > 500) {
      fileErrors.push(
        `Body exceeds 500 characters (${bodyTrimmed.length} chars). Summarise or move details to the PR description.`,
      )
    }

    if (fileErrors.length > 0) {
      errors.push({ filename, errors: fileErrors })
    }
  }

  if (errors.length === 0) {
    console.log(`✔  All ${files.length} changelog entries are valid.`)
    process.exit(0)
  }

  console.error(`\n✖  ${errors.length} invalid changelog entry/entries:\n`)
  for (const { filename, errors: errs } of errors) {
    console.error(`  ${filename}`)
    for (const e of errs) {
      console.error(`    • ${e}`)
    }
    console.error("")
  }
  process.exit(1)
}

main()
