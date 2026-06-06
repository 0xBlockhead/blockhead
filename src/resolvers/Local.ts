import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	type ResolverLoadSubset,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { EvmAddress, ZeroExHex } from '$/schema/$ZeroExHex.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/$Source.ts'

const sliceNormalizedRowsForSubset = <_Row>(
	normalizedCatalogRows: readonly _Row[],
	context: ResolverLoadSubset | undefined,
): readonly _Row[] => (
	normalizedCatalogRows.slice(0, resolverLoadSubsetRowLimit(context))
)

const readNormalizedLocalInternal = async () => (
	(await import('$/sources/Local/Internal/catalog.ts')).readNormalizedLocalInternal()
)

const blockheadConnectionStatusByLocalStatus = {
	disconnected: BlockheadConnectionStatus.Disconnected,
	connecting: BlockheadConnectionStatus.Connecting,
	connected: BlockheadConnectionStatus.Connected,
	error: BlockheadConnectionStatus.Error,
} as const

const findNormalizedBridgeTransactionRow = async (
	...args: Parameters<typeof import('$/sources/Local/Internal/catalog.ts').findNormalizedBridgeTransactionRow>
			) => (
	(await import('$/sources/Local/Internal/catalog.ts')).findNormalizedBridgeTransactionRow(...args)
)

