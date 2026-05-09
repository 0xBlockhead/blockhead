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
				const { getOpenchainFunctionEntries } = await import('$/sources/Openchain/Rest/queries.ts')
				return {
					signatures: (await singleFlight(getOpenchainFunctionEntries)({ hex: entityId.hex })).map(
						(signatureEntry) => signatureEntry.name,
					),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmTopic,
			resolve: async (entityId) => {
				const { getOpenchainEventEntries } = await import('$/sources/Openchain/Rest/queries.ts')
				return {
					signatures: (await singleFlight(getOpenchainEventEntries)({ hex: entityId.hex })).map(
						(signatureEntry) => signatureEntry.name,
					),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmError,
			resolve: async (entityId) => {
				const { getOpenchainErrorEntries } = await import('$/sources/Openchain/Rest/queries.ts')
				return {
					signatures: (await singleFlight(getOpenchainErrorEntries)({ hex: entityId.hex })).map(
						(signatureEntry) => signatureEntry.name,
					),
				}
			},
		}),
	],

	entityFieldResolvers: [],
}
