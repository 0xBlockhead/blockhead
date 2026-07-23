import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'
import { isJsonObject, type JsonObject, type JsonValue } from '$/typescript/JsonValue.ts'
import { base58 } from '@scure/base'
import * as Hash from 'ox/Hash'
import { SvelteMap } from 'svelte/reactivity'
import type { WalletAdapter, WalletCandidate, WalletConnection } from './types.ts'

type TronRequestArguments = {
	method: string
	params?: readonly JsonValue[] | JsonObject
}

type TronProvider = {
	request(arguments_: TronRequestArguments): Promise<JsonValue>
	on(event: string, listener: (payload: JsonValue) => void): void
	removeListener(event: string, listener: (payload: JsonValue) => void): void
}

type TronProviderInfo = Readonly<{
	uuid: string
	name: string
	icon: string
	rdns: string
}>

type TronProviderDetail = {
	info: TronProviderInfo
	provider: TronProvider
}

type TronConnectionState = {
	accounts: string[]
	reference: string
	connectedAt: number
}

declare global {
	interface Window {
		tron?: TronProvider
		tronLink?: TronProvider
	}

	interface WindowEventMap {
		'TIP6963:announceProvider': CustomEvent<TronProviderDetail>
	}
}

const TRON_ANNOUNCE_PROVIDER_EVENT = 'TIP6963:announceProvider'
const TRON_REQUEST_PROVIDER_EVENT = 'TIP6963:requestProvider'
const TRON_LEGACY_WALLET_ID = 'tron:injected'

const tronConnectionCapabilities = [
	WalletCapability.Connect,
	WalletCapability.Reconnect,
	WalletCapability.ListAccounts,
	WalletCapability.WatchAccounts,
	WalletCapability.WatchScopes,
] satisfies WalletCapability[]

const tronReference = (value: JsonValue) => {
	// oxlint-disable-next-line no-runtime-shape-guards/guards -- TIP-1193 provider output is an untrusted JSON boundary.
	if (typeof value !== 'string' || !/^0x[1-9a-f][0-9a-f]*$/.test(value))
		throw new Error('TRON wallet did not expose a canonical chain ID')

	return value
}

const normalizeTronAccount = (account: string) => {
	try {
		const decodedAccount = base58.decode(account)
		if (
			decodedAccount.length !== 25
			|| decodedAccount[0] !== 0x41
		)
			throw new Error('Invalid TRON account payload')

		const accountPayload = decodedAccount.slice(0, 21)
		const checksum = Hash.sha256(
			Hash.sha256(accountPayload, { as: 'Bytes' }),
			{ as: 'Bytes' }
		).slice(0, 4)
		if (decodedAccount.slice(21).some((byte, index) => byte !== checksum[index]))
			throw new Error('Invalid TRON account checksum')

		return base58.encode(decodedAccount)
	} catch {
		throw new Error('TRON wallet returned a non-canonical account address')
	}
}

const tronAccounts = (value: JsonValue) => {
	// oxlint-disable-next-line no-runtime-shape-guards/guards -- TIP-1193 provider output is an untrusted JSON boundary.
	if (!Array.isArray(value))
		throw new Error('TRON wallet did not return an accounts array')

	const accounts = value.filter((account): account is string => (
		// oxlint-disable-next-line no-runtime-shape-guards/guards -- TIP-1193 provider output is an untrusted JSON boundary.
		typeof account === 'string'
	))
	if (accounts.length !== value.length)
		throw new Error('TRON wallet returned a non-canonical account address')

	return [...new Set(accounts.map(normalizeTronAccount))]
}

const tronAccountsFromEvent = (payload: JsonValue) => {
	if (!isJsonObject(payload))
		return tronAccounts(payload)

	const message = isJsonObject(payload.message) ? payload.message : undefined
	const data = isJsonObject(message?.data) ? message.data : undefined
	if (message?.action !== 'accountsChanged' || data == null)
		throw new Error('TRON wallet returned an invalid accountsChanged event')

	return tronAccounts([data.address])
}

const tronReferenceFromEvent = (payload: JsonValue) => {
	if (!isJsonObject(payload))
		return tronReference(payload)

	if (payload.chainId != null)
		return tronReference(payload.chainId)

	const message = isJsonObject(payload.message) ? payload.message : undefined
	const data = isJsonObject(message?.data) ? message.data : undefined
	if (message?.action !== 'chainChanged' || data == null)
		throw new Error('TRON wallet returned an invalid chainChanged event')

	return tronReference(data.chainId)
}

