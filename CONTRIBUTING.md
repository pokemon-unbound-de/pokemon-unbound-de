# Contributing

Thanks for helping with the German localization.

## Ground Rules

- Do not submit ROMs, BIOS files, saves, states, commercial assets, credentials, or private paths.
- Do not submit generated build outputs.
- Keep changes scoped.
- Preserve control codes, placeholders, colors, and linebreak intent.
- Do not invent lore or rename canon terms without review.

## What can I contribute right now?

### Safe / Welcome

- screenshot QA
- German wording suggestions
- official Pokémon terminology corrections
- lore consistency reports
- documentation improvements
- rendering/textbox reports
- reproducible bug reports
- reviewed public documentation or tooling improvements

### Review First

- translation source changes
- terminology/glossary policy changes
- tooling changes
- engine-related changes
- patch workflow changes

If in doubt, open an issue before sending a pull request.

### Do Not Submit

- ROM files
- SAV/state files
- BIOS files
- commercial assets
- generated patched ROMs
- private/internal project reports
- credentials/secrets
- copyrighted assets not permitted for redistribution

## First contribution in 5 minutes

1. Open the screenshots in `docs/screenshots/`.
2. Pick one scene.
3. Check German wording, official terminology, or textbox fit.
4. Open the matching QA issue.
5. Report the exact screenshot and suggested correction.

Good starting points:

- Screenshot QA: https://github.com/prm9j785cn-design/pokemon-unbound-de/issues/1
- Terminology / lore: https://github.com/prm9j785cn-design/pokemon-unbound-de/issues/2
- Rendering QA: https://github.com/prm9j785cn-design/pokemon-unbound-de/issues/3

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
