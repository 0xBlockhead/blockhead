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
import { walletConnectionMethodById } from '$/constants/Wallet.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'
import { XmtpConversationSelector } from '$/schema/XmtpConversation.ts'
import { WalletConnectionMethodSelector } from '$/schema/WalletConnectionMethod.ts'
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
import { BlockheadSiweChallengeSelector } from '$/schema/BlockheadSiweChallenge.ts'
import { BlockheadSocialPostSessionSelector } from '$/schema/BlockheadSocialPostSession.ts'
import { BlockheadStateChannelSelector } from '$/schema/BlockheadStateChannel.ts'
import { BlockheadStateChannel_TimestampSelector } from '$/schema/BlockheadStateChannel_Timestamp.ts'
import { BlockheadStateChannelDepositSelector } from '$/schema/BlockheadStateChannelDeposit.ts'
import { BlockheadStateChannelDeposit_TimestampSelector } from '$/schema/BlockheadStateChannelDeposit_Timestamp.ts'
import { BlockheadStateChannelTransferSelector } from '$/schema/BlockheadStateChannelTransfer.ts'
import { BlockheadStateChannelStateSelector } from '$/schema/BlockheadStateChannelState.ts'
import { BlockheadTransferRequestSelector } from '$/schema/BlockheadTransferRequest.ts'
import { BlockheadAgentConversationSelector } from '$/schema/BlockheadAgentConversation.ts'
import { BlockheadAgentConversationTurnSelector } from '$/schema/BlockheadAgentConversationTurn.ts'
import { BlockheadEnsNameSearchSelector } from '$/schema/BlockheadEnsNameSearch.ts'
import { BlockheadFilecoinPendingMessageSelector } from '$/schema/BlockheadFilecoinPendingMessage.ts'
import { BlockheadBridgeTransactionSelector } from '$/schema/BlockheadBridgeTransaction.ts'
import { BlockheadFarcasterAccountConnectionSelector } from '$/schema/BlockheadFarcasterAccountConnection.ts'
import { normalize as ensNormalizeNode, toString as ensToString } from '@tevm/voltaire/Ens'
import { EvmContractSelector } from '$/schema/EvmContract.ts'
import { XmtpNetworkSelector } from '$/schema/XmtpNetwork.ts'
import { _GlobalEvmAbiCatalogSelector } from '$/schema/_GlobalEvmAbiCatalog.ts'
import { _GlobalEvmAbiCatalog_TimestampSelector } from '$/schema/_GlobalEvmAbiCatalog_Timestamp.ts'

const sliceNormalizedRowsForSubset = <_Row>(
	normalizedCatalogRows: readonly _Row[],
	context: ResolverContext
): readonly _Row[] => (
	normalizedCatalogRows.slice(0, resolverContextRowLimit(context))
)

const readNormalizedLocalInternal = async () => (
	(await import('$/sources/Local/Internal/catalog.ts')).readNormalizedLocalInternal()
)

const globalEvmAbiCatalogTimestampFields = async ({
	scope,
	timestampMs,
}: {
	scope: string
	timestampMs: number
}) => {
	const normalizedLocalInternal = await readNormalizedLocalInternal()
	return {
		[EntityMetaKey.Selector]: {
			$hub: {
				scope,
			},
			timestampMs,
			source: Source.Local_Internal,
		},
		$hub: {
			[EntityMetaKey.Selector]: {
				scope,
			},
		},
		timestampMs,
		source: Source.Local_Internal,
		seededSelectorCount: normalizedLocalInternal.evmSelectors.length,
		seededTopicCount: normalizedLocalInternal.evmTopics.length,
		seededErrorCount: normalizedLocalInternal.evmErrors.length,
		reachable: true,
	}
}

const blockheadConnectionStatusByLocalStatus = {
	disconnected: BlockheadConnectionStatus.Disconnected,
	connecting: BlockheadConnectionStatus.Connecting,
	connected: BlockheadConnectionStatus.Connected,
	error: BlockheadConnectionStatus.Error,
} as const

const stateChannelTimestampFields = (stateChannel: {
	id: string
	totalDeposited: bigint
	balance0: bigint
	balance1: bigint
	turnNum: number
	status: string
	updatedAt: number
}) => ({
	[EntityMetaKey.Selector]: {
		$channel: {
			id: stateChannel.id,
		},
		timestampMs: stateChannel.updatedAt,
		source: Source.Local_Internal,
	},
	$channel: {
		[EntityMetaKey.Selector]: {
			id: stateChannel.id,
		},
	},
	timestampMs: stateChannel.updatedAt,
	source: Source.Local_Internal,
	totalDeposited: stateChannel.totalDeposited,
	balance0: stateChannel.balance0,
	balance1: stateChannel.balance1,
	turnNum: stateChannel.turnNum,
	status: stateChannel.status,
})

