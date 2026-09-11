import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { SvelteMap } from 'svelte/reactivity'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import { type as arktype } from 'arktype'
import {
	WalletAdapterPreDispatchFailure,
	WalletAdapterProviderRejection,
	WalletAdapterResponseAuditFailure,
	type WalletAdapter,
	type WalletCandidate,
	type WalletConnection,
	type WalletTonInternalMessage,
	type WalletTonInternalMessages,
} from '$/state/wallets/adapters/types.ts'
import { buildWalletConnection } from '../walletConnectionState.ts'

type TonConnectSignMessageFeature = {
	name: 'SignMessage'
	maxMessages: number
	extraCurrencySupported?: boolean
	itemTypes?: ('ton' | 'jetton' | 'nft')[]
}

type TonConnectOtherFeature =
	| 'SendTransaction'
	| 'SignData'
	| {
		name: 'SendTransaction' | 'SignData'
	}

type TonConnectAccount = {
	address: string
	chain: string
	signMessageFeature?: TonConnectSignMessageFeature
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
			device?: {
				features: (TonConnectOtherFeature | TonConnectSignMessageFeature)[]
			}
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
	send(request:
		| {
			method: 'disconnect'
			params: []
			id: string
		}
		| {
			method: 'signMessage'
			params: [string]
			id: string
		}
	): Promise<JsonValue>
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

const tonConnectConnectionCapabilities = [
	WalletCapability.Connect,
	WalletCapability.Reconnect,
	WalletCapability.Disconnect,
	WalletCapability.ListAccounts,
] satisfies WalletCapability[]

const tonConnectCapabilities = (account?: TonConnectAccount) => [
	...tonConnectConnectionCapabilities,
	...(account?.signMessageFeature == null ? [] : [WalletCapability.SignTransaction]),
] satisfies WalletCapability[]

const tonConnectSignEnvelope = arktype({
	id: 'string',
	result: 'unknown',
	'error?': 'never',
}).or(arktype({
	id: 'string',
	error: 'unknown',
	'result?': 'never',
}))
const tonConnectSignResult = arktype({
	id: 'string',
	result: {
		internalBoc: 'string',
	},
})
const tonConnectSignError = arktype({
	id: 'string',
	error: {
		code: 'number',
		message: 'string',
	},
})

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

	const signMessageFeature = (
		event.payload.device?.features.find((feature) => (
			feature !== 'SendTransaction'
			&& feature !== 'SignData'
			&& feature.name === 'SignMessage'
		))
	) satisfies TonConnectSignMessageFeature | undefined
	const validSignMessageFeature = (
		signMessageFeature != null
		&& Number.isSafeInteger(signMessageFeature.maxMessages)
		&& signMessageFeature.maxMessages > 0
		&& (
			signMessageFeature.itemTypes == null
			|| signMessageFeature.itemTypes.includes('ton')
		)
	) ? signMessageFeature : undefined

	return {
		address: normalizeTonRawAddress(item.address),
		chain: item.network,
		signMessageFeature: validSignMessageFeature,
	}
}

const tonFriendlyAddressPattern = /^[A-Za-z0-9_-]{48}$/
const base64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
const extraCurrencyIdPattern = /^(?:0|[1-9][0-9]{0,9})$/
const maximumExtraCurrencyId = 4_294_967_295n

const retainedTonMessage = (
	message: WalletTonInternalMessage,
	feature: TonConnectSignMessageFeature
): WalletTonInternalMessage => {
	if (!tonFriendlyAddressPattern.test(message.address))
		throw new WalletAdapterPreDispatchFailure('TON message has an invalid destination address')
	if (!/^(?:0|[1-9][0-9]*)$/.test(message.amount))
		throw new WalletAdapterPreDispatchFailure('TON message has an invalid nanotON amount')
	if (message.payload != null && (!base64Pattern.test(message.payload) || message.payload.length === 0))
		throw new WalletAdapterPreDispatchFailure('TON message has an invalid payload BOC')
	if (message.stateInit != null && (!base64Pattern.test(message.stateInit) || message.stateInit.length === 0))
		throw new WalletAdapterPreDispatchFailure('TON message has an invalid state-init BOC')
	if (message.extra_currency != null && feature.extraCurrencySupported !== true)
		throw new WalletAdapterPreDispatchFailure('TON wallet did not negotiate extra currencies')
	if (message.extra_currency != null && Object.entries(message.extra_currency).some(([currencyId, amount]) => (
		!extraCurrencyIdPattern.test(currencyId)
		|| BigInt(currencyId) > maximumExtraCurrencyId
		|| !/^(?:0|[1-9][0-9]*)$/.test(amount)
	)))
		throw new WalletAdapterPreDispatchFailure('TON message has invalid extra currencies')

	return {
		address: message.address,
		amount: message.amount,
		...(message.payload != null && { payload: message.payload }),
		...(message.stateInit != null && { stateInit: message.stateInit }),
		...(message.extra_currency != null && { extra_currency: { ...message.extra_currency } }),
	}
}

