import {
	WalletCapability,
	WalletDiscoveryKind,
	WalletProtocol,
	WalletTransportKind,
} from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import { type as arktype } from 'arktype'
import type {
	WalletAccount,
	WalletAdapter,
	WalletCandidate,
	WalletConnection,
	WalletScope,
} from './types.ts'
import { buildWalletConnection } from '../walletConnectionState.ts'

export type WalletConnectV2RequestedScope = {
	namespace: string
	reference: string
	methods: readonly string[]
	events: readonly string[]
}

export type WalletConnectV2Namespace = {
	accounts: readonly string[]
	chains?: readonly string[]
	methods: readonly string[]
	events: readonly string[]
}

export type WalletConnectV2Session = {
	topic: string
	expiry: number
	namespaces: Readonly<Record<string, WalletConnectV2Namespace>>
}

export type WalletConnectV2ClientEvent =
	| {
		event: 'session_update'
		topic: string
		namespaces: Readonly<Record<string, WalletConnectV2Namespace>>
	}
	| {
		event: 'session_extend'
		topic: string
		expiry: number
	}
	| {
		event: 'session_event'
		topic: string
		chainId: string
		name: 'accountsChanged'
		accountAddresses: readonly string[]
	}
	| {
		event: 'session_event'
		topic: string
		chainId: string
		name: 'chainChanged'
		nextChainId: string
	}
	| {
		event: 'session_delete' | 'session_expire'
		topic: string
	}

export type WalletConnectV2Client = {
	connect(input: {
		requiredNamespaces: Readonly<Record<string, {
			chains: readonly string[]
			methods: readonly string[]
			events: readonly string[]
		}>>
		optionalNamespaces: Readonly<Record<string, {
			chains: readonly string[]
			methods: readonly string[]
			events: readonly string[]
		}>>
	}): Promise<{
		uri?: string
		approval(): Promise<WalletConnectV2Session>
	}>
	disconnect(input: {
		topic: string
		reason: {
			code: number
			message: string
		}
	}): Promise<void>
	session: {
		getAll(): readonly WalletConnectV2Session[]
	}
	listen(listener: (event: WalletConnectV2ClientEvent) => void): () => void
}

interface WalletConnectV2SignClient {
	connect(input: {
		requiredNamespaces: Record<string, {
			chains: string[]
			methods: string[]
			events: string[]
		}>
		optionalNamespaces: Record<string, {
			chains: string[]
			methods: string[]
			events: string[]
		}>
	}): Promise<{
		uri?: string
		approval(): Promise<WalletConnectV2Session>
	}>
	disconnect(input: {
		topic: string
		reason: {
			code: number
			message: string
		}
	}): Promise<void>
	session: {
		keys: string[]
		get(topic: string): WalletConnectV2Session
		getAll(): readonly WalletConnectV2Session[]
	}
	on(
		event: 'session_update',
		listener: (event: {
			topic: string
			params: {
				namespaces: Readonly<Record<string, WalletConnectV2Namespace>>
			}
		}) => void
	): void
	on(
		event: 'session_extend' | 'session_delete' | 'session_expire',
		listener: (event: {
			topic: string
		}) => void
	): void
	on(
		event: 'session_event',
		listener: (event: {
			topic: string
			params: {
				chainId: string
				event: {
					name: string
					data: JsonValue
				}
			}
		}) => void
	): void
	off(
		event: 'session_update',
		listener: (event: {
			topic: string
			params: {
				namespaces: Readonly<Record<string, WalletConnectV2Namespace>>
			}
		}) => void
	): void
	off(
		event: 'session_extend' | 'session_delete' | 'session_expire',
		listener: (event: {
			topic: string
		}) => void
	): void
	off(
		event: 'session_event',
		listener: (event: {
			topic: string
			params: {
				chainId: string
				event: {
					name: string
					data: JsonValue
				}
			}
		}) => void
	): void
}

type WalletConnectV2SessionState = {
	topic: string
	expiry: number
	scopes: WalletScope[]
	accounts: WalletAccount[]
	activeChainId?: string
	connectedAt: number
}

const WALLET_ID = 'walletconnect-v2'
const maximumTimerDelayMs = 2_147_483_647
const walletConnectAccountAddresses = arktype('string[]')
const walletConnectChainReference = arktype('string | number.integer & number.safe')

