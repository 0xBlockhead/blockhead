// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Transmission/bindings.ts'

export default {
	provider: SourceProvider.Transmission,
	label: 'Transmission',
	sources: [
		{
			source: Source.TransmissionRpc_JsonRpc,
			label: 'Transmission RPC',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
