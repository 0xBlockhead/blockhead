import type {
	WalletDiscoveryKind,
} from '$/constants/Wallet.ts'
import {
	WalletCapability,
	WalletProtocol,
	WalletTransportKind,
} from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'


export type WalletCandidate = {
	id: string
	name: string
	icon: string
	connectionUri?: string
	protocol: WalletProtocol
	discoveryKind: WalletDiscoveryKind
	transportKind: WalletTransportKind
	rdns?: string
	capabilities: WalletCapability[]
}

/** EIP-712 typed data + chain switch — only meaningful on eip155 accounts. */
export type WalletEvmOnlyCapability =
	| WalletCapability.SignTypedData
	| WalletCapability.SwitchScope

/** Account/session capabilities that are valid outside eip155. */
export type WalletNonEvmAccountCapability = Exclude<
	WalletCapability,
	WalletEvmOnlyCapability
>

export type WalletAccount = {
	namespace: string
	reference: string
	accountAddress: string
	capabilities: WalletCapability[]
}

export const walletEvmOnlyCapabilities = [
	WalletCapability.SignTypedData,
	WalletCapability.SwitchScope,
] as const satisfies readonly WalletEvmOnlyCapability[]

export const isWalletEvmOnlyCapability = (
	capability: WalletCapability
): capability is WalletEvmOnlyCapability => (
	capability === WalletCapability.SignTypedData
	|| capability === WalletCapability.SwitchScope
)

/**
 * Strip EVM-only capabilities from non-eip155 accounts.
 * eip155 accounts keep SignTypedData / SwitchScope when advertised.
 */
export const coerceWalletAccount = (
	account: WalletAccount
): WalletAccount => (
	account.namespace === 'eip155' ?
		account
	:
		{
			...account,
			capabilities: account.capabilities.filter((capability) => (
				!isWalletEvmOnlyCapability(capability)
			)),
		}
)

export type WalletScope = {
	namespace: string
	reference: string
	methods: readonly string[]
	events: readonly string[]
}

/** Non-empty account list — required when Connected + selected. */
export type WalletAccountsNonEmpty = readonly [
	WalletAccount,
	...WalletAccount[],
]

type WalletConnectionIdentity = {
	connectionKey?: string
	walletId: string
	transportKind: WalletTransportKind
	scopes: WalletScope[]
}

/**
 * While Connecting, WalletConnect may not have a relay topic yet.
 * Non-WC protocols never carry `sessionTopic`.
 */
export type WalletConnectingSession =
	| {
		protocol: WalletProtocol.WalletConnectV2
		sessionTopic?: string
		sessionId?: string
	}
	| {
		protocol: Exclude<WalletProtocol, WalletProtocol.WalletConnectV2>
		sessionId?: string
		sessionTopic?: undefined
	}

/**
 * After settle (Connected / Disconnected / Error):
 * WalletConnect requires `sessionTopic`; other protocols forbid it.
 */
export type WalletSettledSession =
	| {
		protocol: WalletProtocol.WalletConnectV2
		sessionTopic: string
		sessionId?: string
	}
	| {
		protocol: Exclude<WalletProtocol, WalletProtocol.WalletConnectV2>
		sessionId?: string
		sessionTopic?: undefined
	}

/**
 * Status machine — illegal combos are unrepresentable:
 * - `selected` exists only on Connected
 * - Connected + selected:true requires nonempty accounts + activeAccount
 * - Error always has `error`; other statuses forbid it
 * - `sessionTopic` only on WalletConnect (optional while Connecting, required when settled)
 * - Disconnected / Error never carry `activeAccount`
 */
export type WalletConnection =
	| (
		WalletConnectionIdentity
		& WalletConnectingSession
		& {
			status: BlockheadConnectionStatus.Connecting
			accounts: readonly WalletAccount[]
			activeAccount?: WalletAccount
		}
	)
	| (
		WalletConnectionIdentity
		& WalletSettledSession
		& {
			status: BlockheadConnectionStatus.Connected
			selected: true
			accounts: WalletAccountsNonEmpty
			activeAccount: WalletAccount
			connectedAt?: number
		}
	)
	| (
		WalletConnectionIdentity
		& WalletSettledSession
		& {
			status: BlockheadConnectionStatus.Connected
			selected: false
			accounts: readonly WalletAccount[]
			activeAccount?: WalletAccount
			connectedAt?: number
		}
	)
	| (
		WalletConnectionIdentity
		& WalletSettledSession
		& {
			status: BlockheadConnectionStatus.Disconnected
			accounts: readonly WalletAccount[]
			activeAccount?: undefined
			connectedAt?: number
			disconnectedAt?: number
		}
	)
	| (
		WalletConnectionIdentity
		& WalletSettledSession
		& {
			status: BlockheadConnectionStatus.Error
			error: string
			accounts: readonly WalletAccount[]
			activeAccount?: undefined
			disconnectedAt?: number
		}
	)

