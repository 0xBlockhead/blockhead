import { defineEntityResolver } from '$/resolvers/$defineEntityResolvers.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Sources.ts'

export default {
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType._Global,
			source: Source._User,
			resolve: async () => ({}),
		}),
		defineEntityResolver({
			entityType: EntityType.Proposal,
			source: Source._User,
			resolve: async () => ({}),
		}),
	],
	entityFieldResolvers: [],
}
