// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/AptosFullnode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.AptosFullnode,
	label: 'Aptos fullnode',
	sources: [
		{
			source: Source.AptosFullnode_Rest,
			label: 'Aptos fullnode REST',
		},
	],
	bindings: [bindings[Source.AptosFullnode_Rest]],
} satisfies SourceProviderDefinition
