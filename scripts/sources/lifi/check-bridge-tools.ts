/**
 * Compare LI.FI `GET /v1/tools` bridge keys to `bridgeTools` in `src/constants/Bridge.ts`.
 * Exit 1 when the API exposes keys missing from the curated catalog.
 */

import { readFileSync } from 'node:fs'

import { fetchTools } from '../../../src/sources/Lifi/Rest/queries.ts'


const bridgeToolsSource = readFileSync(
	new URL('../../../src/constants/Bridge.ts', import.meta.url),
	'utf8'
)

const catalogKeys = new Set(
	[...bridgeToolsSource.matchAll(/^\s*key: '([^']+)'/gm)].map((match) => match[1])
)

const { bridges } = await fetchTools()
const apiKeys = bridges.map((bridge) => bridge.key)
const missingFromCatalog = apiKeys.filter((key) => !catalogKeys.has(key))
const staleInCatalog = [...catalogKeys].filter((key) => !apiKeys.includes(key))

if (missingFromCatalog.length === 0 && staleInCatalog.length === 0) {
	console.log(`LI.FI bridge tools (${apiKeys.length}) match bridgeTools catalog.`)
	process.exit(0)
}

if (missingFromCatalog.length > 0) {
	console.error('Add rows to src/constants/Bridge.ts bridgeTools for:')
	for (const key of missingFromCatalog.toSorted()) {
		console.error(`  - ${key}`)
	}
}

if (staleInCatalog.length > 0) {
	console.warn('Catalog keys not returned by LI.FI /v1/tools (review or remove):')
	for (const key of staleInCatalog.toSorted()) {
		console.warn(`  - ${key}`)
	}
}

process.exit(missingFromCatalog.length > 0 ? 1 : 0)
