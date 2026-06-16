import type { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import type { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'

export type WalletCandidate = {
	id: string
	name: string
	icon: string
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

export type WalletConnection = {
	walletId: string
	status: BlockheadConnectionStatus
	protocol: WalletProtocol
	transportKind: WalletTransportKind
	scopes: WalletScope[]
	accounts: WalletAccount[]
	selected: boolean
	connectedAt: number
	error?: string
}

export type WalletAdapter = {
	id: string
	start(updateCandidates: (candidates: WalletCandidate[]) => void): () => void
	connect(walletId: string): Promise<WalletConnection | undefined>
	disconnect(walletId: string): void
	subscribeConnection(
		walletId: string,
		updateConnection: (connection: WalletConnection) => void
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
