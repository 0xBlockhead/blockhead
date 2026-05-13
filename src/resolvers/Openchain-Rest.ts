import { defineEntityFieldResolver, defineEntityResolver } from '$/resolvers/$resolvers.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { schema } from '$/schema/index.ts'
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

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$evmSelectors',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>) => {
				throw new Error('Openchain_Rest: $$evmSelectors listing unsupported; query selector ids directly')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$evmTopics',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>) => {
				throw new Error('Openchain_Rest: $$evmTopics listing unsupported; query topic ids directly')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$evmErrors',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>) => {
				throw new Error('Openchain_Rest: $$evmErrors listing unsupported; query error ids directly')
			},
		}),
	],
}
