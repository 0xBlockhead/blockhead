import type { EntityId } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { BlockheadAgentConversationTurnStatus } from '$/schema/BlockheadAgentConversationTurn.ts'
import { BlockheadSessionStatus } from '$/schema/BlockheadSession.ts'
import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
import { EvmAddress } from '$/schema/$ZeroExHex.ts'
import { XmtpConversationConsentState } from '$/schema/XmtpConversation.ts'
import { schema } from '$/schema/index.ts'


export type NormalizedActor = {
	address: string
}

export type NormalizedXmtpConversation = {
	id: string
	peerInboxId?: string
	topic?: string
	createdAtMs?: number
	consentState?: XmtpConversationConsentState
}

export type NormalizedBlockheadSource = {
	id: string
}

export type NormalizedBlockheadPanelTree = {
	id: string
}

export type NormalizedBlockheadFarcasterAccountConnection = {
	fid: number
}

export type NormalizedBlockheadRoom = {
	id: string
	createdAt: number
	createdBy: string
	name?: string
}

export type NormalizedBlockheadSession = {
	id: string
	name?: string
	status: BlockheadSessionStatus
	createdAt: number
	updatedAt: number
	lockedAt?: number
	simulationCount?: number
}

export type NormalizedBlockheadRoomPeer = {
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

export type NormalizedBlockheadSharedAddress = {
	id: string
	chainId: number
	roomId: string
	peerId: string
	accountAddress: string
	targetPeerIds: string[]
	sharedAt: number
}

export type NormalizedStateChannelAsset =
	| { kind: 'native' }
	| { kind: 'erc20', tokenAddress: string }

export type NormalizedStateChannel = {
	id: string
	chainId: number
	participant0: string
	participant1: string
	asset: NormalizedStateChannelAsset
	totalDeposited: bigint
	balance0: bigint
	balance1: bigint
	turnNum: number
	status: 'pending' | 'active' | 'closing' | 'closed' | 'disputed'
	roomId?: string
	createdAt: number
	updatedAt: number
}

export type NormalizedStateChannelTransfer = {
	id: string
	channelId: string
	from: string
	to: string
	amount: bigint
	turnNum: number
	timestamp: number
	status: 'pending' | 'confirmed' | 'failed'
}

export type NormalizedStateChannelState = {
	id: string
	channelId: string
	intent: number
	version: number
	stateData: `0x${string}`
	allocations: readonly {
		destination: string
		token: string
		amount: bigint
	}[]
	signatures: readonly `0x${string}`[]
	isFinal: boolean
	timestamp: number
}

export type NormalizedStateChannelDeposit = {
	id: string
	channelId: string
	chainId: number
	accountAddress: string
	availableBalance: bigint
	lockedBalance: bigint
	lastUpdated: number
}

export type NormalizedBlockheadAgentConversation = {
	id: string
	name: string
	pinned: boolean
	systemPrompt: string
	defaultConnectionId: string
	defaultModelId: string
	createdAt: number
	updatedAt: number
}

export type NormalizedBlockheadAgentConversationTurn = {
	id: string
	conversationId: string
	parentId: string | null
	userPrompt: string
	assistantText: string | null
	providerId: string | null
	status: BlockheadAgentConversationTurnStatus
	error?: string
	createdAt: number
	promptVersion: string
}

export type NormalizedBridgeTransaction = {
	accountAddress: string
	chainId: number
	txHash: string
	createdAt: number
}

export type NormalizedEvmSelector = {
	hex: `0x${string}`
}

export type NormalizedEvmTopic = {
	hex: `0x${string}`
}

export type NormalizedEvmError = {
	hex: `0x${string}`
}

export type NormalizedLocalInternal = {
	actors: readonly NormalizedActor[]
	xmtpConversations: readonly NormalizedXmtpConversation[]
	blockheadSources: readonly NormalizedBlockheadSource[]
	blockheadSessions: readonly NormalizedBlockheadSession[]
	blockheadPanelTrees: readonly NormalizedBlockheadPanelTree[]
	blockheadFarcasterAccountConnections: readonly NormalizedBlockheadFarcasterAccountConnection[]
	blockheadAgentConversations: readonly NormalizedBlockheadAgentConversation[]
	blockheadAgentConversationTurns: readonly NormalizedBlockheadAgentConversationTurn[]
	bridgeTransactions: readonly NormalizedBridgeTransaction[]
	blockheadRoomPeers: readonly NormalizedBlockheadRoomPeer[]
	blockheadRooms: readonly NormalizedBlockheadRoom[]
	stateChannels: readonly NormalizedStateChannel[]
	stateChannelTransfers: readonly NormalizedStateChannelTransfer[]
	stateChannelStates: readonly NormalizedStateChannelState[]
	stateChannelDeposits: readonly NormalizedStateChannelDeposit[]
	blockheadSharedAddresses: readonly NormalizedBlockheadSharedAddress[]
	evmSelectors: readonly NormalizedEvmSelector[]
	evmTopics: readonly NormalizedEvmTopic[]
	evmErrors: readonly NormalizedEvmError[]
}


/** Mirrors `probeEntityIdByType[EntityType.BridgeTransaction]` in assert-loaded-resolvers fixtures. */
const probeBridgeTransaction = {
	accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
	chainId: 1,
	txHash: '0xdacd6abf5b2814b28c68c59981f269c615796e7f0cba2009f4bf5edfdd9595ab',
	createdAt: 0,
} as const satisfies NormalizedBridgeTransaction

const probeBlockheadSource = {
	id: 'e2e-probe-source',
} as const satisfies NormalizedBlockheadSource

const probeBlockheadPanelTree = {
	id: 'e2e-probe-panel-tree',
} as const satisfies NormalizedBlockheadPanelTree

const probeBlockheadRoom = {
	id: 'e2e-probe-room',
	createdAt: 0,
	createdBy: 'e2e',
} as const satisfies NormalizedBlockheadRoom

const probeBlockheadSession = {
	id: 'e2e-probe-session',
	status: BlockheadSessionStatus.Draft,
	createdAt: 0,
	updatedAt: 0,
} as const satisfies NormalizedBlockheadSession

const probeBlockheadRoomPeer = {
	id: 'e2e-probe-room-peer',
	roomId: probeBlockheadRoom.id,
	peerId: 'e2e-peer',
	joinedAt: 0,
	isConnected: false,
} as const satisfies NormalizedBlockheadRoomPeer

const probeBlockheadSharedAddress = {
	id: 'e2e-probe-shared-address',
	chainId: 1,
	roomId: probeBlockheadRoom.id,
	peerId: 'e2e-peer',
	accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
	targetPeerIds: [],
	sharedAt: 0,
} as const satisfies NormalizedBlockheadSharedAddress

const probeStateChannel = {
	id: 'e2e-probe-state-channel',
	chainId: 1,
	participant0: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
	participant1: '0x0000000000000000000000000000000000000001',
	asset: { kind: 'native' },
	totalDeposited: 1_000_000_000_000_000_000n,
	balance0: 950_000_000_000_000_000n,
	balance1: 50_000_000_000_000_000n,
	turnNum: 2,
	status: 'active',
	createdAt: 0,
	updatedAt: 0,
} as const satisfies NormalizedStateChannel

const probeStateChannelTransfers = [
	{
		id: 'e2e-probe-state-channel-transfer-1',
		channelId: probeStateChannel.id,
		from: probeStateChannel.participant0,
		to: probeStateChannel.participant1,
		amount: 100_000_000_000_000_000n,
		turnNum: 1,
		timestamp: 1,
		status: 'confirmed',
	},
	{
		id: 'e2e-probe-state-channel-transfer-2',
		channelId: probeStateChannel.id,
		from: probeStateChannel.participant1,
		to: probeStateChannel.participant0,
		amount: 50_000_000_000_000_000n,
		turnNum: 2,
		timestamp: 2,
		status: 'confirmed',
	},
] as const satisfies readonly NormalizedStateChannelTransfer[]

const probeStateChannelStates = [
	{
		id: 'e2e-probe-state-channel-state-1',
		channelId: probeStateChannel.id,
		intent: 1,
		version: 1,
		stateData: '0x01',
		allocations: [
			{
				destination: probeStateChannel.participant0,
				token: '0x0000000000000000000000000000000000000000',
				amount: 900_000_000_000_000_000n,
			},
			{
				destination: probeStateChannel.participant1,
				token: '0x0000000000000000000000000000000000000000',
				amount: 100_000_000_000_000_000n,
			},
		],
		signatures: ['0x01'],
		isFinal: false,
		timestamp: 1,
	},
	{
		id: 'e2e-probe-state-channel-state-2',
		channelId: probeStateChannel.id,
		intent: 1,
		version: 2,
		stateData: '0x02',
		allocations: [
			{
				destination: probeStateChannel.participant0,
				token: '0x0000000000000000000000000000000000000000',
				amount: 950_000_000_000_000_000n,
			},
			{
				destination: probeStateChannel.participant1,
				token: '0x0000000000000000000000000000000000000000',
				amount: 50_000_000_000_000_000n,
			},
		],
		signatures: ['0x01', '0x02'],
		isFinal: false,
		timestamp: 2,
	},
] as const satisfies readonly NormalizedStateChannelState[]

const probeStateChannelDeposit = {
	id: 'e2e-probe-state-channel-deposit-0',
	channelId: probeStateChannel.id,
	chainId: probeStateChannel.chainId,
	accountAddress: probeStateChannel.participant0,
	availableBalance: 1_000_000_000_000_000_000n,
	lockedBalance: 0n,
	lastUpdated: 0,
} as const satisfies NormalizedStateChannelDeposit

const probeBlockheadAgentConversation = {
	id: 'e2e-probe-agent-conversation',
	name: 'E2E probe conversation',
	pinned: true,
	systemPrompt: 'You are a helpful assistant.',
	defaultConnectionId: 'e2e-probe-connection',
	defaultModelId: 'e2e-probe-model',
	createdAt: 1_700_000_000_000,
	updatedAt: 1_700_000_000_001,
} as const satisfies NormalizedBlockheadAgentConversation

const probeBlockheadAgentConversationTurn = {
	id: 'e2e-probe-agent-conversation-turn',
	conversationId: probeBlockheadAgentConversation.id,
	parentId: null,
	userPrompt: 'Summarize what this conversation row is for.',
	assistantText: 'It is a catalog probe for agent chat turns in e2e smoke.',
	providerId: 'e2e-probe-provider',
	status: BlockheadAgentConversationTurnStatus.Complete,
	createdAt: 1_700_000_000_002,
	promptVersion: 'e2e-probe-v1',
} as const satisfies NormalizedBlockheadAgentConversationTurn

const defaultEvmSelectors: readonly NormalizedEvmSelector[] = [
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

const defaultEvmTopics: readonly NormalizedEvmTopic[] = [
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

const defaultEvmErrors: readonly NormalizedEvmError[] = [
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

const defaultNormalizedLocalInternal: NormalizedLocalInternal = {
	actors: [
		{ address: '0xd8da6bf26964af9d7eed9e403e826090792bed6a' },
	],
	xmtpConversations: [
		{
			id: 'e2e-probe-conversation',
			peerInboxId: 'e2e-probe-peer',
			topic: 'e2e-probe-topic',
			createdAtMs: 1_700_000_000_000,
			consentState: XmtpConversationConsentState.Allowed,
		},
	],
	blockheadSources: [probeBlockheadSource],
	blockheadSessions: [probeBlockheadSession],
	blockheadPanelTrees: [probeBlockheadPanelTree],
	blockheadFarcasterAccountConnections: [
		{ fid: 3 },
	],
	blockheadAgentConversations: [probeBlockheadAgentConversation],
	blockheadAgentConversationTurns: [probeBlockheadAgentConversationTurn],
	bridgeTransactions: [probeBridgeTransaction],
	blockheadRoomPeers: [probeBlockheadRoomPeer],
	blockheadRooms: [probeBlockheadRoom],
	stateChannels: [probeStateChannel],
	stateChannelTransfers: probeStateChannelTransfers,
	stateChannelStates: probeStateChannelStates,
	stateChannelDeposits: [probeStateChannelDeposit],
	blockheadSharedAddresses: [probeBlockheadSharedAddress],
	evmSelectors: defaultEvmSelectors,
	evmTopics: defaultEvmTopics,
	evmErrors: defaultEvmErrors,
}


export const readNormalizedLocalInternal = (): NormalizedLocalInternal => (
	defaultNormalizedLocalInternal
)


export const findNormalizedBridgeTransactionRow = (
	catalog: NormalizedLocalInternal,
	entityId: EntityId<typeof schema, EntityType.BridgeTransaction>,
): NormalizedBridgeTransaction | undefined => (
	catalog.bridgeTransactions.find((row) => (
		row.accountAddress === entityId.$account.address
		&& String(row.chainId) === entityId.$sourceTx.$network.caip2.reference
		&& row.txHash === entityId.$sourceTx.txHash
		&& row.createdAt === entityId.createdAt
	))
)


export const coinInstanceIdForNormalizedStateChannelRow = (
	row: NormalizedStateChannel,
): EntityId<typeof schema, EntityType.EvmCoinInstance> => (
	row.asset.kind === 'native' ?
		{
			$network: { caip2: { namespace: 'eip155', reference: String(row.chainId) } },
			type: CoinInstanceType.NativeCurrency,
		}
	:
		{
			$network: { caip2: { namespace: 'eip155', reference: String(row.chainId) } },
			type: CoinInstanceType.Erc20Token,
			$contract: {
				$network: { caip2: { namespace: 'eip155', reference: String(row.chainId) } },
				address: EvmAddress.assert(row.asset.tokenAddress),
			},
		}
)
