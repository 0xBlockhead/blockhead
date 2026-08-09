import bindings from '$/sources/KaspaWalletCli/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.KaspaWalletCli,
	label: 'Kaspa wallet CLI',
	sources: {
		[Source.KaspaWalletCli_WalletApi]: {
			label: 'Kaspa wallet CLI API',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
