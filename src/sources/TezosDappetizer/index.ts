// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/TezosDappetizer/bindings.ts'

export default {
	provider: SourceProvider.TezosDappetizer,
	label: 'Tezos Dappetizer',
	sources: [
		{
			source: Source.TezosDappetizer_Postgres,
			label: 'Tezos Dappetizer Postgres',
		},
	],
	bindings: [bindings[Source.TezosDappetizer_Postgres]],
} satisfies SourceProviderDefinition