const walletConnectCapabilities = [
	WalletCapability.Connect,
	WalletCapability.Reconnect,
	WalletCapability.Disconnect,
	WalletCapability.ListAccounts,
	WalletCapability.WatchAccounts,
	WalletCapability.WatchScopes,
] satisfies WalletCapability[]

const walletConnectCandidate = {
	id: WALLET_ID,
	name: 'WalletConnect',
	icon: '',
	protocol: WalletProtocol.WalletConnectV2,
	discoveryKind: WalletDiscoveryKind.QrDeeplink,
	transportKind: WalletTransportKind.WalletConnectRelay,
	capabilities: walletConnectCapabilities,
} satisfies WalletCandidate

const parseCaip2 = (chainId: string) => {
	const match = /^([^:]+):([^:]+)$/.exec(chainId)
	if (match == null)
		throw new Error(`WalletConnect chain "${chainId}" is not a CAIP-2 ID`)

	return {
		namespace: match[1],
		reference: match[2],
	}
}

const parseCaip10 = (accountId: string) => {
	const match = /^([^:]+):([^:]+):(.+)$/.exec(accountId)
	if (match == null)
		throw new Error(`WalletConnect account "${accountId}" is not a CAIP-10 ID`)

	return {
		namespace: match[1],
		reference: match[2],
		accountAddress: match[3],
	}
}

const optionalNamespacesFromScopes = (
	requestedScopes: readonly WalletConnectV2RequestedScope[]
) => {
	const scopesByNamespace = new Map<string, {
		chains: string[]
		methods: string[]
		events: string[]
	}>()

	for (const scope of requestedScopes) {
		const chainId = `${scope.namespace}:${scope.reference}`
		parseCaip2(chainId)
		if (scope.namespace === 'bip122')
			throw new Error(
				'WalletConnect Bitcoin requires address-set session semantics'
			)

		const namespace = scopesByNamespace.get(scope.namespace)
		if (namespace == null) {
			scopesByNamespace.set(scope.namespace, {
				chains: [chainId],
				methods: [...scope.methods],
				events: [...scope.events],
			})
			continue
		}
		if (!namespace.chains.includes(chainId))
			namespace.chains.push(chainId)
		for (const method of scope.methods)
			if (!namespace.methods.includes(method))
				namespace.methods.push(method)
		for (const event of scope.events)
			if (!namespace.events.includes(event))
				namespace.events.push(event)
	}
	if (!scopesByNamespace.size)
		throw new Error('WalletConnect requires at least one explicit CAIP-2 scope')

	return Object.fromEntries(scopesByNamespace)
}

const stateFromSession = (
	session: WalletConnectV2Session,
	connectedAt: number,
	requestedChainIds: ReadonlySet<string>,
	optionalNamespaces: ReturnType<typeof optionalNamespacesFromScopes>
): WalletConnectV2SessionState => {
	const scopes: WalletScope[] = []
	const accounts: WalletAccount[] = []

	for (const [namespaceKey, namespace] of Object.entries(session.namespaces)) {
		const keyChain = namespaceKey.includes(':') ?
			parseCaip2(namespaceKey)
		:
			undefined
		const namespaceName = keyChain?.namespace ?? namespaceKey
		if (namespaceName === 'bip122')
			throw new Error(
				'WalletConnect Bitcoin requires address-set session semantics'
			)
		if (!Object.hasOwn(optionalNamespaces, namespaceName))
			throw new Error(
				`WalletConnect namespace "${namespaceKey}" exceeded requested authority`
			)
		const requestedNamespace = optionalNamespaces[namespaceName]
		if (
			namespace.methods.some((method) => !requestedNamespace.methods.includes(method))
			|| namespace.events.some((event) => !requestedNamespace.events.includes(event))
		)
			throw new Error(
				`WalletConnect namespace "${namespaceKey}" exceeded requested authority`
			)

		for (const chainId of namespace.chains ?? []) {
			const chain = parseCaip2(chainId)
			if (
				chain.namespace !== namespaceName
				|| (
					keyChain != null
					&& chain.reference !== keyChain.reference
				)
			)
				throw new Error(
					`WalletConnect chain "${chainId}" does not belong to namespace "${namespaceKey}"`
				)
			if (!requestedChainIds.has(chainId))
				throw new Error(
					`WalletConnect chain "${chainId}" was not requested`
				)
		}

		for (const accountId of namespace.accounts) {
			const account = parseCaip10(accountId)
			const chainId = `${account.namespace}:${account.reference}`
			if (
				account.namespace !== namespaceName
				|| (
					keyChain != null
					&& account.reference !== keyChain.reference
				)
			)
				throw new Error(
					`WalletConnect account "${accountId}" does not belong to namespace "${namespaceKey}"`
				)
			if (!requestedChainIds.has(chainId))
				throw new Error(
					`WalletConnect account "${accountId}" was not requested`
				)

			accounts.push({
				...account,
				capabilities: walletConnectCapabilities,
			})
			if (!scopes.some((scope) => (
				scope.namespace === account.namespace
				&& scope.reference === account.reference
			)))
				scopes.push({
					namespace: account.namespace,
					reference: account.reference,
					methods: [...namespace.methods],
					events: [...namespace.events],
				})
		}
	}
	if (!accounts.length)
		throw new Error('WalletConnect approved a session without accounts')

	return {
		topic: session.topic,
		expiry: session.expiry,
		scopes,
		accounts,
		activeChainId: accounts.length ?
			`${accounts[0].namespace}:${accounts[0].reference}`
			:
			undefined,
		connectedAt,
	}
}

