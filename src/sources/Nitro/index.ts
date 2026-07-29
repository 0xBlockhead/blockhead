// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Nitro/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Nitro,
	label: 'Nitro',
	sources: [
		{
			source: Source.Nitro_ClientStore,
			label: 'Nitro client store',
		},
		{
			source: Source.Nitro_NodeRpc,
			label: 'Nitro node RPC',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
