import { resolverContextRowLimit, type ResolverContext } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import type {
	NormalizedStateChannel,
	NormalizedStateChannelDeposit,
} from '$/resolvers/Local/Internal/catalog.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EvmAddress, Hash32, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import {
	walletConnectionMethodById,
	walletConnectionMethodByProtocolDiscoveryKindTransportKind,
} from '$/constants/Wallet.ts'
import { normalize as ensNormalizeNode, toString as ensToString } from '@tevm/voltaire/Ens'

const sliceNormalizedRowsForSubset = <_Row>(
	normalizedCatalogRows: readonly _Row[],
	context: ResolverContext
): readonly _Row[] => (
	normalizedCatalogRows.slice(0, resolverContextRowLimit(context))
)

const normalizedLocalInternalModule = import('$/resolvers/Local/Internal/catalog.ts')

const readNormalizedLocalInternal = async () => (
	(await normalizedLocalInternalModule).readNormalizedLocalInternal()
)

const localXmtpMessages = [
	{
		id: 'e2e-probe-message',
		conversationId: 'e2e-probe-conversation',
		senderInboxId: 'e2e-probe-peer',
		sentAtNs: '1700000000000000000',
		contentText: 'e2e probe message',
	},
] as const

const xmtpMessageFields = (xmtpMessage: (typeof localXmtpMessages)[number]) => ({
	$conversation: {
		[EntityMetaKey.Selector]: { id: xmtpMessage.conversationId },
	},
	senderInboxId: xmtpMessage.senderInboxId,
	sentAtNs: xmtpMessage.sentAtNs,
	...(xmtpMessage.contentText != null && { contentText: xmtpMessage.contentText }),
})

