// Generated from APP.ts.

import bindings from '$/sources/HederaSdk/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.HederaSdk,
	label: 'Hedera SDK',
	sources: [
		{
			source: Source.HederaSdk_Grpc,
			label: 'Hedera SDK gRPC',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
