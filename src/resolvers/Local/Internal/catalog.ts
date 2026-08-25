import { entitySelectorKey, type EntitySelector } from '$/schema/$schema.ts'
import { ActionType } from '$/actions/index.ts'
import { networkByCaip2 } from '$/constants/Network.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { BlockheadAgentConversationTurnStatus } from '$/schema/BlockheadAgentConversationTurnStatus.ts'
import { BlockheadSessionStatus } from '$/schema/BlockheadSessionStatus.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { XmtpConversationConsentState } from '$/schema/XmtpConversationConsentState.ts'
import {
	WalletCapability,
	WalletDiscoveryKind,
	WalletProtocol,
	WalletTransportKind,
} from '$/constants/Wallet.ts'
import { entityDefinitionByType, schema } from '$/schema/index.ts'


export type NormalizedActor = {
	address: typeof EvmAddress.infer
}

export type NormalizedXmtpConversation = {
	id: string
	peerInboxId?: string
	topic?: string
	createdAtMs?: number
	consentState?: XmtpConversationConsentState
}

export type NormalizedBlockheadWallet = {
	id: string
	name: string
	icon: string
	protocol: WalletProtocol
	discoveryKind: WalletDiscoveryKind
	transportKind: WalletTransportKind
	rdns?: string
	capabilities: readonly WalletCapability[]
}

export type NormalizedBlockheadWalletConnection = {
	connectionKey: string
	walletId: string
	status: 'disconnected' | 'connecting' | 'connected' | 'error'
	protocol: WalletProtocol
	transportKind: WalletTransportKind
	scopes: readonly {
		namespace: string
		reference: string
		methods: readonly string[]
		events: readonly string[]
	}[]
	accountIds: readonly {
		namespace: string
		reference: string
		accountAddress: string
	}[]
	activeAccountId?: {
		namespace: string
		reference: string
		accountAddress: string
	}
	selected?: boolean
	connectedAt?: number
	disconnectedAt?: number
	sessionId?: string
	sessionTopic?: string
	error?: string
}

export type NormalizedBlockheadWalletRequest = {
	id: string
	sessionId?: string
	actionId?: string
	connectionKey: string
	accountId?: {
		namespace: string
		reference: string
		accountAddress: string
	}
	requestKind: string
	requestMethod: string
	atomicRequired?: boolean
	requestPayloadHash: `0x${string}`
	requestedAt: number
	submittedAt?: number
	hasEvmRequest: boolean
}

export type NormalizedBlockheadEvmWalletRequest = {
	walletRequestId: string
	networkReference: string
	simulationId?: string
}

export type NormalizedBlockheadWalletRequestCall = {
	walletRequestId: string
	callIndex: number
	toAddress?: typeof EvmAddress.infer
	value?: bigint
	inputDataHash: `0x${string}`
}

export type NormalizedBlockheadWalletRequest_Timestamp = {
	walletRequestId: string
	timestampMs: number
	source: string
	status: string
	walletStatusCode?: number
	atomic?: boolean
	transactionId?: string
	signatureHash?: `0x${string}`
	statusPayloadHash?: `0x${string}`
	error?: string
}

export type NormalizedBlockheadPanelTree = {
	id: string
	workspaceId?: string
}

export type NormalizedBlockheadWorkspace = {
	id: string
	name?: string
	activePanelTreeId?: string
	createdAt: number
	updatedAt: number
}

export type NormalizedBlockheadPanel = {
	treeId: string
	panelId: string
	parentPanelId?: string
	indexInParent: number
	kind: string
	entityType?: string
	selector?: object
}

