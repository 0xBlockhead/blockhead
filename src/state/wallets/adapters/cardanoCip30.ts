import {
	WalletCapability,
	WalletDiscoveryKind,
	WalletProtocol,
	WalletTransportKind,
} from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { bech32, hex } from '@scure/base'
import { SvelteMap } from 'svelte/reactivity'
import {
	WalletAdapterPreDispatchFailure,
	type WalletAdapter,
	type WalletConnection,
} from './types.ts'
import { verifyCardanoCip30SignData } from './cardanoCip30SignData.ts'
import { buildWalletConnection } from '../walletConnectionState.ts'

// oxlint-disable-next-line typescript/no-restricted-types -- CIP-30 signData is untrusted injected-wallet data and is parsed at the COSE wire boundary.
type CardanoCip30DataSignature = unknown

type CardanoCip30WalletApi = {
	getUsedAddresses(): Promise<string[]>
	getUnusedAddresses?(): Promise<string[]>
	getNetworkId?(): Promise<number>
	signData?(
		address: string,
		payload: string
	): Promise<CardanoCip30DataSignature>
	cip142?: {
		getNetworkMagic(): Promise<number>
	}
}

type CardanoConnectionState = {
	api: CardanoCip30WalletApi
	connection: WalletConnection
	connectedAt: number
	generation: number
	startGeneration: number
}

type CardanoCip30PaymentAddress = {
	accountAddress: string
	signDataSupported: boolean
}

type CardanoCip30Wallet = {
	name?: string
	icon?: string
	isEnabled?(): Promise<boolean>
	enable(options?: {
		extensions: {
			cip: number
		}[]
	}): Promise<CardanoCip30WalletApi>
}

declare global {
	interface Window {
		cardano?: Record<string, CardanoCip30Wallet>
	}
}

const CIP30_POLL_INTERVAL_MS = 1_000

// oxlint-disable-next-line typescript/no-restricted-types -- JavaScript Promise rejection values are untyped; only the normative CIP-30 APIError code is inspected.
const isAccountChangeError = (error: unknown) => (
	// oxlint-disable-next-line no-runtime-shape-guards/guards -- CIP-30 APIError is an external rejection object whose -4 code requires reauthorization.
	typeof error === 'object'
	&& error !== null
	&& 'code' in error
	&& error.code === -4
)

const decodeCardanoPointerNatural = (
	bytes: Uint8Array,
	offset: number,
	maximum: bigint
) => {
	let value = 0n
	let index = offset

	while (index < bytes.length) {
		const byte = bytes[index]
		if (index === offset && (byte & 0x7f) === 0 && (byte & 0x80) !== 0)
			throw new Error('Cardano CIP-30 wallet returned a non-canonical pointer address')

		value = (value << 7n) | BigInt(byte & 0x7f)
		if (value > maximum)
			throw new Error('Cardano CIP-30 wallet returned a non-canonical pointer address')

		index++
		if ((byte & 0x80) === 0)
			return index
	}

	throw new Error('Cardano CIP-30 wallet returned a non-canonical pointer address')
}

const decodeCardanoCip30Address = (
	encodedAddress: string,
	networkId: number
) => {
	const addressBytes = hex.decode(encodedAddress)
	if (!addressBytes.length)
		throw new Error('Cardano CIP-30 wallet returned an empty address')

	const addressType = addressBytes[0] >> 4
	if (addressType > 7)
		throw new Error('Cardano CIP-30 wallet returned a non-payment address')
	if ((addressBytes[0] & 0b1111) !== networkId)
		throw new Error('Cardano CIP-30 address network does not match the wallet network')
	if (
		(addressType <= 3 && addressBytes.length !== 57)
		|| (addressType >= 6 && addressBytes.length !== 29)
	)
		throw new Error('Cardano CIP-30 wallet returned a malformed payment address')
	if (addressType === 4 || addressType === 5) {
		const transactionIndexOffset = decodeCardanoPointerNatural(
			addressBytes,
			29,
			0xffff_ffff_ffff_ffffn
		)
		const certificateIndexOffset = decodeCardanoPointerNatural(
			addressBytes,
			transactionIndexOffset,
			0xffffn
		)
		const pointerEnd = decodeCardanoPointerNatural(
			addressBytes,
			certificateIndexOffset,
			0xffffn
		)
		if (pointerEnd !== addressBytes.length)
			throw new Error('Cardano CIP-30 wallet returned a non-canonical pointer address')
	}

	return {
		accountAddress: bech32.encode(
			networkId === 1 ?
				'addr'
			:
				'addr_test',
			bech32.toWords(addressBytes),
			false
		),
		signDataSupported: (
			addressType === 0
			|| addressType === 2
			|| addressType === 4
			|| addressType === 6
		),
	} satisfies CardanoCip30PaymentAddress
}