const tronConnection = (
	walletId: string,
	state: TronConnectionState,
	status: BlockheadConnectionStatus,
	error?: string
): WalletConnection => {
	const activeAccountAddress = state.accounts.at(0)

	return {
		walletId,
		status,
		protocol: WalletProtocol.TronTip1193,
		transportKind: WalletTransportKind.InjectedProvider,
		scopes: [
			{
				namespace: 'tron',
				reference: state.reference,
				methods: [
					'eth_accounts',
					'eth_requestAccounts',
					'eth_chainId',
				],
				events: [
					'accountsChanged',
					'chainChanged',
					'connect',
					'disconnect',
				],
			},
		],
		accounts: state.accounts.map((accountAddress) => ({
			namespace: 'tron',
			reference: state.reference,
			accountAddress,
			capabilities: tronConnectionCapabilities,
		})),
		activeAccount: activeAccountAddress == null ?
			undefined
		:
			{
				namespace: 'tron',
				reference: state.reference,
				accountAddress: activeAccountAddress,
				capabilities: tronConnectionCapabilities,
			},
		selected: status === BlockheadConnectionStatus.Connected && state.accounts.length > 0,
		connectedAt: state.connectedAt,
		...(status === BlockheadConnectionStatus.Disconnected && { disconnectedAt: Date.now() }),
		...(error != null && { error }),
	}
}

const tronEventErrorConnection = (
	walletId: string,
	state: TronConnectionState | undefined,
	// oxlint-disable-next-line typescript/no-restricted-types -- JavaScript event normalization failures are caught as untyped rejection values and serialized at this boundary.
	error: unknown
): WalletConnection => (
	state == null ?
		{
			walletId,
			status: BlockheadConnectionStatus.Error,
			protocol: WalletProtocol.TronTip1193,
			transportKind: WalletTransportKind.InjectedProvider,
			scopes: [],
			accounts: [],
			selected: false,
			error: String(error),
		}
	:
		tronConnection(
			walletId,
			{
				...state,
				accounts: [],
			},
			BlockheadConnectionStatus.Error,
			String(error)
		)
)

const readTronState = async (
	provider: TronProvider,
	accountMethod: 'eth_accounts' | 'eth_requestAccounts',
	connectedAt: number
): Promise<TronConnectionState> => ({
	accounts: tronAccounts(await provider.request({
		method: accountMethod,
		params: [],
	})),
	reference: tronReference(await provider.request({
		method: 'eth_chainId',
		params: [],
	})),
	connectedAt,
})