export const walletConnectV2ClientFromSignClient = (
	signClient: WalletConnectV2SignClient
): WalletConnectV2Client => ({
	connect: async (input) => {
		const proposal = await signClient.connect({
			requiredNamespaces: Object.fromEntries(
				Object.entries(input.requiredNamespaces).map(([namespace, values]) => [
					namespace,
					{
						chains: [...values.chains],
						methods: [...values.methods],
						events: [...values.events],
					},
				])
			),
			optionalNamespaces: Object.fromEntries(
				Object.entries(input.optionalNamespaces).map(([namespace, values]) => [
					namespace,
					{
						chains: [...values.chains],
						methods: [...values.methods],
						events: [...values.events],
					},
				])
			),
		})

		return {
			...(proposal.uri != null && {
				uri: proposal.uri,
			}),
			approval: async () => {
				const {
					topic,
					expiry,
					namespaces,
				} = await proposal.approval()

				return {
					topic,
					expiry,
					namespaces,
				}
			},
		}
	},
	disconnect: (input) => signClient.disconnect(input),
	session: {
		getAll: () => signClient.session.getAll().map(({
			topic,
			expiry,
			namespaces,
		}) => ({
			topic,
			expiry,
			namespaces,
		})),
	},
	listen: (listener) => {
		const sessionUpdate = ({
			topic,
			params,
		}: {
			topic: string
			params: {
				namespaces: Readonly<Record<string, WalletConnectV2Namespace>>
			}
		}) => {
			listener({
				event: 'session_update',
				topic,
				namespaces: params.namespaces,
			})
		}
		const sessionExtend = ({
			topic,
		}: {
			topic: string
		}) => {
			if (!signClient.session.keys.includes(topic)) return

			listener({
				event: 'session_extend',
				topic,
				expiry: signClient.session.get(topic).expiry,
			})
		}
		const sessionEvent = ({
			topic,
			params,
		}: {
			topic: string
			params: {
				chainId: string
				event: {
					name: string
					data: JsonValue
				}
			}
		}) => {
			if (params.event.name === 'accountsChanged') {
				const accountAddresses = walletConnectAccountAddresses(params.event.data)
				if (accountAddresses instanceof arktype.errors) return

				listener({
					event: 'session_event',
					topic,
					chainId: params.chainId,
					name: 'accountsChanged',
					accountAddresses,
				})
				return
			}
			if (params.event.name !== 'chainChanged') return

			const chainReference = walletConnectChainReference(params.event.data)
			if (chainReference instanceof arktype.errors) return

			const chain = parseCaip2(params.chainId)
			let nextChainId: string
			try {
				if (String(chainReference).includes(':')) {
					const nextChain = parseCaip2(String(chainReference))
					if (nextChain.namespace !== chain.namespace) return

					nextChainId = String(chainReference)
				}
				else {
					nextChainId = `${chain.namespace}:${
						chain.namespace === 'eip155' ?
							BigInt(chainReference).toString()
							:
							chainReference
					}`
				}
			}
			catch {
				return
			}
			listener({
				event: 'session_event',
				topic,
				chainId: params.chainId,
				name: 'chainChanged',
				nextChainId,
			})
		}
		const sessionDelete = ({
			topic,
		}: {
			topic: string
		}) => {
			listener({
				event: 'session_delete',
				topic,
			})
		}
		const sessionExpire = ({
			topic,
		}: {
			topic: string
		}) => {
			listener({
				event: 'session_expire',
				topic,
			})
		}

		signClient.on('session_update', sessionUpdate)
		signClient.on('session_extend', sessionExtend)
		signClient.on('session_event', sessionEvent)
		signClient.on('session_delete', sessionDelete)
		signClient.on('session_expire', sessionExpire)

		return () => {
			signClient.off('session_update', sessionUpdate)
			signClient.off('session_extend', sessionExtend)
			signClient.off('session_event', sessionEvent)
			signClient.off('session_delete', sessionDelete)
			signClient.off('session_expire', sessionExpire)
		}
	},
})

