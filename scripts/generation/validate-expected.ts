import { existsSync } from 'node:fs'

import { readText } from './files.ts'
import { loadApp } from './load-app.ts'
import { generatedOwnership } from './ownership.ts'

export const validateExpected = async () => {
	const app = loadApp()
	const ownership = generatedOwnership()
	const expectedFiles = ownership.map((row) => row.expectedPath)
	const missingFiles = expectedFiles.filter((file) => !existsSync(file))
	const mismatches = [
		...(readText('.generated/expected/SCHEMA.md').includes(`Entity ${app.schema.entities[0]?.name}`) ? [] : ['schema markdown content']),
		...(readText('.generated/expected/SOURCES.md').includes(app.sources.providers[0]?.label ?? '') ? [] : ['sources markdown content']),
		...(readText('.generated/expected/RESOLVER-COVERAGE.md').includes(app.resolvers.coverage[0]?.source ?? '') ? [] : ['resolver coverage markdown content']),
		...(ownership.length > 0 ? [] : ['ownership rows']),
	]

	if (missingFiles.length > 0)
		throw new Error(`Expected output is missing files: ${missingFiles.join(', ')}`)

	if (mismatches.length > 0)
		throw new Error(`Expected output does not match APP counts: ${mismatches.join(', ')}`)

	console.log(`Expected output validation passed: ${expectedFiles.length} files from APP.ts`)
}
