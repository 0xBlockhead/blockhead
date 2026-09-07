import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { isJsonArray, isJsonObject, isJsonString, type JsonObject, type JsonValue } from '$/typescript/JsonValue.ts'
import { base58, bech32, bech32m } from '@scure/base'
import * as Hash from 'ox/Hash'
import { SvelteMap } from 'svelte/reactivity'
import type { WalletAdapter, WalletCandidate, WalletConnection, WalletNonEvmAccountCapability } from './types.ts'
import { buildWalletConnection } from '../walletConnectionState.ts'

/**
 * Sats Connect Bitcoin address purposes only.
 * Stacks / Spark / Starknet purposes are non-Bitcoin and filtered out.
 * UniSat injected `getAccounts` / `requestAccounts` return unlabeled strings — never invent a purpose there.
 */
const bitcoinAddressPurposes = [
	'payment',
	'ordinals',
] as const

type BitcoinAddressPurpose = (typeof bitcoinAddressPurposes)[number]

const nonBitcoinSatsConnectPurposes = [
	'spark',
	'stacks',
	'starknet',
] as const

type BitcoinLabeledAddress = {
	address: string
	network: string
	purpose: BitcoinAddressPurpose
}

/** UniSat wire accounts — no Sats Connect purpose field on the injected API. */
type BitcoinUnlabeledAddress = {
	address: string
	network: string
}

type BitcoinConnectionAddress =
	| BitcoinLabeledAddress
	| BitcoinUnlabeledAddress

type BitcoinConnectionState = {
	addresses: BitcoinConnectionAddress[]
	connectedAt: number
	protocol: WalletProtocol
	methods: string[]
	events: string[]
}

type SatsConnectProvider = {
	request(method: string, params?: JsonObject | null): Promise<JsonValue>
	addListener?(
		event: 'accountChange' | 'accountDisconnected' | 'networkChange',
		listener: (payload: JsonValue) => void
	): () => void
}

type UnisatChain = {
	enum: string
	name: string
	network: string
}

type UnisatProvider = {
	requestAccounts(): Promise<JsonValue>
	getAccounts(): Promise<JsonValue>
	getChain(): Promise<UnisatChain>
	signMessage?(message: string, type?: string): Promise<string>
	signPsbt?(psbtHex: string): Promise<string>
	on(event: 'accountsChanged' | 'networkChanged', listener: (payload: JsonValue) => void): void
	removeListener(event: 'accountsChanged' | 'networkChanged', listener: (payload: JsonValue) => void): void
}

type BitcoinProvider =
	| { kind: 'leather', provider: SatsConnectProvider }
	| { kind: 'sats-connect', provider: SatsConnectProvider }
	| { kind: 'unisat', provider: UnisatProvider }

declare global {
	interface Window {
		LeatherProvider?: SatsConnectProvider
		magicEden?: {
			bitcoin?: object
		}
		unisat?: UnisatProvider
		XverseProviders?: {
			BitcoinProvider?: SatsConnectProvider
		}
	}
}

const bitcoinNetworks = {
	mainnet: {
		reference: '000000000019d6689c085ae165831e93',
		bech32Prefix: 'bc',
		base58Versions: [
			0x00,
			0x05,
		],
	},
	livenet: {
		reference: '000000000019d6689c085ae165831e93',
		bech32Prefix: 'bc',
		base58Versions: [
			0x00,
			0x05,
		],
	},
	testnet: {
		reference: '000000000933ea01ad0ee984209779ba',
		bech32Prefix: 'tb',
		base58Versions: [
			0x6f,
			0xc4,
		],
	},
	signet: {
		reference: '00000008819873e925422c1ff0f99f7c',
		bech32Prefix: 'tb',
		base58Versions: [
			0x6f,
			0xc4,
		],
	},
	regtest: {
		reference: '0f9188f13cb7b2c71f2a335e3a4fc328',
		bech32Prefix: 'bcrt',
		base58Versions: [
			0x6f,
			0xc4,
		],
	},
} as const

const bitcoinSigningCapabilities = [
	WalletCapability.SignMessage,
	WalletCapability.SignTransaction,
] as const satisfies readonly WalletNonEvmAccountCapability[]

const bitcoinConnectionCapabilities = [
	WalletCapability.Connect,
	WalletCapability.Reconnect,
	WalletCapability.ListAccounts,
	WalletCapability.WatchAccounts,
	WalletCapability.WatchScopes,
	...bitcoinSigningCapabilities,
] as const satisfies readonly WalletNonEvmAccountCapability[]

