// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Conseil/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Conseil,
	label: 'Conseil',
	sources: [
		{
			source: Source.Conseil_Postgres,
			label: 'Conseil Postgres',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
