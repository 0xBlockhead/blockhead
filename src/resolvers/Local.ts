import { defineEntityFieldResolver, defineEntityResolver } from '$/resolvers/$resolvers.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.Local_Internal,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType._Global,
			resolve: async () => {
				throw new Error('Local_Internal: _Global entity resolver is not implemented')
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Proposal,
			resolve: async () => {
				throw new Error('Local_Internal: Proposal entity resolver is not implemented')
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BridgeTransaction,
			resolve: async () => {
				throw new Error('Local_Internal: BridgeTransaction entity resolver is not implemented')
			},
		}),

		defineEntityResolver({
			entityType: EntityType.XmtpConversation,
			resolve: async () => {
				throw new Error('Local_Internal: XmtpConversation entity resolver is not implemented')
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$actors',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>) => {
				throw new Error('Local_Internal: $$actors field resolver is not implemented')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$xmtpConversations',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>) => {
				throw new Error('Local_Internal: $$xmtpConversations field resolver is not implemented')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadSources',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>) => {
				throw new Error('Local_Internal: $$blockheadSources field resolver is not implemented')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadSessions',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>) => {
				throw new Error('Local_Internal: $$blockheadSessions field resolver is not implemented')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadPanelTrees',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>) => {
				throw new Error('Local_Internal: $$blockheadPanelTrees field resolver is not implemented')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadFarcasterAccountConnections',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>) => {
				throw new Error('Local_Internal: $$blockheadFarcasterAccountConnections field resolver is not implemented')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadAgentConversations',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>) => {
				throw new Error('Local_Internal: $$blockheadAgentConversations field resolver is not implemented')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$bridgeTransactions',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>) => {
				throw new Error('Local_Internal: $$bridgeTransactions field resolver is not implemented')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadRoomPeers',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>) => {
				throw new Error('Local_Internal: $$blockheadRoomPeers field resolver is not implemented')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadRooms',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>) => {
				throw new Error('Local_Internal: $$blockheadRooms field resolver is not implemented')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$stateChannels',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>) => {
				throw new Error('Local_Internal: $$stateChannels field resolver is not implemented')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadSharedAddresses',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>) => {
				throw new Error('Local_Internal: $$blockheadSharedAddresses field resolver is not implemented')
			},
		}),
	],
}