const globalEvmAbiCatalogTimestampFields = async ({
	scope,
	timestampMs,
}: {
	scope: string
	timestampMs: number
}) => {
	const normalizedLocalInternal = await readNormalizedLocalInternal()
	return {
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

const stateChannelTimestampFields = (stateChannel: NormalizedStateChannel) => ({
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

const stateChannelDepositTimestampFields = (stateChannelDeposit: NormalizedStateChannelDeposit) => ({
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

const normalizedBlockheadEnsNameSearchQuery = (query: string) => {
	const trimmedQuery = query.trim()
	if (trimmedQuery === '') throw new Error('Local_Internal: empty ENS name search query')
	try {
		return ensToString(ensNormalizeNode(trimmedQuery))
	} catch {
		return trimmedQuery.toLowerCase()
	}
}

export default {
	source: Source.Local_Internal,

	resolvers: [
		defineResolver({
			entityType: EntityType.XmtpConversation,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
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
				},
				}
			},
		})({
				peerInboxId: (conversation) => conversation.peerInboxId,
				topic: (conversation) => conversation.topic,
				createdAtMs: (conversation) => conversation.createdAtMs,
				consentState: (conversation) => conversation.consentState,
			}),

		defineResolver({
			entityType: EntityType.XmtpConversation,
			resolve: {
				Id: {
					resolve: async ({ id }, context) => (
					sliceNormalizedRowsForSubset(
						localXmtpMessages.filter((xmtpMessage) => xmtpMessage.conversationId === id),
						context
					)
						.map((xmtpMessage) => ({
							[EntityMetaKey.Selector]: { id: xmtpMessage.id },
						}))
				),
				}
			},
		})({
				$$messages: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.XmtpConversation,
			resolve: {
				Id: {
					resolve: async ({ id }, context) => {
					const catalog = await readNormalizedLocalInternal()
					const xmtpConversation = catalog.xmtpConversations.find((candidate) => candidate.id === id)
					if (xmtpConversation == null) {
						throw new Error('Local_Internal: XmtpConversation not present in local catalog')
					}
					if (xmtpConversation.peerInboxId == null) return []
					return sliceNormalizedRowsForSubset(
						[
							{
								[EntityMetaKey.Selector]: {
									$conversation: { id },
									inboxId: xmtpConversation.peerInboxId,
								},
							},
						],
						context
					)
				},
				}
			},
		})({
				$$participants: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.XmtpMessage,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
					const xmtpMessage = localXmtpMessages.find((candidate) => candidate.id === id)
					if (xmtpMessage == null) {
						throw new Error('Local_Internal: XmtpMessage not present in local catalog')
					}
					return xmtpMessageFields(xmtpMessage)
				},
				},
				ConversationMessageId: {
					resolve: async ({ $conversation, id }) => {
					const xmtpMessage = localXmtpMessages.find((candidate) => (
						candidate.id === id
						&& candidate.conversationId === $conversation.id
					))
					if (xmtpMessage == null) {
						throw new Error('Local_Internal: XmtpMessage not present in local catalog')
					}
					return xmtpMessageFields(xmtpMessage)
				},
				}
			},
		})({
				$conversation: (message) => message.$conversation,
				senderInboxId: (message) => message.senderInboxId,
				sentAtNs: (message) => message.sentAtNs,
				contentText: (message) => message.contentText,
			}),

		defineResolver({
			entityType: EntityType.XmtpParticipant,
			resolve: {
				ConversationInboxId: {
					resolve: async ({ $conversation, inboxId }) => {
					const catalog = await readNormalizedLocalInternal()
					const xmtpConversation = catalog.xmtpConversations.find((candidate) => candidate.id === $conversation.id)
					if (xmtpConversation == null) {
						throw new Error('Local_Internal: XmtpConversation not present in local catalog')
					}
					if (xmtpConversation.peerInboxId !== inboxId) {
						throw new Error('Local_Internal: XmtpParticipant not present in local catalog')
					}
					return {
						$conversation: {
							[EntityMetaKey.Selector]: { id: $conversation.id },
						},
						inboxId,
					}
				},
				}
			},
		})({
				$conversation: (participant) => participant.$conversation,
				inboxId: (participant) => participant.inboxId,
			}),

		defineResolver({
			entityType: EntityType.BlockheadWallet,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
					const catalog = await readNormalizedLocalInternal()
					const blockheadWallet = catalog.blockheadWallets.find((candidate) => candidate.id === id)
					if (blockheadWallet == null) throw new Error('Local_Internal: BlockheadWallet not present in local catalog')
					const connectionMethod = walletConnectionMethodByProtocolDiscoveryKindTransportKind[[
						blockheadWallet.protocol,
						blockheadWallet.discoveryKind,
						blockheadWallet.transportKind,
					].join(':')]
					if (connectionMethod == null) throw new Error('Local_Internal: BlockheadWallet connection method not present in catalog')
					return {
						name: blockheadWallet.name,
						icon: blockheadWallet.icon,
						protocol: blockheadWallet.protocol,
						discoveryKind: blockheadWallet.discoveryKind,
						transportKind: blockheadWallet.transportKind,
						...(blockheadWallet.rdns != null && { rdns: blockheadWallet.rdns }),
						capabilities: [...blockheadWallet.capabilities],
						$connectionMethod: {
							[EntityMetaKey.Selector]: {
								id: connectionMethod.id,
							},
						},
					}
				},
				}
			},
		})({
				name: (wallet) => wallet.name,
				icon: (wallet) => wallet.icon,
				protocol: (wallet) => wallet.protocol,
				discoveryKind: (wallet) => wallet.discoveryKind,
				transportKind: (wallet) => wallet.transportKind,
				rdns: (wallet) => wallet.rdns,
				capabilities: (wallet) => wallet.capabilities,
				$connectionMethod: (wallet) => wallet.$connectionMethod,
			}),

		defineResolver({
			entityType: EntityType.WalletConnectionMethod,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
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
				},
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

		defineResolver({
			entityType: EntityType.BlockheadWalletConnection,
			resolve: {
				ConnectionKey: {
					resolve: async ({ connectionKey }) => {
					const catalog = await readNormalizedLocalInternal()
					const blockheadWalletConnection = catalog.blockheadWalletConnections.find((candidate) => candidate.connectionKey === connectionKey)
					if (blockheadWalletConnection == null) throw new Error('Local_Internal: BlockheadWalletConnection not present in local catalog')
					return {
						connectionKey: blockheadWalletConnection.connectionKey,
						$wallet: {
							[EntityMetaKey.Selector]: {
								id: blockheadWalletConnection.walletId,
							},
						},
						status: blockheadConnectionStatusByLocalStatus[blockheadWalletConnection.status],
						protocol: blockheadWalletConnection.protocol,
						transportKind: blockheadWalletConnection.transportKind,
						scopes: blockheadWalletConnection.scopes.map((scope) => ({
							namespace: scope.namespace,
							reference: scope.reference,
							methods: [...scope.methods],
							events: [...scope.events],
						})),
						$$accounts: blockheadWalletConnection.accountIds.map((accountId) => ({
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
						...(blockheadWalletConnection.connectedAt != null && { connectedAt: blockheadWalletConnection.connectedAt }),
						...(blockheadWalletConnection.disconnectedAt != null && { disconnectedAt: blockheadWalletConnection.disconnectedAt }),
						...(blockheadWalletConnection.sessionId != null && { sessionId: blockheadWalletConnection.sessionId }),
						...(blockheadWalletConnection.sessionTopic != null && { sessionTopic: blockheadWalletConnection.sessionTopic }),
						...(blockheadWalletConnection.error != null && { error: blockheadWalletConnection.error }),
					}
				},
				}
			},
		})({
				connectionKey: (connection) => connection.connectionKey,
				$wallet: (connection) => connection.$wallet,
				status: (connection) => connection.status,
				protocol: (connection) => connection.protocol,
				transportKind: (connection) => connection.transportKind,
				scopes: (connection) => connection.scopes,
				$$accounts: (connection) => connection.$$accounts,
				$activeAccount: (connection) => connection.$activeAccount,
				selected: (connection) => connection.selected,
				connectedAt: (connection) => connection.connectedAt,
				disconnectedAt: (connection) => connection.disconnectedAt,
				sessionId: (connection) => connection.sessionId,
				sessionTopic: (connection) => connection.sessionTopic,
				error: (connection) => connection.error,
			}),

		defineResolver({
			entityType: EntityType.BlockheadRoom,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
					const catalog = await readNormalizedLocalInternal()
					const blockheadRoom = catalog.blockheadRooms.find((candidate) => candidate.id === id)
					if (blockheadRoom == null) throw new Error('Local_Internal: BlockheadRoom not present in local catalog')
					return {
						createdAt: blockheadRoom.createdAt,
						createdBy: blockheadRoom.createdBy,
						...(blockheadRoom.name != null && { name: blockheadRoom.name }),
					}
				},
				}
			},
		})({
				createdAt: (room) => room.createdAt,
				createdBy: (room) => room.createdBy,
				name: (room) => room.name,
			}),

		defineResolver({
			entityType: EntityType.BlockheadSession,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
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
				},
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

		defineResolver({
			entityType: EntityType.BlockheadSessionAction,
			resolve: {
				SessionIdActionId: {
					resolve: async ({ actionId, sessionId }) => {
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
						actionType: blockheadSessionAction.actionType,
						actionParams: blockheadSessionAction.actionParams,
						createdAt: blockheadSessionAction.createdAt,
						updatedAt: blockheadSessionAction.updatedAt,
					}
				},
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

		defineResolver({
			entityType: EntityType.BlockheadSocialPostSession,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
					const catalog = await readNormalizedLocalInternal()
					const blockheadSocialPostSession = catalog.blockheadSocialPostSessions.find((candidate) => candidate.id === id)
					if (blockheadSocialPostSession == null) {
						throw new Error('Local_Internal: BlockheadSocialPostSession not present in local catalog')
					}
					return {
						...(blockheadSocialPostSession.name != null && { name: blockheadSocialPostSession.name }),
						status: blockheadSocialPostSession.status,
						protocol: blockheadSocialPostSession.protocol,
						...(blockheadSocialPostSession.authorKey != null && { authorKey: blockheadSocialPostSession.authorKey }),
						...(blockheadSocialPostSession.walletConnectionKey != null && {
							$walletConnection: {
								[EntityMetaKey.Selector]: {
									connectionKey: blockheadSocialPostSession.walletConnectionKey,
								},
							},
						}),
						...(blockheadSocialPostSession.agentConversationId != null && {
							$agentConversation: {
								[EntityMetaKey.Selector]: {
									id: blockheadSocialPostSession.agentConversationId,
								},
							},
						}),
						...(blockheadSocialPostSession.text != null && { text: blockheadSocialPostSession.text }),
						$$media: (
							blockheadSocialPostSession.mediaUrls
								?.map((url) => ({
									[EntityMetaKey.Selector]: {
										url,
									},
								}))
							?? []
						),
						...(blockheadSocialPostSession.publishedEntityType != null && { publishedEntityType: blockheadSocialPostSession.publishedEntityType }),
						...(blockheadSocialPostSession.publishedSelector != null && { publishedSelector: blockheadSocialPostSession.publishedSelector }),
						createdAt: blockheadSocialPostSession.createdAt,
						updatedAt: blockheadSocialPostSession.updatedAt,
						...(blockheadSocialPostSession.lockedAt != null && { lockedAt: blockheadSocialPostSession.lockedAt }),
					}
				},
				}
			},
		})({
				name: (session) => session.name,
				status: (session) => session.status,
				protocol: (session) => session.protocol,
				authorKey: (session) => session.authorKey,
				$walletConnection: (session) => session.$walletConnection,
				$agentConversation: (session) => session.$agentConversation,
				text: (session) => session.text,
				$$media: (session) => session.$$media,
				publishedEntityType: (session) => session.publishedEntityType,
				publishedSelector: (session) => session.publishedSelector,
				createdAt: (session) => session.createdAt,
				updatedAt: (session) => session.updatedAt,
				lockedAt: (session) => session.lockedAt,
			}),

		defineResolver({
			entityType: EntityType.BlockheadLocalMediaIngest,
			resolve: {
				IngestId: {
					resolve: async ({ ingestId }) => {
					const catalog = await readNormalizedLocalInternal()
					const blockheadLocalMediaIngest = catalog.blockheadLocalMediaIngests.find((candidate) => candidate.ingestId === ingestId)
					if (blockheadLocalMediaIngest == null) {
						throw new Error('Local_Internal: BlockheadLocalMediaIngest not present in local catalog')
					}
					return {
						ingestId: blockheadLocalMediaIngest.ingestId,
						...(blockheadLocalMediaIngest.fileName != null && { fileName: blockheadLocalMediaIngest.fileName }),
						...(blockheadLocalMediaIngest.mimeType != null && { mimeType: blockheadLocalMediaIngest.mimeType }),
						...(blockheadLocalMediaIngest.size != null && { size: blockheadLocalMediaIngest.size }),
						...(blockheadLocalMediaIngest.sha256 != null && { sha256: blockheadLocalMediaIngest.sha256 }),
						createdAt: blockheadLocalMediaIngest.createdAt,
						...(blockheadLocalMediaIngest.mediaUrl != null && {
							$media: {
								[EntityMetaKey.Selector]: {
									url: blockheadLocalMediaIngest.mediaUrl,
								},
							},
						}),
						$$timestamps: catalog.blockheadLocalMediaIngestTimestamps
							.filter((candidate) => candidate.ingestId === ingestId)
							.map((candidate) => ({
								[EntityMetaKey.Selector]: {
									$ingest: {
										[EntityMetaKey.Selector]: {
											ingestId: candidate.ingestId,
										},
									},
									timestampMs: candidate.timestampMs,
									source: candidate.source,
								},
							})),
					}
				},
				}
			},
		})({
				ingestId: (ingest) => ingest.ingestId,
				fileName: (ingest) => ingest.fileName,
				mimeType: (ingest) => ingest.mimeType,
				size: (ingest) => ingest.size,
				sha256: (ingest) => ingest.sha256,
				createdAt: (ingest) => ingest.createdAt,
				$media: (ingest) => ingest.$media,
				$$timestamps: (ingest) => ingest.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.BlockheadLocalMediaIngest_Timestamp,
			resolve: {
				IngestTimestampMsSource: {
					resolve: async ({ $ingest, timestampMs, source }) => {
					const catalog = await readNormalizedLocalInternal()
					const blockheadLocalMediaIngestTimestamp = catalog.blockheadLocalMediaIngestTimestamps.find((candidate) => (
						candidate.ingestId === $ingest.ingestId
						&& candidate.timestampMs === timestampMs
						&& candidate.source === source
					))
					if (blockheadLocalMediaIngestTimestamp == null) {
						throw new Error('Local_Internal: BlockheadLocalMediaIngest_Timestamp not present in local catalog')
					}
					return {
						$ingest: {
							[EntityMetaKey.Selector]: {
								ingestId: blockheadLocalMediaIngestTimestamp.ingestId,
							},
						},
						timestampMs: blockheadLocalMediaIngestTimestamp.timestampMs,
						source: blockheadLocalMediaIngestTimestamp.source,
						status: blockheadLocalMediaIngestTimestamp.status,
						...(blockheadLocalMediaIngestTimestamp.uri != null && { uri: blockheadLocalMediaIngestTimestamp.uri }),
						...(blockheadLocalMediaIngestTimestamp.error != null && { error: blockheadLocalMediaIngestTimestamp.error }),
					}
				},
				}
			},
		})({
				$ingest: (observation) => observation.$ingest,
				timestampMs: (observation) => observation.timestampMs,
				source: (observation) => observation.source,
				status: (observation) => observation.status,
				uri: (observation) => observation.uri,
				error: (observation) => observation.error,
			}),

		defineResolver({
			entityType: EntityType.BlockheadRoomPeer,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
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
				},
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

		defineResolver({
			entityType: EntityType.BlockheadSharedAddress,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
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
				},
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

		defineResolver({
			entityType: EntityType.BlockheadSiweChallenge,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
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
				},
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

		defineResolver({
			entityType: EntityType.BlockheadFilecoinPendingMessage,
			resolve: {
				NodeIdMessageCidObservedAtMs: {
					resolve: async ({ messageCid, nodeId, observedAtMs }) => {
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
				},
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

		defineResolver({
			entityType: EntityType.BlockheadStateChannel,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
						const catalog = await readNormalizedLocalInternal()
						const stateChannel = catalog.stateChannels.find((candidate) => candidate.id === id)
						if (stateChannel == null)
							throw new Error('Local_Internal: BlockheadStateChannel not present in local catalog')

						const assetId = await (await import('$/resolvers/Local/Internal/catalog.ts')).coinInstanceIdForNormalizedStateChannelRow(stateChannel)
						return {
							$network: { [EntityMetaKey.Selector]: { caip2: { namespace: 'eip155' as const, reference: String(stateChannel.chainId) } } },
							$participant0: { [EntityMetaKey.Selector]: { address: EvmAddress.assert(stateChannel.participant0) } },
							$participant1: { [EntityMetaKey.Selector]: { address: EvmAddress.assert(stateChannel.participant1) } },
							$asset: { [EntityMetaKey.Selector]: assetId },
							...(stateChannel.roomId != null && { $room: { [EntityMetaKey.Selector]: { id: stateChannel.roomId } } }),
							createdAt: stateChannel.createdAt,
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$channel: {
											id: stateChannel.id,
										},
										timestampMs: stateChannel.updatedAt,
										source: Source.Local_Internal,
									},
								},
							],
						}
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
			$$timestamps: (channel) => channel.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.BlockheadStateChannel_Timestamp,
			resolve: {
				ChannelTimestampMsSource: {
					resolve: async ({ $channel, source }) => {
						if (source !== Source.Local_Internal)
							throw new Error(`Local_Internal: unsupported source ${source}`)

						const catalog = await readNormalizedLocalInternal()
						const stateChannel = catalog.stateChannels.find((candidate) => candidate.id === $channel.id)
						if (stateChannel == null)
							throw new Error('Local_Internal: BlockheadStateChannel not present in local catalog')

						return stateChannelTimestampFields(stateChannel)
					}
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

		defineResolver({
			entityType: EntityType.BlockheadStateChannelDeposit,
			resolve: {
				ChannelAccount: {
					resolve: async ({ $channel, $account }) => {
						const catalog = await readNormalizedLocalInternal()
						const stateChannelDeposit = catalog.stateChannelDeposits.find((candidate) => (
							candidate.channelId === $channel.id
							&& candidate.accountAddress === $account.address
						))
						if (stateChannelDeposit == null)
							throw new Error('Local_Internal: BlockheadStateChannelDeposit not present in local catalog')

						return {
							$channel: { [EntityMetaKey.Selector]: { id: stateChannelDeposit.channelId } },
							$network: { [EntityMetaKey.Selector]: { caip2: { namespace: 'eip155' as const, reference: String(stateChannelDeposit.chainId) } } },
							$account: { [EntityMetaKey.Selector]: { address: EvmAddress.assert(stateChannelDeposit.accountAddress) } },
							$$timestamps: [
								{
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
								},
							],
						}
					}
				}
			},
		})({
			$channel: (deposit) => deposit.$channel,
			$network: (deposit) => deposit.$network,
			$account: (deposit) => deposit.$account,
			$$timestamps: (deposit) => deposit.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.BlockheadStateChannelDeposit_Timestamp,
			resolve: {
				DepositTimestampMsSource: {
					resolve: async ({ $deposit, source }) => {
						if (source !== Source.Local_Internal)
							throw new Error(`Local_Internal: unsupported source ${source}`)

						const catalog = await readNormalizedLocalInternal()
						const stateChannelDeposit = catalog.stateChannelDeposits.find((candidate) => (
							candidate.channelId === $deposit.$channel.id
							&& candidate.accountAddress === $deposit.$account.address
						))
						if (stateChannelDeposit == null)
							throw new Error('Local_Internal: BlockheadStateChannelDeposit not present in local catalog')

						return stateChannelDepositTimestampFields(stateChannelDeposit)
					}
				}
			},
		})({
			$deposit: (timestamp) => timestamp.$deposit,
			timestampMs: (timestamp) => timestamp.timestampMs,
			source: (timestamp) => timestamp.source,
			availableBalance: (timestamp) => timestamp.availableBalance,
			lockedBalance: (timestamp) => timestamp.lockedBalance,
		}),

		defineResolver({
			entityType: EntityType.BlockheadStateChannelTransfer,
			resolve: {
				ChannelTurnNumFromToAmount: {
					resolve: async ({ $channel, $from, $to, amount, turnNum }) => {
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
				},
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

		defineResolver({
			entityType: EntityType.BlockheadStateChannelState,
			resolve: {
				ChannelVersionStateData: {
					resolve: async ({ $channel, stateData, version }) => {
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
				},
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

		defineResolver({
			entityType: EntityType.BlockheadTransferRequest,
			resolve: {
				IdEvmNetwork: {
					resolve: async ({ id, $network }) => {
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
				},
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

		defineResolver({
			entityType: EntityType.BlockheadAgentConversation,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
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
				},
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

		defineResolver({
			entityType: EntityType.BlockheadAgentConversationTurn,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
					const catalog = await readNormalizedLocalInternal()
					const blockheadAgentConversationTurn = catalog.blockheadAgentConversationTurns.find((candidate) => candidate.id === id)
					if (blockheadAgentConversationTurn == null) {
						throw new Error('Local_Internal: BlockheadAgentConversationTurn not present in local catalog')
					}
					return {
						$conversation: {
							[EntityMetaKey.Selector]: { id: blockheadAgentConversationTurn.conversationId },
						},
						...(blockheadAgentConversationTurn.parentId != null && { parentId: blockheadAgentConversationTurn.parentId }),
						userPrompt: blockheadAgentConversationTurn.userPrompt,
						assistantText: blockheadAgentConversationTurn.assistantText,
						providerId: blockheadAgentConversationTurn.providerId,
						status: blockheadAgentConversationTurn.status,
						...(blockheadAgentConversationTurn.error != null && { error: blockheadAgentConversationTurn.error }),
						createdAt: blockheadAgentConversationTurn.createdAt,
						promptVersion: blockheadAgentConversationTurn.promptVersion,
					}
				},
				},
				ConversationTurnId: {
					resolve: async ({ $conversation, id }) => {
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
						...(blockheadAgentConversationTurn.parentId != null && { parentId: blockheadAgentConversationTurn.parentId }),
						userPrompt: blockheadAgentConversationTurn.userPrompt,
						assistantText: blockheadAgentConversationTurn.assistantText,
						providerId: blockheadAgentConversationTurn.providerId,
						status: blockheadAgentConversationTurn.status,
						...(blockheadAgentConversationTurn.error != null && { error: blockheadAgentConversationTurn.error }),
						createdAt: blockheadAgentConversationTurn.createdAt,
						promptVersion: blockheadAgentConversationTurn.promptVersion,
					}
				},
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

		defineResolver({
			entityType: EntityType.BlockheadEnsNameSearch,
			resolve: {
				Query: {
					resolve: async ({ query: querySelector }, context) => {
					const query = normalizedBlockheadEnsNameSearchQuery(querySelector)
					const limit = context.pagination.limit
					return {
						query,
						createdAt: Date.now(),
						...(limit != null && { resultLimit: limit }),
					}
				},
				}
			},
		})({
				query: (entity) => entity.query,
				createdAt: (entity) => entity.createdAt,
				resultLimit: (entity) => entity.resultLimit,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
						sliceNormalizedRowsForSubset((await readNormalizedLocalInternal()).actors, context)
							.map((actor) => ({
								[EntityMetaKey.Selector]: { address: actor.address },
							}))
					),
				}
			},
		})({
				$$actors: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
					sliceNormalizedRowsForSubset(
						(await readNormalizedLocalInternal()).xmtpConversations,
						context
					)
						.map((xmtpConversation) => ({
							[EntityMetaKey.Selector]: { id: xmtpConversation.id },
						}))
				),
				}
			},
		})({
				$$xmtpConversations: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.XmtpNetwork,
			resolve: {
				Scope: {
					resolve: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType.XmtpNetwork>, context) => (
					sliceNormalizedRowsForSubset(
						(await readNormalizedLocalInternal()).xmtpConversations,
						context
					)
						.map((xmtpConversation) => ({
							[EntityMetaKey.Selector]: { id: xmtpConversation.id },
						}))
				),
				}
			},
		})({
				$$xmtpConversations: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.BlockheadWorkspace,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
					const catalog = await readNormalizedLocalInternal()
					const blockheadWorkspace = catalog.blockheadWorkspaces.find((candidate) => candidate.id === id)
					if (blockheadWorkspace == null) throw new Error('Local_Internal: BlockheadWorkspace not present in local catalog')
					return {
						[EntityMetaKey.Selector]: {
							id: blockheadWorkspace.id,
						},
						...blockheadWorkspace,
					}
				},
				}
			},
		})({
				id: (blockheadWorkspace) => blockheadWorkspace[EntityMetaKey.Selector].id,
				name: (blockheadWorkspace) => blockheadWorkspace.name,
				$activePanelTree: (blockheadWorkspace) => (
					blockheadWorkspace.activePanelTreeId == null ?
						undefined
					:
						{
							[EntityMetaKey.Selector]: {
								id: blockheadWorkspace.activePanelTreeId,
							},
						}
				),
				createdAt: (blockheadWorkspace) => blockheadWorkspace.createdAt,
				updatedAt: (blockheadWorkspace) => blockheadWorkspace.updatedAt,
			}),

		defineResolver({
			entityType: EntityType.BlockheadPanelTree,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
					const catalog = await readNormalizedLocalInternal()
					const blockheadPanelTree = catalog.blockheadPanelTrees.find((candidate) => candidate.id === id)
					if (blockheadPanelTree == null) throw new Error('Local_Internal: BlockheadPanelTree not present in local catalog')
					return {
						[EntityMetaKey.Selector]: {
							id: blockheadPanelTree.id,
						},
						...blockheadPanelTree,
					}
				},
				}
			},
		})({
				id: (blockheadPanelTree) => blockheadPanelTree[EntityMetaKey.Selector].id,
				$workspace: (blockheadPanelTree) => (
					blockheadPanelTree.workspaceId == null ?
						undefined
					:
						{
							[EntityMetaKey.Selector]: {
								id: blockheadPanelTree.workspaceId,
							},
						}
				),
			}),

		defineResolver({
			entityType: EntityType.BlockheadPanel,
			resolve: {
				TreeIdPanelId: {
					resolve: async ({ treeId, panelId }) => {
					const catalog = await readNormalizedLocalInternal()
					const blockheadPanel = catalog.blockheadPanels.find((candidate) => candidate.treeId === treeId && candidate.panelId === panelId)
					if (blockheadPanel == null) throw new Error('Local_Internal: BlockheadPanel not present in local catalog')
					return {
						[EntityMetaKey.Selector]: {
							treeId: blockheadPanel.treeId,
							panelId: blockheadPanel.panelId,
						},
						...blockheadPanel,
					}
				},
				}
			},
		})({
				treeId: (blockheadPanel) => blockheadPanel[EntityMetaKey.Selector].treeId,
				panelId: (blockheadPanel) => blockheadPanel[EntityMetaKey.Selector].panelId,
				$panelTree: (blockheadPanel) => ({
					[EntityMetaKey.Selector]: {
						id: blockheadPanel.treeId,
					},
				}),
				parentPanelId: (blockheadPanel) => blockheadPanel.parentPanelId,
				indexInParent: (blockheadPanel) => blockheadPanel.indexInParent,
				kind: (blockheadPanel) => blockheadPanel.kind,
				entityType: (blockheadPanel) => blockheadPanel.entityType,
				selector: (blockheadPanel) => blockheadPanel.selector,
			}),

		defineResolver({
			entityType: EntityType.BlockheadFarcasterAccountConnection,
			resolve: {
				ConnectionId: {
					resolve: async ({ connectionId }) => {
						const catalog = await readNormalizedLocalInternal()
						const blockheadFarcasterAccountConnection = catalog.blockheadFarcasterAccountConnections.find((candidate) => candidate.connectionId === connectionId)
						if (blockheadFarcasterAccountConnection == null) {
							throw new Error('Local_Internal: BlockheadFarcasterAccountConnection not present in local catalog')
						}
						return {
							...blockheadFarcasterAccountConnection,
							$user: {
								[EntityMetaKey.Selector]: {
									fid: blockheadFarcasterAccountConnection.fid,
								},
							},
						}
					},
				}
			},
		})({
				connectionId: (connection) => connection.connectionId,
				$user: (connection) => connection.$user,
				signerAddress: (connection) => connection.signerAddress,
				authMethod: (connection) => connection.authMethod,
				verifiedAt: (connection) => connection.verifiedAt,
				expiresAt: (connection) => connection.expiresAt,
				associationFingerprint: (connection) => connection.associationFingerprint,
				selected: (connection) => connection.selected,
			}),

		defineResolver({
			entityType: EntityType.BlockheadWalletRequest,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
						const catalog = await readNormalizedLocalInternal()
						const request = catalog.blockheadWalletRequests.find((candidate) => candidate.id === id)
						if (request == null)
							throw new Error('Local_Internal: BlockheadWalletRequest not present in local catalog')

						return {
							id: request.id,
							...(
								request.sessionId != null
								&& request.actionId != null
								&& {
									$sessionAction: {
										[EntityMetaKey.Selector]: {
											sessionId: request.sessionId,
											actionId: request.actionId,
										},
									},
								}
							),
							$walletConnection: {
								[EntityMetaKey.Selector]: {
									connectionKey: request.connectionKey,
								},
							},
							...(
								request.accountId != null
								&& {
									$account: {
										[EntityMetaKey.Selector]: {
											caip10: request.accountId,
										},
									},
								}
							),
							...(
								request.hasEvmRequest
								&& {
									$evmRequest: {
										[EntityMetaKey.Selector]: {
											$walletRequest: {
												id: request.id,
											},
										},
									},
								}
							),
							requestKind: request.requestKind,
							requestMethod: request.requestMethod,
							...(request.atomicRequired != null && { atomicRequired: request.atomicRequired }),
							requestPayloadHash: Hash32.assert(request.requestPayloadHash),
							requestedAt: request.requestedAt,
							...(request.submittedAt != null && { submittedAt: request.submittedAt }),
						}
					},
				},
			},
		})({
			id: (request) => request.id,
			$sessionAction: (request) => request.$sessionAction,
			$walletConnection: (request) => request.$walletConnection,
			$account: (request) => request.$account,
			$evmRequest: (request) => request.$evmRequest,
			requestKind: (request) => request.requestKind,
			requestMethod: (request) => request.requestMethod,
			atomicRequired: (request) => request.atomicRequired,
			requestPayloadHash: (request) => request.requestPayloadHash,
			requestedAt: (request) => request.requestedAt,
			submittedAt: (request) => request.submittedAt,
		}),

		defineResolver({
			entityType: EntityType.BlockheadEvmWalletRequest,
			resolve: {
				EvmWalletRequest: {
					resolve: async ({ $walletRequest }) => {
						const catalog = await readNormalizedLocalInternal()
						const detail = catalog.blockheadEvmWalletRequests.find((candidate) => (
							candidate.walletRequestId === $walletRequest.id
						))
						if (detail == null)
							throw new Error('Local_Internal: BlockheadEvmWalletRequest not present in local catalog')

						return {
							$walletRequest: {
								[EntityMetaKey.Selector]: {
									id: detail.walletRequestId,
								},
							},
							$network: {
								[EntityMetaKey.Selector]: {
									caip2: {
										namespace: 'eip155' as const,
										reference: detail.networkReference,
									},
								},
							},
							...(
								detail.simulationId != null
								&& {
									$simulation: {
										[EntityMetaKey.Selector]: {
											id: detail.simulationId,
										},
									},
								}
							),
						}
					},
				},
			},
		})({
			$walletRequest: (detail) => detail.$walletRequest,
			$network: (detail) => detail.$network,
			$simulation: (detail) => detail.$simulation,
		}),

		defineResolver({
			entityType: EntityType.BlockheadWalletRequestCall,
			resolve: {
				EvmWalletRequestCallIndex: {
					resolve: async ({ $evmRequest, callIndex }) => {
						const catalog = await readNormalizedLocalInternal()
						const call = catalog.blockheadWalletRequestCalls.find((candidate) => (
							candidate.walletRequestId === $evmRequest.$walletRequest.id
							&& candidate.callIndex === callIndex
						))
						if (call == null)
							throw new Error('Local_Internal: BlockheadWalletRequestCall not present in local catalog')

						return {
							$evmRequest: {
								[EntityMetaKey.Selector]: {
									$walletRequest: {
										id: call.walletRequestId,
									},
								},
							},
							callIndex: call.callIndex,
							...(call.toAddress != null && { toAddress: call.toAddress }),
							...(call.value != null && { value: call.value }),
							inputDataHash: Hash32.assert(call.inputDataHash),
						}
					},
				},
			},
		})({
			$evmRequest: (call) => call.$evmRequest,
			callIndex: (call) => call.callIndex,
			toAddress: (call) => call.toAddress,
			value: (call) => call.value,
			inputDataHash: (call) => call.inputDataHash,
		}),

		defineResolver({
			entityType: EntityType.BlockheadWalletRequest_Timestamp,
			resolve: {
				WalletRequestTimestampMsSource: {
					resolve: async ({ $walletRequest, timestampMs, source }) => {
						const catalog = await readNormalizedLocalInternal()
						const observation = catalog.blockheadWalletRequestTimestamps.find((candidate) => (
							candidate.walletRequestId === $walletRequest.id
							&& candidate.timestampMs === timestampMs
							&& candidate.source === source
						))
						if (observation == null)
							throw new Error('Local_Internal: BlockheadWalletRequest_Timestamp not present in local catalog')

						return {
							$walletRequest: {
								[EntityMetaKey.Selector]: {
									id: observation.walletRequestId,
								},
							},
							timestampMs: observation.timestampMs,
							source: observation.source,
							status: observation.status,
							...(observation.walletStatusCode != null && { walletStatusCode: observation.walletStatusCode }),
							...(observation.atomic != null && { atomic: observation.atomic }),
							...(observation.transactionId != null && { transactionId: observation.transactionId }),
							...(observation.signatureHash != null && { signatureHash: Hash32.assert(observation.signatureHash) }),
							...(observation.statusPayloadHash != null && { statusPayloadHash: Hash32.assert(observation.statusPayloadHash) }),
							...(observation.error != null && { error: observation.error }),
						}
					},
				},
			},
		})({
			$walletRequest: (observation) => observation.$walletRequest,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			status: (observation) => observation.status,
			walletStatusCode: (observation) => observation.walletStatusCode,
			atomic: (observation) => observation.atomic,
			transactionId: (observation) => observation.transactionId,
			signatureHash: (observation) => observation.signatureHash,
			statusPayloadHash: (observation) => observation.statusPayloadHash,
			error: (observation) => observation.error,
		}),

		defineResolver({
			entityType: EntityType.BlockheadWalletRequest,
			resolve: {
				Id: {
					resolve: async ({ id }, context) => (
						sliceNormalizedRowsForSubset(
							(await readNormalizedLocalInternal()).blockheadWalletRequestTimestamps
								.filter((observation) => observation.walletRequestId === id)
								.toSorted((left, right) => left.timestampMs - right.timestampMs),
							context
						)
							.map((observation) => ({
								[EntityMetaKey.Selector]: {
									$walletRequest: { id: observation.walletRequestId },
									timestampMs: observation.timestampMs,
									source: observation.source,
								},
							}))
					),
				},
			},
		})({
			$$timestamps: (entity) => entity,
		}),

		defineResolver({
			entityType: EntityType.BlockheadEvmWalletRequest,
			resolve: {
				EvmWalletRequest: {
					resolve: async ({ $walletRequest }, context) => {
						const catalog = await readNormalizedLocalInternal()
						if (!catalog.blockheadEvmWalletRequests.some((request) => (
							request.walletRequestId === $walletRequest.id
						)))
							throw new Error('Local_Internal: BlockheadEvmWalletRequest not present in local catalog')

						return (
							sliceNormalizedRowsForSubset(
								catalog.blockheadWalletRequestCalls
									.filter((call) => call.walletRequestId === $walletRequest.id)
									.toSorted((left, right) => left.callIndex - right.callIndex),
								context
							)
								.map((call) => ({
									[EntityMetaKey.Selector]: {
										$evmRequest: {
											$walletRequest: { id: call.walletRequestId },
										},
										callIndex: call.callIndex,
									},
								}))
						)
					},
				},
			},
		})({
			$$calls: (entity) => entity,
		}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
					sliceNormalizedRowsForSubset(
						(await readNormalizedLocalInternal()).blockheadWallets,
						context
					)
						.map((blockheadWallet) => ({
							[EntityMetaKey.Selector]: { id: blockheadWallet.id },
						}))
				),
				}
			},
		})({
				$$blockheadWallets: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
					sliceNormalizedRowsForSubset(
						(await readNormalizedLocalInternal()).blockheadWalletConnections,
						context
					)
						.map((blockheadWalletConnection) => ({
							[EntityMetaKey.Selector]: {
								connectionKey: blockheadWalletConnection.connectionKey,
							},
						}))
				),
				}
			},
		})({
				$$blockheadWalletConnections: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
						sliceNormalizedRowsForSubset(
							(await readNormalizedLocalInternal()).blockheadWalletRequests,
							context
						)
							.map((request) => ({
								[EntityMetaKey.Selector]: {
									id: request.id,
								},
							}))
					),
				},
			},
		})({
			$$blockheadWalletRequests: (entity) => entity,
		}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
					sliceNormalizedRowsForSubset(
						(await readNormalizedLocalInternal()).blockheadSessions,
						context
					)
						.map((blockheadSession) => ({
							[EntityMetaKey.Selector]: { id: blockheadSession.id },
						}))
				),
				}
			},
		})({
				$$blockheadSessions: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.BlockheadSession,
			resolve: {
				Id: {
					resolve: async (
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
				),
				}
			},
		})({
				$$actions: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.BlockheadSessionAction,
			resolve: {
				SessionIdActionId: {
					resolve: async (
						scopedEntitySelector: EntitySelector<typeof schema, EntityType.BlockheadSessionAction>,
						context
					) => (
						sliceNormalizedRowsForSubset(
							(await readNormalizedLocalInternal()).blockheadWalletRequests
								.filter((request) => (
									request.sessionId === scopedEntitySelector.sessionId
									&& request.actionId === scopedEntitySelector.actionId
								)),
							context
						)
							.map((request) => ({
								[EntityMetaKey.Selector]: {
									id: request.id,
								},
							}))
					),
				},
			},
		})({
			$$walletRequests: (entity) => entity,
		}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
					sliceNormalizedRowsForSubset(
						(await readNormalizedLocalInternal()).blockheadWorkspaces,
						context
					)
						.map((blockheadWorkspace) => ({
							[EntityMetaKey.Selector]: { id: blockheadWorkspace.id },
						}))
				),
				}
			},
		})({
				$$blockheadWorkspaces: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
					sliceNormalizedRowsForSubset(
						(await readNormalizedLocalInternal()).blockheadLocalMediaIngests,
						context
					)
						.map((blockheadLocalMediaIngest) => ({
							[EntityMetaKey.Selector]: { ingestId: blockheadLocalMediaIngest.ingestId },
						}))
				),
				}
			},
		})({
				$$blockheadLocalMediaIngests: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
					sliceNormalizedRowsForSubset(
						(await readNormalizedLocalInternal()).blockheadPanelTrees,
						context
					)
						.map((blockheadPanelTree) => ({
							[EntityMetaKey.Selector]: { id: blockheadPanelTree.id },
						}))
				),
				}
			},
		})({
				$$blockheadPanelTrees: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.BlockheadPanelTree,
			resolve: {
				Id: {
					resolve: async (
					scopedEntitySelector: EntitySelector<typeof schema, EntityType.BlockheadPanelTree>,
					context
				) => (
					sliceNormalizedRowsForSubset(
						(await readNormalizedLocalInternal()).blockheadPanels
							.filter((blockheadPanel) => blockheadPanel.treeId === scopedEntitySelector.id)
							.toSorted((left, right) => left.indexInParent - right.indexInParent),
						context
					)
						.map((blockheadPanel) => ({
							[EntityMetaKey.Selector]: {
								treeId: blockheadPanel.treeId,
								panelId: blockheadPanel.panelId,
							},
						}))
				),
				}
			},
		})({
				$$panels: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
					sliceNormalizedRowsForSubset(
						(await readNormalizedLocalInternal()).blockheadFarcasterAccountConnections,
						context
					)
						.map((blockheadFarcasterAccountConnection) => ({
							[EntityMetaKey.Selector]: { connectionId: blockheadFarcasterAccountConnection.connectionId },
						}))
				),
				}
			},
		})({
				$$blockheadFarcasterAccountConnections: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
					sliceNormalizedRowsForSubset(
						(await readNormalizedLocalInternal()).blockheadAgentConversations,
						context
					)
						.map((blockheadAgentConversation) => ({
							[EntityMetaKey.Selector]: { id: blockheadAgentConversation.id },
						}))
				),
				}
			},
		})({
				$$blockheadAgentConversations: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.BlockheadAgentConversation,
			resolve: {
				Id: {
					resolve: async (
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
				),
				}
			},
		})({
				$$turns: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
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
				),
				}
			},
		})({
				$$bridgeTransactions: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.BlockheadBridgeTransaction,
			resolve: {
				AccountSourceTxCreatedAt: {
					resolve: async (
					scopedEntitySelector: EntitySelector<typeof schema, EntityType.BlockheadBridgeTransaction>
				) => {
					const blockheadBridgeTransaction = await (await import('$/resolvers/Local/Internal/catalog.ts')).findNormalizedBridgeTransactionRow(
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
				},
				}
			},
		})({
				$account: (transaction) => transaction.$account,
				$sourceTx: (transaction) => transaction.$sourceTx,
				createdAt: (transaction) => transaction.createdAt,
			}),

		defineResolver({
			entityType: EntityType.BlockheadRoom,
			resolve: {
				Id: {
					resolve: async ({ id }, context) => (
					sliceNormalizedRowsForSubset(
						(await readNormalizedLocalInternal()).blockheadRoomPeers.filter((roomPeer) => (
							roomPeer.roomId === id
						)),
						context
					)
						.map((roomPeer) => ({
							[EntityMetaKey.Selector]: { id: roomPeer.id },
						}))
				),
				}
			},
		})({
				$$peers: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
					sliceNormalizedRowsForSubset(
						(await readNormalizedLocalInternal()).blockheadRoomPeers,
						context
					)
						.map((blockheadRoomPeer) => ({
							[EntityMetaKey.Selector]: { id: blockheadRoomPeer.id },
						}))
				),
				}
			},
		})({
				$$blockheadRoomPeers: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
					sliceNormalizedRowsForSubset(
						(await readNormalizedLocalInternal()).blockheadRooms,
						context
					)
						.map((blockheadRoom) => ({
							[EntityMetaKey.Selector]: { id: blockheadRoom.id },
						}))
				),
				}
			},
		})({
				$$blockheadRooms: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
					sliceNormalizedRowsForSubset(
						(await readNormalizedLocalInternal()).stateChannels,
						context
					)
						.map((stateChannel) => ({
							[EntityMetaKey.Selector]: { id: stateChannel.id },
						}))
				),
				}
			},
		})({
					$$blockheadStateChannels: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.BlockheadStateChannel,
			resolve: {
				Id: {
					resolve: async (
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
				),
				}
			},
		})({
				$$transfers: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.BlockheadStateChannel,
			resolve: {
				Id: {
					resolve: async (
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
				),
				}
			},
		})({
				$$states: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.BlockheadStateChannel,
			resolve: {
				Id: {
					resolve: async (
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
				),
				}
			},
		})({
				$$deposits: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
					sliceNormalizedRowsForSubset(
						(await readNormalizedLocalInternal()).blockheadSharedAddresses,
						context
					)
						.map((blockheadSharedAddress) => ({
							[EntityMetaKey.Selector]: { id: blockheadSharedAddress.id },
						}))
				),
				}
			},
		})({
				$$blockheadSharedAddresses: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType._GlobalEvmAbiCatalog,
			resolve: {
				Scope: {
					resolve: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._GlobalEvmAbiCatalog>, context) => (
					sliceNormalizedRowsForSubset(
						(await readNormalizedLocalInternal()).evmSelectors,
						context
					)
						.map((evmSelector) => ({
							[EntityMetaKey.Selector]: { hex: evmSelector.hex },
						}))
				),
				}
			},
		})({
					$$observedSelectors: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType._GlobalEvmAbiCatalog,
			resolve: {
				Scope: {
					resolve: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._GlobalEvmAbiCatalog>, context) => (
					sliceNormalizedRowsForSubset(
						(await readNormalizedLocalInternal()).evmTopics,
						context
					)
						.map((evmTopic) => ({
							[EntityMetaKey.Selector]: { hex: evmTopic.hex },
						}))
				),
				}
			},
		})({
					$$observedTopics: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType._GlobalEvmAbiCatalog,
			resolve: {
				Scope: {
					resolve: async (_scopedEntitySelector: EntitySelector<typeof schema, EntityType._GlobalEvmAbiCatalog>, context) => (
					sliceNormalizedRowsForSubset(
						(await readNormalizedLocalInternal()).evmErrors,
						context
					)
						.map((evmError) => ({
							[EntityMetaKey.Selector]: { hex: evmError.hex },
						}))
				),
				}
			},
		})({
					$$observedErrors: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType._GlobalEvmAbiCatalog,
			resolve: {
				Scope: {
					resolve: async ({ scope }) => [
						{
							[EntityMetaKey.Selector]: {
								$hub: {
									scope,
								},
								timestampMs: Date.now(),
								source: Source.Local_Internal,
							},
						},
					],
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType._GlobalEvmAbiCatalog_Timestamp,
			resolve: {
				HubTimestampMsSource: {
					resolve: async ({
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
} satisfies RegisteredSourceResolverModule