const cardanoSignMessagePayload = (message: string) => (
	hex.encode(new TextEncoder().encode(message))
)

const cardanoSignDataAddress = (accountAddress: string) => {
	const decodedAddress = bech32.decode(accountAddress, false)
	if (
		decodedAddress.prefix !== 'addr'
		&& decodedAddress.prefix !== 'addr_test'
	)
		throw new Error('Cardano wallet returned a non-address signing credential')

	return hex.encode(bech32.fromWords(decodedAddress.words))
}

export const createCardanoCip30Adapter = (): WalletAdapter => {
	const walletByWalletId = new SvelteMap<string, CardanoCip30Wallet>()
	const stateByWalletId = new SvelteMap<string, CardanoConnectionState>()
	const generationByWalletId = new SvelteMap<string, number>()
	let activeStartGeneration = 0
	let activeStop: (() => void) | undefined
	const nextGeneration = (walletId: string) => {
		const generation = (generationByWalletId.get(walletId) ?? 0) + 1
		generationByWalletId.set(walletId, generation)

		return generation
	}
	const isCurrentGeneration = (
		walletId: string,
		startGeneration: number,
		generation: number
	) => (
		activeStartGeneration === startGeneration
		&& generationByWalletId.get(walletId) === generation
	)
	const isCurrentState = (
		walletId: string,
		state: CardanoConnectionState
	) => isCurrentGeneration(
		walletId,
		state.startGeneration,
		state.generation
	)
	const invalidateWallet = (walletId: string) => {
		nextGeneration(walletId)
		stateByWalletId.delete(walletId)
	}
	const connectionAuthority = (connection: WalletConnection) => [
		...connection.scopes.map((scope) => (
			`${scope.namespace}:${scope.reference}:${scope.methods.join(',')}:${scope.events.join(',')}`
		)),
		...connection.accounts.map((account) => (
			`${account.namespace}:${account.reference}:${account.accountAddress}:${account.capabilities.join(',')}`
		)),
	].join('|')
	const readConnection = async (
		walletId: string,
		api: CardanoCip30WalletApi,
		connectedAt: number
	): Promise<WalletConnection> => {
		const networkId = await api.getNetworkId?.()
		const networkMagic = await api.cip142?.getNetworkMagic()
		if (networkId !== 0 && networkId !== 1)
			throw new Error('Cardano CIP-30 wallet did not expose a canonical CIP-34 network')
		if (
			networkMagic !== undefined
			&& (
				!Number.isSafeInteger(networkMagic)
				|| networkMagic < 0
				|| networkMagic > 0xffff_ffff
				|| (networkId === 1 && networkMagic !== 764_824_073)
			)
		)
			throw new Error('Cardano CIP-30 wallet did not expose a canonical CIP-34 network')

		const networkReference = (
			networkMagic !== undefined ?
				`${networkId}-${networkMagic}`
			: networkId === 1 ?
				'1-764824073'
			:
				undefined
		)
		if (networkReference === undefined)
			throw new Error('Cardano CIP-30 wallet did not expose a canonical CIP-34 network')

		const accountByAddress = new Map<string, CardanoCip30PaymentAddress>()
		for (const encodedAddress of [
			...await api.getUsedAddresses(),
			...await api.getUnusedAddresses?.() ?? [],
		]) {
			const paymentAddress = decodeCardanoCip30Address(
				encodedAddress,
				networkId
			)
			accountByAddress.set(paymentAddress.accountAddress, paymentAddress)
		}

		return buildWalletConnection({
			walletId,
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.CardanoCip30,
			transportKind: WalletTransportKind.InjectedSigner,
			scopes: [
				{
					namespace: 'cip34',
					reference: networkReference,
					methods: [
						'enable',
						'getUsedAddresses',
						...(api.getUnusedAddresses == null ? [] : ['getUnusedAddresses']),
						...(api.signData == null ? [] : ['signData']),
					],
					events: [],
				},
			],
			accounts: [...accountByAddress.values()].map(({
				accountAddress,
				signDataSupported,
			}) => ({
				namespace: 'cip34',
				reference: networkReference,
				accountAddress,
				capabilities: [
					WalletCapability.Connect,
					WalletCapability.Reconnect,
					WalletCapability.ListAccounts,
					...(signDataSupported && api.signData != null ?
						[WalletCapability.SignMessage]
					:
						[]),
				],
			})),
			selected: true,
			connectedAt,
		})
	}
	const authorize = async (
		walletId: string,
		wallet: CardanoCip30Wallet,
		startGeneration: number,
		generation: number,
		connectedAt = Date.now()
	) => {
		const api = await wallet.enable({
			extensions: [
				{
					cip: 142,
				},
			],
		})
		if (!isCurrentGeneration(walletId, startGeneration, generation))
			return undefined

		const connection = await readConnection(
			walletId,
			api,
			connectedAt
		)
		if (!isCurrentGeneration(walletId, startGeneration, generation))
			return undefined

		stateByWalletId.set(walletId, {
			api,
			connection,
			connectedAt,
			generation,
			startGeneration,
		})

		return connection
	}
	const refresh = async (
		walletId: string,
		wallet: CardanoCip30Wallet
	) => {
		const state = stateByWalletId.get(walletId)
		if (state == null) {
			const startGeneration = activeStartGeneration
			const generation = nextGeneration(walletId)

			return authorize(
				walletId,
				wallet,
				startGeneration,
				generation
			)
		}
		if (!isCurrentState(walletId, state))
			return undefined

		try {
			const connection = await readConnection(
				walletId,
				state.api,
				state.connectedAt
			)
			if (!isCurrentState(walletId, state))
				return undefined

			const currentState = stateByWalletId.get(walletId)
			if (currentState == null || !isCurrentState(walletId, currentState))
				return undefined

			stateByWalletId.set(walletId, {
				...currentState,
				connection,
				...(connectionAuthority(currentState.connection) !== connectionAuthority(connection) && {
					generation: nextGeneration(walletId),
				}),
			})

			return connection
		}
		catch (error) {
			if (!isCurrentState(walletId, state))
				return undefined
			if (!isAccountChangeError(error)) throw error

			const generation = nextGeneration(walletId)
			stateByWalletId.delete(walletId)
			return authorize(
				walletId,
				wallet,
				state.startGeneration,
				generation,
				state.connectedAt
			)
		}
	}

	return {
		id: 'cardano-cip30',
		start: (updateCandidates) => {
			activeStop?.()
			activeStartGeneration += 1
			const startGeneration = activeStartGeneration
			stateByWalletId.clear()
			walletByWalletId.clear()
			generationByWalletId.clear()
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
							],
						}
					})

			updateCandidates(candidates)

			const stop = () => {
				if (activeStop !== stop || activeStartGeneration !== startGeneration) return

				activeStop = undefined
				activeStartGeneration += 1
				stateByWalletId.clear()
				walletByWalletId.clear()
				generationByWalletId.clear()
			}
			activeStop = stop

			return stop
		},
		connect: async (walletId) => {
			const wallet = walletByWalletId.get(walletId)
			if (wallet == null) return undefined

			const startGeneration = activeStartGeneration
			const generation = nextGeneration(walletId)
			stateByWalletId.delete(walletId)

			return authorize(
				walletId,
				wallet,
				startGeneration,
				generation
			)
		},
		disconnect: (walletId) => {
			invalidateWallet(walletId)
		},
		signMessage: async (walletId, accountAddress, message) => {
			const state = stateByWalletId.get(walletId)
			if (state == null || !isCurrentState(walletId, state))
				throw new Error('Cardano CIP-30 wallet is not connected')

			const signData = state.api.signData
			if (signData == null)
				throw new Error('Cardano CIP-30 wallet does not implement signData')

			const authorizedAccount = state.connection.accounts.find((account) => (
				account.accountAddress === accountAddress
				&& account.capabilities.includes(WalletCapability.SignMessage)
			))
			if (authorizedAccount == null)
				throw new WalletAdapterPreDispatchFailure(
					'Cardano CIP-30 selected account does not support signData'
				)

			const address = cardanoSignDataAddress(accountAddress)
			const payload = cardanoSignMessagePayload(message)
			let liveConnection: WalletConnection
			try {
				liveConnection = await readConnection(
					walletId,
					state.api,
					state.connectedAt
				)
			}
			catch {
				throw new WalletAdapterPreDispatchFailure(
					'Cardano CIP-30 signing authority could not be read before signData'
				)
			}
			if (!isCurrentState(walletId, state))
				throw new WalletAdapterPreDispatchFailure(
					'Cardano CIP-30 connection changed before signData dispatch'
				)
			if (!liveConnection.accounts.some((account) => (
				account.accountAddress === accountAddress
				&& account.reference === authorizedAccount.reference
				&& account.capabilities.includes(WalletCapability.SignMessage)
			)))
				throw new WalletAdapterPreDispatchFailure(
					'Cardano CIP-30 selected account no longer supports signData'
				)

			const response = await signData.call(state.api, address, payload)
			if (!isCurrentState(walletId, state))
				throw new Error('Cardano CIP-30 connection changed while signData was pending')

			return verifyCardanoCip30SignData({
				address,
				payload,
				response,
			})
		},
		subscribeConnection: (walletId, updateConnection) => {
			const abortController = new AbortController()
			const startGeneration = activeStartGeneration
			const wallet = walletByWalletId.get(walletId)
			if (wallet == null) return () => abortController.abort()

			const isEnabled = wallet.isEnabled
			if (isEnabled == null) return () => abortController.abort()

			let checking = false
			let previousIdentity: string | undefined
			const isCurrentSubscription = () => (
				!abortController.signal.aborted
				&& activeStartGeneration === startGeneration
			)
			const checkConnection = async () => {
				if (checking || !isCurrentSubscription()) return

				checking = true
				try {
					const enabled = await isEnabled.call(wallet)
					if (!isCurrentSubscription()) return

					if (!enabled)
						invalidateWallet(walletId)

					const connection = enabled ?
						await refresh(walletId, wallet)
					:
						buildWalletConnection({
							walletId,
							status: BlockheadConnectionStatus.Disconnected,
							protocol: WalletProtocol.CardanoCip30,
							transportKind: WalletTransportKind.InjectedSigner,
							scopes: [],
							accounts: [],
							disconnectedAt: Date.now(),
						})
					if (connection == null || !isCurrentSubscription()) return

					const identity = [
						connection.status,
						...connection.accounts.map((account) => (
							`${account.namespace}:${account.reference}:${account.accountAddress}`
						)),
					].join('|')
					if (identity !== previousIdentity) {
						previousIdentity = identity
						updateConnection(connection)
					}
				}
				finally {
					checking = false
				}
			}

			void checkConnection().catch(() => {})
			const poll = setInterval(() => {
				void checkConnection().catch(() => {})
			}, CIP30_POLL_INTERVAL_MS)

			return () => {
				abortController.abort()
				clearInterval(poll)
			}
		},
	}
}
