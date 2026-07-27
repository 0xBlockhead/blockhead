// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Nitro/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

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
	bindings: [
		bindings[Source.Nitro_ClientStore],
		bindings[Source.Nitro_NodeRpc],
	],
} satisfies SourceProviderDefinition
