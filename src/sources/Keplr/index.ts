import bindings from '$/sources/Keplr/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Keplr,
	label: 'Keplr',
	sources: {
		[Source.Keplr_WalletApi]: {
			label: 'Keplr wallet API',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
