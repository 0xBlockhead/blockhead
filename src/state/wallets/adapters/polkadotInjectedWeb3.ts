import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { Caip2Reference } from '$/constants/Network.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'
import { SvelteMap } from 'svelte/reactivity'
import type { WalletAdapter } from './types.ts'

type PolkadotInjectedExtension = {
	accounts: {
		get(): Promise<{ address: string, name?: string }[]>
	}
}

type PolkadotInjectedWeb3Wallet = {
	enable(appName: string): Promise<PolkadotInjectedExtension>
}

declare global {
	interface Window {
		injectedWeb3?: Record<string, PolkadotInjectedWeb3Wallet>
	}
}

export const createPolkadotInjectedWeb3Adapter = (): WalletAdapter => {
	const walletByWalletId = new SvelteMap<string, PolkadotInjectedWeb3Wallet>()

	return {
		id: 'polkadot-injected-web3',
		start: (updateCandidates) => {
			const candidates = typeof window === 'undefined' ?
				[]
			:
				Object
					.entries(window.injectedWeb3 ?? {})
					.map(([walletKey, wallet]) => {
						walletByWalletId.set(`polkadot:${walletKey}`, wallet)

						return {
							id: `polkadot:${walletKey}`,
							name: walletKey,
							icon: '',
							protocol: WalletProtocol.PolkadotInjectedWeb3,
							discoveryKind: WalletDiscoveryKind.InjectedGlobal,
							transportKind: WalletTransportKind.InjectedSigner,
							capabilities: [
								WalletCapability.Connect,
								WalletCapability.ListAccounts,
								WalletCapability.WatchAccounts,
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

			return {
				walletId,
				status: BlockheadConnectionStatus.Connected,
				protocol: WalletProtocol.PolkadotInjectedWeb3,
				transportKind: WalletTransportKind.InjectedSigner,
				scopes: [
					{
						namespace: 'polkadot',
						reference: Caip2Reference.Polkadot,
						methods: ['enable', 'accounts.get', 'signer.signPayload', 'signer.signRaw'],
						events: ['accounts.subscribe'],
					},
				],
				accounts: (await (await wallet.enable('Blockhead')).accounts.get()).map((account) => ({
					namespace: 'polkadot',
					reference: Caip2Reference.Polkadot,
					accountAddress: account.address,
					capabilities: [
						WalletCapability.Connect,
						WalletCapability.ListAccounts,
						WalletCapability.WatchAccounts,
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