const retainedTonRequest = (
	request: WalletTonInternalMessages,
	account: TonConnectAccount,
	feature: TonConnectSignMessageFeature
): WalletTonInternalMessages => {
	if (request.network !== account.chain || request.from !== account.address)
		throw new WalletAdapterPreDispatchFailure('TON signing authority does not match the active account')
	if (request.valid_until != null && (
		!Number.isSafeInteger(request.valid_until)
		|| request.valid_until <= Math.floor(Date.now() / 1_000)
	))
		throw new WalletAdapterPreDispatchFailure('TON sign-message expiry is invalid')
	if (
		request.messages.length === 0
		|| request.messages.length > feature.maxMessages
	)
		throw new WalletAdapterPreDispatchFailure('TON sign-message batch is empty or exceeds the negotiated limit')

	return {
		network: request.network,
		from: request.from,
		...(request.valid_until != null && { valid_until: request.valid_until }),
		messages: [
			retainedTonMessage(request.messages[0], feature),
			...request.messages.slice(1).map((message) => retainedTonMessage(message, feature)),
		],
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
					...(account.signMessageFeature == null ? [] : ['signMessage']),
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
				capabilities: tonConnectCapabilities(account),
			},
		],
		activeAccount: {
			namespace: 'ton',
			reference: account.chain,
			accountAddress: account.address,
			capabilities: tonConnectCapabilities(account),
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
	const requestIdByWalletId = new SvelteMap<string, number>()

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
			let discoveryInterval: ReturnType<typeof globalThis.setInterval> | undefined
			const discover = () => {
				if (typeof window === 'undefined') return

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
							...tonConnectConnectionCapabilities,
						],
					} satisfies WalletCandidate]
				})
				const nextCandidateIds = wallets.map(({ id }) => id).join('|')
				if (nextCandidateIds === candidateIds) return

				candidateIds = nextCandidateIds
				updateCandidates(wallets)
			}

			discover()
			discoveryInterval = globalThis.setInterval(discover, 100)

			return () => {
				if (discoveryInterval !== undefined) {
					globalThis.clearInterval(discoveryInterval)
					discoveryInterval = undefined
				}

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
		signTonInternalMessages: async (walletId, accountAddress, request) => {
			const bridge = bridgeByWalletId.get(walletId)
			const account = accountByWalletId.get(walletId)
			const feature = account?.signMessageFeature
			if (bridge == null || account == null || feature == null)
				throw new WalletAdapterPreDispatchFailure('TON signed messages are unavailable')
			if (account.address !== accountAddress)
				throw new WalletAdapterPreDispatchFailure('TON signing authority does not match the active account')

			const retainedRequest = retainedTonRequest(request, account, feature)
			const lifecycleVersion = lifecycleVersionByWalletId.get(walletId) ?? 0
			const requestId = String((requestIdByWalletId.get(walletId) ?? 0) + 1)
			requestIdByWalletId.set(walletId, Number(requestId))
			const response = await bridge.send({
				method: 'signMessage',
				params: [JSON.stringify(retainedRequest)],
				id: requestId,
			})

			if (
				bridgeByWalletId.get(walletId) !== bridge
				|| accountByWalletId.get(walletId) !== account
				|| lifecycleVersionByWalletId.get(walletId) !== lifecycleVersion
			)
				throw new WalletAdapterResponseAuditFailure(
					'TON signing authority changed while the wallet request was pending',
					response
				)

			const envelope = tonConnectSignEnvelope(response)
			if (envelope instanceof arktype.errors)
				throw new WalletAdapterResponseAuditFailure(
					'TON wallet response must contain exactly one result or error key',
					response
				)

			const resultResponse = tonConnectSignResult(envelope)
			const errorResponse = tonConnectSignError(envelope)
			if (!(errorResponse instanceof arktype.errors)) {
				if (errorResponse.id !== requestId)
					throw new WalletAdapterResponseAuditFailure('TON wallet returned a mismatched request ID', response)

				throw new WalletAdapterProviderRejection(
					errorResponse.error.message,
					errorResponse.error.code
				)
			}

			if (
				resultResponse instanceof arktype.errors
				|| resultResponse.id !== requestId
				|| resultResponse.result.internalBoc.length === 0
				|| !base64Pattern.test(resultResponse.result.internalBoc)
			)
				throw new WalletAdapterResponseAuditFailure('TON wallet returned a malformed signed message response', response)

			return resultResponse.result.internalBoc
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
