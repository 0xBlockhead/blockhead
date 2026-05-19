import type { EntityId } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { BlockheadSessionStatus } from '$/schema/BlockheadSession.ts'
import { CoinInstanceType } from '$/schema/CoinInstance.ts'
import { schema } from '$/schema/index.ts'


export type NormalizedActorCatalogRow = {
	address: string
}

export type NormalizedXmtpConversationCatalogRow = {
	id: string
}

export type NormalizedBlockheadSourceCatalogRow = {
	id: string
}

export type NormalizedBlockheadPanelTreeCatalogRow = {
	id: string
}

export type NormalizedBlockheadFarcasterAccountConnectionCatalogRow = {
	fid: number
}

export type NormalizedBlockheadRoomCatalogRow = {
	id: string
	createdAt: number
	createdBy: string
	name?: string
}

export type NormalizedBlockheadSessionCatalogRow = {
	id: string
	name?: string
	status: BlockheadSessionStatus
	createdAt: number
	updatedAt: number
	lockedAt?: number
	simulationCount?: number
}

export type NormalizedBlockheadRoomPeerCatalogRow = {
	id: string
	roomId: string
	peerId: string
	displayName?: string
	joinedAt: number
	lastSeenAt?: number
	connectedAt?: number
	disconnectedAt?: number
	isConnected: boolean
}

export type NormalizedBlockheadSharedAddressCatalogRow = {
	id: string
	chainId: number
	roomId: string
	peerId: string
	accountAddress: string
	targetPeerIds: string[]
	sharedAt: number
}

export type NormalizedStateChannelCatalogAsset =
	| { kind: 'native' }
	| { kind: 'erc20', tokenAddress: string }

export type NormalizedStateChannelCatalogRow = {
	id: string
	chainId: number
	participant0: string
	participant1: string
	asset: NormalizedStateChannelCatalogAsset
	totalDeposited: bigint
	balance0: bigint
	balance1: bigint
	turnNum: number
	status: 'pending' | 'active' | 'closing' | 'closed' | 'disputed'
	roomId?: string
	createdAt: number
	updatedAt: number
}

export type NormalizedBlockheadAgentConversationCatalogRow = {
	id: string
	name: string
	pinned: boolean
	systemPrompt: string
	defaultConnectionId: string
	defaultModelId: string
	createdAt: number
	updatedAt: number
}

export type NormalizedBridgeTransactionCatalogRow = {
	accountAddress: string
	chainId: number
	txHash: string
	createdAt: number
}

export type NormalizedLocalInternalCatalog = {
	actors: readonly NormalizedActorCatalogRow[]
	xmtpConversations: readonly NormalizedXmtpConversationCatalogRow[]
	blockheadSources: readonly NormalizedBlockheadSourceCatalogRow[]
	blockheadSessions: readonly NormalizedBlockheadSessionCatalogRow[]
	blockheadPanelTrees: readonly NormalizedBlockheadPanelTreeCatalogRow[]
	blockheadFarcasterAccountConnections: readonly NormalizedBlockheadFarcasterAccountConnectionCatalogRow[]
	blockheadAgentConversations: readonly NormalizedBlockheadAgentConversationCatalogRow[]
	bridgeTransactions: readonly NormalizedBridgeTransactionCatalogRow[]
	blockheadRoomPeers: readonly NormalizedBlockheadRoomPeerCatalogRow[]
	blockheadRooms: readonly NormalizedBlockheadRoomCatalogRow[]
	stateChannels: readonly NormalizedStateChannelCatalogRow[]
	blockheadSharedAddresses: readonly NormalizedBlockheadSharedAddressCatalogRow[]
}


/** Mirrors `probeEntityIdByType[EntityType.BridgeTransaction]` in assert-loaded-resolvers fixtures. */
const probeBridgeTransactionCatalogRow = {
	accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
	chainId: 1,
	txHash: '0xdacd6abf5b2814b28c68c59981f269c615796e7f0cba2009f4bf5edfdd9595ab',
	createdAt: 0,
} as const satisfies NormalizedBridgeTransactionCatalogRow

const defaultNormalizedLocalInternalCatalog: NormalizedLocalInternalCatalog = {
	actors: [],
	xmtpConversations: [],
	blockheadSources: [],
	blockheadSessions: [],
	blockheadPanelTrees: [],
	blockheadFarcasterAccountConnections: [],
	blockheadAgentConversations: [],
	bridgeTransactions: [probeBridgeTransactionCatalogRow],
	blockheadRoomPeers: [],
	blockheadRooms: [],
	stateChannels: [],
	blockheadSharedAddresses: [],
}


export const readNormalizedLocalInternalCatalog = (): NormalizedLocalInternalCatalog => (
	defaultNormalizedLocalInternalCatalog
)


export const findNormalizedBridgeTransactionRow = (
	catalog: NormalizedLocalInternalCatalog,
	entityId: EntityId<typeof schema, EntityType.BridgeTransaction>,
): NormalizedBridgeTransactionCatalogRow | undefined => (
	catalog.bridgeTransactions.find((row) => (
		row.accountAddress === entityId.$account.address
		&& row.chainId === entityId.$sourceTx.$network.chainId
		&& row.txHash === entityId.$sourceTx.txHash
		&& row.createdAt === entityId.createdAt
	))
)


export const coinInstanceIdForNormalizedStateChannelRow = (
	row: NormalizedStateChannelCatalogRow,
): EntityId<typeof schema, EntityType.CoinInstance> => (
	row.asset.kind === 'native' ?
		{
			$network: { chainId: row.chainId },
			type: CoinInstanceType.NativeCurrency,
		}
	:
		{
			$network: { chainId: row.chainId },
			type: CoinInstanceType.Erc20Token,
			$contract: {
				$network: { chainId: row.chainId },
				address: row.asset.tokenAddress,
			},
		}
)
