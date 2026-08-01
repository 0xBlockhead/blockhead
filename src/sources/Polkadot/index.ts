// Generated from APP.ts.

import bindings from '$/sources/Polkadot/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Polkadot,
	label: 'Polkadot',
	sources: [
		{
			source: Source.Polkadot_JsonRpc,
			label: 'Polkadot JSON-RPC',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
