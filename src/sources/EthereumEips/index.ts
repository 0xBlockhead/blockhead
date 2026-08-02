// Generated from APP.ts.

import bindings from '$/sources/EthereumEips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.EthereumEips,
	label: 'Ethereum EIPs',
	sources: {
		[Source.EthereumEips_Github]: {
			label: 'Ethereum EIPs GitHub',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
