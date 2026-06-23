import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { cardanoDbSyncBindings } from '$/sources/CardanoDbSync/bindings.ts'

export default {
	provider: SourceProvider.CardanoDbSync,
	label: 'cardano-db-sync',
	sources: [
		{
			provider: SourceProvider.CardanoDbSync,
			source: Source.CardanoDbSync_Postgres,
			label: 'cardano-db-sync Postgres',
		},
	],
	bindings: cardanoDbSyncBindings,
} satisfies SourceProviderDefinition
