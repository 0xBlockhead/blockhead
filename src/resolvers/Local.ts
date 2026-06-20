import { resolverContextRowLimit, type ResolverContext } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'
import { BridgeTransactionSelector } from '$/schema/BridgeTransaction.ts'
import { XmtpConversationSelector } from '$/schema/XmtpConversation.ts'
import { BlockheadSourceSelector } from '$/schema/BlockheadSource.ts'
import { BlockheadWalletSelector } from '$/schema/BlockheadWallet.ts'
import { BlockheadWalletAccountSelector } from '$/schema/BlockheadWalletAccount.ts'
import { BlockheadWalletConnectionSelector } from '$/schema/BlockheadWalletConnection.ts'
import { BlockheadPanelTreeSelector } from '$/schema/BlockheadPanelTree.ts'
import { BlockheadRoomSelector } from '$/schema/BlockheadRoom.ts'
import { BlockheadSessionSelector } from '$/schema/BlockheadSession.ts'
import { BlockheadSessionActionSelector } from '$/schema/BlockheadSessionAction.ts'
import { BlockheadRoomPeerSelector } from '$/schema/BlockheadRoomPeer.ts'
import { BlockheadSharedAddressSelector } from '$/schema/BlockheadSharedAddress.ts'
import { StateChannelSelector } from '$/schema/StateChannel.ts'
import { StateChannelDepositSelector } from '$/schema/StateChannelDeposit.ts'
import { StateChannelTransferSelector } from '$/schema/StateChannelTransfer.ts'
import { StateChannelStateSelector } from '$/schema/StateChannelState.ts'
import { BlockheadAgentConversationSelector } from '$/schema/BlockheadAgentConversation.ts'
import { BlockheadAgentConversationTurnSelector } from '$/schema/BlockheadAgentConversationTurn.ts'
import { EvmContractSelector } from '$/schema/EvmContract.ts'
import { XmtpNetworkSelector } from '$/schema/XmtpNetwork.ts'
import { EvmProtocolSelector } from '$/schema/EvmProtocol.ts'

