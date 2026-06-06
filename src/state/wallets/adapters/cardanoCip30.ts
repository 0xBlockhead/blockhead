import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'
import { SvelteMap } from 'svelte/reactivity'
import type { WalletAdapter } from './types.ts'

type CardanoCip30WalletApi = {
	getUsedAddresses(): Promise<string[]>
	getUnusedAddresses?(): Promise<string[]>
	getNetworkId?(): Promise<number>
}

type CardanoCip30Wallet = {
	name?: string
	icon?: string
	enable(): Promise<CardanoCip30WalletApi>
}

declare global {
	interface Window {
		cardano?: Record<string, CardanoCip30Wallet>
	}
}

export const createCardanoCip30Adapter = (): WalletAdapter => {
	const walletByWalletId = new SvelteMap<string, CardanoCip30Wallet>()

	return {
		id: 'cardano-cip30',
		start: (updateCandidates) => {
			const candidates = typeof window === 'undefined' ?
				[]
			:
				Object
					.entries(window.cardano ?? {})
					.map(([walletKey, wallet]) => {
						walletByWalletId.set(`cip30:${walletKey}`, wallet)

						return {
							id: `cip30:${walletKey}`,
							name: wallet.name ?? walletKey,
							icon: wallet.icon ?? '',
							protocol: WalletProtocol.CardanoCip30,
							discoveryKind: WalletDiscoveryKind.InjectedGlobal,
							transportKind: WalletTransportKind.InjectedSigner,
							capabilities: [
								WalletCapability.Connect,
								WalletCapability.Reconnect,
								WalletCapability.ListAccounts,
								WalletCapability.SignMessage,
								WalletCapability.SignTransaction,
							],
						}
					})

			updateCandidates(candidates)

			return () => {
				walletByWalletId.clear()
			}
		},
		connect: async (walletId) => {
			const wallet = walletByWalletId.get(walletId)
			if (wallet == null) return undefined

			const api = await wallet.enable()
			const networkId = await api.getNetworkId?.()
			const addresses = [
				...await api.getUsedAddresses(),
				...await api.getUnusedAddresses?.() ?? [],
			]

			return {
				walletId,
				status: BlockheadConnectionStatus.Connected,
				protocol: WalletProtocol.CardanoCip30,
				transportKind: WalletTransportKind.InjectedSigner,
				scopes: [
					{
						namespace: 'cardano',
						reference: String(networkId ?? 1),
						methods: ['enable', 'getUsedAddresses', 'getUnusedAddresses', 'signData', 'signTx', 'submitTx'],
						events: ['accountChange', 'networkChange'],
					},
				],
				accounts: addresses.map((accountAddress) => ({
					namespace: 'cardano',
					reference: String(networkId ?? 1),
					accountAddress,
					capabilities: [
						WalletCapability.Connect,
						WalletCapability.Reconnect,
						WalletCapability.ListAccounts,
						WalletCapability.SignMessage,
						WalletCapability.SignTransaction,
					],
				})),
				selected: true,
				connectedAt: Date.now(),
			}
		},
		disconnect: (walletId) => {
			walletByWalletId.delete(walletId)
		},
		subscribeConnection: () => () => {},
	}
}
