import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { hederaSdkBindings } from '$/sources/HederaSdk/bindings.ts'

export default {
	provider: SourceProvider.HederaSdk,
	label: 'Hedera SDK',
	sources: [
		{
			provider: SourceProvider.HederaSdk,
			source: Source.HederaSdk_Grpc,
			label: 'Hedera SDK gRPC',
		},
	],
	bindings: hederaSdkBindings,
} satisfies SourceProviderDefinition
