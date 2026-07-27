// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Covalent/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Covalent,
	label: 'Covalent',
	sources: [
		{
			source: Source.GoldRushFoundational_Rest,
			label: 'GoldRush Foundational API',
		},
	],
	bindings: [bindings[Source.GoldRushFoundational_Rest]],
} satisfies SourceProviderDefinition
