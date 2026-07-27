// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Polkadot/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Polkadot,
	label: 'Polkadot',
	sources: [
		{
			source: Source.Polkadot_JsonRpc,
			label: 'Polkadot JSON-RPC',
		},
	],
	bindings: [bindings[Source.Polkadot_JsonRpc]],
} satisfies SourceProviderDefinition
