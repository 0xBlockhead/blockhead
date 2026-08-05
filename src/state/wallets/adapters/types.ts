import type {
	WalletCapability,
	WalletDiscoveryKind,
} from '$/constants/Wallet.ts'
import {
	WalletProtocol,
	WalletTransportKind,
} from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'


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

export type WalletAccount = {
	namespace: string
	reference: string
	accountAddress: string
	capabilities: WalletCapability[]
}

export type WalletScope = {
	namespace: string
	reference: string
	methods: string[]
	events: string[]
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
			accounts: WalletAccount[]
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
			accounts: WalletAccount[]
			activeAccount?: WalletAccount
			connectedAt?: number
		}
	)
	| (
		WalletConnectionIdentity
		& WalletSettledSession
		& {
			status: BlockheadConnectionStatus.Disconnected
			accounts: WalletAccount[]
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
			accounts: WalletAccount[]
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
	accounts: WalletAccount[]
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