/** Flat construction/persistence bag — may be illegal; coerce via builders. */
export type WalletConnectionBase = {
	connectionKey?: string
	walletId: string
	protocol: WalletProtocol
	transportKind: WalletTransportKind
	scopes: WalletScope[]
	accounts: readonly WalletAccount[]
	activeAccount?: WalletAccount
	sessionId?: string
	sessionTopic?: string
}

export type WalletTypedData = {
	types: Record<string, {
		name: string
		type: string
	}[]>
	primaryType: string
	domain: Record<string, string | number | boolean>
	message: Record<string, string | number | boolean | Record<string, string | number | boolean>>
}

export type WalletStarknetTypedData = {
	types: Record<string, {
		name: string
		type: string
		contains?: string
	}[]>
	primaryType: string
	domain: {
		name: string
		version: string
		chainId: string
		revision?: string
	}
	message: Record<string, JsonValue>
}

export type WalletTonInternalMessage = {
	address: string
	amount: string
	payload?: string
	stateInit?: string
	extra_currency?: Record<string, string>
}

export type WalletTonInternalMessages = {
	network: string
	from: string
	valid_until?: number
	messages: readonly [
		WalletTonInternalMessage,
		...WalletTonInternalMessage[],
	]
}

const walletAdapterPreDispatchFailures = new WeakSet<object>()

/** An adapter-owned failure proving that its provider request was not invoked. */
export class WalletAdapterPreDispatchFailure extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'WalletAdapterPreDispatchFailure'
		walletAdapterPreDispatchFailures.add(this)
		Object.freeze(this)
	}
}

export const isWalletAdapterPreDispatchFailure = (
	error: object
): error is WalletAdapterPreDispatchFailure => (
	walletAdapterPreDispatchFailures.has(error)
)

const walletAdapterProviderRejections = new WeakSet<object>()

/** An adapter-owned failure proving that its provider explicitly rejected the request. */
export class WalletAdapterProviderRejection extends Error {
	constructor(message: string, readonly code?: number) {
		super(message)
		this.name = 'WalletAdapterProviderRejection'
		walletAdapterProviderRejections.add(this)
		Object.freeze(this)
	}
}

export const isWalletAdapterProviderRejection = (
	error: object
): error is WalletAdapterProviderRejection => (
	walletAdapterProviderRejections.has(error)
)

const walletAdapterResponseAuditFailures = new WeakSet<object>()

/** An adapter-owned failure proving that a provider response violated its contract. */
export class WalletAdapterResponseAuditFailure extends Error {
	constructor(
		message: string,
		readonly returnedValue: JsonValue
	) {
		super(message)
		this.name = 'WalletAdapterResponseAuditFailure'
		walletAdapterResponseAuditFailures.add(this)
		Object.freeze(this)
	}
}

export const isWalletAdapterResponseAuditFailure = (
	error: object
): error is WalletAdapterResponseAuditFailure => (
	walletAdapterResponseAuditFailures.has(error)
)

export type WalletAdapter = {
	id: string
	start(updateCandidates: (candidates: WalletCandidate[]) => void): () => void
	connect(walletId: string): Promise<WalletConnection | undefined>
	signMessage?(
		walletId: string,
		accountAddress: string,
		message: string,
		connectionKey?: string
	): Promise<string>
	signTypedData?(
		walletId: string,
		accountAddress: string,
		typedData: WalletTypedData,
		connectionKey?: string
	): Promise<string>
	signStarknetTypedData?(
		walletId: string,
		accountAddress: string,
		reference: string,
		typedData: WalletStarknetTypedData,
		apiVersion?: string,
		connectionKey?: string
	): Promise<string[]>
	signTonInternalMessages?(
		walletId: string,
		accountAddress: string,
		request: WalletTonInternalMessages,
		connectionKey?: string
	): Promise<string>
	switchScope?(
		walletId: string,
		scope: {
			namespace: string
			reference: string
		},
		connectionKey?: string
	): Promise<WalletConnection | undefined>
	disconnect(walletId: string, connectionKey?: string): void | Promise<void>
	subscribeConnection(
		walletId: string,
		updateConnection: (connection: WalletConnection) => void,
		connectionKey?: string
	): () => void
}

export const optionalDiscoveredCandidate = (
	available: boolean,
	candidate: Pick<WalletCandidate, 'id' | 'name' | 'icon' | 'rdns'>
) => (
	available ?
		[candidate]
	:
		[]
)

export const isWalletAccountsNonEmpty = (
	accounts: readonly WalletAccount[]
): accounts is WalletAccountsNonEmpty => (
	accounts.length > 0
)