const connectedConnection = (
	state: WalletConnectV2SessionState
): WalletConnection => (
	buildWalletConnection({
		connectionKey: state.topic,
		walletId: WALLET_ID,
		status: BlockheadConnectionStatus.Connected,
		protocol: WalletProtocol.WalletConnectV2,
		transportKind: WalletTransportKind.WalletConnectRelay,
		scopes: state.scopes,
		accounts: state.accounts,
		activeAccount: state.accounts.find((account) => (
			`${account.namespace}:${account.reference}` === state.activeChainId
		)),
		selected: true,
		connectedAt: state.connectedAt,
		sessionTopic: state.topic,
	})
)

const disconnectedConnection = (
	state: {
		topic: string
		scopes: WalletScope[]
		connectedAt?: number
	},
	error?: string
): WalletConnection => (
	buildWalletConnection({
		connectionKey: state.topic,
		walletId: WALLET_ID,
		status: error == null ?
			BlockheadConnectionStatus.Disconnected
		:
			BlockheadConnectionStatus.Error,
		protocol: WalletProtocol.WalletConnectV2,
		transportKind: WalletTransportKind.WalletConnectRelay,
		scopes: state.scopes,
		accounts: [],
		...(state.connectedAt != null && { connectedAt: state.connectedAt }),
		disconnectedAt: Date.now(),
		sessionTopic: state.topic,
		...(error != null && { error }),
	})
)

const validSessionExpiry = (expiry: number) => (
	Number.isSafeInteger(expiry)
	&& expiry * 1_000 > Date.now()
)

