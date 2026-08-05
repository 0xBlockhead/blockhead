import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { SvelteMap } from 'svelte/reactivity'
import type { WalletAdapter, WalletCandidate, WalletConnection } from './types.ts'
import { buildWalletConnection } from '../walletConnectionState.ts'

type TonConnectAccount = {
	address: string
	chain: string
}

type TonConnectEvent =
	| {
		event: 'connect'
		payload: {
			items: ({
				name: 'ton_addr'
				address: string
				network: string
			} | {
				name: string
			})[]
		}
	}
	| {
		event: 'connect_error'
		payload: {
			message: string
		}
	}
	| {
		event: 'disconnect'
		payload: Record<string, never>
	}

type TonConnectBridge = {
	connect(
		protocolVersion: number,
		request: {
			manifestUrl: string
			items: [{ name: 'ton_addr' }]
		}
	): Promise<TonConnectEvent>
	restoreConnection(): Promise<TonConnectEvent>
	send(request: {
		method: 'disconnect'
		params: []
		id: string
	}): Promise<Record<string, never>>
	listen(listener: (event: TonConnectEvent) => void): (() => void) | void
}

type TonConnectInjectedWallet = {
	tonconnect: TonConnectBridge
}

declare global {
	interface Window {
		tonkeeper?: TonConnectInjectedWallet
		mytonwallet?: TonConnectInjectedWallet
		openmask?: TonConnectInjectedWallet
	}
}

const tonConnectWallets = [
	{
		id: 'ton-connect:tonkeeper',
		name: 'Tonkeeper',
		icon: 'https://tonkeeper.com/assets/tonconnect-icon.png',
		wallet: () => window.tonkeeper,
	},
	{
		id: 'ton-connect:mytonwallet',
		name: 'MyTonWallet',
		icon: '',
		wallet: () => window.mytonwallet,
	},
	{
		id: 'ton-connect:openmask',
		name: 'OpenMask',
		icon: '',
		wallet: () => window.openmask,
	},
] as const

const tonConnectCapabilities = [
	WalletCapability.Connect,
	WalletCapability.Reconnect,
	WalletCapability.Disconnect,
	WalletCapability.ListAccounts,
] satisfies WalletCapability[]

const normalizeTonRawAddress = (address: string) => {
	if (!/^-?[0-9]+:[0-9a-fA-F]{64}$/.test(address))
		throw new Error('TON wallet returned a non-canonical raw address')

	const separatorIndex = address.indexOf(':')
	const workchain = BigInt(address.slice(0, separatorIndex))
	if (
		workchain < -2_147_483_648n
		|| workchain > 2_147_483_647n
	)
		throw new Error('TON wallet returned a non-canonical raw address')

	return `${workchain}:${address.slice(separatorIndex + 1).toLowerCase()}`
}

const accountFromEvent = (event: TonConnectEvent): TonConnectAccount => {
	if (event.event === 'connect_error')
		throw new Error(event.payload.message)
	if (event.event !== 'connect')
		throw new Error('TON wallet disconnected before connecting')

	const item = event.payload.items.find((candidate) => candidate.name === 'ton_addr')
	if (item == null || !('address' in item) || !('network' in item))
		throw new Error('TON wallet did not return an address')
	if (!/^-?[1-9][0-9]*$/.test(item.network))
		throw new Error('TON wallet did not expose a canonical network ID')

	return {
		address: normalizeTonRawAddress(item.address),
		chain: item.network,
	}
}

const connectionFromAccount = (
	walletId: string,
	account: TonConnectAccount,
	connectedAt: number
): WalletConnection => (
	buildWalletConnection({
		walletId,
		status: BlockheadConnectionStatus.Connected,
		protocol: WalletProtocol.TonConnect,
		transportKind: WalletTransportKind.InjectedProvider,
		scopes: [
			{
				namespace: 'ton',
				reference: account.chain,
				methods: [
					'connect',
					'restoreConnection',
					'disconnect',
				],
				events: [
					'connect',
					'disconnect',
				],
			},
		],
		accounts: [
			{
				namespace: 'ton',
				reference: account.chain,
				accountAddress: account.address,
				capabilities: tonConnectCapabilities,
			},
		],
		activeAccount: {
			namespace: 'ton',
			reference: account.chain,
			accountAddress: account.address,
			capabilities: tonConnectCapabilities,
		},
		selected: true,
		connectedAt,
	})
)

