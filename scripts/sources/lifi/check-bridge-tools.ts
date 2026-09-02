/**
 * Compare LI.FI `GET /v1/tools` bridge keys to `bridgeTools` in `src/constants/Bridge.ts`.
 * Exit 1 when the API exposes keys missing from the curated catalog.
 */

import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { bridgeTools } from '../../../src/constants/Bridge.ts'
import { fetchTools } from '../../../src/sources/Lifi/Rest/queries.ts'


export const catalogBridgeToolKeys = bridgeTools.map(({ key }) => key)

export const bridgeToolCatalogDrift = (apiKeys: readonly string[]) => {
	const catalogKeys = new Set(catalogBridgeToolKeys)
	return {
		missingFromCatalog: apiKeys.filter((key) => !catalogKeys.has(key)),
		staleInCatalog: catalogBridgeToolKeys.filter((key) => !apiKeys.includes(key)),
	}
}

const checkBridgeTools = async () => {
	const { bridges } = await fetchTools()
	const apiKeys = bridges.map((bridge) => bridge.key)
	const {
		missingFromCatalog,
		staleInCatalog,
	} = bridgeToolCatalogDrift(apiKeys)

	if (missingFromCatalog.length === 0 && staleInCatalog.length === 0) {
		console.log(`LI.FI bridge tools (${apiKeys.length}) match bridgeTools catalog.`)
		return 0
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

	return missingFromCatalog.length > 0 ? 1 : 0
}

if (
	process.argv[1] != null
	&& import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
	process.exit(await checkBridgeTools())
