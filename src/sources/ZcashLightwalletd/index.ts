import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import { zcashLightwalletdBindings } from '$/sources/ZcashLightwalletd/bindings.ts'

const zcashLightwalletdOrigins = sourceOriginsFromBindings(zcashLightwalletdBindings)

const zcashLightwalletdSourceProviderDefinition = {
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
	origins: zcashLightwalletdOrigins,
} satisfies SourceProviderDefinition

export default zcashLightwalletdSourceProviderDefinition