const sliceNormalizedRowsForSubset = <_Row>(
	normalizedCatalogRows: readonly _Row[],
	context: ResolverContext
): readonly _Row[] => (
	normalizedCatalogRows.slice(0, resolverContextRowLimit(context))
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

	resolvers: [
		defineResolver(Source.Local_Internal, {
			entityType: EntityType.XmtpConversation,
			resolve: {
				[XmtpConversationSelector.Id]: async ({ id }) => {
				const conversationId = id
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
			}
			},
		})({
				fields: {
				peerInboxId: (conversation) => conversation.peerInboxId,
				topic: (conversation) => conversation.topic,
				createdAtMs: (conversation) => conversation.createdAtMs,
				consentState: (conversation) => conversation.consentState,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadWallet,
			resolve: {
				[BlockheadWalletSelector.Id]: async ({ id }) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadWallet = catalog.blockheadWallets.find((candidate) => candidate.id === id)
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
			}
			},
		})({
				fields: {
				name: (wallet) => wallet.name,
				icon: (wallet) => wallet.icon,
				protocol: (wallet) => wallet.protocol,
				discoveryKind: (wallet) => wallet.discoveryKind,
				transportKind: (wallet) => wallet.transportKind,
				rdns: (wallet) => wallet.rdns,
				websiteUrl: (wallet) => wallet.websiteUrl,
				capabilities: (wallet) => wallet.capabilities,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadWalletAccount,
			resolve: {
				[BlockheadWalletAccountSelector.Caip10]: async ({ caip10 }) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadWalletAccount = catalog.blockheadWalletAccounts.find((candidate) => (
					candidate.namespace === caip10.namespace
					&& candidate.reference === caip10.reference
					&& candidate.accountAddress === caip10.accountAddress
				))
				if (blockheadWalletAccount == null) throw new Error('Local_Internal: BlockheadWalletAccount not present in local catalog')
				return {
					$network: {
						[EntityMetaKey.Selector]: {
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
			}
			},
		})({
				fields: {
				$network: (account) => account.$network,
				address: (account) => account.address,
				label: (account) => account.label,
				capabilities: (account) => account.capabilities,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadWalletConnection,
			resolve: {
				[BlockheadWalletConnectionSelector.BlockheadWallet]: async ({ $wallet }) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadWalletConnection = catalog.blockheadWalletConnections.find((candidate) => candidate.walletId === $wallet.id)
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
						[EntityMetaKey.Selector]: {
							caip10: accountId,
						},
					})),
					...(blockheadWalletConnection.activeAccountId != null && {
						$activeAccount: {
							[EntityMetaKey.Selector]: {
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
			}
			},
		})({
				fields: {
				status: (connection) => connection.status,
				protocol: (connection) => connection.protocol,
				transportKind: (connection) => connection.transportKind,
				scopes: (connection) => connection.scopes,
				$$connectedAccounts: (connection) => connection.$$connectedAccounts,
				$activeAccount: (connection) => connection.$activeAccount,
				selected: (connection) => connection.selected,
				connectedAt: (connection) => connection.connectedAt,
				disconnectedAt: (connection) => connection.disconnectedAt,
				sessionId: (connection) => connection.sessionId,
				sessionTopic: (connection) => connection.sessionTopic,
				error: (connection) => connection.error,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadRoom,
			resolve: {
				[BlockheadRoomSelector.Id]: async ({ id }) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadRoom = catalog.blockheadRooms.find((candidate) => candidate.id === id)
				if (blockheadRoom == null) throw new Error('Local_Internal: BlockheadRoom not present in local catalog')
				return {
					createdAt: blockheadRoom.createdAt,
					createdBy: blockheadRoom.createdBy,
					...(blockheadRoom.name != null && { name: blockheadRoom.name }),
				}
			}
			},
		})({
				fields: {
				createdAt: (room) => room.createdAt,
				createdBy: (room) => room.createdBy,
				name: (room) => room.name,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadSession,
			resolve: {
				[BlockheadSessionSelector.Id]: async ({ id }) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadSession = catalog.blockheadSessions.find((candidate) => candidate.id === id)
				if (blockheadSession == null) throw new Error('Local_Internal: BlockheadSession not present in local catalog')
				return {
					...(blockheadSession.name != null && { name: blockheadSession.name }),
					status: blockheadSession.status,
					createdAt: blockheadSession.createdAt,
					updatedAt: blockheadSession.updatedAt,
					...(blockheadSession.lockedAt != null && { lockedAt: blockheadSession.lockedAt }),
					...(blockheadSession.simulationCount != null && { simulationCount: blockheadSession.simulationCount }),
				}
			}
			},
		})({
				fields: {
				name: (session) => session.name,
				status: (session) => session.status,
				createdAt: (session) => session.createdAt,
				updatedAt: (session) => session.updatedAt,
				lockedAt: (session) => session.lockedAt,
				simulationCount: (session) => session.simulationCount,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadSessionAction,
			resolve: {
				[BlockheadSessionActionSelector.SessionIdActionId]: async ({ actionId, sessionId }) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadSessionAction = catalog.blockheadSessionActions.find((candidate) => (
					candidate.sessionId === sessionId
					&& candidate.actionId === actionId
				))
				if (blockheadSessionAction == null) throw new Error('Local_Internal: BlockheadSessionAction not present in local catalog')
				return {
					$session: {
						[EntityMetaKey.Selector]: {
							id: blockheadSessionAction.sessionId,
						},
					},
					indexInSequence: blockheadSessionAction.indexInSequence,
					action: blockheadSessionAction.action,
					createdAt: blockheadSessionAction.createdAt,
					updatedAt: blockheadSessionAction.updatedAt,
				}
			}
			},
		})({
				fields: {
				$session: (action) => action.$session,
				indexInSequence: (action) => action.indexInSequence,
				action: (action) => action.action,
				createdAt: (action) => action.createdAt,
				updatedAt: (action) => action.updatedAt,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadRoomPeer,
			resolve: {
				[BlockheadRoomPeerSelector.Id]: async ({ id }) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadRoomPeer = catalog.blockheadRoomPeers.find((candidate) => candidate.id === id)
				if (blockheadRoomPeer == null) throw new Error('Local_Internal: BlockheadRoomPeer not present in local catalog')
				return {
					$room: { [EntityMetaKey.Selector]: { id: blockheadRoomPeer.roomId } },
					peerId: blockheadRoomPeer.peerId,
					...(blockheadRoomPeer.displayName != null && { displayName: blockheadRoomPeer.displayName }),
					joinedAt: blockheadRoomPeer.joinedAt,
					...(blockheadRoomPeer.lastSeenAt != null && { lastSeenAt: blockheadRoomPeer.lastSeenAt }),
					...(blockheadRoomPeer.connectedAt != null && { connectedAt: blockheadRoomPeer.connectedAt }),
					...(blockheadRoomPeer.disconnectedAt != null && { disconnectedAt: blockheadRoomPeer.disconnectedAt }),
					isConnected: blockheadRoomPeer.isConnected,
				}
			}
			},
		})({
				fields: {
				$room: (peer) => peer.$room,
				peerId: (peer) => peer.peerId,
				displayName: (peer) => peer.displayName,
				joinedAt: (peer) => peer.joinedAt,
				lastSeenAt: (peer) => peer.lastSeenAt,
				connectedAt: (peer) => peer.connectedAt,
				disconnectedAt: (peer) => peer.disconnectedAt,
				isConnected: (peer) => peer.isConnected,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadSharedAddress,
			resolve: {
				[BlockheadSharedAddressSelector.Id]: async ({ id }) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadSharedAddress = catalog.blockheadSharedAddresses.find((candidate) => candidate.id === id)
				if (blockheadSharedAddress == null) {
					throw new Error('Local_Internal: BlockheadSharedAddress not present in local catalog')
					}
					return {
						$network: { [EntityMetaKey.Selector]: { caip2: { namespace: 'eip155' as const, reference: String(blockheadSharedAddress.chainId) } } },
						$room: { [EntityMetaKey.Selector]: { id: blockheadSharedAddress.roomId } },
						peerId: blockheadSharedAddress.peerId,
						$account: { [EntityMetaKey.Selector]: { address: EvmAddress.assert(blockheadSharedAddress.accountAddress) } },
						targetPeerIds: blockheadSharedAddress.targetPeerIds,
						sharedAt: blockheadSharedAddress.sharedAt,
					}
			}
			},
		})({
				fields: {
				$network: (address) => address.$network,
				$room: (address) => address.$room,
				peerId: (address) => address.peerId,
				$account: (address) => address.$account,
				targetPeerIds: (address) => address.targetPeerIds,
				sharedAt: (address) => address.sharedAt,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.StateChannel,
			resolve: {
				[StateChannelSelector.Id]: async ({ id }) => {
				const catalog = await readNormalizedLocalInternal()
				const stateChannel = catalog.stateChannels.find((candidate) => candidate.id === id)
					if (stateChannel == null) throw new Error('Local_Internal: StateChannel not present in local catalog')
					const assetId = await coinInstanceIdForNormalizedStateChannelRow(stateChannel)
					return {
							$network: { [EntityMetaKey.Selector]: { caip2: { namespace: 'eip155' as const, reference: String(stateChannel.chainId) } } },
						$participant0: { [EntityMetaKey.Selector]: { address: EvmAddress.assert(stateChannel.participant0) } },
						$participant1: { [EntityMetaKey.Selector]: { address: EvmAddress.assert(stateChannel.participant1) } },
						$asset: { [EntityMetaKey.Selector]: assetId },
						totalDeposited: stateChannel.totalDeposited,
						balance0: stateChannel.balance0,
					balance1: stateChannel.balance1,
					turnNum: stateChannel.turnNum,
					status: stateChannel.status,
					...(stateChannel.roomId != null && { $room: { [EntityMetaKey.Selector]: { id: stateChannel.roomId } } }),
					createdAt: stateChannel.createdAt,
					updatedAt: stateChannel.updatedAt,
				}
			}
			},
		})({
				fields: {
				$network: (channel) => channel.$network,
				$participant0: (channel) => channel.$participant0,
				$participant1: (channel) => channel.$participant1,
				$asset: (channel) => channel.$asset,
				totalDeposited: (channel) => channel.totalDeposited,
				balance0: (channel) => channel.balance0,
				balance1: (channel) => channel.balance1,
				turnNum: (channel) => channel.turnNum,
				status: (channel) => channel.status,
				$room: (channel) => channel.$room,
				createdAt: (channel) => channel.createdAt,
				updatedAt: (channel) => channel.updatedAt,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.StateChannelDeposit,
			resolve: {
				[StateChannelDepositSelector.Id]: async ({ id }) => {
				const catalog = await readNormalizedLocalInternal()
				const stateChannelDeposit = catalog.stateChannelDeposits.find((candidate) => candidate.id === id)
				if (stateChannelDeposit == null) {
					throw new Error('Local_Internal: StateChannelDeposit not present in local catalog')
					}
					return {
						$channel: { [EntityMetaKey.Selector]: { id: stateChannelDeposit.channelId } },
							$network: { [EntityMetaKey.Selector]: { caip2: { namespace: 'eip155' as const, reference: String(stateChannelDeposit.chainId) } } },
						$account: { [EntityMetaKey.Selector]: { address: EvmAddress.assert(stateChannelDeposit.accountAddress) } },
						availableBalance: stateChannelDeposit.availableBalance,
						lockedBalance: stateChannelDeposit.lockedBalance,
						lastUpdated: stateChannelDeposit.lastUpdated,
				}
			}
			},
		})({
				fields: {
				$channel: (deposit) => deposit.$channel,
				$network: (deposit) => deposit.$network,
				$account: (deposit) => deposit.$account,
				availableBalance: (deposit) => deposit.availableBalance,
				lockedBalance: (deposit) => deposit.lockedBalance,
				lastUpdated: (deposit) => deposit.lastUpdated,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.StateChannelTransfer,
			resolve: {
				[StateChannelTransferSelector.Id]: async ({ id }) => {
				const catalog = await readNormalizedLocalInternal()
				const stateChannelTransfer = catalog.stateChannelTransfers.find((candidate) => candidate.id === id)
				if (stateChannelTransfer == null) {
					throw new Error('Local_Internal: StateChannelTransfer not present in local catalog')
					}
					return {
						$channel: { [EntityMetaKey.Selector]: { id: stateChannelTransfer.channelId } },
						$from: { [EntityMetaKey.Selector]: { address: EvmAddress.assert(stateChannelTransfer.from) } },
						$to: { [EntityMetaKey.Selector]: { address: EvmAddress.assert(stateChannelTransfer.to) } },
						amount: stateChannelTransfer.amount,
						turnNum: stateChannelTransfer.turnNum,
						timestamp: stateChannelTransfer.timestamp,
					status: stateChannelTransfer.status,
				}
			}
			},
		})({
				fields: {
				$channel: (transfer) => transfer.$channel,
				$from: (transfer) => transfer.$from,
				$to: (transfer) => transfer.$to,
				amount: (transfer) => transfer.amount,
				turnNum: (transfer) => transfer.turnNum,
				timestamp: (transfer) => transfer.timestamp,
				status: (transfer) => transfer.status,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.StateChannelState,
			resolve: {
				[StateChannelStateSelector.Id]: async ({ id }) => {
				const catalog = await readNormalizedLocalInternal()
				const stateChannelState = catalog.stateChannelStates.find((candidate) => candidate.id === id)
				if (stateChannelState == null) {
					throw new Error('Local_Internal: StateChannelState not present in local catalog')
				}
				return {
					$channel: { [EntityMetaKey.Selector]: { id: stateChannelState.channelId } },
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
			}
			},
		})({
				fields: {
				$channel: (state) => state.$channel,
				intent: (state) => state.intent,
				version: (state) => state.version,
				stateData: (state) => state.stateData,
				allocations: (state) => state.allocations,
				signatures: (state) => state.signatures,
				isFinal: (state) => state.isFinal,
				timestamp: (state) => state.timestamp,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadAgentConversation,
			resolve: {
				[BlockheadAgentConversationSelector.Id]: async ({ id }) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadAgentConversation = catalog.blockheadAgentConversations.find((candidate) => candidate.id === id)
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
			}
			},
		})({
				fields: {
				name: (conversation) => conversation.name,
				pinned: (conversation) => conversation.pinned,
				systemPrompt: (conversation) => conversation.systemPrompt,
				defaultConnectionId: (conversation) => conversation.defaultConnectionId,
				defaultModelId: (conversation) => conversation.defaultModelId,
				createdAt: (conversation) => conversation.createdAt,
				updatedAt: (conversation) => conversation.updatedAt,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadAgentConversationTurn,
			resolve: {
				[BlockheadAgentConversationTurnSelector.Id]: async ({ id }) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadAgentConversationTurn = catalog.blockheadAgentConversationTurns.find((candidate) => candidate.id === id)
				if (blockheadAgentConversationTurn == null) {
					throw new Error('Local_Internal: BlockheadAgentConversationTurn not present in local catalog')
				}
				return {
					$conversation: {
						[EntityMetaKey.Selector]: { id: blockheadAgentConversationTurn.conversationId },
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
			}
			},
		})({
				fields: {
				$conversation: (turn) => turn.$conversation,
				parentId: (turn) => turn.parentId,
				userPrompt: (turn) => turn.userPrompt,
				assistantText: (turn) => turn.assistantText,
				providerId: (turn) => turn.providerId,
				status: (turn) => turn.status,
				error: (turn) => turn.error,
				createdAt: (turn) => turn.createdAt,
				promptVersion: (turn) => turn.promptVersion,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
					sliceNormalizedRowsForSubset((await readNormalizedLocalInternal()).actors, context)
						.map((actor) => ({
							[EntityMetaKey.Selector]: { address: EvmAddress.assert(actor.address) },
						}))
				)
			},
		})({
				fields: {
				$$actors: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).xmtpConversations,
					context
				)
					.map((xmtpConversation) => ({
						[EntityMetaKey.Selector]: { id: xmtpConversation.id },
					}))
			)
			},
		})({
				fields: {
				$$xmtpConversations: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.XmtpNetwork,
			resolve: {
				[XmtpNetworkSelector.Scope]: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType.XmtpNetwork>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).xmtpConversations,
					context
				)
					.map((xmtpConversation) => ({
						[EntityMetaKey.Selector]: { id: xmtpConversation.id },
					}))
			)
			},
		})({
				fields: {
				$$xmtpConversations: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadSources,
					context
				)
					.map((blockheadSource) => ({
						[EntityMetaKey.Selector]: { id: blockheadSource.id },
					}))
			)
			},
		})({
				fields: {
				$$blockheadSources: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadWallets,
					context
				)
					.map((blockheadWallet) => ({
						[EntityMetaKey.Selector]: { id: blockheadWallet.id },
					}))
			)
			},
		})({
				fields: {
				$$blockheadWallets: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadWalletConnections,
					context
				)
					.map((blockheadWalletConnection) => ({
						[EntityMetaKey.Selector]: {
							$wallet: {
								id: blockheadWalletConnection.walletId,
							},
						},
					}))
			)
			},
		})({
				fields: {
				$$blockheadWalletConnections: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadWalletAccounts,
					context
				)
					.map((blockheadWalletAccount) => ({
						[EntityMetaKey.Selector]: {
							caip10: {
								namespace: blockheadWalletAccount.namespace,
								reference: blockheadWalletAccount.reference,
								accountAddress: blockheadWalletAccount.accountAddress,
							},
						},
					}))
			)
			},
		})({
				fields: {
				$$blockheadWalletAccounts: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadSessions,
					context
				)
					.map((blockheadSession) => ({
						[EntityMetaKey.Selector]: { id: blockheadSession.id },
					}))
			)
			},
		})({
				fields: {
				$$blockheadSessions: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadSession,
			resolve: {
				[BlockheadSessionSelector.Id]: async (
				scopedEntitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>,
				context
			) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadSessionActions
						.filter((sessionAction) => sessionAction.sessionId === scopedEntitySelector.id)
						.toSorted((left, right) => left.indexInSequence - right.indexInSequence),
					context
				)
					.map((sessionAction) => ({
						[EntityMetaKey.Selector]: {
							sessionId: sessionAction.sessionId,
							actionId: sessionAction.actionId,
						},
					}))
			)
			},
		})({
				fields: {
				$$actions: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadPanelTrees,
					context
				)
					.map((blockheadPanelTree) => ({
						[EntityMetaKey.Selector]: { id: blockheadPanelTree.id },
					}))
			)
			},
		})({
				fields: {
				$$blockheadPanelTrees: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadFarcasterAccountConnections,
					context
				)
					.map((blockheadFarcasterAccountConnection) => ({
						[EntityMetaKey.Selector]: { fid: blockheadFarcasterAccountConnection.fid },
					}))
			)
			},
		})({
				fields: {
				$$blockheadFarcasterAccountConnections: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadAgentConversations,
					context
				)
					.map((blockheadAgentConversation) => ({
						[EntityMetaKey.Selector]: { id: blockheadAgentConversation.id },
					}))
			)
			},
		})({
				fields: {
				$$blockheadAgentConversations: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadAgentConversation,
			resolve: {
				[BlockheadAgentConversationSelector.Id]: async (
				scopedEntitySelector: EntitySelector<typeof schema, EntityType.BlockheadAgentConversation>,
				context
			) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadAgentConversationTurns
						.filter((conversationTurn) => conversationTurn.conversationId === scopedEntitySelector.id),
					context
				)
					.map((conversationTurn) => ({
						[EntityMetaKey.Selector]: { id: conversationTurn.id },
					}))
			)
			},
		})({
				fields: {
				$$turns: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).bridgeTransactions,
					context
				)
						.map((bridgeTransaction) => ({
							[EntityMetaKey.Selector]: {
								$account: { address: EvmAddress.assert(bridgeTransaction.accountAddress) },
								$sourceTx: {
									$network: { caip2: { namespace: 'eip155' as const, reference: String(bridgeTransaction.chainId) } },
									txHash: ZeroExHex.assert(bridgeTransaction.txHash),
								},
							createdAt: bridgeTransaction.createdAt,
						},
					}))
			)
			},
		})({
				fields: {
				$$bridgeTransactions: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadRoom,
			resolve: {
				[BlockheadRoomSelector.Id]: async ({ id }, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadRoomPeers.filter((roomPeer) => (
						roomPeer.roomId === id
					)),
					context
				)
					.map((roomPeer) => ({
						[EntityMetaKey.Selector]: { id: roomPeer.id },
					}))
			)
			},
		})({
				fields: {
				$$peers: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadRoomPeers,
					context
				)
					.map((blockheadRoomPeer) => ({
						[EntityMetaKey.Selector]: { id: blockheadRoomPeer.id },
					}))
			)
			},
		})({
				fields: {
				$$blockheadRoomPeers: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadRooms,
					context
				)
					.map((blockheadRoom) => ({
						[EntityMetaKey.Selector]: { id: blockheadRoom.id },
					}))
			)
			},
		})({
				fields: {
				$$blockheadRooms: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).stateChannels,
					context
				)
					.map((stateChannel) => ({
						[EntityMetaKey.Selector]: { id: stateChannel.id },
					}))
			)
			},
		})({
				fields: {
				$$stateChannels: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.StateChannel,
			resolve: {
				[StateChannelSelector.Id]: async (
				scopedEntitySelector: EntitySelector<typeof schema, EntityType.StateChannel>,
				context
			) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).stateChannelTransfers
						.filter((stateChannelTransfer) => stateChannelTransfer.channelId === scopedEntitySelector.id),
					context
				)
					.map((stateChannelTransfer) => ({
						[EntityMetaKey.Selector]: { id: stateChannelTransfer.id },
					}))
			)
			},
		})({
				fields: {
				$$transfers: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.StateChannel,
			resolve: {
				[StateChannelSelector.Id]: async (
				scopedEntitySelector: EntitySelector<typeof schema, EntityType.StateChannel>,
				context
			) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).stateChannelStates
						.filter((stateChannelState) => stateChannelState.channelId === scopedEntitySelector.id),
					context
				)
					.map((stateChannelState) => ({
						[EntityMetaKey.Selector]: { id: stateChannelState.id },
					}))
			)
			},
		})({
				fields: {
				$$states: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.StateChannel,
			resolve: {
				[StateChannelSelector.Id]: async (
				scopedEntitySelector: EntitySelector<typeof schema, EntityType.StateChannel>,
				context
			) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).stateChannelDeposits
						.filter((stateChannelDeposit) => stateChannelDeposit.channelId === scopedEntitySelector.id),
					context
				)
					.map((stateChannelDeposit) => ({
						[EntityMetaKey.Selector]: { id: stateChannelDeposit.id },
					}))
			)
			},
		})({
				fields: {
				$$deposits: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).blockheadSharedAddresses,
					context
				)
					.map((blockheadSharedAddress) => ({
						[EntityMetaKey.Selector]: { id: blockheadSharedAddress.id },
					}))
			)
			},
		})({
				fields: {
				$$blockheadSharedAddresses: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.EvmProtocol,
			resolve: {
				[EvmProtocolSelector.Scope]: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType.EvmProtocol>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).evmSelectors,
					context
				)
					.map((evmSelector) => ({
						[EntityMetaKey.Selector]: { hex: evmSelector.hex },
					}))
			)
			},
		})({
				fields: {
				$$evmSelectors: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.EvmProtocol,
			resolve: {
				[EvmProtocolSelector.Scope]: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType.EvmProtocol>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).evmTopics,
					context
				)
					.map((evmTopic) => ({
						[EntityMetaKey.Selector]: { hex: evmTopic.hex },
					}))
			)
			},
		})({
				fields: {
				$$evmTopics: (entity) => entity,
			},
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.EvmProtocol,
			resolve: {
				[EvmProtocolSelector.Scope]: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType.EvmProtocol>, context) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).evmErrors,
					context
				)
					.map((evmError) => ({
						[EntityMetaKey.Selector]: { hex: evmError.hex },
					}))
			)
			},
		})({
				fields: {
				$$evmErrors: (entity) => entity,
			},
			}),
	],
}
