// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/PolkadotRfcs/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.PolkadotRfcs,
	label: 'Polkadot RFCs',
	sources: [
		{
			source: Source.PolkadotRfcs_Github,
			label: 'Polkadot RFCs GitHub',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
