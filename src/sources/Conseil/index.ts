// Generated from APP.ts.

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
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
