// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const fedimintClientRpcSourceDefinition = {
	provider: SourceProvider.FedimintClient,
	source: Source.FedimintClient_Rpc,
	label: 'Fedimint client RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default fedimintClientRpcSourceDefinition
