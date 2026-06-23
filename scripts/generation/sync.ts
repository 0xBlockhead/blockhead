import { copyFileSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname } from 'node:path'

import { checkGenerated } from './check.ts'
import { ownershipDiff } from './ownership.ts'
import { writeJsonl, writeText } from './files.ts'

export const syncGenerated = async ({ dryRun }: { dryRun: boolean }) => {
	await checkGenerated()

	const diff = ownershipDiff(JSON.parse(readFileSync('.generated/expected/ownership.json', 'utf8')) as Parameters<typeof ownershipDiff>[0])
	const generatedRows = diff.filter((row) => row.ownership === 'generated')
	const handOwnedRows = diff.filter((row) => row.ownership === 'hand-owned')
	const missingExpectedGeneratedRows = generatedRows.filter((row) => !row.expectedExists)
	const missingActiveGeneratedRows = generatedRows.filter((row) => row.expectedExists && !row.activeExists)
	const changedGeneratedRows = generatedRows.filter((row) => row.expectedExists && row.activeExists && !row.matches)

	writeJsonl('.generated/ledgers/sync-diff.jsonl', diff)
	writeText('.generated/reports/sync-dry-run.md', [
		'# Sync Dry Run',
		'',
		`Ownership rows: ${diff.length}`,
		`Generated rows: ${generatedRows.length}`,
		`Hand-owned rows preserved: ${handOwnedRows.length}`,
		`Missing expected generated rows: ${missingExpectedGeneratedRows.length}`,
		`Missing active generated rows: ${missingActiveGeneratedRows.length}`,
		`Generated rows that would change: ${changedGeneratedRows.length}`,
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
	].join('\n'))

	if (missingExpectedGeneratedRows.length > 0 && !dryRun)
		throw new Error(`Sync expected output is incomplete: ${missingExpectedGeneratedRows.length} generated rows are missing expected files`)

	if (dryRun) {
		console.log(`Sync dry-run passed; ${changedGeneratedRows.length} generated files would change; no active files were modified`)
		return
	}

	for (const row of [
		...missingActiveGeneratedRows,
		...changedGeneratedRows,
	]) {
		mkdirSync(dirname(row.activePath), {
			recursive: true,
		})
		copyFileSync(row.expectedPath, row.activePath)
	}

	console.log(`Sync passed; wrote ${missingActiveGeneratedRows.length + changedGeneratedRows.length} generated files`)
}
