// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Reservoir/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Reservoir,
	label: 'Reservoir',
	sources: [
		{
			source: Source.Reservoir_Rest,
			label: 'Reservoir REST',
		},
	],
	bindings: [bindings[Source.Reservoir_Rest]],
} satisfies SourceProviderDefinition
