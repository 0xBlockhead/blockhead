// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const hederaSdkGrpcSourceDefinition = {
	provider: SourceProvider.HederaSdk,
	source: Source.HederaSdk_Grpc,
	label: 'Hedera SDK gRPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default hederaSdkGrpcSourceDefinition