export const createWalletConnectV2Adapter = ({
	client,
	requestedScopes,
	onDisplayUri,
}: {
	client: WalletConnectV2Client
	requestedScopes: readonly WalletConnectV2RequestedScope[]
	onDisplayUri?: (uri: string | undefined) => void
}): WalletAdapter => {
	const optionalNamespaces = optionalNamespacesFromScopes(requestedScopes)
	const requestedChainIds = new Set(
		Object.values(optionalNamespaces).flatMap(({ chains }) => chains)
	)
	const sessionStateByTopic = new Map<string, WalletConnectV2SessionState>()
	const subscribersByTopic = new Map<
		string,
		Set<(connection: WalletConnection) => void>
	>()
	const expiryTimerByTopic = new Map<
		string,
		ReturnType<typeof globalThis.setTimeout>
	>()
	let stopClientEvents = () => {}
	let started = false
	let connectAttempt = 0
	let displayUriAttempt: number | undefined
	let updateWalletConnectCandidates: ((candidates: WalletCandidate[]) => void) | undefined

	const clearExpiryTimer = (topic: string) => {
		const timer = expiryTimerByTopic.get(topic)
		if (timer == null) return

		globalThis.clearTimeout(timer)
		expiryTimerByTopic.delete(topic)
	}

	const terminateSession = (
		topic: string,
		error?: string
	) => {
		const state = sessionStateByTopic.get(topic)
		if (state == null) return

		clearExpiryTimer(topic)
		sessionStateByTopic.delete(topic)
		const subscribers = subscribersByTopic.get(topic)
		if (subscribers == null) return

		const connection = disconnectedConnection(state, error)
		for (const updateConnection of subscribers)
			updateConnection(connection)
		subscribersByTopic.delete(topic)
	}

	const scheduleExpiry = (state: WalletConnectV2SessionState) => {
		clearExpiryTimer(state.topic)
		expiryTimerByTopic.set(
			state.topic,
			globalThis.setTimeout(
				() => {
					const currentState = sessionStateByTopic.get(state.topic)
					if (
						currentState == null
						|| currentState.expiry !== state.expiry
					) return

					if (validSessionExpiry(currentState.expiry)) {
						scheduleExpiry(currentState)
						return
					}

					terminateSession(
						currentState.topic,
						'WalletConnect session expired'
					)
				},
				Math.min(
					state.expiry * 1_000 - Date.now(),
					maximumTimerDelayMs
				)
			)
		)
	}

	const clearDisplayedUri = (attempt?: number) => {
		if (
			displayUriAttempt == null
			|| (
				attempt != null
				&& displayUriAttempt !== attempt
			)
		) return

		displayUriAttempt = undefined
		onDisplayUri?.(undefined)
		updateWalletConnectCandidates?.([walletConnectCandidate])
	}

	const disconnectRejectedSession = async (
		session: WalletConnectV2Session,
		message: string
	) => {
		try {
			await client.disconnect({
				topic: session.topic,
				reason: {
					code: 6000,
					message,
				},
			})
		}
		catch {}
	}

	return {
		id: WALLET_ID,
		start: (updateCandidates) => {
			started = true
			updateWalletConnectCandidates = updateCandidates

			for (const session of client.session.getAll()) {
				if (!validSessionExpiry(session.expiry))
					continue

				try {
					const state = stateFromSession(
						session,
						Date.now(),
						requestedChainIds,
						optionalNamespaces
					)
					sessionStateByTopic.set(session.topic, state)
					scheduleExpiry(state)
				}
				catch {}
			}
			updateCandidates([walletConnectCandidate])

			stopClientEvents = client.listen((event) => {
				const state = sessionStateByTopic.get(event.topic)
				if (state == null) return

				if (event.event === 'session_update') {
					let nextState: WalletConnectV2SessionState
					try {
						nextState = stateFromSession(
							{
								topic: state.topic,
								expiry: state.expiry,
								namespaces: event.namespaces,
							},
							state.connectedAt,
							requestedChainIds,
							optionalNamespaces
						)
					}
					catch {
						return
					}

					if (
						state.activeChainId != null
						&& nextState.accounts.some((account) => (
							`${account.namespace}:${account.reference}` === state.activeChainId
						))
					)
						nextState.activeChainId = state.activeChainId

					sessionStateByTopic.set(event.topic, nextState)
					for (const updateConnection of subscribersByTopic.get(event.topic) ?? [])
						updateConnection(connectedConnection(nextState))
					return
				}

				if (event.event === 'session_extend') {
					if (
						event.expiry <= state.expiry
						|| !validSessionExpiry(event.expiry)
					) return

					state.expiry = event.expiry
					scheduleExpiry(state)
					return
				}

				if (event.event === 'session_event') {
					if (event.name === 'accountsChanged') {
						let chain: ReturnType<typeof parseCaip2>
						try {
							chain = parseCaip2(event.chainId)
						}
						catch {
							return
						}
						if (
							!state.scopes.some((scope) => (
								scope.namespace === chain.namespace
								&& scope.reference === chain.reference
							))
							|| event.accountAddresses.some((accountAddress) => !accountAddress.length)
						) return

						state.accounts = [
							...state.accounts.filter((account) => (
								account.namespace !== chain.namespace
								|| account.reference !== chain.reference
							)),
							...event.accountAddresses.map((accountAddress) => ({
								...chain,
								accountAddress,
								capabilities: walletConnectCapabilities,
							})),
						]
						if (state.activeChainId == null)
							state.activeChainId = event.chainId
						if (!state.accounts.some((account) => (
							`${account.namespace}:${account.reference}` === state.activeChainId
						)))
							state.activeChainId = state.accounts.length ?
								`${state.accounts[0].namespace}:${state.accounts[0].reference}`
								:
								undefined
					}
					else {
						let eventChain: ReturnType<typeof parseCaip2>
						let nextChain: ReturnType<typeof parseCaip2>
						try {
							eventChain = parseCaip2(event.chainId)
							nextChain = parseCaip2(event.nextChainId)
						}
						catch {
							return
						}
						if (
							!state.scopes.some((scope) => (
								scope.namespace === eventChain.namespace
								&& scope.reference === eventChain.reference
							))
							|| !state.scopes.some((scope) => (
								scope.namespace === nextChain.namespace
								&& scope.reference === nextChain.reference
							))
						) return

						state.activeChainId = event.nextChainId
					}

					for (const updateConnection of subscribersByTopic.get(event.topic) ?? [])
						updateConnection(connectedConnection(state))
					return
				}

				terminateSession(
					event.topic,
					event.event === 'session_expire' ?
						'WalletConnect session expired'
						:
						undefined
				)
			})

			return () => {
				started = false
				connectAttempt += 1
				clearDisplayedUri()
				stopClientEvents()
				stopClientEvents = () => {}
				for (const topic of expiryTimerByTopic.keys())
					clearExpiryTimer(topic)
				sessionStateByTopic.clear()
				subscribersByTopic.clear()
				updateWalletConnectCandidates = undefined
			}
		},
		connect: async (walletId) => {
			if (!started || walletId !== WALLET_ID) return undefined

			const attempt = ++connectAttempt
			clearDisplayedUri()
			const proposal = await client.connect({
				requiredNamespaces: {},
				optionalNamespaces,
			})
			if (attempt !== connectAttempt)
				throw new Error('WalletConnect connection request was superseded')

			if (proposal.uri != null) {
				displayUriAttempt = attempt
				onDisplayUri?.(proposal.uri)
				updateWalletConnectCandidates?.([{
					...walletConnectCandidate,
					connectionUri: proposal.uri,
				}])
			}

			let session: WalletConnectV2Session
			try {
				session = await proposal.approval()
			}
			finally {
				clearDisplayedUri(attempt)
			}

			if (attempt !== connectAttempt) {
				await disconnectRejectedSession(
					session,
					'WalletConnect connection request was superseded'
				)
				throw new Error('WalletConnect connection request was superseded')
			}
			if (!validSessionExpiry(session.expiry)) {
				await disconnectRejectedSession(
					session,
					'WalletConnect approved an expired session'
				)
				throw new Error('WalletConnect approved an expired session')
			}

			let state: WalletConnectV2SessionState
			try {
				state = stateFromSession(
					session,
					Date.now(),
					requestedChainIds,
					optionalNamespaces
				)
			}
			catch (error) {
				await disconnectRejectedSession(
					session,
					error instanceof Error ?
						error.message
						:
						'WalletConnect approved an invalid session'
				)
				throw error
			}
			sessionStateByTopic.set(session.topic, state)
			scheduleExpiry(state)
			return connectedConnection(state)
		},
		disconnect: async (walletId, connectionKey) => {
			if (
				walletId !== WALLET_ID
				|| connectionKey == null
				|| !sessionStateByTopic.has(connectionKey)
			) return

			await client.disconnect({
				topic: connectionKey,
				reason: {
					code: 6000,
					message: 'User disconnected',
				},
			})
			terminateSession(connectionKey)
		},
		subscribeConnection: (walletId, updateConnection, connectionKey) => {
			if (walletId !== WALLET_ID || connectionKey == null)
				return () => {}

			const state = sessionStateByTopic.get(connectionKey)
			if (state == null) {
				updateConnection(disconnectedConnection({
					topic: connectionKey,
					scopes: [],
				}))
				return () => {}
			}
			if (!validSessionExpiry(state.expiry)) {
				terminateSession(
					connectionKey,
					'WalletConnect session expired'
				)
				updateConnection(disconnectedConnection(
					state,
					'WalletConnect session expired'
				))
				return () => {}
			}

			const subscribers = subscribersByTopic.get(connectionKey) ?? new Set()
			subscribers.add(updateConnection)
			subscribersByTopic.set(connectionKey, subscribers)

			return () => {
				subscribers.delete(updateConnection)
				if (!subscribers.size)
					subscribersByTopic.delete(connectionKey)
			}
		},
	}
}
