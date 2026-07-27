// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Acp/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Acp,
	label: 'Agent Client Protocol',
	sources: [
		{
			source: Source.AcpLocal_JsonRpc,
			label: 'ACP local JSON-RPC',
		},
		{
			source: Source.AcpRegistry_Rest,
			label: 'ACP registry REST',
		},
	],
	bindings: [
		bindings[Source.AcpLocal_JsonRpc],
		bindings[Source.AcpRegistry_Rest],
	],
} satisfies SourceProviderDefinition
