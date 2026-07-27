// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/Starkscan/bindings.ts'

export default {
	provider: SourceProvider.Starkscan,
	label: 'Starkscan',
	sources: [
		{
			source: Source.Starkscan_Rest,
			label: 'Starkscan REST',
		},
	],
	bindings: [bindings[Source.Starkscan_Rest]],
} satisfies SourceProviderDefinition