const stateChannelDepositTimestampFields = (stateChannelDeposit: {
	channelId: string
	accountAddress: string
	availableBalance: bigint
	lockedBalance: bigint
	lastUpdated: number
}) => ({
	[EntityMetaKey.Selector]: {
		$deposit: {
			$channel: {
				id: stateChannelDeposit.channelId,
			},
			$account: {
				address: EvmAddress.assert(stateChannelDeposit.accountAddress),
			},
		},
		timestampMs: stateChannelDeposit.lastUpdated,
		source: Source.Local_Internal,
	},
	$deposit: {
		[EntityMetaKey.Selector]: {
			$channel: {
				id: stateChannelDeposit.channelId,
			},
			$account: {
				address: EvmAddress.assert(stateChannelDeposit.accountAddress),
			},
		},
	},
	timestampMs: stateChannelDeposit.lastUpdated,
	source: Source.Local_Internal,
	availableBalance: stateChannelDeposit.availableBalance,
	lockedBalance: stateChannelDeposit.lockedBalance,
})

const coinInstanceIdForNormalizedStateChannelRow = async (
	...args: Parameters<typeof import('$/sources/Local/Internal/catalog.ts').coinInstanceIdForNormalizedStateChannelRow>
			) => (
	(await import('$/sources/Local/Internal/catalog.ts')).coinInstanceIdForNormalizedStateChannelRow(...args)
)

const normalizedBlockheadEnsNameSearchQuery = (query: string): string => {
	const trimmedQuery = query.trim()
	if (trimmedQuery === '') throw new Error('Local_Internal: empty ENS name search query')
	try {
		return ensToString(ensNormalizeNode(trimmedQuery))
	} catch {
		return trimmedQuery.toLowerCase()
	}
}