const bitcoinNetwork = (network: string) => {
	const bitcoinNetwork = Object.entries(bitcoinNetworks).find(([name]) => name === network.toLowerCase())?.[1]
	if (bitcoinNetwork == null)
		throw new Error(`Bitcoin wallet exposed unsupported network ${network}`)

	return bitcoinNetwork
}

const bitcoinReference = (network: string) => bitcoinNetwork(network).reference

const normalizeBitcoinWireAddress = (
	address: string,
	network: string
): Pick<BitcoinConnectionAddress, 'address' | 'network'> => {
	try {
		const normalizedNetwork = network.toLowerCase()
		const {
			base58Versions,
			bech32Prefix,
		} = bitcoinNetwork(normalizedNetwork)
		if ([
			'bc',
			'tb',
			'bcrt',
		].some((prefix) => address.toLowerCase().startsWith(`${prefix}1`))) {
			let decodedAddress: ReturnType<typeof bech32.decode>
			let usesBech32m = false
			try {
				decodedAddress = bech32.decode(address)
			} catch {
				decodedAddress = bech32m.decode(address)
				usesBech32m = true
			}

			const [witnessVersion, ...programWords] = decodedAddress.words
			const witnessProgram = bech32.fromWords(programWords)
			if (
				decodedAddress.prefix !== bech32Prefix
				|| witnessVersion > 16
				|| witnessProgram.length < 2
				|| witnessProgram.length > 40
				|| (
					witnessVersion === 0
					&& (
						usesBech32m
						|| (witnessProgram.length !== 20 && witnessProgram.length !== 32)
					)
				)
				|| (witnessVersion > 0 && !usesBech32m)
			)
				throw new Error('Invalid Bitcoin witness address')

			return {
				address: address.toLowerCase(),
				network: normalizedNetwork,
			}
		}

		const decodedAddress = base58.decode(address)
		if (
			decodedAddress.length !== 25
			|| !base58Versions.some((version) => version === decodedAddress[0])
		)
			throw new Error('Invalid Bitcoin Base58Check payload')

		const addressPayload = decodedAddress.slice(0, 21)
		const checksum = Hash.sha256(
			Hash.sha256(addressPayload, { as: 'Bytes' }),
			{ as: 'Bytes' }
		).slice(0, 4)
		if (
			decodedAddress.slice(21).some((byte, index) => byte !== checksum[index])
			|| base58.encode(decodedAddress) !== address
		)
			throw new Error('Invalid Bitcoin Base58Check checksum')

		return {
			address,
			network: normalizedNetwork,
		}
	} catch {
		throw new Error(`Bitcoin wallet returned an invalid ${network} address`)
	}
}

const bitcoinAccountIdentity = ({
	address,
	network,
}: Pick<BitcoinConnectionAddress, 'address' | 'network'>) => (
	`${bitcoinReference(network)}:${address}`
)

const normalizeBitcoinLabeledAddresses = (addresses: BitcoinLabeledAddress[]) => {
	const purposesByAccountId = new Map<string, Set<BitcoinAddressPurpose>>()
	return addresses.flatMap((address) => {
		const normalizedWire = normalizeBitcoinWireAddress(address.address, address.network)
		const normalizedAddress = {
			...normalizedWire,
			purpose: address.purpose,
		}
		const accountId = bitcoinAccountIdentity(normalizedAddress)
		const purposes = purposesByAccountId.get(accountId) ?? new Set<BitcoinAddressPurpose>()
		if (purposes.has(normalizedAddress.purpose))
			return []

		purposes.add(normalizedAddress.purpose)
		purposesByAccountId.set(accountId, purposes)
		return [normalizedAddress]
	})
}

const normalizeUnisatBitcoinAddresses = (addresses: BitcoinUnlabeledAddress[]) => {
	const seenAccounts = new Set<string>()
	return addresses.flatMap((address) => {
		const normalizedAddress = normalizeBitcoinWireAddress(address.address, address.network)
		const accountId = bitcoinAccountIdentity(normalizedAddress)
		if (seenAccounts.has(accountId)) return []

		seenAccounts.add(accountId)
		return [normalizedAddress]
	})
}

