import { copyFileSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { dirname } from 'node:path'

import { checkGenerated } from './check.ts'
import { generateExpected } from './generate-expected.ts'
import { ownershipDiff, staleGeneratedFiles } from './ownership.ts'
import { validateExpected } from './validate-expected.ts'
import { writeJsonl, writeText } from './files.ts'

export const syncGenerated = async ({
	deleteStale,
	dryRun,
}: {
	deleteStale: boolean
	dryRun: boolean
}) => {
	await generateExpected()
	await validateExpected()

	const diff = ownershipDiff(JSON.parse(readFileSync('.generated/expected/ownership.json', 'utf8')) as Parameters<typeof ownershipDiff>[0])
	const generatedRows = diff.filter((row) => row.ownership === 'generated')
	const handOwnedRows = diff.filter((row) => row.ownership === 'hand-owned')
	const handOwnedViews = handOwnedRows.filter((row) => row.kind === 'view')
	const handOwnedRoutes = handOwnedRows.filter((row) => row.kind === 'route')
	const handOwnedRouteSections = handOwnedRows.filter((row) => row.kind === 'route-section')
	const handOwnedRowsWithExpectedCandidate = handOwnedRows.filter((row) => row.expectedExists)
	const handOwnedRowsMatchingExpectedCandidate = handOwnedRowsWithExpectedCandidate.filter((row) => row.matches)
	const missingExpectedGeneratedRows = generatedRows.filter((row) => !row.expectedExists)
	const missingActiveGeneratedRows = generatedRows.filter((row) => row.expectedExists && !row.activeExists)
	const changedGeneratedRows = generatedRows.filter((row) => row.expectedExists && row.activeExists && !row.matches)
	const staleGeneratedRows = staleGeneratedFiles()

	writeJsonl('.generated/ledgers/sync-diff.jsonl', diff)
	writeJsonl('.generated/ledgers/stale-generated-files.jsonl', staleGeneratedRows)
	writeText('.generated/reports/sync-dry-run.md', [
		'# Sync Dry Run',
		'',
		`Ownership rows: ${diff.length}`,
		`Generated rows: ${generatedRows.length}`,
		`Hand-owned rows preserved: ${handOwnedRows.length}`,
		`Hand-owned entity views remaining: ${handOwnedViews.length}`,
		`Hand-owned route pages remaining: ${handOwnedRoutes.length}`,
		`Hand-owned route sections remaining: ${handOwnedRouteSections.length}`,
		`Hand-owned rows with expected candidate: ${handOwnedRowsWithExpectedCandidate.length}`,
		`Hand-owned rows matching expected candidate: ${handOwnedRowsMatchingExpectedCandidate.length}`,
		`Missing expected generated rows: ${missingExpectedGeneratedRows.length}`,
		`Missing active generated rows: ${missingActiveGeneratedRows.length}`,
		`Generated rows that would change: ${changedGeneratedRows.length}`,
		`Stale generated files: ${staleGeneratedRows.length}`,
		`Delete stale requested: ${deleteStale ? 'yes' : 'no'}`,
		'',
		'## Missing Expected Generated Rows',
		'',
		...(missingExpectedGeneratedRows.length === 0 ? ['None'] : missingExpectedGeneratedRows.slice(0, 200).map((row) => `- ${row.expectedPath}`)),
		'',
		'## Missing Active Generated Rows',
		'',
		...(missingActiveGeneratedRows.length === 0 ? ['None'] : missingActiveGeneratedRows.slice(0, 200).map((row) => `- ${row.activePath}`)),
		'',
		'## Generated Rows That Would Change',
		'',
		...(changedGeneratedRows.length === 0 ? ['None'] : changedGeneratedRows.slice(0, 200).map((row) => `- ${row.activePath}`)),
		'',
		'## Stale Generated Files',
		'',
		...(staleGeneratedRows.length === 0 ? ['None'] : staleGeneratedRows.slice(0, 200).map((row) => `- ${row.activePath} — ${row.reason}`)),
	].join('\n'))

	if (missingExpectedGeneratedRows.length > 0 && !dryRun)
		throw new Error(`Sync expected output is incomplete: ${missingExpectedGeneratedRows.length} generated rows are missing expected files`)

	if (staleGeneratedRows.length > 0 && !deleteStale)
		throw new Error(`Sync has ${staleGeneratedRows.length} stale generated files; rerun with --delete-stale after reviewing .generated/ledgers/stale-generated-files.jsonl`)

	if (dryRun) {
		console.log(`Sync dry-run passed; ${changedGeneratedRows.length} generated files would change; ${deleteStale ? staleGeneratedRows.length : 0} stale files would be deleted; no active files were modified`)
		return
	}

	for (const row of staleGeneratedRows)
		rmSync(row.activePath)

	for (const row of [
		...missingActiveGeneratedRows,
		...changedGeneratedRows,
	]) {
		mkdirSync(dirname(row.activePath), {
			recursive: true,
		})
		copyFileSync(row.expectedPath, row.activePath)
	}

	await checkGenerated()

	console.log(`Sync passed; deleted ${staleGeneratedRows.length} stale files and wrote ${missingActiveGeneratedRows.length + changedGeneratedRows.length} generated files`)
}
