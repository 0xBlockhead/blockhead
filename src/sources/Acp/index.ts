// Generated from APP.ts.

import bindings from '$/sources/Acp/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

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
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
