import type { RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { Source } from '$/sources/Source.ts'

export default {
	source: Source.Morpho_Graphql,
	resolvers: [],
} satisfies RegisteredSourceResolverModule<Source.Morpho_Graphql>
