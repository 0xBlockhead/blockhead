// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Primal/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Primal,
	label: 'Primal',
	sources: [
		{
			source: Source.Primal_Rest,
			label: 'Primal REST',
		},
	],
	bindings: [bindings[Source.Primal_Rest]],
} satisfies SourceProviderDefinition
