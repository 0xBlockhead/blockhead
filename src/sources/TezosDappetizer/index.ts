// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
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
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
