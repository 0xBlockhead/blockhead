// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const zcashLightwalletdGrpcSourceDefinition = {
	provider: SourceProvider.ZcashLightwalletd,
	source: Source.ZcashLightwalletd_Grpc,
	label: 'Zcash lightwalletd gRPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default zcashLightwalletdGrpcSourceDefinition
