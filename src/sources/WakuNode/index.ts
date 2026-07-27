// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/WakuNode/bindings.ts'

export default {
	provider: SourceProvider.WakuNode,
	label: 'Waku node',
	sources: [
		{
			source: Source.WakuNode_Rest,
			label: 'Waku node REST',
		},
	],
	bindings: [bindings[Source.WakuNode_Rest]],
} satisfies SourceProviderDefinition