const bitcoinAddresses = (value: JsonValue): BitcoinLabeledAddress[] => {
	const result = isJsonObject(value) && value.status === 'success' ? value.result : value
	const addressesValue = isJsonObject(result) ? result.addresses : result
	if (!isJsonArray(addressesValue))
		throw new Error('Bitcoin wallet did not return an addresses array')

	return normalizeBitcoinLabeledAddresses(addressesValue.flatMap((address) => {
		if (!isJsonObject(address) || !isJsonString(address.address))
			throw new Error('Bitcoin wallet returned a non-canonical address')

		if (!isJsonString(address.purpose))
			throw new Error('Bitcoin wallet address did not include its purpose')

		if (nonBitcoinSatsConnectPurposes.some((purpose) => purpose === address.purpose))
			return []

		const purpose = bitcoinAddressPurposes.find((bitcoinPurpose) => bitcoinPurpose === address.purpose)
		if (purpose == null)
			throw new Error(`Bitcoin wallet returned unsupported address purpose ${address.purpose}`)

		if (!isJsonString(address.network))
			throw new Error('Bitcoin wallet address did not include its network')

		return [{
			address: address.address,
			network: address.network,
			purpose,
		}]
	}))
}

const unisatAddresses = (value: JsonValue, network: string): BitcoinUnlabeledAddress[] => {
	if (!isJsonArray(value) || !value.every(isJsonString))
		throw new Error('Bitcoin wallet did not return an accounts array')

	return normalizeUnisatBitcoinAddresses(value.map((address) => ({ address, network })))
}

const bitcoinConnection = (
	walletId: string,
	state: BitcoinConnectionState,
	status = state.addresses.length > 0 ?
		BlockheadConnectionStatus.Connected
	:
		BlockheadConnectionStatus.Disconnected
): WalletConnection => {
	const accounts = [
		...new Map(
			state.addresses.map((row) => [
				bitcoinAccountIdentity(row),
				row,
			] as const)
		)
			.values(),
	]
		.map(({ address, network }) => ({
			namespace: 'bip122',
			reference: bitcoinReference(network),
			accountAddress: address,
			capabilities: bitcoinConnectionCapabilities.filter((capability) => (
				capability !== WalletCapability.SignTransaction
				|| state.methods.includes('signPsbt')
			)),
		}))

	return buildWalletConnection({
		walletId,
		status,
		protocol: state.protocol,
		transportKind: WalletTransportKind.InjectedSigner,
		scopes: [...new Set(state.addresses.map(({ network }) => bitcoinReference(network)))].map((reference) => ({
			namespace: 'bip122',
			reference,
			methods: state.methods,
			events: state.events,
		})),
		accounts,
		...(state.addresses.length > 0 && { activeAccount: accounts[0] }),
		selected: status === BlockheadConnectionStatus.Connected && accounts.length > 0,
		connectedAt: state.connectedAt,
		...(status === BlockheadConnectionStatus.Disconnected && { disconnectedAt: Date.now() }),
	})
}

