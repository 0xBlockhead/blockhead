import { WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'
import type { WalletAdapter, WalletCandidate } from './types.ts'

export const createDiscoveryOnlyAdapter = ({
	id,
	candidate,
	getCandidates,
}: {
	id: string
	candidate: Omit<WalletCandidate, 'id' | 'name' | 'icon'>
	getCandidates: () => Pick<WalletCandidate, 'id' | 'name' | 'icon' | 'rdns'>[]
}): WalletAdapter => ({
	id,
	start: (updateCandidates) => {
		updateCandidates(getCandidates().map((discoveredCandidate) => ({
			...candidate,
			...discoveredCandidate,
		})))

		return () => {}
	},
	connect: async (walletId) => ({
		walletId,
		status: BlockheadConnectionStatus.Disconnected,
		protocol: candidate.protocol,
		transportKind: candidate.transportKind,
		scopes: [],
		accounts: [],
		selected: false,
		connectedAt: Date.now(),
		error: 'This wallet protocol is discovered but connection is not implemented yet.',
	}),
	disconnect: () => {},
	subscribeConnection: () => () => {},
})
