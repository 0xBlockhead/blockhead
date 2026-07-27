// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Koios/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Koios,
	label: 'Koios',
	sources: [
		{
			source: Source.Koios_Rest,
			label: 'Koios REST',
		},
	],
	bindings: [bindings[Source.Koios_Rest]],
} satisfies SourceProviderDefinition
