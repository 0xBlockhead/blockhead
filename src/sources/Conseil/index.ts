// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Conseil/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Conseil,
	label: 'Conseil',
	sources: [
		{
			source: Source.Conseil_Postgres,
			label: 'Conseil Postgres',
		},
	],
	bindings: [bindings[Source.Conseil_Postgres]],
} satisfies SourceProviderDefinition
