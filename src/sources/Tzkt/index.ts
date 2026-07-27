// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/Tzkt/bindings.ts'

export default {
	provider: SourceProvider.Tzkt,
	label: 'TzKT',
	sources: [
		{
			source: Source.Tzkt_Rest,
			label: 'TzKT REST',
		},
	],
	bindings: [bindings[Source.Tzkt_Rest]],
} satisfies SourceProviderDefinition
