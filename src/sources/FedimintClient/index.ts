// Generated from APP.ts.

import bindings from '$/sources/FedimintClient/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.FedimintClient,
	label: 'Fedimint client',
	sources: [
		{
			source: Source.FedimintClient_Rpc,
			label: 'Fedimint client RPC',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
