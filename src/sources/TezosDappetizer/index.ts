import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/TezosDappetizer/bindings.ts'

export default {
	provider: SourceProvider.TezosDappetizer,
	label: 'Tezos Dappetizer',
	sources: {
		[Source.TezosDappetizer_Postgres]: {
			label: 'Tezos Dappetizer Postgres',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
