import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'
import { getWallet as getKeplrWallet } from '$/sources/Keplr/WalletApi/queries.ts'
import type { KeplrWallet } from '$/sources/Keplr/WalletApi/types.ts'
import { getWallet as getLeapWallet } from '$/sources/Leap/WalletApi/queries.ts'
import type { LeapWallet } from '$/sources/Leap/WalletApi/types.ts'
import { bech32 } from '@scure/base'
import { SvelteMap } from 'svelte/reactivity'
import type { WalletAdapter, WalletConnection } from './types.ts'

const COSMOS_HUB_CHAIN_ID = 'cosmoshub-4'
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

const normalizeCosmosAccountAddress = (accountAddress: string) => {
	try {
		const decodedAddress = bech32.decode(accountAddress)
		if (decodedAddress.prefix !== 'cosmos')
			throw new Error('Unexpected Cosmos account address prefix')

		return bech32.encode('cosmos', decodedAddress.words, false)
	} catch {
		throw new Error('Cosmos wallet returned an invalid cosmoshub-4 account address')
	}
}

const cosmosConnectionFromAccounts = (
	walletId: string,
	accountAddresses: string[],
	connectedAt: number
): WalletConnection => ({
	connectionKey: `${walletId}:${COSMOS_HUB_CHAIN_ID}`,
	walletId,
	status: (
		accountAddresses.length ?
			BlockheadConnectionStatus.Connected
		:
			BlockheadConnectionStatus.Disconnected
	),
	protocol: WalletProtocol.CosmosOfflineSigner,
	transportKind: WalletTransportKind.InjectedSigner,
	scopes: [
		{
			namespace: 'cosmos',
			reference: COSMOS_HUB_CHAIN_ID,
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
		},
	],
	accounts: accountAddresses.map((accountAddress) => ({
		namespace: 'cosmos',
		reference: COSMOS_HUB_CHAIN_ID,
		accountAddress,
		capabilities: [
			...cosmosConnectionCapabilities(walletId),
		],
	})),
	selected: accountAddresses.length > 0,
	connectedAt,
	...(accountAddresses.length === 0 && { disconnectedAt: Date.now() }),
})

const readCosmosConnection = async (
	walletId: string,
	wallet: CosmosWallet,
	connectedAt: number,
	enable: boolean
) => {
	if (enable)
		await wallet.enable(COSMOS_HUB_CHAIN_ID)

	return cosmosConnectionFromAccounts(
		walletId,
		[...new Set(
			(await (await wallet.getOfflineSignerAuto(COSMOS_HUB_CHAIN_ID)).getAccounts())
				.map((account) => normalizeCosmosAccountAddress(account.address))
		)],
		connectedAt
	)
}

export const createCosmosOfflineSignerAdapter = (): WalletAdapter => {
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
				await wallet.disconnect(COSMOS_HUB_CHAIN_ID)

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
					connectedAt,
					false
				).then((connection) => {
					if (subscribed && readVersion === currentReadVersion)
						updateConnection(connection)
				}).catch((error) => {
					if (subscribed && readVersion === currentReadVersion)
						updateConnection({
						...cosmosConnectionFromAccounts(
							walletId,
							[],
							connectedAt
						),
						status: BlockheadConnectionStatus.Error,
						error: String(error),
					})
				})
			}

			window.addEventListener(keystoreChangeEvent, onKeystoreChange)
			if (restoring && walletId === 'cosmos:leap' && wallet.isConnected != null) {
				const restoreVersion = readVersion
				void wallet.isConnected(COSMOS_HUB_CHAIN_ID).then((connected) => {
					if (!subscribed || readVersion !== restoreVersion) return

					if (connected)
						onKeystoreChange()
					else
						updateConnection(cosmosConnectionFromAccounts(walletId, [], connectedAt))
				}).catch((error) => {
					if (subscribed && readVersion === restoreVersion)
						updateConnection({
						...cosmosConnectionFromAccounts(walletId, [], connectedAt),
						status: BlockheadConnectionStatus.Error,
						error: String(error),
					})
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
