// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const lightningLndGrpcSourceDefinition = {
	provider: SourceProvider.LightningLnd,
	source: Source.LightningLnd_Grpc,
	label: 'LND gRPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default lightningLndGrpcSourceDefinition
