import bindings from '$/sources/Petra/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Petra,
	label: 'Petra',
	sources: {
		[Source.Petra_WalletApi]: {
			label: 'Petra wallet API',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
