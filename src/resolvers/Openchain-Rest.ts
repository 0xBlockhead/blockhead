import {
	defineResolver,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { EntityIdProjection } from '$/schema/$EntityDefinition.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.Openchain_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmSelector,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getFunctionEntries } = await import('$/sources/Openchain/Rest/queries.ts')
				return {
					signatures: (await singleFlight(getFunctionEntries)({ hex: entityId.hex })).map(
						(signatureEntry) => signatureEntry.name,
					),
				}
			}
			},
			fields: {
			signatures: (snapshot) => snapshot.signatures,
		}
		}),

		defineResolver({
			entityType: EntityType.EvmTopic,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getEventEntries } = await import('$/sources/Openchain/Rest/queries.ts')
				return {
					signatures: (await singleFlight(getEventEntries)({ hex: entityId.hex })).map(
						(signatureEntry) => signatureEntry.name,
					),
				}
			}
			},
			fields: {
			signatures: (snapshot) => snapshot.signatures,
		}
		}),

		defineResolver({
			entityType: EntityType.EvmError,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getErrorEntries } = await import('$/sources/Openchain/Rest/queries.ts')
				return {
					signatures: (await singleFlight(getErrorEntries)({ hex: entityId.hex })).map(
						(signatureEntry) => signatureEntry.name,
					),
				}
			}
			},
			fields: {
			signatures: (snapshot) => snapshot.signatures,
		}
		}),
	],
}
