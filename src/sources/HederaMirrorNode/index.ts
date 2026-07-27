// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/HederaMirrorNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.HederaMirrorNode,
	label: 'Hedera mirror node',
	sources: [
		{
			source: Source.HederaMirrorNode_Rest,
			label: 'Hedera mirror node REST',
		},
	],
	bindings: [bindings[Source.HederaMirrorNode_Rest]],
} satisfies SourceProviderDefinition
