import { Caip2Reference } from '$/constants/Network.ts'
import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { getWallet as getKeplrWallet } from '$/sources/Keplr/WalletApi/queries.ts'
import type { KeplrWallet } from '$/sources/Keplr/WalletApi/types.ts'
import { getWallet as getLeapWallet } from '$/sources/Leap/WalletApi/queries.ts'
import type { LeapWallet } from '$/sources/Leap/WalletApi/types.ts'
import { bech32 } from '@scure/base'
import { SvelteMap } from 'svelte/reactivity'
import type { WalletAdapter, WalletConnection } from './types.ts'
import { buildWalletConnection } from '../walletConnectionState.ts'

export type CosmosChain = {
	chainId: string
	accountPrefix: string
}

const defaultCosmosChains = [
	{
		chainId: Caip2Reference.CosmosHub,
		accountPrefix: 'cosmos',
	},
] as const satisfies readonly CosmosChain[]

type CosmosWallet = Pick<KeplrWallet | LeapWallet, 'enable' | 'getOfflineSignerAuto'> & {
	isConnected?: (chainId: string) => Promise<boolean>
	disconnect?: (chainId: string) => Promise<boolean>
}

declare global {
	interface Window {
		trustwallet?: {
			cosmos?: CosmosWallet
		}
	}
}

const cosmosConnectionCapabilities = (walletId: string) => [
	WalletCapability.Connect,
	WalletCapability.Reconnect,
	...(walletId === 'cosmos:leap' ? [WalletCapability.Disconnect] : []),
	WalletCapability.ListAccounts,
	WalletCapability.WatchAccounts,
	WalletCapability.SignTransaction,
] satisfies WalletCapability[]

const normalizeCosmosAccountAddress = (
	accountAddress: string,
	chain: CosmosChain
) => {
	try {
		const decodedAddress = bech32.decode(accountAddress)
		if (decodedAddress.prefix !== chain.accountPrefix)
			throw new Error('Unexpected Cosmos account address prefix')

		return bech32.encode(chain.accountPrefix, decodedAddress.words, false)
	} catch {
		throw new Error(`Cosmos wallet returned an invalid ${chain.chainId} account address`)
	}
}

const cosmosConnectionFromAccounts = (
	walletId: string,
	accountsByChain: readonly {
		chain: CosmosChain
		accountAddresses: string[]
	}[],
	connectedAt: number
): WalletConnection => {
	const accountCount = accountsByChain.reduce((
		count,
		{ accountAddresses }
	) => count + accountAddresses.length, 0)

	return buildWalletConnection({
		connectionKey: `${walletId}:${accountsByChain.map(({ chain }) => chain.chainId).join(',')}`,
		walletId,
		status: (
			accountCount ?
				BlockheadConnectionStatus.Connected
			:
				BlockheadConnectionStatus.Disconnected
		),
		protocol: WalletProtocol.CosmosOfflineSigner,
		transportKind: WalletTransportKind.InjectedSigner,
		scopes: accountsByChain.map(({ chain }) => ({
				namespace: 'cosmos',
				reference: chain.chainId,
				methods: [
					'enable',
					'getOfflineSignerAuto',
					'getAccounts',
					'signAmino',
					'signDirect',
					...(walletId === 'cosmos:leap' ? ['isConnected', 'disconnect'] : []),
				],
				events: [
					walletId === 'cosmos:leap' ?
						'leap_keystorechange'
					:
						'keplr_keystorechange',
				],
			})),
		accounts: accountsByChain.flatMap(({ chain, accountAddresses }) => (
			accountAddresses.map((accountAddress) => ({
				namespace: 'cosmos',
				reference: chain.chainId,
				accountAddress,
				capabilities: [
					...cosmosConnectionCapabilities(walletId),
				],
			}))
		)),
		selected: accountCount > 0,
		connectedAt,
		...(accountCount === 0 && { disconnectedAt: Date.now() }),
	})
}

const readCosmosConnection = async (
	walletId: string,
	wallet: CosmosWallet,
	chains: readonly CosmosChain[],
	connectedAt: number,
	enable: boolean
) => {
	if (enable)
		await wallet.enable(chains.map(({ chainId }) => chainId))

	return cosmosConnectionFromAccounts(
		walletId,
		await Promise.all(chains.map(async (chain) => ({
			chain,
			accountAddresses: [...new Set(
				(await (await wallet.getOfflineSignerAuto(chain.chainId)).getAccounts())
					.map((account) => normalizeCosmosAccountAddress(account.address, chain))
			)],
		}))),
		connectedAt
	)
}

