// Generated from APP.ts.

import bindings from '$/sources/PolkadotRfcs/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.PolkadotRfcs,
	label: 'Polkadot RFCs',
	sources: {
		[Source.PolkadotRfcs_Github]: {
			label: 'Polkadot RFCs GitHub',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
