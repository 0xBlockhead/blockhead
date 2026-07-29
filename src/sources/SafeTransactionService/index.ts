// Generated from APP.ts. Do not edit by hand.

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
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
