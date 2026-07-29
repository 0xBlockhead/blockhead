// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Primal/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Primal,
	label: 'Primal',
	sources: [
		{
			source: Source.Primal_Rest,
			label: 'Primal REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
