import bindings from '$/sources/Pontem/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Pontem,
	label: 'Pontem',
	sources: {
		[Source.Pontem_WalletApi]: {
			label: 'Pontem wallet API',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
