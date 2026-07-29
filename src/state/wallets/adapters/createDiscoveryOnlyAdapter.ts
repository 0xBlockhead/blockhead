import { WalletCapability, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
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
			capabilities: [WalletCapability.Discover],
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
		error: 'This wallet protocol is discovered but connection is not implemented yet.',
	}),
	disconnect: () => {},
	subscribeConnection: () => () => {},
})
