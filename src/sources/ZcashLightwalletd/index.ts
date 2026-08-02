// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
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
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