const disconnectedConnection = (
	walletId: string,
	account?: TonConnectAccount
): WalletConnection => (
	buildWalletConnection({
		walletId,
		status: BlockheadConnectionStatus.Disconnected,
		protocol: WalletProtocol.TonConnect,
		transportKind: WalletTransportKind.InjectedProvider,
		scopes: account == null ?
			[]
		:
			[
				{
					namespace: 'ton',
					reference: account.chain,
					methods: [
						'connect',
						'restoreConnection',
						'disconnect',
					],
					events: [
						'connect',
						'disconnect',
					],
				},
			],
		accounts: [],
		disconnectedAt: Date.now(),
	})
)

const errorConnection = (
	walletId: string,
	message: string,
	connectedAt?: number
): WalletConnection => (
	buildWalletConnection({
		walletId,
		status: BlockheadConnectionStatus.Error,
		protocol: WalletProtocol.TonConnect,
		transportKind: WalletTransportKind.InjectedProvider,
		scopes: [],
		accounts: [],
		error: message,
	})
)

export const createTonConnectAdapter = (): WalletAdapter => {
	const bridgeByWalletId = new SvelteMap<string, TonConnectBridge>()
	const accountByWalletId = new SvelteMap<string, TonConnectAccount>()
	const connectedAtByWalletId = new SvelteMap<string, number>()
	const updateConnectionByWalletId = new SvelteMap<string, (connection: WalletConnection) => void>()
	const eventCleanupByWalletId = new SvelteMap<string, () => void>()
	const lifecycleVersionByWalletId = new SvelteMap<string, number>()

	const nextLifecycleVersion = (walletId: string) => {
		const lifecycleVersion = (lifecycleVersionByWalletId.get(walletId) ?? 0) + 1
		lifecycleVersionByWalletId.set(walletId, lifecycleVersion)

		return lifecycleVersion
	}

	return {
		id: 'ton-connect',
		start: (updateCandidates) => {
			if (typeof window === 'undefined') return () => {}

			let candidateIds: string | undefined
			const discover = () => {
				const wallets = tonConnectWallets.flatMap(({ id, name, icon, wallet }) => {
					const injectedWallet = wallet()
					if (injectedWallet == null) return []

					bridgeByWalletId.set(id, injectedWallet.tonconnect)
					return [{
						id,
						name,
						icon,
						protocol: WalletProtocol.TonConnect,
						discoveryKind: WalletDiscoveryKind.InjectedGlobal,
						transportKind: WalletTransportKind.InjectedProvider,
						capabilities: [
							WalletCapability.Discover,
							...tonConnectCapabilities,
						],
					} satisfies WalletCandidate]
				})
				const nextCandidateIds = wallets.map(({ id }) => id).join('|')
				if (nextCandidateIds === candidateIds) return

				candidateIds = nextCandidateIds
				updateCandidates(wallets)
			}

			discover()
			const discoveryInterval = globalThis.setInterval(discover, 100)

			return () => {
				globalThis.clearInterval(discoveryInterval)

				for (const walletId of bridgeByWalletId.keys())
					nextLifecycleVersion(walletId)

				for (const cleanup of eventCleanupByWalletId.values())
					cleanup()

				eventCleanupByWalletId.clear()
				updateConnectionByWalletId.clear()
				connectedAtByWalletId.clear()
				accountByWalletId.clear()
				bridgeByWalletId.clear()
			}
		},
		connect: async (walletId) => {
			const bridge = bridgeByWalletId.get(walletId)
			if (bridge == null) return undefined

			const lifecycleVersion = nextLifecycleVersion(walletId)
			let event: TonConnectEvent | undefined
			try {
				event = await bridge.restoreConnection()
			}
			catch {}
			if (
				bridgeByWalletId.get(walletId) !== bridge
				|| lifecycleVersionByWalletId.get(walletId) !== lifecycleVersion
			) return undefined

			if (event?.event !== 'connect') {
				event = await bridge.connect(2, {
					manifestUrl: `${window.location.origin}/tonconnect-manifest.json`,
					items: [{ name: 'ton_addr' }],
				})
			}
			if (
				bridgeByWalletId.get(walletId) !== bridge
				|| lifecycleVersionByWalletId.get(walletId) !== lifecycleVersion
			) return undefined

			const account = accountFromEvent(event)
			const connectedAt = Date.now()
			accountByWalletId.set(walletId, account)
			connectedAtByWalletId.set(walletId, connectedAt)
			return connectionFromAccount(walletId, account, connectedAt)
		},
		disconnect: async (walletId) => {
			const bridge = bridgeByWalletId.get(walletId)
			if (bridge == null) return

			const lifecycleVersion = nextLifecycleVersion(walletId)
			await bridge.send({
				method: 'disconnect',
				params: [],
				id: String(Date.now()),
			})
			if (lifecycleVersionByWalletId.get(walletId) !== lifecycleVersion)
				return

			accountByWalletId.delete(walletId)
			connectedAtByWalletId.delete(walletId)
		},
		subscribeConnection: (walletId, updateConnection) => {
			const bridge = bridgeByWalletId.get(walletId)
			if (bridge == null) return () => {}

			updateConnectionByWalletId.set(walletId, updateConnection)
			if (!eventCleanupByWalletId.has(walletId)) {
				const cleanup = bridge.listen((event) => {
					nextLifecycleVersion(walletId)
					if (event.event === 'connect') {
						let account: TonConnectAccount
						try {
							account = accountFromEvent(event)
						} catch (error) {
							updateConnectionByWalletId.get(walletId)?.(errorConnection(
								walletId,
								String(error),
								connectedAtByWalletId.get(walletId)
							))
							return
						}

						const connectedAt = Date.now()
						accountByWalletId.set(walletId, account)
						connectedAtByWalletId.set(walletId, connectedAt)
						updateConnectionByWalletId.get(walletId)?.(
							connectionFromAccount(walletId, account, connectedAt)
						)
					}

					if (event.event === 'disconnect') {
						const account = accountByWalletId.get(walletId)

						accountByWalletId.delete(walletId)
						connectedAtByWalletId.delete(walletId)
						updateConnectionByWalletId.get(walletId)?.(
							disconnectedConnection(
								walletId,
								account
							)
						)
					}

					if (event.event === 'connect_error')
						updateConnectionByWalletId.get(walletId)?.(errorConnection(
							walletId,
							event.payload.message,
							connectedAtByWalletId.get(walletId)
						))
				})
				eventCleanupByWalletId.set(walletId, cleanup ?? (() => {}))
			}

			if (!accountByWalletId.has(walletId)) {
				const restoreVersion = lifecycleVersionByWalletId.get(walletId) ?? 0
				void bridge.restoreConnection().then((event) => {
					if (
						(lifecycleVersionByWalletId.get(walletId) ?? 0) !== restoreVersion
						|| updateConnectionByWalletId.get(walletId) !== updateConnection
					) return

					if (event.event === 'connect') {
						const account = accountFromEvent(event)
						const connectedAt = Date.now()
						accountByWalletId.set(walletId, account)
						connectedAtByWalletId.set(walletId, connectedAt)
						updateConnection(connectionFromAccount(walletId, account, connectedAt))
					}
					else if (event.event === 'disconnect')
						updateConnection(disconnectedConnection(walletId))
					else
						updateConnection(errorConnection(walletId, event.payload.message))
				}).catch((error) => {
					if (
						(lifecycleVersionByWalletId.get(walletId) ?? 0) === restoreVersion
						&& updateConnectionByWalletId.get(walletId) === updateConnection
					)
						updateConnection(errorConnection(walletId, String(error)))
				})
			}

			return () => {
				if (updateConnectionByWalletId.get(walletId) === updateConnection) {
					updateConnectionByWalletId.delete(walletId)
					nextLifecycleVersion(walletId)
					eventCleanupByWalletId.get(walletId)?.()
					eventCleanupByWalletId.delete(walletId)
				}
			}
		},
	}
}
