// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const suiGrpcSourceDefinition = {
	provider: SourceProvider.Sui,
	source: Source.Sui_Grpc,
	label: 'Sui gRPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default suiGrpcSourceDefinition
