// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/ZcashLightwalletd/bindings.ts'

export default {
	provider: SourceProvider.ZcashLightwalletd,
	label: 'Zcash lightwalletd',
	sources: [
		{
			source: Source.ZcashLightwalletd_Grpc,
			label: 'Zcash lightwalletd gRPC',
		},
	],
	bindings: [bindings[Source.ZcashLightwalletd_Grpc]],
} satisfies SourceProviderDefinition
