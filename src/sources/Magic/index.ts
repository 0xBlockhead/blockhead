import bindings from '$/sources/Magic/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Magic,
	label: 'Magic',
	sources: {
		[Source.Magic_HederaWalletApi]: {
			label: 'Magic Hedera wallet API',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
