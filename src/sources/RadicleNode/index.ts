// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/RadicleNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.RadicleNode,
	label: 'Radicle node',
	sources: [
		{
			source: Source.RadicleNode_Control,
			label: 'Radicle node control API',
		},
	],
	bindings: [bindings[Source.RadicleNode_Control]],
} satisfies SourceProviderDefinition
