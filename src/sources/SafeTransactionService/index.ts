// Generated from APP.ts.

import bindings from '$/sources/SafeTransactionService/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.SafeTransactionService,
	label: 'Safe Transaction Service',
	sources: [
		{
			source: Source.SafeTransactionService_Rest,
			label: 'Safe Transaction Service REST',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
