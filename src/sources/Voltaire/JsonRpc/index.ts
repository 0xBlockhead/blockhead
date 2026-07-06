// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const voltaireJsonRpcSourceDefinition = {
	provider: SourceProvider.Voltaire,
	source: Source.Voltaire_JsonRpc,
	label: 'Voltaire JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default voltaireJsonRpcSourceDefinition
