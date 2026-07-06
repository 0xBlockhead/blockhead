// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const atprotoSyncXrpcSourceDefinition = {
	provider: SourceProvider.AtprotoSync,
	source: Source.AtprotoSync_Xrpc,
	label: 'AT Protocol sync XRPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default atprotoSyncXrpcSourceDefinition
