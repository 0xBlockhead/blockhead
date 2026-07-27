// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Axelarscan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Axelarscan,
	label: 'Axelarscan',
	sources: [
		{
			source: Source.Axelarscan_Rest,
			label: 'Axelarscan REST',
		},
	],
	bindings: [bindings[Source.Axelarscan_Rest]],
} satisfies SourceProviderDefinition
