import type { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
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

export type WalletConnection =
	| (
		WalletConnectionBase & {
			status: BlockheadConnectionStatus.Connecting
		}
	)
	| (
		WalletConnectionBase & {
			status: BlockheadConnectionStatus.Connected
			selected: true
			connectedAt?: number
		}
	)
	| (
		WalletConnectionBase & {
			status: BlockheadConnectionStatus.Connected
			selected: false
			connectedAt?: number
		}
	)
	| (
		WalletConnectionBase & {
			status: BlockheadConnectionStatus.Disconnected
			connectedAt?: number
			disconnectedAt?: number
		}
	)
	| (
		WalletConnectionBase & {
			status: BlockheadConnectionStatus.Error
			error: string
			disconnectedAt?: number
		}
	)

export type WalletAdapter = {
	id: string
	start(updateCandidates: (candidates: WalletCandidate[]) => void): () => void
	connect(walletId: string): Promise<WalletConnection | undefined>
	signMessage?(
		walletId: string,
		accountAddress: string,
		message: string
	): Promise<string>
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
