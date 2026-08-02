// Generated from APP.ts.

import bindings from '$/sources/Ogmios/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Ogmios,
	label: 'Ogmios',
	sources: {
		[Source.Ogmios_JsonRpc]: {
			label: 'Ogmios JSON-RPC',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