export type NormalizedBlockheadFarcasterAccountConnection = {
	connectionId: string
	fid: number
	signerAddress: string
	authMethod: 'custody' | 'authAddress'
	verifiedAt: number
	expiresAt: number
	associationFingerprint: string
	selected: boolean
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

export type NormalizedBlockheadSessionAction = {
	sessionId: string
	actionId: string
	indexInSequence: number
	actionType: ActionType
	actionParams?: unknown
	createdAt: number
	updatedAt: number
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

export type NormalizedBlockheadSiweChallenge = {
	id: string
	chainId: number
	roomId: string
	fromPeerId: string
	toPeerId: string
	signerAddress: string
	message: string
	scheme?: string
	domain: string
	address: string
	uri: string
	version: string
	nonce: string
	statement?: string
	issuedAt: number
	expiresAt?: number
	notBefore?: number
	requestId?: string
	resources: readonly string[]
	requestOrigin?: string
	signature?: string
	signatureKind?: string
	verified: boolean
	verificationMethod?: string
	verifiedAt?: number
	verificationError?: string
}

export type NormalizedBlockheadTransferRequest = {
	id: string
	chainId: number
	roomId: string
	from: string
	to: string
	allocations: readonly {
		destination: string
		token: string
		amount: bigint
	}[]
	status: string
	createdAt: number
	expiresAt: number
}

export type NormalizedBlockheadSocialPostSession = {
	id: string
	name?: string
	status: 'Draft' | 'Submitted' | 'Finalized'
	protocol: 'Farcaster' | 'Atproto' | 'ActivityPub' | 'Nostr' | 'X'
	authorKey?: string
	walletConnectionKey?: string
	agentConversationId?: string
	text?: string
	mediaUrls?: string[]
	publishedEntityType?: string
	publishedSelector?: object
	createdAt: number
	updatedAt: number
	lockedAt?: number
}

export type NormalizedBlockheadLocalMediaIngest = {
	ingestId: string
	fileName?: string
	mimeType?: string
	size?: number
	sha256?: `0x${string}`
	createdAt: number
	mediaUrl?: string
}

export type NormalizedBlockheadLocalMediaIngest_Timestamp = {
	ingestId: string
	timestampMs: number
	source: string
	status: string
	uri?: string
	error?: string
}

export type NormalizedBlockheadFilecoinPendingMessage = {
	nodeId: string
	messageCid: string
	observedAtMs: number
	networkCaip2Reference?: string
	fromAddress?: string
	toAddress?: string
	nonce?: bigint
	method?: number
	valueAttoFil?: bigint
	gasLimit?: bigint
	gasFeeCapAttoFil?: bigint
	gasPremiumAttoFil?: bigint
	signatureType?: number
	local?: boolean
	payload?: unknown
}

export type NormalizedStateChannelAsset =
	| { kind: 'native' }
	| {
		kind: 'erc20'
		tokenAddress: string
	}

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
	blockheadWallets: readonly NormalizedBlockheadWallet[]
	blockheadWalletConnections: readonly NormalizedBlockheadWalletConnection[]
	blockheadWalletRequests: readonly NormalizedBlockheadWalletRequest[]
	blockheadEvmWalletRequests: readonly NormalizedBlockheadEvmWalletRequest[]
	blockheadWalletRequestCalls: readonly NormalizedBlockheadWalletRequestCall[]
	blockheadWalletRequestTimestamps: readonly NormalizedBlockheadWalletRequest_Timestamp[]
	blockheadSessions: readonly NormalizedBlockheadSession[]
	blockheadSessionActions: readonly NormalizedBlockheadSessionAction[]
	blockheadWorkspaces: readonly NormalizedBlockheadWorkspace[]
	blockheadPanelTrees: readonly NormalizedBlockheadPanelTree[]
	blockheadPanels: readonly NormalizedBlockheadPanel[]
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
	blockheadSiweChallenges: readonly NormalizedBlockheadSiweChallenge[]
	blockheadTransferRequests: readonly NormalizedBlockheadTransferRequest[]
	blockheadSocialPostSessions: readonly NormalizedBlockheadSocialPostSession[]
	blockheadLocalMediaIngests: readonly NormalizedBlockheadLocalMediaIngest[]
	blockheadLocalMediaIngestTimestamps: readonly NormalizedBlockheadLocalMediaIngest_Timestamp[]
	blockheadFilecoinPendingMessages: readonly NormalizedBlockheadFilecoinPendingMessage[]
	evmSelectors: readonly NormalizedEvmSelector[]
	evmTopics: readonly NormalizedEvmTopic[]
	evmErrors: readonly NormalizedEvmError[]
}


/** Mirrors `probeEntitySelectorByType[EntityType.BlockheadBridgeTransaction]` in assert-loaded-resolvers fixtures. */
const probeBridgeTransaction = {
	accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
	chainId: 1,
	txHash: '0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca',
	createdAt: 0,
} as const satisfies NormalizedBridgeTransaction

const probeBlockheadWallet = {
	id: 'eip6963:e2e-probe-wallet',
	name: 'E2E Probe Wallet',
	icon: '',
	protocol: WalletProtocol.Eip6963,
	discoveryKind: WalletDiscoveryKind.InjectedEvent,
	transportKind: WalletTransportKind.InjectedProvider,
	rdns: 'dev.blockhead.e2e',
	capabilities: [
		WalletCapability.Connect,
		WalletCapability.Reconnect,
		WalletCapability.ListAccounts,
		WalletCapability.WatchAccounts,
		WalletCapability.WatchScopes,
		WalletCapability.SignMessage,
		WalletCapability.SignTransaction,
	],
} as const satisfies NormalizedBlockheadWallet

const probeBlockheadWalletConnection = {
	connectionKey: 'e2e-probe-wallet-connection',
	walletId: probeBlockheadWallet.id,
	status: 'connected',
	protocol: WalletProtocol.Eip6963,
	transportKind: WalletTransportKind.InjectedProvider,
	scopes: [
		{
			namespace: 'eip155',
			reference: '1',
			methods: [
				'eth_accounts',
				'eth_requestAccounts',
				'personal_sign',
				'eth_sendTransaction',
			],
			events: [
				'accountsChanged',
				'chainChanged',
			],
		},
		{
			namespace: 'solana',
			reference: 'mainnet',
			methods: [
				'signMessage',
				'signTransaction',
			],
			events: ['change'],
		},
	],
	accountIds: [{
		namespace: 'eip155',
		reference: '1',
		accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
	}],
	activeAccountId: {
		namespace: 'eip155',
		reference: '1',
		accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
	},
	selected: true,
	connectedAt: 0,
} as const satisfies NormalizedBlockheadWalletConnection

const probeBlockheadWalletRequestPayloadHash = '0x1111111111111111111111111111111111111111111111111111111111111111' as const

const probeBlockheadWalletRequest = {
	id: 'e2e-probe-wallet-request',
	sessionId: 'e2e-probe-session',
	actionId: 'e2e-probe-session-action-0',
	connectionKey: probeBlockheadWalletConnection.connectionKey,
	accountId: probeBlockheadWalletConnection.activeAccountId,
	requestKind: 'transaction',
	requestMethod: 'eth_sendTransaction',
	requestPayloadHash: probeBlockheadWalletRequestPayloadHash,
	requestedAt: 0,
	hasEvmRequest: true,
} as const satisfies NormalizedBlockheadWalletRequest

const probeBlockheadEvmWalletRequest = {
	walletRequestId: probeBlockheadWalletRequest.id,
	networkReference: '1',
	simulationId: 'e2e-probe-session-simulation',
} as const satisfies NormalizedBlockheadEvmWalletRequest

const probeBlockheadWalletRequestCall = {
	walletRequestId: probeBlockheadWalletRequest.id,
	callIndex: 0,
	toAddress: EvmAddress.assert('0x0000000000000000000000000000000000000001'),
	value: 0n,
	inputDataHash: '0x2222222222222222222222222222222222222222222222222222222222222222',
} as const satisfies NormalizedBlockheadWalletRequestCall

const probeBlockheadWalletRequestTimestamp = {
	walletRequestId: probeBlockheadWalletRequest.id,
	timestampMs: 0,
	source: 'Local_Internal',
	status: 'prepared',
} as const satisfies NormalizedBlockheadWalletRequest_Timestamp

const probeBlockheadPanelTree = {
	id: 'e2e-probe-panel-tree',
	workspaceId: 'e2e-probe-workspace',
} as const satisfies NormalizedBlockheadPanelTree

const probeBlockheadWorkspace = {
	id: 'e2e-probe-workspace',
	name: 'E2E Probe Workspace',
	activePanelTreeId: probeBlockheadPanelTree.id,
	createdAt: 0,
	updatedAt: 0,
} as const satisfies NormalizedBlockheadWorkspace

const probeBlockheadPanel = {
	treeId: probeBlockheadPanelTree.id,
	panelId: 'e2e-probe-panel',
	indexInParent: 0,
	kind: 'entity',
	entityType: 'BlockheadSession',
	selector: {
		id: 'e2e-probe-session',
	},
} as const satisfies NormalizedBlockheadPanel

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

const probeBlockheadDirectSession = {
	id: 'e2e-probe-direct-session',
	status: BlockheadSessionStatus.Draft,
	createdAt: 0,
	updatedAt: 0,
} as const satisfies NormalizedBlockheadSession

const probeBlockheadSessionAction = {
	sessionId: probeBlockheadSession.id,
	actionId: 'e2e-probe-session-action-0',
	indexInSequence: 0,
	actionType: ActionType.Swap,
	actionParams: {
		chainId: 1,
		tokenIn: '0x0000000000000000000000000000000000000000',
		tokenOut: '0x0000000000000000000000000000000000000000',
		amount: 0n,
		slippage: 0.005,
	},
	createdAt: 0,
	updatedAt: 0,
} as const satisfies NormalizedBlockheadSessionAction

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

const probeBlockheadSiweChallenge = {
	id: 'e2e-probe-siwe-challenge',
	chainId: 1,
	roomId: probeBlockheadRoom.id,
	fromPeerId: probeBlockheadRoomPeer.peerId,
	toPeerId: 'e2e-peer-2',
	signerAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
	message: 'e2e.blockhead.dev wants you to sign in with your Ethereum account.',
	domain: 'e2e.blockhead.dev',
	address: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
	uri: 'https://e2e.blockhead.dev',
	version: '1',
	nonce: 'e2e-probe-nonce',
	statement: 'E2E probe SIWE challenge.',
	issuedAt: 1_700_000_000_000,
	resources: [],
	verified: true,
	verificationMethod: 'local-probe',
	verifiedAt: 1_700_000_000_001,
} as const satisfies NormalizedBlockheadSiweChallenge

const probeBlockheadTransferRequest = {
	id: 'e2e-probe-transfer-request',
	chainId: 1,
	roomId: probeBlockheadRoom.id,
	from: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
	to: '0x0000000000000000000000000000000000000001',
	allocations: [
		{
			destination: '0x0000000000000000000000000000000000000001',
			token: '0x0000000000000000000000000000000000000000',
			amount: 1_000_000_000_000_000n,
		},
	],
	status: 'pending',
	createdAt: 1_700_000_000_000,
	expiresAt: 1_700_003_600_000,
} as const satisfies NormalizedBlockheadTransferRequest

const probeBlockheadSocialPostSession = {
	id: 'e2e-probe-social-post-session',
	name: 'E2E probe social post',
	status: 'Draft',
	protocol: 'Farcaster',
	authorKey: 'fid:3',
	text: 'E2E probe draft',
	createdAt: 1_700_000_000_000,
	updatedAt: 1_700_000_000_001,
} as const satisfies NormalizedBlockheadSocialPostSession

const probeBlockheadLocalMediaIngest = {
	ingestId: 'e2e-probe-local-media-ingest',
	fileName: 'probe.png',
	mimeType: 'image/png',
	size: 1024,
	sha256: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
	createdAt: 1_700_000_000_000,
} as const satisfies NormalizedBlockheadLocalMediaIngest

const probeBlockheadLocalMediaIngestTimestamp = {
	ingestId: 'e2e-probe-local-media-ingest',
	timestampMs: 1_700_000_000_001,
	source: 'Local_Internal',
	status: 'digested',
} as const satisfies NormalizedBlockheadLocalMediaIngest_Timestamp

const probeBlockheadFilecoinPendingMessage = {
	nodeId: 'e2e-probe-filecoin-node',
	messageCid: 'bafy2bzacebe2eprobe',
	observedAtMs: 1_700_000_000_000,
	networkCaip2Reference: '314',
	fromAddress: 'f01234',
	toAddress: 'f05678',
	nonce: 1n,
	method: 0,
	valueAttoFil: 0n,
	gasLimit: 10_000_000n,
	gasFeeCapAttoFil: 1n,
	gasPremiumAttoFil: 1n,
	signatureType: 1,
	local: true,
} as const satisfies NormalizedBlockheadFilecoinPendingMessage

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
		signatures: [
			'0x01',
			'0x02',
		],
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

const defaultEvmSelectors = [
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
] as const satisfies readonly NormalizedEvmSelector[]

const defaultEvmTopics = [
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
] as const satisfies readonly NormalizedEvmTopic[]

const defaultEvmErrors = [
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
] as const satisfies readonly NormalizedEvmError[]

const defaultNormalizedLocalInternal = {
	actors: [],
	xmtpConversations: [
		{
			id: 'e2e-probe-conversation',
			peerInboxId: 'e2e-probe-peer',
			topic: 'e2e-probe-topic',
			createdAtMs: 1_700_000_000_000,
			consentState: XmtpConversationConsentState.Allowed,
		},
	],
	blockheadWallets: [probeBlockheadWallet],
	blockheadWalletConnections: [probeBlockheadWalletConnection],
	blockheadWalletRequests: [probeBlockheadWalletRequest],
	blockheadEvmWalletRequests: [probeBlockheadEvmWalletRequest],
	blockheadWalletRequestCalls: [probeBlockheadWalletRequestCall],
	blockheadWalletRequestTimestamps: [probeBlockheadWalletRequestTimestamp],
	blockheadSessions: [
		probeBlockheadSession,
		probeBlockheadDirectSession,
	],
	blockheadSessionActions: [probeBlockheadSessionAction],
	blockheadWorkspaces: [probeBlockheadWorkspace],
	blockheadPanelTrees: [probeBlockheadPanelTree],
	blockheadPanels: [probeBlockheadPanel],
	blockheadFarcasterAccountConnections: [],
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
	blockheadSiweChallenges: [probeBlockheadSiweChallenge],
	blockheadTransferRequests: [probeBlockheadTransferRequest],
	blockheadSocialPostSessions: [probeBlockheadSocialPostSession],
	blockheadLocalMediaIngests: [probeBlockheadLocalMediaIngest],
	blockheadLocalMediaIngestTimestamps: [probeBlockheadLocalMediaIngestTimestamp],
	blockheadFilecoinPendingMessages: [probeBlockheadFilecoinPendingMessage],
	evmSelectors: defaultEvmSelectors,
	evmTopics: defaultEvmTopics,
	evmErrors: defaultEvmErrors,
} as const satisfies NormalizedLocalInternal


export const readNormalizedLocalInternal = (): NormalizedLocalInternal => (
	defaultNormalizedLocalInternal
)


export const findNormalizedBridgeTransactionRow = (
	catalog: NormalizedLocalInternal,
	entitySelector: EntitySelector<typeof schema, EntityType.BlockheadBridgeTransaction>
): NormalizedBridgeTransaction | undefined => (
	catalog.bridgeTransactions.find((row) => (
		row.accountAddress === entitySelector.$account.address
		&& Object.values(networkByCaip2).some((network) => (
			network.caip2.namespace === 'eip155'
			&& network.caip2.reference === String(row.chainId)
			&& [
				entitySelectorKey(
					schema,
					entityDefinitionByType[EntityType.Network],
					{ caip2: network.caip2 }
				),
				entitySelectorKey(
					schema,
					entityDefinitionByType[EntityType.Network],
					{ slug: network.slug }
				),
			].includes(entitySelectorKey(
				schema,
				entityDefinitionByType[EntityType.Network],
				entitySelector.$sourceTx.$network
			))
		))
		&& row.txHash === entitySelector.$sourceTx.txHash
		&& row.createdAt === entitySelector.createdAt
	))
)


export const coinInstanceIdForNormalizedStateChannelRow = (
	row: NormalizedStateChannel
): EntitySelector<typeof schema, EntityType.EvmCoinInstance> => (
	row.asset.kind === 'native' ?
		{
			$network: { caip2: {
				namespace: 'eip155',
				reference: String(row.chainId),
			} },
			type: CoinInstanceType.NativeCurrency,
		}
	:
		{
			$network: { caip2: {
				namespace: 'eip155',
				reference: String(row.chainId),
			} },
			type: CoinInstanceType.Erc20Token,
			$contract: {
				$network: { caip2: {
					namespace: 'eip155',
					reference: String(row.chainId),
				} },
				address: EvmAddress.assert(row.asset.tokenAddress),
			},
		}
)
