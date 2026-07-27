// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/EthereumLists/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.EthereumLists,
	label: 'ethereum-lists (chainid.network)',
	sources: [
		{
			source: Source.EthereumLists_Rest,
			label: 'ethereum-lists REST',
		},
	],
	bindings: [bindings[Source.EthereumLists_Rest]],
} satisfies SourceProviderDefinition