const findNormalizedBridgeTransactionRow = async (
	...args: Parameters<typeof import('$/sources/Local/Internal/catalog.ts').findNormalizedBridgeTransactionRow>
			) => (
	(await import('$/sources/Local/Internal/catalog.ts')).findNormalizedBridgeTransactionRow(...args)
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
				peerInboxId: (conversation) => conversation.peerInboxId,
				topic: (conversation) => conversation.topic,
				createdAtMs: (conversation) => conversation.createdAtMs,
				consentState: (conversation) => conversation.consentState,
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
				name: (wallet) => wallet.name,
				icon: (wallet) => wallet.icon,
				protocol: (wallet) => wallet.protocol,
				discoveryKind: (wallet) => wallet.discoveryKind,
				transportKind: (wallet) => wallet.transportKind,
				rdns: (wallet) => wallet.rdns,
				websiteUrl: (wallet) => wallet.websiteUrl,
				capabilities: (wallet) => wallet.capabilities,
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.WalletConnectionMethod,
			resolve: {
				[WalletConnectionMethodSelector.Id]: async ({ id }) => {
				const walletConnectionMethod = walletConnectionMethodById[id]
				if (walletConnectionMethod == null) throw new Error('Local_Internal: WalletConnectionMethod not present in local catalog')
				return {
					label: walletConnectionMethod.label,
					protocol: walletConnectionMethod.protocol,
					discoveryKind: walletConnectionMethod.discoveryKind,
					transportKind: walletConnectionMethod.transportKind,
					formFactors: walletConnectionMethod.formFactors,
					networkNamespaces: walletConnectionMethod.networkNamespaces,
					caipNamespaces: walletConnectionMethod.caipNamespaces,
					capabilities: walletConnectionMethod.capabilities,
					implementationStatus: walletConnectionMethod.implementationStatus,
					dependencyPolicy: walletConnectionMethod.dependencyPolicy,
				}
			}
			},
		})({
				label: (method) => method.label,
				protocol: (method) => method.protocol,
				discoveryKind: (method) => method.discoveryKind,
				transportKind: (method) => method.transportKind,
				formFactors: (method) => method.formFactors,
				networkNamespaces: (method) => method.networkNamespaces,
				caipNamespaces: (method) => method.caipNamespaces,
				capabilities: (method) => method.capabilities,
				implementationStatus: (method) => method.implementationStatus,
				dependencyPolicy: (method) => method.dependencyPolicy,
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
				$network: (account) => account.$network,
				address: (account) => account.address,
				label: (account) => account.label,
				capabilities: (account) => account.capabilities,
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
				createdAt: (room) => room.createdAt,
				createdBy: (room) => room.createdBy,
				name: (room) => room.name,
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
				name: (session) => session.name,
				status: (session) => session.status,
				createdAt: (session) => session.createdAt,
				updatedAt: (session) => session.updatedAt,
				lockedAt: (session) => session.lockedAt,
				simulationCount: (session) => session.simulationCount,
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
					actionType: blockheadSessionAction.action.type,
					actionParams: blockheadSessionAction.action.params,
					createdAt: blockheadSessionAction.createdAt,
					updatedAt: blockheadSessionAction.updatedAt,
				}
			}
			},
		})({
				$session: (action) => action.$session,
				indexInSequence: (action) => action.indexInSequence,
				actionType: (action) => action.actionType,
				actionParams: (action) => action.actionParams,
				createdAt: (action) => action.createdAt,
				updatedAt: (action) => action.updatedAt,
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadSocialPostSession,
			resolve: {
				[BlockheadSocialPostSessionSelector.Id]: async ({ id }) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadSocialPostSession = catalog.blockheadSocialPostSessions.find((candidate) => candidate.id === id)
				if (blockheadSocialPostSession == null) {
					throw new Error('Local_Internal: BlockheadSocialPostSession not present in local catalog')
				}
				return {
					...(blockheadSocialPostSession.name != null && { name: blockheadSocialPostSession.name }),
					status: blockheadSocialPostSession.status,
					protocol: blockheadSocialPostSession.protocol,
					authorId: blockheadSocialPostSession.authorId,
					createdAt: blockheadSocialPostSession.createdAt,
					updatedAt: blockheadSocialPostSession.updatedAt,
					...(blockheadSocialPostSession.lockedAt != null && { lockedAt: blockheadSocialPostSession.lockedAt }),
				}
			}
			},
		})({
				name: (session) => session.name,
				status: (session) => session.status,
				protocol: (session) => session.protocol,
				authorId: (session) => session.authorId,
				createdAt: (session) => session.createdAt,
				updatedAt: (session) => session.updatedAt,
				lockedAt: (session) => session.lockedAt,
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
				$room: (peer) => peer.$room,
				peerId: (peer) => peer.peerId,
				displayName: (peer) => peer.displayName,
				joinedAt: (peer) => peer.joinedAt,
				lastSeenAt: (peer) => peer.lastSeenAt,
				connectedAt: (peer) => peer.connectedAt,
				disconnectedAt: (peer) => peer.disconnectedAt,
				isConnected: (peer) => peer.isConnected,
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
				$network: (address) => address.$network,
				$room: (address) => address.$room,
				peerId: (address) => address.peerId,
				$account: (address) => address.$account,
				targetPeerIds: (address) => address.targetPeerIds,
				sharedAt: (address) => address.sharedAt,
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadSiweChallenge,
			resolve: {
				[BlockheadSiweChallengeSelector.Id]: async ({ id }) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadSiweChallenge = catalog.blockheadSiweChallenges.find((candidate) => candidate.id === id)
				if (blockheadSiweChallenge == null) {
					throw new Error('Local_Internal: BlockheadSiweChallenge not present in local catalog')
				}
				return {
					$network: { [EntityMetaKey.Selector]: { caip2: { namespace: 'eip155' as const, reference: String(blockheadSiweChallenge.chainId) } } },
					$room: { [EntityMetaKey.Selector]: { id: blockheadSiweChallenge.roomId } },
					fromPeerId: blockheadSiweChallenge.fromPeerId,
					toPeerId: blockheadSiweChallenge.toPeerId,
					$signer: { [EntityMetaKey.Selector]: { address: EvmAddress.assert(blockheadSiweChallenge.signerAddress) } },
					message: blockheadSiweChallenge.message,
					...(blockheadSiweChallenge.scheme != null && { scheme: blockheadSiweChallenge.scheme }),
					domain: blockheadSiweChallenge.domain,
					address: EvmAddress.assert(blockheadSiweChallenge.address),
					uri: blockheadSiweChallenge.uri,
					version: blockheadSiweChallenge.version,
					chainId: blockheadSiweChallenge.chainId,
					nonce: blockheadSiweChallenge.nonce,
					...(blockheadSiweChallenge.statement != null && { statement: blockheadSiweChallenge.statement }),
					issuedAt: blockheadSiweChallenge.issuedAt,
					...(blockheadSiweChallenge.expiresAt != null && { expiresAt: blockheadSiweChallenge.expiresAt }),
					...(blockheadSiweChallenge.notBefore != null && { notBefore: blockheadSiweChallenge.notBefore }),
					...(blockheadSiweChallenge.requestId != null && { requestId: blockheadSiweChallenge.requestId }),
					resources: [...blockheadSiweChallenge.resources],
					...(blockheadSiweChallenge.requestOrigin != null && { requestOrigin: blockheadSiweChallenge.requestOrigin }),
					...(blockheadSiweChallenge.signature != null && { signature: blockheadSiweChallenge.signature }),
					...(blockheadSiweChallenge.signatureKind != null && { signatureKind: blockheadSiweChallenge.signatureKind }),
					verified: blockheadSiweChallenge.verified,
					...(blockheadSiweChallenge.verificationMethod != null && { verificationMethod: blockheadSiweChallenge.verificationMethod }),
					...(blockheadSiweChallenge.verifiedAt != null && { verifiedAt: blockheadSiweChallenge.verifiedAt }),
					...(blockheadSiweChallenge.verificationError != null && { verificationError: blockheadSiweChallenge.verificationError }),
				}
			}
			},
		})({
				$network: (challenge) => challenge.$network,
				$room: (challenge) => challenge.$room,
				fromPeerId: (challenge) => challenge.fromPeerId,
				toPeerId: (challenge) => challenge.toPeerId,
				$signer: (challenge) => challenge.$signer,
				message: (challenge) => challenge.message,
				scheme: (challenge) => challenge.scheme,
				domain: (challenge) => challenge.domain,
				address: (challenge) => challenge.address,
				uri: (challenge) => challenge.uri,
				version: (challenge) => challenge.version,
				chainId: (challenge) => challenge.chainId,
				nonce: (challenge) => challenge.nonce,
				statement: (challenge) => challenge.statement,
				issuedAt: (challenge) => challenge.issuedAt,
				expiresAt: (challenge) => challenge.expiresAt,
				notBefore: (challenge) => challenge.notBefore,
				requestId: (challenge) => challenge.requestId,
				resources: (challenge) => challenge.resources,
				requestOrigin: (challenge) => challenge.requestOrigin,
				signature: (challenge) => challenge.signature,
				signatureKind: (challenge) => challenge.signatureKind,
				verified: (challenge) => challenge.verified,
				verificationMethod: (challenge) => challenge.verificationMethod,
				verifiedAt: (challenge) => challenge.verifiedAt,
				verificationError: (challenge) => challenge.verificationError,
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadFilecoinPendingMessage,
			resolve: {
				[BlockheadFilecoinPendingMessageSelector.NodeIdMessageCidObservedAtMs]: async ({ messageCid, nodeId, observedAtMs }) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadFilecoinPendingMessage = catalog.blockheadFilecoinPendingMessages.find((candidate) => (
					candidate.nodeId === nodeId
					&& candidate.messageCid === messageCid
					&& candidate.observedAtMs === observedAtMs
				))
				if (blockheadFilecoinPendingMessage == null) {
					throw new Error('Local_Internal: BlockheadFilecoinPendingMessage not present in local catalog')
				}
				return {
					...(blockheadFilecoinPendingMessage.networkCaip2Reference != null && {
						$network: {
							[EntityMetaKey.Selector]: {
								$network: { caip2: { namespace: 'fil' as const, reference: blockheadFilecoinPendingMessage.networkCaip2Reference } },
							},
						},
						$message: {
							[EntityMetaKey.Selector]: {
								$network: { caip2: { namespace: 'fil' as const, reference: blockheadFilecoinPendingMessage.networkCaip2Reference } },
								cid: blockheadFilecoinPendingMessage.messageCid,
							},
						},
					}),
					...(blockheadFilecoinPendingMessage.networkCaip2Reference != null && blockheadFilecoinPendingMessage.fromAddress != null && {
						$from: {
							[EntityMetaKey.Selector]: {
								$network: { caip2: { namespace: 'fil' as const, reference: blockheadFilecoinPendingMessage.networkCaip2Reference } },
								address: blockheadFilecoinPendingMessage.fromAddress,
							},
						},
					}),
					...(blockheadFilecoinPendingMessage.networkCaip2Reference != null && blockheadFilecoinPendingMessage.toAddress != null && {
						$to: {
							[EntityMetaKey.Selector]: {
								$network: { caip2: { namespace: 'fil' as const, reference: blockheadFilecoinPendingMessage.networkCaip2Reference } },
								address: blockheadFilecoinPendingMessage.toAddress,
							},
						},
					}),
					...(blockheadFilecoinPendingMessage.nonce != null && { nonce: blockheadFilecoinPendingMessage.nonce }),
					...(blockheadFilecoinPendingMessage.method != null && { method: blockheadFilecoinPendingMessage.method }),
					...(blockheadFilecoinPendingMessage.valueAttoFil != null && { valueAttoFil: blockheadFilecoinPendingMessage.valueAttoFil }),
					...(blockheadFilecoinPendingMessage.gasLimit != null && { gasLimit: blockheadFilecoinPendingMessage.gasLimit }),
					...(blockheadFilecoinPendingMessage.gasFeeCapAttoFil != null && { gasFeeCapAttoFil: blockheadFilecoinPendingMessage.gasFeeCapAttoFil }),
					...(blockheadFilecoinPendingMessage.gasPremiumAttoFil != null && { gasPremiumAttoFil: blockheadFilecoinPendingMessage.gasPremiumAttoFil }),
					...(blockheadFilecoinPendingMessage.signatureType != null && { signatureType: blockheadFilecoinPendingMessage.signatureType }),
					...(blockheadFilecoinPendingMessage.local != null && { local: blockheadFilecoinPendingMessage.local }),
					...(blockheadFilecoinPendingMessage.payload != null && { payload: blockheadFilecoinPendingMessage.payload }),
				}
			}
			},
		})({
				$network: (message) => message.$network,
				$message: (message) => message.$message,
				$from: (message) => message.$from,
				$to: (message) => message.$to,
				nonce: (message) => message.nonce,
				method: (message) => message.method,
				valueAttoFil: (message) => message.valueAttoFil,
				gasLimit: (message) => message.gasLimit,
				gasFeeCapAttoFil: (message) => message.gasFeeCapAttoFil,
				gasPremiumAttoFil: (message) => message.gasPremiumAttoFil,
				signatureType: (message) => message.signatureType,
				local: (message) => message.local,
				payload: (message) => message.payload,
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadStateChannel,
			resolve: {
				[BlockheadStateChannelSelector.Id]: async ({ id }) => {
				const catalog = await readNormalizedLocalInternal()
				const stateChannel = catalog.stateChannels.find((candidate) => candidate.id === id)
					if (stateChannel == null) throw new Error('Local_Internal: BlockheadStateChannel not present in local catalog')
					const assetId = await coinInstanceIdForNormalizedStateChannelRow(stateChannel)
					return {
							$network: { [EntityMetaKey.Selector]: { caip2: { namespace: 'eip155' as const, reference: String(stateChannel.chainId) } } },
						$participant0: { [EntityMetaKey.Selector]: { address: EvmAddress.assert(stateChannel.participant0) } },
						$participant1: { [EntityMetaKey.Selector]: { address: EvmAddress.assert(stateChannel.participant1) } },
						$asset: { [EntityMetaKey.Selector]: assetId },
					...(stateChannel.roomId != null && { $room: { [EntityMetaKey.Selector]: { id: stateChannel.roomId } } }),
					createdAt: stateChannel.createdAt,
					$$timestamps: [
						stateChannelTimestampFields(stateChannel),
					],
				}
			}
			},
		})({
				$network: (channel) => channel.$network,
				$participant0: (channel) => channel.$participant0,
				$participant1: (channel) => channel.$participant1,
				$asset: (channel) => channel.$asset,
				$room: (channel) => channel.$room,
				createdAt: (channel) => channel.createdAt,
				$$timestamps: (channel) => channel.$$timestamps.map((timestamp) => ({
					[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
				})),
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadStateChannel_Timestamp,
			resolve: {
				[BlockheadStateChannel_TimestampSelector.ChannelTimestampMsSource]: async ({ $channel, source }) => {
				if (source !== Source.Local_Internal) throw new Error(`Local_Internal: unsupported source ${source}`)
				const catalog = await readNormalizedLocalInternal()
				const stateChannel = catalog.stateChannels.find((candidate) => candidate.id === $channel.id)
					if (stateChannel == null) throw new Error('Local_Internal: BlockheadStateChannel not present in local catalog')
					return stateChannelTimestampFields(stateChannel)
			}
			},
		})({
				$channel: (timestamp) => timestamp.$channel,
				timestampMs: (timestamp) => timestamp.timestampMs,
				source: (timestamp) => timestamp.source,
				totalDeposited: (timestamp) => timestamp.totalDeposited,
				balance0: (timestamp) => timestamp.balance0,
				balance1: (timestamp) => timestamp.balance1,
				turnNum: (timestamp) => timestamp.turnNum,
				status: (timestamp) => timestamp.status,
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadStateChannelDeposit,
			resolve: {
				[BlockheadStateChannelDepositSelector.ChannelAccount]: async ({ $channel, $account }) => {
				const catalog = await readNormalizedLocalInternal()
				const stateChannelDeposit = catalog.stateChannelDeposits.find((candidate) => (
					candidate.channelId === $channel.id
					&& candidate.accountAddress === $account.address
				))
				if (stateChannelDeposit == null) {
					throw new Error('Local_Internal: BlockheadStateChannelDeposit not present in local catalog')
					}
					return {
						$channel: { [EntityMetaKey.Selector]: { id: stateChannelDeposit.channelId } },
							$network: { [EntityMetaKey.Selector]: { caip2: { namespace: 'eip155' as const, reference: String(stateChannelDeposit.chainId) } } },
						$account: { [EntityMetaKey.Selector]: { address: EvmAddress.assert(stateChannelDeposit.accountAddress) } },
						$$timestamps: [
							stateChannelDepositTimestampFields(stateChannelDeposit),
						],
				}
			}
			},
		})({
				$channel: (deposit) => deposit.$channel,
				$network: (deposit) => deposit.$network,
				$account: (deposit) => deposit.$account,
				$$timestamps: (deposit) => deposit.$$timestamps.map((timestamp) => ({
					[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
				})),
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadStateChannelDeposit_Timestamp,
			resolve: {
				[BlockheadStateChannelDeposit_TimestampSelector.DepositTimestampMsSource]: async ({ $deposit, source }) => {
				if (source !== Source.Local_Internal) throw new Error(`Local_Internal: unsupported source ${source}`)
				const catalog = await readNormalizedLocalInternal()
				const stateChannelDeposit = catalog.stateChannelDeposits.find((candidate) => (
					candidate.channelId === $deposit.$channel.id
					&& candidate.accountAddress === $deposit.$account.address
				))
				if (stateChannelDeposit == null) {
					throw new Error('Local_Internal: BlockheadStateChannelDeposit not present in local catalog')
					}
					return stateChannelDepositTimestampFields(stateChannelDeposit)
			}
			},
		})({
				$deposit: (timestamp) => timestamp.$deposit,
				timestampMs: (timestamp) => timestamp.timestampMs,
				source: (timestamp) => timestamp.source,
				availableBalance: (timestamp) => timestamp.availableBalance,
				lockedBalance: (timestamp) => timestamp.lockedBalance,
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadStateChannelTransfer,
			resolve: {
				[BlockheadStateChannelTransferSelector.ChannelTurnNumFromToAmount]: async ({ $channel, $from, $to, amount, turnNum }) => {
				const catalog = await readNormalizedLocalInternal()
				const stateChannelTransfer = catalog.stateChannelTransfers.find((candidate) => (
					candidate.channelId === $channel.id
					&& candidate.from === $from.address
					&& candidate.to === $to.address
					&& candidate.amount === amount
					&& candidate.turnNum === turnNum
				))
				if (stateChannelTransfer == null) {
					throw new Error('Local_Internal: BlockheadStateChannelTransfer not present in local catalog')
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
				$channel: (transfer) => transfer.$channel,
				$from: (transfer) => transfer.$from,
				$to: (transfer) => transfer.$to,
				amount: (transfer) => transfer.amount,
				turnNum: (transfer) => transfer.turnNum,
				timestamp: (transfer) => transfer.timestamp,
				status: (transfer) => transfer.status,
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadStateChannelState,
			resolve: {
				[BlockheadStateChannelStateSelector.ChannelVersionStateData]: async ({ $channel, stateData, version }) => {
				const catalog = await readNormalizedLocalInternal()
				const stateChannelState = catalog.stateChannelStates.find((candidate) => (
					candidate.channelId === $channel.id
					&& candidate.stateData === stateData
					&& candidate.version === version
				))
				if (stateChannelState == null) {
					throw new Error('Local_Internal: BlockheadStateChannelState not present in local catalog')
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
				$channel: (state) => state.$channel,
				intent: (state) => state.intent,
				version: (state) => state.version,
				stateData: (state) => state.stateData,
				allocations: (state) => state.allocations,
				signatures: (state) => state.signatures,
				isFinal: (state) => state.isFinal,
				timestamp: (state) => state.timestamp,
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadTransferRequest,
			resolve: {
				[BlockheadTransferRequestSelector.IdEvmNetwork]: async ({ id, $network }) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadTransferRequest = catalog.blockheadTransferRequests.find((candidate) => (
					candidate.id === id
					&& String(candidate.chainId) === $network.caip2.reference
				))
				if (blockheadTransferRequest == null) {
					throw new Error('Local_Internal: BlockheadTransferRequest not present in local catalog')
				}
				return {
					$network: { [EntityMetaKey.Selector]: { caip2: { namespace: 'eip155' as const, reference: String(blockheadTransferRequest.chainId) } } },
					$room: { [EntityMetaKey.Selector]: { id: blockheadTransferRequest.roomId } },
					$from: { [EntityMetaKey.Selector]: { address: EvmAddress.assert(blockheadTransferRequest.from) } },
					$to: { [EntityMetaKey.Selector]: { address: EvmAddress.assert(blockheadTransferRequest.to) } },
					allocations: blockheadTransferRequest.allocations.map((allocation) => ({
						destination: EvmAddress.assert(allocation.destination),
						token: EvmAddress.assert(allocation.token),
						amount: allocation.amount,
					})),
					status: blockheadTransferRequest.status,
					createdAt: blockheadTransferRequest.createdAt,
					expiresAt: blockheadTransferRequest.expiresAt,
				}
			}
			},
		})({
				$network: (request) => request.$network,
				$room: (request) => request.$room,
				$from: (request) => request.$from,
				$to: (request) => request.$to,
				allocations: (request) => request.allocations,
				status: (request) => request.status,
				createdAt: (request) => request.createdAt,
				expiresAt: (request) => request.expiresAt,
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
				name: (conversation) => conversation.name,
				pinned: (conversation) => conversation.pinned,
				systemPrompt: (conversation) => conversation.systemPrompt,
				defaultConnectionId: (conversation) => conversation.defaultConnectionId,
				defaultModelId: (conversation) => conversation.defaultModelId,
				createdAt: (conversation) => conversation.createdAt,
				updatedAt: (conversation) => conversation.updatedAt,
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
			},
				[BlockheadAgentConversationTurnSelector.ConversationTurnId]: async ({ $conversation, id }) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadAgentConversationTurn = catalog.blockheadAgentConversationTurns.find((candidate) => (
					candidate.id === id
					&& candidate.conversationId === $conversation.id
				))
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
				$conversation: (turn) => turn.$conversation,
				parentId: (turn) => turn.parentId,
				userPrompt: (turn) => turn.userPrompt,
				assistantText: (turn) => turn.assistantText,
				providerId: (turn) => turn.providerId,
				status: (turn) => turn.status,
				error: (turn) => turn.error,
				createdAt: (turn) => turn.createdAt,
				promptVersion: (turn) => turn.promptVersion,
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadEnsNameSearch,
			resolve: {
				[BlockheadEnsNameSearchSelector.Query]: async ({ query: querySelector }, context) => {
				const query = normalizedBlockheadEnsNameSearchQuery(querySelector)
				const limit = context.pagination.limit
				return {
					query,
					createdAt: Date.now(),
					...(limit != null && { resultLimit: limit }),
				}
			}
			},
		})({
				query: (entity) => entity.query,
				createdAt: (entity) => entity.createdAt,
				resultLimit: (entity) => entity.resultLimit,
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
				$$actors: (entity) => entity,
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
				$$xmtpConversations: (entity) => entity,
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
				$$xmtpConversations: (entity) => entity,
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadPanelTree,
			resolve: {
				[BlockheadPanelTreeSelector.Id]: async ({ id }) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadPanelTree = catalog.blockheadPanelTrees.find((candidate) => candidate.id === id)
				if (blockheadPanelTree == null) throw new Error('Local_Internal: BlockheadPanelTree not present in local catalog')
				return {
					[EntityMetaKey.Selector]: {
						id: blockheadPanelTree.id,
					},
				}
			}
			},
		})({
				id: (blockheadPanelTree) => blockheadPanelTree[EntityMetaKey.Selector].id,
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadSource,
			resolve: {
				[BlockheadSourceSelector.Id]: async ({ id }) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadSource = catalog.blockheadSources.find((candidate) => candidate.id === id)
				if (blockheadSource == null) throw new Error('Local_Internal: BlockheadSource not present in local catalog')
				return {}
			}
			},
		})({
				id: (blockheadSource) => blockheadSource[EntityMetaKey.Selector].id,
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadFarcasterAccountConnection,
			resolve: {
				[BlockheadFarcasterAccountConnectionSelector.Fid]: async ({ fid }) => {
				const catalog = await readNormalizedLocalInternal()
				const blockheadFarcasterAccountConnection = catalog.blockheadFarcasterAccountConnections.find((candidate) => candidate.fid === fid)
				if (blockheadFarcasterAccountConnection == null) {
					throw new Error('Local_Internal: BlockheadFarcasterAccountConnection not present in local catalog')
				}
				return blockheadFarcasterAccountConnection
			}
			},
		})({
				fid: (blockheadFarcasterAccountConnection) => blockheadFarcasterAccountConnection.fid,
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
				$$blockheadSources: (entity) => entity,
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
				$$blockheadWallets: (entity) => entity,
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
				$$blockheadWalletConnections: (entity) => entity,
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
				$$blockheadWalletAccounts: (entity) => entity,
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
				$$blockheadSessions: (entity) => entity,
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
				$$actions: (entity) => entity,
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
				$$blockheadPanelTrees: (entity) => entity,
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
				$$blockheadFarcasterAccountConnections: (entity) => entity,
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
				$$blockheadAgentConversations: (entity) => entity,
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
				$$turns: (entity) => entity,
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
				$$bridgeTransactions: (entity) => entity,
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadBridgeTransaction,
			resolve: {
				[BlockheadBridgeTransactionSelector.AccountSourceTxCreatedAt]: async (
				scopedEntitySelector: EntitySelector<typeof schema, EntityType.BlockheadBridgeTransaction>
			) => {
				const blockheadBridgeTransaction = await findNormalizedBridgeTransactionRow(
					await readNormalizedLocalInternal(),
					scopedEntitySelector
				)
				if (blockheadBridgeTransaction == null) {
					throw new Error('Local_Internal: BlockheadBridgeTransaction not present in local catalog')
				}
				return {
					$account: {
						[EntityMetaKey.Selector]: { address: EvmAddress.assert(blockheadBridgeTransaction.accountAddress) },
					},
					$sourceTx: {
						[EntityMetaKey.Selector]: {
							$network: { caip2: { namespace: 'eip155' as const, reference: String(blockheadBridgeTransaction.chainId) } },
							txHash: ZeroExHex.assert(blockheadBridgeTransaction.txHash),
						},
					},
					createdAt: blockheadBridgeTransaction.createdAt,
				}
			}
			},
		})({
				$account: (transaction) => transaction.$account,
				$sourceTx: (transaction) => transaction.$sourceTx,
				createdAt: (transaction) => transaction.createdAt,
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
				$$peers: (entity) => entity,
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
				$$blockheadRoomPeers: (entity) => entity,
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
				$$blockheadRooms: (entity) => entity,
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
					$$blockheadStateChannels: (entity) => entity,
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadStateChannel,
			resolve: {
				[BlockheadStateChannelSelector.Id]: async (
				scopedEntitySelector: EntitySelector<typeof schema, EntityType.BlockheadStateChannel>,
				context
			) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).stateChannelTransfers
						.filter((stateChannelTransfer) => stateChannelTransfer.channelId === scopedEntitySelector.id),
					context
				)
					.map((stateChannelTransfer) => ({
						[EntityMetaKey.Selector]: {
							$channel: { id: stateChannelTransfer.channelId },
							turnNum: stateChannelTransfer.turnNum,
							$from: { address: EvmAddress.assert(stateChannelTransfer.from) },
							$to: { address: EvmAddress.assert(stateChannelTransfer.to) },
							amount: stateChannelTransfer.amount,
						},
					}))
			)
			},
		})({
				$$transfers: (entity) => entity,
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadStateChannel,
			resolve: {
				[BlockheadStateChannelSelector.Id]: async (
				scopedEntitySelector: EntitySelector<typeof schema, EntityType.BlockheadStateChannel>,
				context
			) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).stateChannelStates
						.filter((stateChannelState) => stateChannelState.channelId === scopedEntitySelector.id),
					context
				)
					.map((stateChannelState) => ({
						[EntityMetaKey.Selector]: {
							$channel: { id: stateChannelState.channelId },
							version: stateChannelState.version,
							stateData: stateChannelState.stateData,
						},
					}))
			)
			},
		})({
				$$states: (entity) => entity,
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType.BlockheadStateChannel,
			resolve: {
				[BlockheadStateChannelSelector.Id]: async (
				scopedEntitySelector: EntitySelector<typeof schema, EntityType.BlockheadStateChannel>,
				context
			) => (
				sliceNormalizedRowsForSubset(
					(await readNormalizedLocalInternal()).stateChannelDeposits
						.filter((stateChannelDeposit) => stateChannelDeposit.channelId === scopedEntitySelector.id),
					context
				)
					.map((stateChannelDeposit) => ({
						[EntityMetaKey.Selector]: {
							$channel: { id: stateChannelDeposit.channelId },
							$account: { address: EvmAddress.assert(stateChannelDeposit.accountAddress) },
						},
					}))
			)
			},
		})({
				$$deposits: (entity) => entity,
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
				$$blockheadSharedAddresses: (entity) => entity,
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType._GlobalEvmAbiCatalog,
			resolve: {
				[_GlobalEvmAbiCatalogSelector.Scope]: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._GlobalEvmAbiCatalog>, context) => (
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
					$$observedSelectors: (entity) => entity,
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType._GlobalEvmAbiCatalog,
			resolve: {
				[_GlobalEvmAbiCatalogSelector.Scope]: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._GlobalEvmAbiCatalog>, context) => (
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
					$$observedTopics: (entity) => entity,
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType._GlobalEvmAbiCatalog,
			resolve: {
				[_GlobalEvmAbiCatalogSelector.Scope]: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._GlobalEvmAbiCatalog>, context) => (
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
					$$observedErrors: (entity) => entity,
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType._GlobalEvmAbiCatalog,
			resolve: {
				[_GlobalEvmAbiCatalogSelector.Scope]: async ({ scope }) => [
					await globalEvmAbiCatalogTimestampFields({
						scope,
						timestampMs: Date.now(),
					}),
				],
			},
		})({
				$$timestamps: (timestamps) => timestamps.map((timestamp) => ({
					[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
				})),
			}),

		defineResolver(Source.Local_Internal, {
			entityType: EntityType._GlobalEvmAbiCatalog_Timestamp,
			resolve: {
				[_GlobalEvmAbiCatalog_TimestampSelector.HubTimestampMsSource]: async ({
					$hub,
					timestampMs,
					source,
				}) => {
					if (source !== Source.Local_Internal)
						throw new Error(`Local_Internal: unsupported EVM ABI catalog timestamp source ${source}`)

					return globalEvmAbiCatalogTimestampFields({
						scope: $hub.scope,
						timestampMs,
					})
				},
			},
		})({
				$hub: (timestamp) => timestamp.$hub,
				timestampMs: (timestamp) => timestamp.timestampMs,
				source: (timestamp) => timestamp.source,
				seededSelectorCount: (timestamp) => timestamp.seededSelectorCount,
				seededTopicCount: (timestamp) => timestamp.seededTopicCount,
				seededErrorCount: (timestamp) => timestamp.seededErrorCount,
				reachable: (timestamp) => timestamp.reachable,
			}),
	],
}
