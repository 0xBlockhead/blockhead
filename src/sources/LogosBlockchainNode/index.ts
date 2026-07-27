// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/LogosBlockchainNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.LogosBlockchainNode,
	label: 'Logos blockchain node',
	sources: [
		{
			source: Source.LogosBlockchainNode_Rest,
			label: 'Logos blockchain node REST',
		},
	],
	bindings: [bindings[Source.LogosBlockchainNode_Rest]],
} satisfies SourceProviderDefinition
