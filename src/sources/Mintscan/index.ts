// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Mintscan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Mintscan,
	label: 'Mintscan',
	sources: [
		{
			source: Source.Mintscan_Rest,
			label: 'Mintscan REST',
		},
	],
	bindings: [bindings[Source.Mintscan_Rest]],
} satisfies SourceProviderDefinition