const coinInstanceIdForNormalizedStateChannelRow = async (
	...args: Parameters<typeof import('$/sources/Local/Internal/catalog.ts').coinInstanceIdForNormalizedStateChannelRow>
			) => (
	(await import('$/sources/Local/Internal/catalog.ts')).coinInstanceIdForNormalizedStateChannelRow(...args)
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
				const catalog = await readNormalizedLocalInternal()
				if (await findNormalizedBridgeTransactionRow(catalog, entityId) == null) {
					throw new Error('Local_Internal: BridgeTransaction not present in local catalog')
				}
				return {}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.XmtpConversation,
			resolve: async (entityId) => {
				const conversationId = entityId.id
				if (conversationId === '') throw new Error('Local_Internal: XMTP conversation id is empty')
				const catalog = await readNormalizedLocalInternal()
				const xmtpConversation = catalog.xmtpConversations.find((candidate) => candidate.id === conversationId)
				if (xmtpConversation == null) {
					throw new Error('Local_Internal: XmtpConversation not present in local catalog')
				}
				return {
					...(xmtpConversation.peerInboxId != null && { peerInboxId: xmtpConversation.peerInboxId }),
					...(xmtpConversation.topic != null && { topic: xmtpConversation.topic }),
					...(xmtpConversation.createdAtMs != null && { createdAtMs: xmtpConversation.createdAtMs }),
					...(xmtpConversation.consentState != null && { consentState: xmtpConversation.consentState }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BlockheadSource,
			resolve: async (entityId) => {
				const catalog = await readNormalizedLocalInternal()
				if (!catalog.blockheadSources.some((blockheadSource) => blockheadSource.id === entityId.id)) {
					throw new Error('Local_Internal: BlockheadSource not present in local catalog')
				}
				return {}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BlockheadWallet,
			resolve: async (entityId) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadWallet = catalog.blockheadWallets.find((candidate) => candidate.id === entityId.id)
				if (blockheadWallet == null) throw new Error('Local_Internal: BlockheadWallet not present in local catalog')
				return {
					name: blockheadWallet.name,
					icon: blockheadWallet.icon,
					protocol: blockheadWallet.protocol,
					discoveryKind: blockheadWallet.discoveryKind,
					transportKind: blockheadWallet.transportKind,
					...(blockheadWallet.rdns != null && { rdns: blockheadWallet.rdns }),
					...(blockheadWallet.websiteUrl != null && { websiteUrl: blockheadWallet.websiteUrl }),
					capabilities: [...blockheadWallet.capabilities],
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BlockheadWalletAccount,
			resolve: async (entityId) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadWalletAccount = catalog.blockheadWalletAccounts.find((candidate) => (
					candidate.namespace === entityId.caip10.namespace
					&& candidate.reference === entityId.caip10.reference
					&& candidate.accountAddress === entityId.caip10.accountAddress
				))
				if (blockheadWalletAccount == null) throw new Error('Local_Internal: BlockheadWalletAccount not present in local catalog')
				return {
					$network: {
						[EntityMetaKey.Id]: {
							caip2: {
								namespace: blockheadWalletAccount.namespace,
								reference: blockheadWalletAccount.reference,
							},
						},
					},
					address: blockheadWalletAccount.accountAddress,
					...(blockheadWalletAccount.label != null && { label: blockheadWalletAccount.label }),
					capabilities: [...blockheadWalletAccount.capabilities],
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BlockheadWalletConnection,
			resolve: async (entityId) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadWalletConnection = catalog.blockheadWalletConnections.find((candidate) => candidate.walletId === entityId.$wallet.id)
				if (blockheadWalletConnection == null) throw new Error('Local_Internal: BlockheadWalletConnection not present in local catalog')
				return {
					status: blockheadConnectionStatusByLocalStatus[blockheadWalletConnection.status],
					protocol: blockheadWalletConnection.protocol,
					transportKind: blockheadWalletConnection.transportKind,
					scopes: blockheadWalletConnection.scopes.map((scope) => ({
						namespace: scope.namespace,
						reference: scope.reference,
						methods: [...scope.methods],
						events: [...scope.events],
					})),
					$$connectedAccounts: blockheadWalletConnection.accountIds.map((accountId) => ({
						[EntityMetaKey.Id]: {
							caip10: accountId,
						},
					})),
					...(blockheadWalletConnection.activeAccountId != null && {
						$activeAccount: {
							[EntityMetaKey.Id]: {
								caip10: blockheadWalletConnection.activeAccountId,
							},
						},
					}),
					selected: blockheadWalletConnection.selected,
					connectedAt: blockheadWalletConnection.connectedAt,
					...(blockheadWalletConnection.disconnectedAt != null && { disconnectedAt: blockheadWalletConnection.disconnectedAt }),
					...(blockheadWalletConnection.sessionId != null && { sessionId: blockheadWalletConnection.sessionId }),
					...(blockheadWalletConnection.sessionTopic != null && { sessionTopic: blockheadWalletConnection.sessionTopic }),
					...(blockheadWalletConnection.error != null && { error: blockheadWalletConnection.error }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BlockheadPanelTree,
			resolve: async (entityId) => {
				const catalog = await readNormalizedLocalInternal()
				if (!catalog.blockheadPanelTrees.some((blockheadPanelTree) => blockheadPanelTree.id === entityId.id)) {
					throw new Error('Local_Internal: BlockheadPanelTree not present in local catalog')
				}
				return {}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BlockheadRoom,
			resolve: async (entityId) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadRoom = catalog.blockheadRooms.find((candidate) => candidate.id === entityId.id)
				if (blockheadRoom == null) throw new Error('Local_Internal: BlockheadRoom not present in local catalog')
				return {
					createdAt: blockheadRoom.createdAt,
					createdBy: blockheadRoom.createdBy,
					...(blockheadRoom.name != null && { name: blockheadRoom.name }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BlockheadSession,
			resolve: async (entityId) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadSession = catalog.blockheadSessions.find((candidate) => candidate.id === entityId.id)
				if (blockheadSession == null) throw new Error('Local_Internal: BlockheadSession not present in local catalog')
				return {
					...(blockheadSession.name != null && { name: blockheadSession.name }),
					status: blockheadSession.status,
					createdAt: blockheadSession.createdAt,
					updatedAt: blockheadSession.updatedAt,
					...(blockheadSession.lockedAt != null && { lockedAt: blockheadSession.lockedAt }),
					...(blockheadSession.simulationCount != null && { simulationCount: blockheadSession.simulationCount }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BlockheadSessionAction,
			resolve: async (entityId) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadSessionAction = catalog.blockheadSessionActions.find((candidate) => (
					candidate.sessionId === entityId.sessionId
					&& candidate.actionId === entityId.actionId
				))
				if (blockheadSessionAction == null) throw new Error('Local_Internal: BlockheadSessionAction not present in local catalog')
				return {
					$session: {
						[EntityMetaKey.Id]: {
							id: blockheadSessionAction.sessionId,
						},
					},
					indexInSequence: blockheadSessionAction.indexInSequence,
					action: blockheadSessionAction.action,
					createdAt: blockheadSessionAction.createdAt,
					updatedAt: blockheadSessionAction.updatedAt,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BlockheadRoomPeer,
			resolve: async (entityId) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadRoomPeer = catalog.blockheadRoomPeers.find((candidate) => candidate.id === entityId.id)
				if (blockheadRoomPeer == null) throw new Error('Local_Internal: BlockheadRoomPeer not present in local catalog')
				return {
					$room: { [EntityMetaKey.Id]: { id: blockheadRoomPeer.roomId } },
					peerId: blockheadRoomPeer.peerId,
					...(blockheadRoomPeer.displayName != null && { displayName: blockheadRoomPeer.displayName }),
					joinedAt: blockheadRoomPeer.joinedAt,
					...(blockheadRoomPeer.lastSeenAt != null && { lastSeenAt: blockheadRoomPeer.lastSeenAt }),
					...(blockheadRoomPeer.connectedAt != null && { connectedAt: blockheadRoomPeer.connectedAt }),
					...(blockheadRoomPeer.disconnectedAt != null && { disconnectedAt: blockheadRoomPeer.disconnectedAt }),
					isConnected: blockheadRoomPeer.isConnected,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BlockheadSharedAddress,
			resolve: async (entityId) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadSharedAddress = catalog.blockheadSharedAddresses.find((candidate) => candidate.id === entityId.id)
				if (blockheadSharedAddress == null) {
					throw new Error('Local_Internal: BlockheadSharedAddress not present in local catalog')
					}
					return {
						$network: { [EntityMetaKey.Id]: { caip2: { namespace: 'eip155' as const, reference: String(blockheadSharedAddress.chainId) } } },
						$room: { [EntityMetaKey.Id]: { id: blockheadSharedAddress.roomId } },
						peerId: blockheadSharedAddress.peerId,
						$account: { [EntityMetaKey.Id]: { address: EvmAddress.assert(blockheadSharedAddress.accountAddress) } },
						targetPeerIds: blockheadSharedAddress.targetPeerIds,
						sharedAt: blockheadSharedAddress.sharedAt,
					}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.StateChannel,
			resolve: async (entityId) => {
				const catalog = await readNormalizedLocalInternal()
				const stateChannel = catalog.stateChannels.find((candidate) => candidate.id === entityId.id)
					if (stateChannel == null) throw new Error('Local_Internal: StateChannel not present in local catalog')
					const assetId = await coinInstanceIdForNormalizedStateChannelRow(stateChannel)
					return {
							$network: { [EntityMetaKey.Id]: { caip2: { namespace: 'eip155' as const, reference: String(stateChannel.chainId) } } },
						$participant0: { [EntityMetaKey.Id]: { address: EvmAddress.assert(stateChannel.participant0) } },
						$participant1: { [EntityMetaKey.Id]: { address: EvmAddress.assert(stateChannel.participant1) } },
						$asset: { [EntityMetaKey.Id]: assetId },
						totalDeposited: stateChannel.totalDeposited,
						balance0: stateChannel.balance0,
					balance1: stateChannel.balance1,
					turnNum: stateChannel.turnNum,
					status: stateChannel.status,
					...(stateChannel.roomId != null && { $room: { [EntityMetaKey.Id]: { id: stateChannel.roomId } } }),
					createdAt: stateChannel.createdAt,
					updatedAt: stateChannel.updatedAt,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.StateChannelDeposit,
			resolve: async (entityId) => {
				const catalog = await readNormalizedLocalInternal()
				const stateChannelDeposit = catalog.stateChannelDeposits.find((candidate) => candidate.id === entityId.id)
				if (stateChannelDeposit == null) {
					throw new Error('Local_Internal: StateChannelDeposit not present in local catalog')
					}
					return {
						$channel: { [EntityMetaKey.Id]: { id: stateChannelDeposit.channelId } },
							$network: { [EntityMetaKey.Id]: { caip2: { namespace: 'eip155' as const, reference: String(stateChannelDeposit.chainId) } } },
						$account: { [EntityMetaKey.Id]: { address: EvmAddress.assert(stateChannelDeposit.accountAddress) } },
						availableBalance: stateChannelDeposit.availableBalance,
						lockedBalance: stateChannelDeposit.lockedBalance,
						lastUpdated: stateChannelDeposit.lastUpdated,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.StateChannelTransfer,
			resolve: async (entityId) => {
				const catalog = await readNormalizedLocalInternal()
				const stateChannelTransfer = catalog.stateChannelTransfers.find((candidate) => candidate.id === entityId.id)
				if (stateChannelTransfer == null) {
					throw new Error('Local_Internal: StateChannelTransfer not present in local catalog')
					}
					return {
						$channel: { [EntityMetaKey.Id]: { id: stateChannelTransfer.channelId } },
						$from: { [EntityMetaKey.Id]: { address: EvmAddress.assert(stateChannelTransfer.from) } },
						$to: { [EntityMetaKey.Id]: { address: EvmAddress.assert(stateChannelTransfer.to) } },
						amount: stateChannelTransfer.amount,
						turnNum: stateChannelTransfer.turnNum,
						timestamp: stateChannelTransfer.timestamp,
					status: stateChannelTransfer.status,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.StateChannelState,
			resolve: async (entityId) => {
				const catalog = await readNormalizedLocalInternal()
				const stateChannelState = catalog.stateChannelStates.find((candidate) => candidate.id === entityId.id)
				if (stateChannelState == null) {
					throw new Error('Local_Internal: StateChannelState not present in local catalog')
				}
				return {
					$channel: { [EntityMetaKey.Id]: { id: stateChannelState.channelId } },
					intent: stateChannelState.intent,
					version: stateChannelState.version,
						stateData: stateChannelState.stateData,
						allocations: stateChannelState.allocations.map((allocation) => ({
							destination: EvmAddress.assert(allocation.destination),
							token: EvmAddress.assert(allocation.token),
							amount: allocation.amount,
						})),
					signatures: [...stateChannelState.signatures],
					isFinal: stateChannelState.isFinal,
					timestamp: stateChannelState.timestamp,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BlockheadAgentConversation,
			resolve: async (entityId) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadAgentConversation = catalog.blockheadAgentConversations.find((candidate) => candidate.id === entityId.id)
				if (blockheadAgentConversation == null) {
					throw new Error('Local_Internal: BlockheadAgentConversation not present in local catalog')
				}
				return {
					name: blockheadAgentConversation.name,
					pinned: blockheadAgentConversation.pinned,
					systemPrompt: blockheadAgentConversation.systemPrompt,
					defaultConnectionId: blockheadAgentConversation.defaultConnectionId,
					defaultModelId: blockheadAgentConversation.defaultModelId,
					createdAt: blockheadAgentConversation.createdAt,
					updatedAt: blockheadAgentConversation.updatedAt,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BlockheadAgentConversationTurn,
			resolve: async (entityId) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadAgentConversationTurn = catalog.blockheadAgentConversationTurns.find((candidate) => candidate.id === entityId.id)
				if (blockheadAgentConversationTurn == null) {
					throw new Error('Local_Internal: BlockheadAgentConversationTurn not present in local catalog')
				}
				return {
					$conversation: {
						[EntityMetaKey.Id]: { id: blockheadAgentConversationTurn.conversationId },
					},
					parentId: blockheadAgentConversationTurn.parentId,
					userPrompt: blockheadAgentConversationTurn.userPrompt,
					assistantText: blockheadAgentConversationTurn.assistantText,
					providerId: blockheadAgentConversationTurn.providerId,
					status: blockheadAgentConversationTurn.status,
					...(blockheadAgentConversationTurn.error != null && { error: blockheadAgentConversationTurn.error }),
					createdAt: blockheadAgentConversationTurn.createdAt,
					promptVersion: blockheadAgentConversationTurn.promptVersion,
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
					sliceNormalizedRowsForSubset((await readNormalizedLocalInternal()).actors, context)
						.map((actor) => ({
							[EntityMetaKey.Id]: { address: EvmAddress.assert(actor.address) },
						}))
				),
			}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$xmtpConversations',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).xmtpConversations,
					context,
				)
					.map((xmtpConversation) => ({
						[EntityMetaKey.Id]: { id: xmtpConversation.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.XmtpNetwork,
			fieldName: '$$xmtpConversations',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType.XmtpNetwork>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).xmtpConversations,
					context,
				)
					.map((xmtpConversation) => ({
						[EntityMetaKey.Id]: { id: xmtpConversation.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadSources',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadSources,
					context,
				)
					.map((blockheadSource) => ({
						[EntityMetaKey.Id]: { id: blockheadSource.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadWallets',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadWallets,
					context,
				)
					.map((blockheadWallet) => ({
						[EntityMetaKey.Id]: { id: blockheadWallet.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadWalletConnections',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadWalletConnections,
					context,
				)
					.map((blockheadWalletConnection) => ({
						[EntityMetaKey.Id]: {
							$wallet: {
								id: blockheadWalletConnection.walletId,
							},
						},
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadWalletAccounts',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadWalletAccounts,
					context,
				)
					.map((blockheadWalletAccount) => ({
						[EntityMetaKey.Id]: {
							caip10: {
								namespace: blockheadWalletAccount.namespace,
								reference: blockheadWalletAccount.reference,
								accountAddress: blockheadWalletAccount.accountAddress,
							},
						},
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadSessions',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadSessions,
					context,
				)
					.map((blockheadSession) => ({
						[EntityMetaKey.Id]: { id: blockheadSession.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.BlockheadSession,
			fieldName: '$$actions',
			resolve: async (
				scopedEntityId: EntityId<typeof schema, EntityType.BlockheadSession>,
				context,
			) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadSessionActions
						.filter((sessionAction) => sessionAction.sessionId === scopedEntityId.id)
						.toSorted((left, right) => left.indexInSequence - right.indexInSequence),
					context,
				)
					.map((sessionAction) => ({
						[EntityMetaKey.Id]: {
							sessionId: sessionAction.sessionId,
							actionId: sessionAction.actionId,
						},
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadPanelTrees',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadPanelTrees,
					context,
				)
					.map((blockheadPanelTree) => ({
						[EntityMetaKey.Id]: { id: blockheadPanelTree.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadFarcasterAccountConnections',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadFarcasterAccountConnections,
					context,
				)
					.map((blockheadFarcasterAccountConnection) => ({
						[EntityMetaKey.Id]: { fid: blockheadFarcasterAccountConnection.fid },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadAgentConversations',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadAgentConversations,
					context,
				)
					.map((blockheadAgentConversation) => ({
						[EntityMetaKey.Id]: { id: blockheadAgentConversation.id },
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
					(await readNormalizedLocalInternal()).blockheadAgentConversationTurns
						.filter((conversationTurn) => conversationTurn.conversationId === scopedEntityId.id),
					context,
				)
					.map((conversationTurn) => ({
						[EntityMetaKey.Id]: { id: conversationTurn.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$bridgeTransactions',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).bridgeTransactions,
					context,
				)
						.map((bridgeTransaction) => ({
							[EntityMetaKey.Id]: {
								$account: { address: EvmAddress.assert(bridgeTransaction.accountAddress) },
								$sourceTx: {
									$network: { caip2: { namespace: 'eip155' as const, reference: String(bridgeTransaction.chainId) } },
									txHash: ZeroExHex.assert(bridgeTransaction.txHash),
								},
							createdAt: bridgeTransaction.createdAt,
						},
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.BlockheadRoom,
			fieldName: '$$peers',
			resolve: async (entityId, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadRoomPeers.filter((roomPeer) => (
						roomPeer.roomId === entityId.id
					)),
					context,
				)
					.map((roomPeer) => ({
						[EntityMetaKey.Id]: { id: roomPeer.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadRoomPeers',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadRoomPeers,
					context,
				)
					.map((blockheadRoomPeer) => ({
						[EntityMetaKey.Id]: { id: blockheadRoomPeer.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadRooms',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadRooms,
					context,
				)
					.map((blockheadRoom) => ({
						[EntityMetaKey.Id]: { id: blockheadRoom.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$stateChannels',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).stateChannels,
					context,
				)
					.map((stateChannel) => ({
						[EntityMetaKey.Id]: { id: stateChannel.id },
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
					(await readNormalizedLocalInternal()).stateChannelTransfers
						.filter((stateChannelTransfer) => stateChannelTransfer.channelId === scopedEntityId.id),
					context,
				)
					.map((stateChannelTransfer) => ({
						[EntityMetaKey.Id]: { id: stateChannelTransfer.id },
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
					(await readNormalizedLocalInternal()).stateChannelStates
						.filter((stateChannelState) => stateChannelState.channelId === scopedEntityId.id),
					context,
				)
					.map((stateChannelState) => ({
						[EntityMetaKey.Id]: { id: stateChannelState.id },
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
					(await readNormalizedLocalInternal()).stateChannelDeposits
						.filter((stateChannelDeposit) => stateChannelDeposit.channelId === scopedEntityId.id),
					context,
				)
					.map((stateChannelDeposit) => ({
						[EntityMetaKey.Id]: { id: stateChannelDeposit.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$blockheadSharedAddresses',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadSharedAddresses,
					context,
				)
					.map((blockheadSharedAddress) => ({
						[EntityMetaKey.Id]: { id: blockheadSharedAddress.id },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmProtocol,
			fieldName: '$$evmSelectors',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType.EvmProtocol>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).evmSelectors,
					context,
				)
					.map((evmSelector) => ({
						[EntityMetaKey.Id]: { hex: evmSelector.hex },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmProtocol,
			fieldName: '$$evmTopics',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType.EvmProtocol>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).evmTopics,
					context,
				)
					.map((evmTopic) => ({
						[EntityMetaKey.Id]: { hex: evmTopic.hex },
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmProtocol,
			fieldName: '$$evmErrors',
			resolve: async (_scopedEntityId: EntityId<typeof schema, EntityType.EvmProtocol>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).evmErrors,
					context,
				)
					.map((evmError) => ({
						[EntityMetaKey.Id]: { hex: evmError.hex },
					}))
			),
		}),
	],
}
