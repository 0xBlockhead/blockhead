// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Piped/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Piped,
	label: 'Piped',
	sources: [
		{
			source: Source.Piped_Rest,
			label: 'Piped API REST',
		},
	],
	bindings: [bindings[Source.Piped_Rest]],
} satisfies SourceProviderDefinition
