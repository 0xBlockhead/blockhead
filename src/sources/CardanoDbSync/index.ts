import bindings from '$/sources/CardanoDbSync/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.CardanoDbSync,
	label: 'cardano-db-sync',
	sources: {
		[Source.CardanoDbSync_Postgres]: {
			label: 'cardano-db-sync Postgres',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
