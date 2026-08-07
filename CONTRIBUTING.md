# Contributing

Thanks for helping with the German localization.

## Ground Rules

- Do not submit ROMs, BIOS files, saves, states, commercial assets, credentials, or private paths.
- Do not submit generated build outputs.
- Keep changes scoped.
- Preserve control codes, placeholders, colors, and linebreak intent.
- Do not invent lore or rename canon terms without review.

## Translation PRs

Each PR should include:

- Affected pointer(s) or file(s)
- English source context if available
- German proposal
- Terminology risks
- Textbox/line-length risks
- QA performed

## Issues

Open issues for:

- Translation errors
- Lore or terminology questions
- Render, textbox, screenshot, or linebreak problems
- Tooling or documentation issues in curated public files

Do not attach ROMs, saves, emulator states, BIOS files, credentials, or private files.

## Technical PRs

Each PR should include:

- Purpose
- Files changed
- Tests or validation performed
- Whether any ROM/build output was generated locally
- Confirmation that no forbidden files are staged

## Review Expectations

- Localization review for tone, terminology, and lore.
- Technical review for pointer safety, control codes, and workflow integrity.
- Forbidden-file check before merge.
- Staged-file private-path/credential scan before public release.

## Staging Rule

Stage explicit curated files by path. Do not use broad `git add .` in the working tree.
