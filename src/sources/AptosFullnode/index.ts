// Generated from APP.ts.

import bindings from '$/sources/AptosFullnode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.AptosFullnode,
	label: 'Aptos fullnode',
	sources: [
		{
			source: Source.AptosFullnode_Rest,
			label: 'Aptos fullnode REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
