import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	type ResolverLoadSubset,
} from '$/resolvers/$resolvers.ts'
import {
	coinInstanceIdForNormalizedStateChannelRow,
	findNormalizedBridgeTransactionRow,
	readNormalizedLocalInternal,
} from '$/sources/Local/Internal/catalog.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const sliceNormalizedRowsForSubset = <_Row>(
	rows: readonly _Row[],
	context: ResolverLoadSubset | undefined,
): readonly _Row[] => (
	rows.slice(0, resolverLoadSubsetRowLimit(context))
)

export default {
	source: Source.Local_Internal,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType._Global,
			resolve: async () => ({}),
		}),

		defineEntityResolver({
			entityType: EntityType.BridgeTransaction,
			resolve: async (entityId) => {
				const catalog = readNormalizedLocalInternal()
				if (findNormalizedBridgeTransactionRow(catalog, entityId) == null) {
					throw new Error('Local_Internal: BridgeTransaction not present in local catalog')
				}
				return {}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.XmtpConversation,
			resolve: async (entityId) => {
				const trimmedId = entityId.id.trim()
				if (trimmedId === '') throw new Error('Local_Internal: XMTP conversation id is empty')
				const catalog = readNormalizedLocalInternal()
				const row = catalog.xmtpConversations.find((candidate) => candidate.id === trimmedId)
				if (row == null) {
					throw new Error('Local_Internal: XmtpConversation not present in local catalog')
				}
				return {
					...(row.peerInboxId != null && { peerInboxId: row.peerInboxId }),
					...(row.topic != null && { topic: row.topic }),
					...(row.createdAtMs != null && { createdAtMs: row.createdAtMs }),
					...(row.consentState != null && { consentState: row.consentState }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BlockheadSource,
			resolve: async (entityId) => {
				const catalog = readNormalizedLocalInternal()
				if (!catalog.blockheadSources.some((row) => row.id === entityId.id)) {
					throw new Error('Local_Internal: BlockheadSource not present in local catalog')
				}
				return {}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BlockheadPanelTree,
			resolve: async (entityId) => {
				const catalog = readNormalizedLocalInternal()
				if (!catalog.blockheadPanelTrees.some((row) => row.id === entityId.id)) {
					throw new Error('Local_Internal: BlockheadPanelTree not present in local catalog')
				}
				return {}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BlockheadRoom,
			resolve: async (entityId) => {
				const catalog = readNormalizedLocalInternal()
				const row = catalog.blockheadRooms.find((candidate) => candidate.id === entityId.id)
				if (row == null) throw new Error('Local_Internal: BlockheadRoom not present in local catalog')
				return {
					createdAt: row.createdAt,
					createdBy: row.createdBy,
					...(row.name != null && { name: row.name }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BlockheadSession,
			resolve: async (entityId) => {
				const catalog = readNormalizedLocalInternal()
				const row = catalog.blockheadSessions.find((candidate) => candidate.id === entityId.id)
				if (row == null) throw new Error('Local_Internal: BlockheadSession not present in local catalog')
				return {
					...(row.name != null && { name: row.name }),
					status: row.status,
					createdAt: row.createdAt,
					updatedAt: row.updatedAt,
					...(row.lockedAt != null && { lockedAt: row.lockedAt }),
					...(row.simulationCount != null && { simulationCount: row.simulationCount }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BlockheadRoomPeer,
			resolve: async (entityId) => {
				const catalog = readNormalizedLocalInternal()
				const row = catalog.blockheadRoomPeers.find((candidate) => candidate.id === entityId.id)
				if (row == null) throw new Error('Local_Internal: BlockheadRoomPeer not present in local catalog')
				return {
					$room: { [EntityMetaKey.Id]: { id: row.roomId } },
					peerId: row.peerId,
					...(row.displayName != null && { displayName: row.displayName }),
					joinedAt: row.joinedAt,
					...(row.lastSeenAt != null && { lastSeenAt: row.lastSeenAt }),
					...(row.connectedAt != null && { connectedAt: row.connectedAt }),
					...(row.disconnectedAt != null && { disconnectedAt: row.disconnectedAt }),
					isConnected: row.isConnected,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BlockheadSharedAddress,
			resolve: async (entityId) => {
				const catalog = readNormalizedLocalInternal()
				const row = catalog.blockheadSharedAddresses.find((candidate) => candidate.id === entityId.id)
				if (row == null) {
					throw new Error('Local_Internal: BlockheadSharedAddress not present in local catalog')
				}
				return {
					$network: { [EntityMetaKey.Id]: { chainId: row.chainId } },
					$room: { [EntityMetaKey.Id]: { id: row.roomId } },
					peerId: row.peerId,
					$account: { [EntityMetaKey.Id]: { address: row.accountAddress } },
					targetPeerIds: row.targetPeerIds,
					sharedAt: row.sharedAt,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.StateChannel,
			resolve: async (entityId) => {
				const catalog = readNormalizedLocalInternal()
				const row = catalog.stateChannels.find((candidate) => candidate.id === entityId.id)
				if (row == null) throw new Error('Local_Internal: StateChannel not present in local catalog')
				const assetId = coinInstanceIdForNormalizedStateChannelRow(row)
				return {
					$network: { [EntityMetaKey.Id]: { chainId: row.chainId } },
					$participant0: { [EntityMetaKey.Id]: { address: row.participant0 } },
					$participant1: { [EntityMetaKey.Id]: { address: row.participant1 } },
					$asset: { [EntityMetaKey.Id]: assetId },
					totalDeposited: row.totalDeposited,
					balance0: row.balance0,
					balance1: row.balance1,
					turnNum: row.turnNum,
					status: row.status,
					...(row.roomId != null && { $room: { [EntityMetaKey.Id]: { id: row.roomId } } }),
					createdAt: row.createdAt,
					updatedAt: row.updatedAt,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.StateChannelDeposit,
			resolve: async (entityId) => {
				const catalog = readNormalizedLocalInternal()
				const row = catalog.stateChannelDeposits.find((candidate) => candidate.id === entityId.id)
				if (row == null) {
					throw new Error('Local_Internal: StateChannelDeposit not present in local catalog')
				}
				return {
					$channel: { [EntityMetaKey.Id]: { id: row.channelId } },
					$network: { [EntityMetaKey.Id]: { chainId: row.chainId } },
					$account: { [EntityMetaKey.Id]: { address: row.accountAddress } },
					availableBalance: row.availableBalance,
					lockedBalance: row.lockedBalance,
					lastUpdated: row.lastUpdated,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.StateChannelTransfer,
			resolve: async (entityId) => {
				const catalog = readNormalizedLocalInternal()
				const row = catalog.stateChannelTransfers.find((candidate) => candidate.id === entityId.id)
				if (row == null) {
					throw new Error('Local_Internal: StateChannelTransfer not present in local catalog')
				}
				return {
					$channel: { [EntityMetaKey.Id]: { id: row.channelId } },
					$from: { [EntityMetaKey.Id]: { address: row.from } },
					$to: { [EntityMetaKey.Id]: { address: row.to } },
					amount: row.amount,
					turnNum: row.turnNum,
					timestamp: row.timestamp,
					status: row.status,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.StateChannelState,
			resolve: async (entityId) => {
				const catalog = readNormalizedLocalInternal()
				const row = catalog.stateChannelStates.find((candidate) => candidate.id === entityId.id)
				if (row == null) {
					throw new Error('Local_Internal: StateChannelState not present in local catalog')
				}
				return {
					$channel: { [EntityMetaKey.Id]: { id: row.channelId } },
					intent: row.intent,
					version: row.version,
					stateData: row.stateData,
					allocations: row.allocations.map((allocation) => ({
						destination: allocation.destination,
						token: allocation.token,
						amount: allocation.amount,
					})),
					signatures: [...row.signatures],
					isFinal: row.isFinal,
					timestamp: row.timestamp,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BlockheadAgentConversation,
			resolve: async (entityId) => {
				const catalog = readNormalizedLocalInternal()
				const row = catalog.blockheadAgentConversations.find((candidate) => candidate.id === entityId.id)
				if (row == null) {
					throw new Error('Local_Internal: BlockheadAgentConversation not present in local catalog')
				}
				return {
					name: row.name,
					pinned: row.pinned,
					systemPrompt: row.systemPrompt,
					defaultConnectionId: row.defaultConnectionId,
					defaultModelId: row.defaultModelId,
					createdAt: row.createdAt,
					updatedAt: row.updatedAt,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BlockheadAgentConversationTurn,
			resolve: async (entityId) => {
				const catalog = readNormalizedLocalInternal()
				const row = catalog.blockheadAgentConversationTurns.find((candidate) => candidate.id === entityId.id)
				if (row == null) {
					throw new Error('Local_Internal: BlockheadAgentConversationTurn not present in local catalog')
				}
				return {
					$conversation: {
						[EntityMetaKey.Id]: { id: row.conversationId },
					},
					parentId: row.parentId,
					userPrompt: row.userPrompt,
					assistantText: row.assistantText,
					providerId: row.providerId,
					status: row.status,
					...(row.error != null && { error: row.error }),
					createdAt: row.createdAt,
					promptVersion: row.promptVersion,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmContract,
			resolve: async () => ({}),
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$actors',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(readNormalizedLocalInternal().actors, context)
					.map((row) => ({
						[EntityMetaKey.Id]: { address: row.address },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$xmtpConversations',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					readNormalizedLocalInternal().xmtpConversations,
					context,
				)
					.map((row) => ({
						[EntityMetaKey.Id]: { id: row.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.XmtpNetwork,
			fieldName: '$$xmtpConversations',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType.XmtpNetwork>, context) => (
				sliceNormalizedRowsForSubset(
					readNormalizedLocalInternal().xmtpConversations,
					context,
				)
					.map((row) => ({
						[EntityMetaKey.Id]: { id: row.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadSources',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					readNormalizedLocalInternal().blockheadSources,
					context,
				)
					.map((row) => ({
						[EntityMetaKey.Id]: { id: row.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadSessions',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					readNormalizedLocalInternal().blockheadSessions,
					context,
				)
					.map((row) => ({
						[EntityMetaKey.Id]: { id: row.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadPanelTrees',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					readNormalizedLocalInternal().blockheadPanelTrees,
					context,
				)
					.map((row) => ({
						[EntityMetaKey.Id]: { id: row.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadFarcasterAccountConnections',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					readNormalizedLocalInternal().blockheadFarcasterAccountConnections,
					context,
				)
					.map((row) => ({
						[EntityMetaKey.Id]: { fid: row.fid },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadAgentConversations',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					readNormalizedLocalInternal().blockheadAgentConversations,
					context,
				)
					.map((row) => ({
						[EntityMetaKey.Id]: { id: row.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.BlockheadAgentConversation,
			fieldName: '$$turns',
			resolve: async (
				scopedEntityId: EntityId<typeof schema, EntityType.BlockheadAgentConversation>,
				context,
			) => (
				sliceNormalizedRowsForSubset(
					readNormalizedLocalInternal().blockheadAgentConversationTurns
						.filter((row) => row.conversationId === scopedEntityId.id),
					context,
				)
					.map((row) => ({
						[EntityMetaKey.Id]: { id: row.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$bridgeTransactions',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					readNormalizedLocalInternal().bridgeTransactions,
					context,
				)
					.map((row) => ({
						[EntityMetaKey.Id]: {
							$account: { address: row.accountAddress },
							$sourceTx: {
								$network: { chainId: row.chainId },
								txHash: row.txHash,
							},
							createdAt: row.createdAt,
						},
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.BlockheadRoom,
			fieldName: '$$peers',
			resolve: async (entityId, context) => (
				sliceNormalizedRowsForSubset(
					readNormalizedLocalInternal().blockheadRoomPeers.filter((row) => (
						row.roomId === entityId.id
					)),
					context,
				)
					.map((row) => ({
						[EntityMetaKey.Id]: { id: row.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadRoomPeers',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					readNormalizedLocalInternal().blockheadRoomPeers,
					context,
				)
					.map((row) => ({
						[EntityMetaKey.Id]: { id: row.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadRooms',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					readNormalizedLocalInternal().blockheadRooms,
					context,
				)
					.map((row) => ({
						[EntityMetaKey.Id]: { id: row.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$stateChannels',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					readNormalizedLocalInternal().stateChannels,
					context,
				)
					.map((row) => ({
						[EntityMetaKey.Id]: { id: row.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.StateChannel,
			fieldName: '$$transfers',
			resolve: async (
				scopedEntityId: EntityId<typeof schema, EntityType.StateChannel>,
				context,
			) => (
				sliceNormalizedRowsForSubset(
					readNormalizedLocalInternal().stateChannelTransfers
						.filter((row) => row.channelId === scopedEntityId.id),
					context,
				)
					.map((row) => ({
						[EntityMetaKey.Id]: { id: row.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.StateChannel,
			fieldName: '$$states',
			resolve: async (
				scopedEntityId: EntityId<typeof schema, EntityType.StateChannel>,
				context,
			) => (
				sliceNormalizedRowsForSubset(
					readNormalizedLocalInternal().stateChannelStates
						.filter((row) => row.channelId === scopedEntityId.id),
					context,
				)
					.map((row) => ({
						[EntityMetaKey.Id]: { id: row.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.StateChannel,
			fieldName: '$$deposits',
			resolve: async (
				scopedEntityId: EntityId<typeof schema, EntityType.StateChannel>,
				context,
			) => (
				sliceNormalizedRowsForSubset(
					readNormalizedLocalInternal().stateChannelDeposits
						.filter((row) => row.channelId === scopedEntityId.id),
					context,
				)
					.map((row) => ({
						[EntityMetaKey.Id]: { id: row.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadSharedAddresses',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					readNormalizedLocalInternal().blockheadSharedAddresses,
					context,
				)
					.map((row) => ({
						[EntityMetaKey.Id]: { id: row.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmProtocol,
			fieldName: '$$evmSelectors',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType.EvmProtocol>, context) => (
				sliceNormalizedRowsForSubset(
					readNormalizedLocalInternal().evmSelectors,
					context,
				)
					.map((row) => ({
						[EntityMetaKey.Id]: { hex: row.hex },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmProtocol,
			fieldName: '$$evmTopics',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType.EvmProtocol>, context) => (
				sliceNormalizedRowsForSubset(
					readNormalizedLocalInternal().evmTopics,
					context,
				)
					.map((row) => ({
						[EntityMetaKey.Id]: { hex: row.hex },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmProtocol,
			fieldName: '$$evmErrors',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType.EvmProtocol>, context) => (
				sliceNormalizedRowsForSubset(
					readNormalizedLocalInternal().evmErrors,
					context,
				)
					.map((row) => ({
						[EntityMetaKey.Id]: { hex: row.hex },
					}))
			),
		}),
	],
}
