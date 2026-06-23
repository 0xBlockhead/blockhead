import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { tezosDappetizerBindings } from '$/sources/TezosDappetizer/bindings.ts'

export default {
	provider: SourceProvider.TezosDappetizer,
	label: 'Tezos Dappetizer',
	sources: [
		{
			provider: SourceProvider.TezosDappetizer,
			source: Source.TezosDappetizer_Postgres,
			label: 'Tezos Dappetizer Postgres',
		},
	],
	bindings: tezosDappetizerBindings,
} satisfies SourceProviderDefinition
