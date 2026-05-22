import type { EntityId } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { BlockheadSessionStatus } from '$/schema/BlockheadSession.ts'
import { CoinInstanceType } from '$/schema/CoinInstance.ts'
import { XmtpConversationConsentState } from '$/schema/XmtpConversation.ts'
import { schema } from '$/schema/index.ts'


export type NormalizedActorCatalogRow = {
	address: string
}

export type NormalizedXmtpConversationCatalogRow = {
	id: string
	peerInboxId?: string
	topic?: string
	createdAtMs?: number
	consentState?: XmtpConversationConsentState
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

export type NormalizedEvmSelectorCatalogRow = {
	hex: `0x${string}`
}

export type NormalizedEvmTopicCatalogRow = {
	hex: `0x${string}`
}

export type NormalizedEvmErrorCatalogRow = {
	hex: `0x${string}`
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
	evmSelectors: readonly NormalizedEvmSelectorCatalogRow[]
	evmTopics: readonly NormalizedEvmTopicCatalogRow[]
	evmErrors: readonly NormalizedEvmErrorCatalogRow[]
}


/** Mirrors `probeEntityIdByType[EntityType.BridgeTransaction]` in assert-loaded-resolvers fixtures. */
const probeBridgeTransactionCatalogRow = {
	accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
	chainId: 1,
	txHash: '0xdacd6abf5b2814b28c68c59981f269c615796e7f0cba2009f4bf5edfdd9595ab',
	createdAt: 0,
} as const satisfies NormalizedBridgeTransactionCatalogRow

const probeBlockheadSourceCatalogRow = {
	id: 'e2e-probe-source',
} as const satisfies NormalizedBlockheadSourceCatalogRow

const probeBlockheadPanelTreeCatalogRow = {
	id: 'e2e-probe-panel-tree',
} as const satisfies NormalizedBlockheadPanelTreeCatalogRow

const probeBlockheadRoomCatalogRow = {
	id: 'e2e-probe-room',
	createdAt: 0,
	createdBy: 'e2e',
} as const satisfies NormalizedBlockheadRoomCatalogRow

const probeBlockheadSessionCatalogRow = {
	id: 'e2e-probe-session',
	status: BlockheadSessionStatus.Draft,
	createdAt: 0,
	updatedAt: 0,
} as const satisfies NormalizedBlockheadSessionCatalogRow

const probeBlockheadRoomPeerCatalogRow = {
	id: 'e2e-probe-room-peer',
	roomId: probeBlockheadRoomCatalogRow.id,
	peerId: 'e2e-peer',
	joinedAt: 0,
	isConnected: false,
} as const satisfies NormalizedBlockheadRoomPeerCatalogRow

const probeBlockheadSharedAddressCatalogRow = {
	id: 'e2e-probe-shared-address',
	chainId: 1,
	roomId: probeBlockheadRoomCatalogRow.id,
	peerId: 'e2e-peer',
	accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
	targetPeerIds: [],
	sharedAt: 0,
} as const satisfies NormalizedBlockheadSharedAddressCatalogRow

const probeStateChannelCatalogRow = {
	id: 'e2e-probe-state-channel',
	chainId: 1,
	participant0: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
	participant1: '0x0000000000000000000000000000000000000001',
	asset: { kind: 'native' },
	totalDeposited: 0n,
	balance0: 0n,
	balance1: 0n,
	turnNum: 0,
	status: 'active',
	createdAt: 0,
	updatedAt: 0,
} as const satisfies NormalizedStateChannelCatalogRow

const probeBlockheadAgentConversationCatalogRow = {
	id: 'e2e-probe-agent-conversation',
	name: 'E2E probe',
	pinned: false,
	systemPrompt: '',
	defaultConnectionId: 'e2e',
	defaultModelId: 'e2e',
	createdAt: 0,
	updatedAt: 0,
} as const satisfies NormalizedBlockheadAgentConversationCatalogRow

const defaultEvmSelectorCatalog: readonly NormalizedEvmSelectorCatalogRow[] = [
	{ hex: '0xa9059cbb' },
	{ hex: '0x095ea7b3' },
	{ hex: '0x70a08231' },
	{ hex: '0x18160ddd' },
	{ hex: '0x23b872dd' },
	{ hex: '0xdd62ed3e' },
	{ hex: '0x06fdde03' },
	{ hex: '0x95d89b41' },
	{ hex: '0x313ce567' },
	{ hex: '0x42842e0e' },
]

const defaultEvmTopicCatalog: readonly NormalizedEvmTopicCatalogRow[] = [
	{
		hex: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
	},
	{
		hex: '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
	},
	{
		hex: '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31',
	},
	{
		hex: '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1',
	},
	{
		hex: '0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67',
	},
	{
		hex: '0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c',
	},
	{
		hex: '0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65',
	},
	{
		hex: '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0',
	},
	{
		hex: '0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d',
	},
	{
		hex: '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
	},
]

const defaultEvmErrorCatalog: readonly NormalizedEvmErrorCatalogRow[] = [
	{ hex: '0x08c379a0' },
	{ hex: '0x4e487b71' },
	{ hex: '0x1e4fbdf7' },
	{ hex: '0x2d0a3f8e' },
	{ hex: '0x82b42900' },
	{ hex: '0x5c60da1b' },
	{ hex: '0x30f28b7a' },
	{ hex: '0x2d838119' },
	{ hex: '0x2d67b72d' },
	{ hex: '0xfe0d94c1' },
]

const defaultNormalizedLocalInternalCatalog: NormalizedLocalInternalCatalog = {
	actors: [
		{ address: '0xd8da6bf26964af9d7eed9e403e826090792bed6a' },
	],
	xmtpConversations: [
		{
			id: 'e2e-probe-conversation',
			peerInboxId: 'e2e-probe-peer',
		},
	],
	blockheadSources: [probeBlockheadSourceCatalogRow],
	blockheadSessions: [probeBlockheadSessionCatalogRow],
	blockheadPanelTrees: [probeBlockheadPanelTreeCatalogRow],
	blockheadFarcasterAccountConnections: [
		{ fid: 3 },
	],
	blockheadAgentConversations: [probeBlockheadAgentConversationCatalogRow],
	bridgeTransactions: [probeBridgeTransactionCatalogRow],
	blockheadRoomPeers: [probeBlockheadRoomPeerCatalogRow],
	blockheadRooms: [probeBlockheadRoomCatalogRow],
	stateChannels: [probeStateChannelCatalogRow],
	blockheadSharedAddresses: [probeBlockheadSharedAddressCatalogRow],
	evmSelectors: defaultEvmSelectorCatalog,
	evmTopics: defaultEvmTopicCatalog,
	evmErrors: defaultEvmErrorCatalog,
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
