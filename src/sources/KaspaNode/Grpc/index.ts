// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const kaspaNodeGrpcSourceDefinition = {
	provider: SourceProvider.KaspaNode,
	source: Source.KaspaNode_Grpc,
	label: 'Kaspa node gRPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default kaspaNodeGrpcSourceDefinition
