// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const transmissionRpcJsonRpcSourceDefinition = {
	provider: SourceProvider.Transmission,
	source: Source.TransmissionRpc_JsonRpc,
	label: 'Transmission RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default transmissionRpcJsonRpcSourceDefinition
