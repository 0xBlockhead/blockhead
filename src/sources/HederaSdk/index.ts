// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/HederaSdk/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.HederaSdk,
	label: 'Hedera SDK',
	sources: [
		{
			source: Source.HederaSdk_Grpc,
			label: 'Hedera SDK gRPC',
		},
	],
	bindings: [bindings[Source.HederaSdk_Grpc]],
} satisfies SourceProviderDefinition
