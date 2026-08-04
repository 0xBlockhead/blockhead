import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { bech32, hex } from '@scure/base'
import { SvelteMap } from 'svelte/reactivity'
import type { WalletAdapter, WalletConnection } from './types.ts'
import { buildWalletConnection } from '../walletConnectionState.ts'

type CardanoCip30WalletApi = {
	getUsedAddresses(): Promise<string[]>
	getUnusedAddresses?(): Promise<string[]>
	getNetworkId?(): Promise<number>
	cip142?: {
		getNetworkMagic(): Promise<number>
	}
}

type CardanoConnectionState = {
	api: CardanoCip30WalletApi
	connection: WalletConnection
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

	return bech32.encode(
		networkId === 1 ?
			'addr'
		:
			'addr_test',
		bech32.toWords(addressBytes),
		false
	)
}

export const createCardanoCip30Adapter = (): WalletAdapter => {
	const walletByWalletId = new SvelteMap<string, CardanoCip30Wallet>()
	const stateByWalletId = new SvelteMap<string, CardanoConnectionState>()
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

		return buildWalletConnection({
			walletId,
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.CardanoCip30,
			transportKind: WalletTransportKind.InjectedSigner,
			scopes: [
				{
					namespace: 'cip34',
					reference: networkReference,
					methods: ['enable', 'getUsedAddresses', 'getUnusedAddresses', 'signData', 'signTx', 'submitTx'],
					events: [],
				},
			],
			accounts: [...new Set([
				...await api.getUsedAddresses(),
				...await api.getUnusedAddresses?.() ?? [],
			].map((encodedAddress) => decodeCardanoCip30Address(
				encodedAddress,
				networkId
			)))].map((accountAddress) => ({
				namespace: 'cip34',
				reference: networkReference,
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
			connectedAt,
		})
	}
	const authorize = async (
		walletId: string,
		wallet: CardanoCip30Wallet,
		connectedAt = Date.now()
	) => {
		const api = await wallet.enable({
			extensions: [
				{
					cip: 142,
				},
			],
		})
		const connection = await readConnection(
			walletId,
			api,
			connectedAt
		)
		stateByWalletId.set(walletId, {
			api,
			connection,
		})

		return connection
	}
	const refresh = async (
		walletId: string,
		wallet: CardanoCip30Wallet
	) => {
		const state = stateByWalletId.get(walletId)
		if (state == null)
			return authorize(walletId, wallet)

		try {
			const connection = await readConnection(
				walletId,
				state.api,
				state.connection.connectedAt ?? Date.now()
			)
			stateByWalletId.set(walletId, {
				...state,
				connection,
			})

			return connection
		}
		catch (error) {
			if (!isAccountChangeError(error)) throw error

			return authorize(
				walletId,
				wallet,
				state.connection.connectedAt
			)
		}
	}

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
				stateByWalletId.clear()
				walletByWalletId.clear()
			}
		},
		connect: async (walletId) => {
			const wallet = walletByWalletId.get(walletId)
			if (wallet == null) return undefined

			return authorize(walletId, wallet)
		},
		disconnect: (walletId) => {
			stateByWalletId.delete(walletId)
		},
		subscribeConnection: (walletId, updateConnection) => {
			const abortController = new AbortController()
			const wallet = walletByWalletId.get(walletId)
			if (wallet == null) return () => abortController.abort()

			const isEnabled = wallet.isEnabled
			if (isEnabled == null) return () => abortController.abort()

			let checking = false
			let previousIdentity: string | undefined
			const checkConnection = async () => {
				if (checking || abortController.signal.aborted) return

				checking = true
				try {
					const enabled = await isEnabled()
					// oxlint-disable-next-line typescript/no-unnecessary-condition -- cleanup can abort while the wallet request is pending
					if (abortController.signal.aborted) return

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
					if (!enabled)
						stateByWalletId.delete(walletId)
					// oxlint-disable-next-line typescript/no-unnecessary-condition -- cleanup can abort while wallet account and network reads are pending
					if (abortController.signal.aborted) return

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
