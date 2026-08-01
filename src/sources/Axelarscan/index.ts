// Generated from APP.ts.

import bindings from '$/sources/Axelarscan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Axelarscan,
	label: 'Axelarscan',
	sources: [
		{
			source: Source.Axelarscan_Rest,
			label: 'Axelarscan REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
