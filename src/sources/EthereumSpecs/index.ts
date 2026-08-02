// Generated from APP.ts.

import bindings from '$/sources/EthereumSpecs/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.EthereumSpecs,
	label: 'Ethereum specs',
	sources: {
		[Source.EthereumSpecs_Github]: {
			label: 'Ethereum specs GitHub',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
