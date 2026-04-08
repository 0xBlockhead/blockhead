import { defineEntityResolver } from '$/resolvers/$defineEntityResolvers.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { OpenchainSignatureEntryWire } from '$/sources/Openchain/Rest/types.ts'
import { Source } from '$/sources/$Sources.ts'

const namesFromEntries = (entries: OpenchainSignatureEntryWire[]) => (
	entries.map((e) => e.name)
)

export default {
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.EvmSelector,
			source: Source.Openchain,
			resolve: async (entityId) => {
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const { getOpenchainFunctionEntries } = await import('$/sources/Openchain/Rest/queries.ts')
				const entries = await singleFlight(getOpenchainFunctionEntries)({
					hex: entityId.hex,
				})
				return {
					signatures: namesFromEntries(entries),
				}
			},
		}),
		defineEntityResolver({
			entityType: EntityType.EvmTopic,
			source: Source.Openchain,
			resolve: async (entityId) => {
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const { getOpenchainEventEntries } = await import('$/sources/Openchain/Rest/queries.ts')
				const entries = await singleFlight(getOpenchainEventEntries)({
					hex: entityId.hex,
				})
				return {
					signatures: namesFromEntries(entries),
				}
			},
		}),
		defineEntityResolver({
			entityType: EntityType.EvmError,
			source: Source.Openchain,
			resolve: async (entityId) => {
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const { getOpenchainErrorEntries } = await import('$/sources/Openchain/Rest/queries.ts')
				const entries = await singleFlight(getOpenchainErrorEntries)({
					hex: entityId.hex,
				})
				return {
					signatures: namesFromEntries(entries),
				}
			},
		}),
	],
	entityFieldResolvers: [],
}