export const createBitcoinInjectedAdapter = (): WalletAdapter => {
	const providerByWalletId = new SvelteMap<string, BitcoinProvider>()
	const stateByWalletId = new SvelteMap<string, BitcoinConnectionState>()
	const cleanupByWalletId = new SvelteMap<string, () => void>()
	const updateConnectionByWalletId = new SvelteMap<string, (connection: WalletConnection) => void>()
	const updateVersionByWalletId = new SvelteMap<string, number>()

	const emit = (walletId: string, state: BitcoinConnectionState) => {
		stateByWalletId.set(walletId, state)
		updateConnectionByWalletId.get(walletId)?.(bitcoinConnection(walletId, state))
	}

	const readSatsConnectState = async (
		provider: SatsConnectProvider,
		method: 'getAddresses' | 'wallet_connect' | 'wallet_getAccount',
		connectedAt: number
	) => {
		const addresses = bitcoinAddresses(await provider.request(method, method === 'wallet_connect' ? {
			addresses: [...bitcoinAddressPurposes],
		} : null))
		if (!addresses.length)
			throw new Error('Bitcoin wallet did not return any Bitcoin addresses')

		return {
			addresses,
			connectedAt,
			protocol: WalletProtocol.SatsConnect,
			methods: method === 'getAddresses' ?
				['getAddresses', 'signMessage']
			:
				[
					'wallet_connect',
					'wallet_getAccount',
					'wallet_disconnect',
					'signMessage',
				],
			events: method === 'getAddresses' ? [] : ['accountChange', 'accountDisconnected', 'networkChange'],
		}
	}

	const readUnisatState = async (
		provider: UnisatProvider,
		method: 'getAccounts' | 'requestAccounts',
		connectedAt: number
	) => {
		const chain = await provider.getChain()
		const accounts = await provider[method]()
		return {
			addresses: unisatAddresses(accounts, chain.network),
			connectedAt,
			protocol: WalletProtocol.BitcoinInjected,
			methods: [
				'getAccounts',
				'requestAccounts',
				'getChain',
				'signMessage',
				...(provider.signPsbt != null ? ['signPsbt'] as const : []),
			],
			events: ['accountsChanged', 'networkChanged'],
		}
	}

	return {
		id: 'bitcoin-injected',
		start: (updateCandidates) => {
			if (typeof window === 'undefined') return () => {}

			const candidates: WalletCandidate[] = []
			if (window.LeatherProvider != null) {
				providerByWalletId.set('bitcoin:leather', { kind: 'leather', provider: window.LeatherProvider })
				candidates.push({
					id: 'bitcoin:leather',
					name: 'Leather',
					icon: '',
					protocol: WalletProtocol.SatsConnect,
					discoveryKind: WalletDiscoveryKind.InjectedGlobal,
					transportKind: WalletTransportKind.InjectedSigner,
					capabilities: [WalletCapability.Discover, WalletCapability.Connect, WalletCapability.ListAccounts],
				})
			}
			if (window.XverseProviders != null) {
				if (window.XverseProviders.BitcoinProvider != null)
					providerByWalletId.set('bitcoin:xverse', { kind: 'sats-connect', provider: window.XverseProviders.BitcoinProvider })
				candidates.push({
					id: 'bitcoin:xverse',
					name: 'Xverse',
					icon: '',
					protocol: WalletProtocol.SatsConnect,
					discoveryKind: WalletDiscoveryKind.InjectedGlobal,
					transportKind: WalletTransportKind.InjectedSigner,
					capabilities: window.XverseProviders.BitcoinProvider == null ?
						[WalletCapability.Discover]
					:
						[
							WalletCapability.Discover,
							...bitcoinConnectionCapabilities.filter((capability) => (
								capability !== WalletCapability.SignTransaction
							)),
							WalletCapability.Disconnect,
						],
				})
			}
			if (window.unisat != null) {
				providerByWalletId.set('bitcoin:unisat', { kind: 'unisat', provider: window.unisat })
				candidates.push({
					id: 'bitcoin:unisat',
					name: 'UniSat',
					icon: '',
					protocol: WalletProtocol.BitcoinInjected,
					discoveryKind: WalletDiscoveryKind.InjectedGlobal,
					transportKind: WalletTransportKind.InjectedSigner,
					capabilities: [
						WalletCapability.Discover,
						...window.unisat.signPsbt != null ?
							bitcoinConnectionCapabilities
						:
							bitcoinConnectionCapabilities.filter((capability) => (
								capability !== WalletCapability.SignTransaction
							)),
					],
				})
			}
			if (window.magicEden?.bitcoin != null)
				candidates.push({
					id: 'bitcoin:magiceden',
					name: 'Magic Eden',
					icon: '',
					protocol: WalletProtocol.BitcoinInjected,
					discoveryKind: WalletDiscoveryKind.InjectedGlobal,
					transportKind: WalletTransportKind.InjectedSigner,
					capabilities: [WalletCapability.Discover],
				})

			updateCandidates(candidates)
			return () => {
				for (const cleanup of cleanupByWalletId.values()) cleanup()

				cleanupByWalletId.clear()
				updateConnectionByWalletId.clear()
				updateVersionByWalletId.clear()
				stateByWalletId.clear()
				providerByWalletId.clear()
			}
		},
		connect: async (walletId) => {
			const provider = providerByWalletId.get(walletId)
			if (provider == null) return undefined

			const state = provider.kind === 'unisat' ?
				await readUnisatState(provider.provider, 'requestAccounts', Date.now())
			:
				await readSatsConnectState(
					provider.provider,
					provider.kind === 'leather' ? 'getAddresses' : 'wallet_connect',
					Date.now()
				)
			stateByWalletId.set(walletId, state)
			return bitcoinConnection(walletId, state)
		},
		disconnect: async (walletId) => {
			const provider = providerByWalletId.get(walletId)
			if (provider?.kind === 'sats-connect')
				await provider.provider.request('wallet_disconnect', null)

			stateByWalletId.delete(walletId)
		},
		signMessage: async (walletId, accountAddress, message) => {
			const provider = providerByWalletId.get(walletId)
			if (provider == null)
				throw new Error('Bitcoin wallet provider is unavailable')

			if (provider.kind === 'unisat') {
				const signMessage = provider.provider.signMessage
				if (signMessage == null)
					throw new Error('UniSat wallet does not implement signMessage')

				const signature = await signMessage(message, 'ecdsa')
				if (typeof signature !== 'string' || signature.length === 0)
					throw new Error('UniSat wallet returned an invalid signMessage signature')

				return signature
			}

			const response = await provider.provider.request('signMessage', {
				payload: {
					address: accountAddress,
					message,
				},
			})
			const result = isJsonObject(response) && response.status === 'success' ?
				response.result
			:
				response
			if (
				!isJsonObject(result)
				|| !isJsonString(result.signature)
				|| result.signature.length === 0
			)
				throw new Error('Bitcoin wallet returned an invalid signMessage signature')

			return result.signature
		},
		subscribeConnection: (walletId, updateConnection) => {
			const provider = providerByWalletId.get(walletId)
			if (provider == null) return () => {}

			updateConnectionByWalletId.set(walletId, updateConnection)
			if (!cleanupByWalletId.has(walletId)) {
				if (provider.kind === 'unisat') {
					const accountsChanged = (accounts: JsonValue) => {
						const updateVersion = (updateVersionByWalletId.get(walletId) ?? 0) + 1
						updateVersionByWalletId.set(walletId, updateVersion)
						void provider.provider.getChain().then((chain) => {
							const state = stateByWalletId.get(walletId)
							if (
								updateVersionByWalletId.get(walletId) === updateVersion
								&& updateConnectionByWalletId.get(walletId) === updateConnection
							)
								emit(walletId, {
									addresses: unisatAddresses(accounts, chain.network),
									connectedAt: state?.connectedAt ?? Date.now(),
									protocol: WalletProtocol.BitcoinInjected,
									methods: [
										'getAccounts',
										'requestAccounts',
										'getChain',
										'signMessage',
										...(provider.provider.signPsbt != null ? ['signPsbt'] as const : []),
									],
									events: ['accountsChanged', 'networkChanged'],
								})
						}).catch(() => {})
					}
					const networkChanged = () => {
						const updateVersion = (updateVersionByWalletId.get(walletId) ?? 0) + 1
						updateVersionByWalletId.set(walletId, updateVersion)
						void readUnisatState(
							provider.provider,
							'getAccounts',
							stateByWalletId.get(walletId)?.connectedAt ?? Date.now()
						).then((state) => {
							if (
								updateVersionByWalletId.get(walletId) === updateVersion
								&& updateConnectionByWalletId.get(walletId) === updateConnection
							)
								emit(walletId, state)
						}).catch(() => {})
					}
					provider.provider.on('accountsChanged', accountsChanged)
					provider.provider.on('networkChanged', networkChanged)
					cleanupByWalletId.set(walletId, () => {
						provider.provider.removeListener('accountsChanged', accountsChanged)
						provider.provider.removeListener('networkChanged', networkChanged)
					})
				}
				else if (provider.provider.addListener != null) {
					const refresh = () => {
						const updateVersion = (updateVersionByWalletId.get(walletId) ?? 0) + 1
						updateVersionByWalletId.set(walletId, updateVersion)
						void readSatsConnectState(
							provider.provider,
							'wallet_getAccount',
							stateByWalletId.get(walletId)?.connectedAt ?? Date.now()
						).then((state) => {
							if (
								updateVersionByWalletId.get(walletId) === updateVersion
								&& updateConnectionByWalletId.get(walletId) === updateConnection
							)
								emit(walletId, state)
						}).catch(() => {})
					}
					const disconnected = () => {
						updateVersionByWalletId.set(
							walletId,
							(updateVersionByWalletId.get(walletId) ?? 0) + 1
						)
						const state = stateByWalletId.get(walletId)
						if (state != null) emit(walletId, { ...state, addresses: [] })
					}
					const cleanups = [
						provider.provider.addListener('accountChange', refresh),
						provider.provider.addListener('networkChange', refresh),
						provider.provider.addListener('accountDisconnected', disconnected),
					]
					cleanupByWalletId.set(walletId, () => cleanups.forEach((cleanup) => cleanup()))
				}
			}

			if (!stateByWalletId.has(walletId)) {
				const updateVersion = (updateVersionByWalletId.get(walletId) ?? 0) + 1
				updateVersionByWalletId.set(walletId, updateVersion)
				void (provider.kind === 'sats-connect' ?
					readSatsConnectState(provider.provider, 'wallet_getAccount', Date.now())
				: provider.kind === 'leather' ?
					readSatsConnectState(provider.provider, 'getAddresses', Date.now())
				:
					readUnisatState(provider.provider, 'getAccounts', Date.now())
				).then((state) => {
					if (
						updateVersionByWalletId.get(walletId) === updateVersion
						&& updateConnectionByWalletId.get(walletId) === updateConnection
					)
						emit(walletId, state)
				}).catch(() => {})
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