export const createTronInjectedAdapter = (): WalletAdapter => {
	const providerByWalletId = new SvelteMap<string, TronProvider>()
	const stateByWalletId = new SvelteMap<string, TronConnectionState>()
	const cleanupByWalletId = new SvelteMap<string, () => void>()
	const updateConnectionByWalletId = new SvelteMap<string, (connection: WalletConnection) => void>()
	const updateVersionByWalletId = new SvelteMap<string, number>()
	const announcedProviderByUuid = new Map<string, TronProviderDetail>()

	const candidate = (
		walletId: string,
		name: string,
		icon: string,
		rdns?: string,
		discoveryKind = WalletDiscoveryKind.InjectedEvent
	): WalletCandidate => ({
		id: walletId,
		name,
		icon,
		protocol: WalletProtocol.TronTip1193,
		discoveryKind,
		transportKind: WalletTransportKind.InjectedProvider,
		...(rdns != null && { rdns }),
		capabilities: [
			WalletCapability.Discover,
			...tronConnectionCapabilities,
		],
	})

	const emit = (
		walletId: string,
		state: TronConnectionState,
		status = state.accounts.length > 0 ?
			BlockheadConnectionStatus.Connected
		:
			BlockheadConnectionStatus.Disconnected,
		error?: string
	) => {
		stateByWalletId.set(walletId, state)
		updateConnectionByWalletId.get(walletId)?.(tronConnection(
			walletId,
			state,
			status,
			error
		))
	}

	return {
		id: 'tron-injected',
		start: (updateCandidates) => {
			if (typeof window === 'undefined') return () => {}

			const publishCandidates = () => updateCandidates(
				[...announcedProviderByUuid.values()].map((detail) => candidate(
					`tron-tip6963:${detail.info.uuid}`,
					detail.info.name,
					detail.info.icon,
					detail.info.rdns
				))
			)
			const announceProvider = (event: CustomEvent<TronProviderDetail>) => {
				announcedProviderByUuid.set(event.detail.info.uuid, event.detail)
				providerByWalletId.set(
					`tron-tip6963:${event.detail.info.uuid}`,
					event.detail.provider
				)
				providerByWalletId.delete(TRON_LEGACY_WALLET_ID)
				publishCandidates()
			}

			const supportsProviderEvents = typeof window.addEventListener === 'function'
			if (supportsProviderEvents) {
				window.addEventListener(TRON_ANNOUNCE_PROVIDER_EVENT, announceProvider)
				window.dispatchEvent(new Event(TRON_REQUEST_PROVIDER_EVENT))
			}
			const provider = window.tron ?? window.tronLink
			if (announcedProviderByUuid.size === 0 && provider != null) {
				providerByWalletId.set(TRON_LEGACY_WALLET_ID, provider)
				updateCandidates([
					candidate(
						TRON_LEGACY_WALLET_ID,
						'TRON injected wallet',
						'',
						undefined,
						WalletDiscoveryKind.InjectedGlobal
					),
				])
			}
			else
				publishCandidates()

			return () => {
				if (supportsProviderEvents)
					window.removeEventListener(TRON_ANNOUNCE_PROVIDER_EVENT, announceProvider)
				for (const cleanup of cleanupByWalletId.values())
					cleanup()

				cleanupByWalletId.clear()
				updateConnectionByWalletId.clear()
				updateVersionByWalletId.clear()
				announcedProviderByUuid.clear()
				providerByWalletId.clear()
				stateByWalletId.clear()
			}
		},
		connect: async (walletId) => {
			const provider = providerByWalletId.get(walletId)
			if (provider == null) return undefined

			const state = await readTronState(
				provider,
				'eth_requestAccounts',
				Date.now()
			)
			if (!state.accounts.length)
				throw new Error('TRON wallet did not return any accounts')

			stateByWalletId.set(walletId, state)
			return tronConnection(
				walletId,
				state,
				BlockheadConnectionStatus.Connected
			)
		},
		disconnect: (walletId) => {
			stateByWalletId.delete(walletId)
		},
		subscribeConnection: (walletId, updateConnection) => {
			const provider = providerByWalletId.get(walletId)
			if (provider == null) return () => {}

			updateConnectionByWalletId.set(walletId, updateConnection)
			if (!cleanupByWalletId.has(walletId)) {
				const accountsChanged = (payload: JsonValue) => {
					updateVersionByWalletId.set(
						walletId,
						(updateVersionByWalletId.get(walletId) ?? 0) + 1
					)
					let accounts: string[]
					try {
						accounts = tronAccountsFromEvent(payload)
					} catch (error) {
						updateConnection(tronEventErrorConnection(
							walletId,
							stateByWalletId.get(walletId),
							error
						))
						return
					}

					const state = stateByWalletId.get(walletId)
					if (state != null) {
						emit(walletId, {
							...state,
							accounts,
						})
						return
					}

					void provider.request({
						method: 'eth_chainId',
						params: [],
					}).then((reference) => {
						if (updateConnectionByWalletId.get(walletId) === updateConnection)
							emit(walletId, {
								accounts,
								reference: tronReference(reference),
								connectedAt: Date.now(),
							})
					}).catch(() => {})
				}
				const chainChanged = (payload: JsonValue) => {
					updateVersionByWalletId.set(
						walletId,
						(updateVersionByWalletId.get(walletId) ?? 0) + 1
					)
					let reference: string
					try {
						reference = tronReferenceFromEvent(payload)
					} catch (error) {
						updateConnection(tronEventErrorConnection(
							walletId,
							stateByWalletId.get(walletId),
							error
						))
						return
					}

					emit(walletId, {
						accounts: stateByWalletId.get(walletId)?.accounts ?? [],
						reference,
						connectedAt: stateByWalletId.get(walletId)?.connectedAt ?? Date.now(),
					})
				}
				const connected = (payload: JsonValue) => {
					if (
						isJsonObject(payload)
						&& isJsonObject(payload.message)
						&& payload.message.action === 'connect'
					) {
						const updateVersion = (updateVersionByWalletId.get(walletId) ?? 0) + 1
						updateVersionByWalletId.set(walletId, updateVersion)
						void readTronState(provider, 'eth_accounts', Date.now())
							.then((state) => {
								if (
									updateVersionByWalletId.get(walletId) === updateVersion
									&& updateConnectionByWalletId.get(walletId) === updateConnection
								)
									emit(walletId, state)
							})
							.catch(() => {})
						return
					}

					chainChanged(payload)
				}
				const disconnected = () => {
					updateVersionByWalletId.set(
						walletId,
						(updateVersionByWalletId.get(walletId) ?? 0) + 1
					)
					const state = stateByWalletId.get(walletId)
					if (state != null)
						emit(walletId, {
							...state,
							accounts: [],
						}, BlockheadConnectionStatus.Disconnected)
				}

				provider.on('accountsChanged', accountsChanged)
				provider.on('chainChanged', chainChanged)
				provider.on('connect', connected)
				provider.on('disconnect', disconnected)
				cleanupByWalletId.set(walletId, () => {
					provider.removeListener('accountsChanged', accountsChanged)
					provider.removeListener('chainChanged', chainChanged)
					provider.removeListener('connect', connected)
					provider.removeListener('disconnect', disconnected)
				})
			}

			if (!stateByWalletId.has(walletId)) {
				const updateVersion = (updateVersionByWalletId.get(walletId) ?? 0) + 1
				updateVersionByWalletId.set(walletId, updateVersion)
				void readTronState(provider, 'eth_accounts', Date.now())
					.then((state) => {
						if (
							updateVersionByWalletId.get(walletId) === updateVersion
							&& updateConnectionByWalletId.get(walletId) === updateConnection
						)
							emit(walletId, state)
					})
					.catch(() => {})
			}

			return () => {
				if (updateConnectionByWalletId.get(walletId) === updateConnection) {
					updateConnectionByWalletId.delete(walletId)
					updateVersionByWalletId.set(
						walletId,
						(updateVersionByWalletId.get(walletId) ?? 0) + 1
					)
					cleanupByWalletId.get(walletId)?.()
					cleanupByWalletId.delete(walletId)
				}
			}
		},
	}
}
