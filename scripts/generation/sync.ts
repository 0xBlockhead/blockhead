import { copyFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname } from 'node:path'

import { checkGenerated } from './check.ts'
import { generateExpected } from './generate-expected.ts'
import { generatedOwnership, ownershipDiff, staleGeneratedFiles } from './ownership.ts'
import { validateExpected } from './validate-expected.ts'

export const syncGenerated = async ({
	deleteStale,
	dryRun,
}: {
	deleteStale: boolean
	dryRun: boolean
}) => {
	await generateExpected()
	await validateExpected()

	const diff = ownershipDiff(generatedOwnership())
	const generatedRows = diff.filter((row) => row.ownership === 'generated')
	const missingExpectedGeneratedRows = generatedRows.filter((row) => !row.expectedExists)
	const missingActiveGeneratedRows = generatedRows.filter((row) => row.expectedExists && !row.activeExists)
	const changedGeneratedRows = generatedRows.filter((row) => row.expectedExists && row.activeExists && !row.matches)
	const staleGeneratedRows = staleGeneratedFiles()

	if (missingExpectedGeneratedRows.length > 0 && !dryRun)
		throw new Error(`Sync expected output is incomplete: ${missingExpectedGeneratedRows.length} generated rows are missing expected files`)

	if (staleGeneratedRows.length > 0 && !deleteStale)
		throw new Error(`Sync has ${staleGeneratedRows.length} stale generated files; rerun with --delete-stale`)

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