export const createCosmosOfflineSignerAdapter = (
	chains: readonly CosmosChain[] = defaultCosmosChains
): WalletAdapter => {
	if (!chains.length)
		throw new Error('Cosmos offline signer adapter requires at least one declared chain')
	if (new Set(chains.map(({ chainId }) => chainId)).size !== chains.length)
		throw new Error('Cosmos offline signer adapter chain IDs must be unique')

	const walletByWalletId = new SvelteMap<string, CosmosWallet>()
	const connectedAtByWalletId = new SvelteMap<string, number>()

	return {
		id: 'cosmos-offline-signer',
		start: (updateCandidates) => {
			const keplrWallet = getKeplrWallet()
			const leapWallet = getLeapWallet()
			const trustWallet = (
				typeof window === 'undefined' ?
					undefined
				:
					window.trustwallet?.cosmos
			)
			const wallets = [
				...(keplrWallet == null ?
					[]
				:
					[{
						id: 'cosmos:keplr',
						name: 'Keplr',
						wallet: keplrWallet,
					}]),
				...(leapWallet == null ?
					[]
				:
					[{
						id: 'cosmos:leap',
						name: 'Leap',
						wallet: leapWallet,
					}]),
				...(trustWallet == null ?
					[]
				:
					[{
						id: 'cosmos:trustwallet',
						name: 'Trust Wallet',
						wallet: trustWallet,
					}]),
			]

			for (const { id, wallet } of wallets)
				walletByWalletId.set(id, wallet)

			updateCandidates(wallets.map(({ id, name }) => ({
				id,
				name,
				icon: '',
				protocol: WalletProtocol.CosmosOfflineSigner,
				discoveryKind: WalletDiscoveryKind.InjectedGlobal,
				transportKind: WalletTransportKind.InjectedSigner,
				capabilities: [
					WalletCapability.Discover,
					...cosmosConnectionCapabilities(id),
				],
			})))

			return () => {
				connectedAtByWalletId.clear()
				walletByWalletId.clear()
			}
		},
		connect: async (walletId) => {
			const wallet = walletByWalletId.get(walletId)
			if (wallet == null) return undefined

			const connectedAt = Date.now()
			const connection = await readCosmosConnection(
				walletId,
				wallet,
				chains,
				connectedAt,
				true
			)
			if (!connection.accounts.length)
				throw new Error('Cosmos wallet did not return any accounts')

			connectedAtByWalletId.set(walletId, connectedAt)

			return connection
		},
		disconnect: async (walletId) => {
			const wallet = walletByWalletId.get(walletId)
			if (walletId === 'cosmos:leap' && wallet?.disconnect != null)
				await Promise.all(chains.map(({ chainId }) => wallet.disconnect?.(chainId)))

			connectedAtByWalletId.delete(walletId)
		},
		subscribeConnection: (walletId, updateConnection) => {
			const wallet = walletByWalletId.get(walletId)
			if (wallet == null || typeof window === 'undefined')
				return () => {}

			const restoring = !connectedAtByWalletId.has(walletId)
			const connectedAt = connectedAtByWalletId.get(walletId) ?? Date.now()
			connectedAtByWalletId.set(walletId, connectedAt)
			let subscribed = true
			let readVersion = 0

			const keystoreChangeEvent = (
				walletId === 'cosmos:leap' ?
					'leap_keystorechange'
				:
					'keplr_keystorechange'
			)
			const onKeystoreChange = () => {
				const currentReadVersion = ++readVersion
				void readCosmosConnection(
					walletId,
					wallet,
					chains,
					connectedAt,
					false
				).then((connection) => {
					if (subscribed && readVersion === currentReadVersion)
						updateConnection(connection)
				}).catch((error) => {
					if (subscribed && readVersion === currentReadVersion)
						updateConnection(buildWalletConnection({
							...cosmosConnectionFromAccounts(
							walletId,
							chains.map((chain) => ({
								chain,
								accountAddresses: [],
							})),
							connectedAt
						),
							status: BlockheadConnectionStatus.Error,
							error: String(error),
						}))
				})
			}

			window.addEventListener(keystoreChangeEvent, onKeystoreChange)
			if (restoring && walletId === 'cosmos:leap' && wallet.isConnected != null) {
				const restoreVersion = readVersion
				void Promise.all(chains.map(({ chainId }) => wallet.isConnected?.(chainId))).then((connectedByChain) => {
					if (!subscribed || readVersion !== restoreVersion) return

					if (connectedByChain.every(Boolean))
						onKeystoreChange()
					else
						updateConnection(cosmosConnectionFromAccounts(
							walletId,
							chains.map((chain) => ({
								chain,
								accountAddresses: [],
							})),
							connectedAt
						))
				}).catch((error) => {
					if (subscribed && readVersion === restoreVersion)
						updateConnection(buildWalletConnection({
						...cosmosConnectionFromAccounts(
							walletId,
							chains.map((chain) => ({
								chain,
								accountAddresses: [],
							})),
							connectedAt
						),
							status: BlockheadConnectionStatus.Error,
							error: String(error),
						}))
				})
			}
			else if (restoring)
				onKeystoreChange()

			return () => {
				subscribed = false
				readVersion++
				window.removeEventListener(keystoreChangeEvent, onKeystoreChange)
			}
		},
	}
}
