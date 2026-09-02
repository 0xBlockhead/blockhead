import {
	expect,
	it,
} from 'vitest'

import { bridgeTools } from '$/constants/Bridge.ts'
import {
	bridgeToolCatalogDrift,
	catalogBridgeToolKeys,
} from '../../../scripts/sources/lifi/check-bridge-tools.ts'


it('compares LI.FI tool keys through the executable bridge catalog owner', () => {
	const canonicalKeys = bridgeTools.map(({ key }) => key)
	expect(catalogBridgeToolKeys).toEqual(canonicalKeys)
	expect(bridgeToolCatalogDrift(canonicalKeys)).toEqual({
		missingFromCatalog: [],
		staleInCatalog: [],
	})
	expect(bridgeToolCatalogDrift([
		...canonicalKeys.slice(1),
		'new-upstream-tool',
	])).toEqual({
		missingFromCatalog: ['new-upstream-tool'],
		staleInCatalog: [canonicalKeys[0]],
	})
})
