import { defineEntityResolver } from '$/resolvers/$resolvers.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.Local_Internal,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType._Global,
			resolve: async () => ({}),
		}),

		defineEntityResolver({
			entityType: EntityType.Proposal,
			resolve: async () => ({}),
		}),
	],

	entityFieldResolvers: [],
}
