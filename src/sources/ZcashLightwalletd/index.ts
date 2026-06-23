import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { zcashLightwalletdBindings } from '$/sources/ZcashLightwalletd/bindings.ts'

export default {
	provider: SourceProvider.ZcashLightwalletd,
	label: 'Zcash lightwalletd',
	sources: [
		{
			provider: SourceProvider.ZcashLightwalletd,
			source: Source.ZcashLightwalletd_Grpc,
			label: 'Zcash lightwalletd gRPC',
		},
	],
	bindings: zcashLightwalletdBindings,
} satisfies SourceProviderDefinition
