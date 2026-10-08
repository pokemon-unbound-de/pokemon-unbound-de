# Contributor Quickstart

Useful ways to help:

- Check German translation quality.
- Review lore and terminology consistency.
- Report textbox, render, screenshot, or linebreak issues.
- Open pull requests against public documentation, issue templates, or reviewed public tooling only after reviewing repository safety rules.

## Simple QA

You only need:

- a browser
- a GitHub account if you want to open issues or comment

You do not need a local ROM for screenshot review. Pick a screenshot in `docs/screenshots/`, check wording or textbox fit, and report one concrete issue.

## In-game Testing

For local in-game testing, you need:

- your own legally obtained base ROM: Pokémon FireRed (USA) Rev 0 or Pokémon Unbound (EN) v1.0.1
- the `.bps` patch from the [Beta v0.1 release](https://github.com/pokemon-unbound-de/pokemon-unbound-de/releases/tag/v0.1-beta) — see [PATCH_ANLEITUNG.md](PATCH_ANLEITUNG.md)
- an emulator such as mGBA

This project does not provide ROMs, BIOS files, save states, or commercial assets.

## Code / Tooling

For documentation and light public tooling contributions, Git is enough to start.

Python is only needed when a specific public tool or validation step says so. Do not invent setup steps or submit generated build outputs.

Before opening an issue:

- Search for an existing report.
- Include location, pointer, scene, or screenshot context when available.
- Do not attach ROMs, patched ROMs, emulator save states, credentials, or private files. A zipped `.sav` is fine if it helps reproduce a bug.

Before opening a pull request:

- Keep changes scoped.
- Avoid broad rewrites.
- Confirm no forbidden files are staged.
- Run or request a staged-file-only private-path/credential scan.
