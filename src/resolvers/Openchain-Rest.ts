import { defineEntityResolver } from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.Openchain_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.EvmSelector,
			resolve: async (entityId) => {
				const { getFunctionEntries } = await import('$/sources/Openchain/Rest/queries.ts')
				return {
					signatures: (await singleFlight(getFunctionEntries)({ hex: entityId.hex })).map(
						(signatureEntry) => signatureEntry.name,
					),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmTopic,
			resolve: async (entityId) => {
				const { getEventEntries } = await import('$/sources/Openchain/Rest/queries.ts')
				return {
					signatures: (await singleFlight(getEventEntries)({ hex: entityId.hex })).map(
						(signatureEntry) => signatureEntry.name,
					),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmError,
			resolve: async (entityId) => {
				const { getErrorEntries } = await import('$/sources/Openchain/Rest/queries.ts')
				return {
					signatures: (await singleFlight(getErrorEntries)({ hex: entityId.hex })).map(
						(signatureEntry) => signatureEntry.name,
					),
				}
			},
		}),
	],

	entityFieldResolvers: [],
}
