// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const polkadotJsonRpcSourceDefinition = {
	provider: SourceProvider.Polkadot,
	source: Source.Polkadot_JsonRpc,
	label: 'Polkadot JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default polkadotJsonRpcSourceDefinition
