// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/PolkadotRfcs/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.PolkadotRfcs,
	label: 'Polkadot RFCs',
	sources: [
		{
			source: Source.PolkadotRfcs_Github,
			label: 'Polkadot RFCs GitHub',
		},
	],
	bindings: [bindings[Source.PolkadotRfcs_Github]],
} satisfies SourceProviderDefinition
