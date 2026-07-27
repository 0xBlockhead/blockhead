// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Cardanoscan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Cardanoscan,
	label: 'Cardanoscan',
	sources: [
		{
			source: Source.Cardanoscan_Rest,
			label: 'Cardanoscan REST',
		},
	],
	bindings: [bindings[Source.Cardanoscan_Rest]],
} satisfies SourceProviderDefinition
