import bindings from '$/sources/HederaSdk/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.HederaSdk,
	label: 'Hedera SDK',
	sources: {
		[Source.HederaSdk_Grpc]: {
			label: 'Hedera SDK gRPC',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
