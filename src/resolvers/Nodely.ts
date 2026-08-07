import type { RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import algod from '$/resolvers/Algod-Rest.ts'
import indexer from '$/resolvers/AlgorandIndexer-Rest.ts'
import { Source } from '$/sources/Source.ts'

export default {
	source: Source.Nodely,
	resolvers: [
		...algod.resolvers,
		...indexer.resolvers,
	],
} as const satisfies RegisteredSourceResolverModule<Source.Nodely>
