import { afterEach, describe, expect, it, vi } from 'vitest'

import {
	WalletCapability,
	WalletDiscoveryKind,
	WalletProtocol,
	WalletTransportKind,
} from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import {
	createWalletConnectV2Adapter,
	type WalletConnectV2Client,
	type WalletConnectV2ClientEvent,
	type WalletConnectV2Session,
	walletConnectV2ClientFromSignClient,
} from './walletConnectV2.ts'
import type { WalletCandidate, WalletConnection } from './types.ts'

const eip155Session = (
	topic = 'session-topic',
	expiry = Math.floor(Date.now() / 1_000) + 3_600
): WalletConnectV2Session => ({
	topic,
	expiry,
	namespaces: {
		eip155: {
			accounts: [
				'eip155:1:0x1111111111111111111111111111111111111111',
				'eip155:137:0x2222222222222222222222222222222222222222',
			],
			chains: [
				'eip155:1',
				'eip155:137',
			],
			methods: [
				'personal_sign',
				'eth_sendTransaction',
			],
			events: [
				'accountsChanged',
				'chainChanged',
			],
		},
	},
})

const requestedScopes = [
	{
		namespace: 'eip155',
		reference: '1',
		methods: [
			'personal_sign',
			'eth_sendTransaction',
		],
		events: [
			'accountsChanged',
			'chainChanged',
		],
	},
	{
		namespace: 'eip155',
		reference: '137',
		methods: [
			'personal_sign',
			'eth_sendTransaction',
		],
		events: [
			'accountsChanged',
			'chainChanged',
		],
	},
] as const

const createClient = ({
	sessions = [],
	session = eip155Session(),
	uri = 'wc:proposal@2',
}: {
	sessions?: WalletConnectV2Session[]
	session?: WalletConnectV2Session
	uri?: string
} = {}) => {
	const listeners = new Set<(event: WalletConnectV2ClientEvent) => void>()
	const approval = Promise.withResolvers<WalletConnectV2Session>()
	const client = {
		connect: vi.fn(async () => ({
			uri,
			approval: () => approval.promise,
		})),
		disconnect: vi.fn(async () => {}),
		session: {
			getAll: () => sessions,
		},
		listen: vi.fn((listener: (event: WalletConnectV2ClientEvent) => void) => {
			listeners.add(listener)

			return () => listeners.delete(listener)
		}),
	} satisfies WalletConnectV2Client

	return {
		client,
		emit: (event: WalletConnectV2ClientEvent) => {
			for (const listener of listeners)
				listener(event)
		},
		approve: () => approval.resolve(session),
		reject: (error: Error) => approval.reject(error),
	}
}

describe('WalletConnect v2 adapter', () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	it('translates the official Sign Client lifecycle into the adapter client boundary', async () => {
		const session = eip155Session()
		const on = vi.fn()
		const off = vi.fn()
		const disconnect = vi.fn(async () => {})
		const connect = vi.fn(async () => ({
			uri: 'wc:official@2',
			approval: async () => session,
		}))
		const client = walletConnectV2ClientFromSignClient({
			connect,
			disconnect,
			session: {
				keys: [session.topic],
				get: () => ({
					...session,
					expiry: session.expiry + 600,
				}),
				getAll: () => [session],
			},
			on,
			off,
		})

		await expect(client.connect({
			requiredNamespaces: {},
			optionalNamespaces: {
				eip155: {
					chains: ['eip155:1'],
					methods: ['personal_sign'],
					events: [
						'accountsChanged',
						'chainChanged',
					],
				},
			},
		})).resolves.toMatchObject({
			uri: 'wc:official@2',
		})
		expect(connect).toHaveBeenCalledWith({
			requiredNamespaces: {},
			optionalNamespaces: {
				eip155: {
					chains: ['eip155:1'],
					methods: ['personal_sign'],
					events: [
						'accountsChanged',
						'chainChanged',
					],
				},
			},
		})
		expect(client.session.getAll()).toEqual([session])

		const events: WalletConnectV2ClientEvent[] = []
		const stop = client.listen((event) => events.push(event))
		expect(on.mock.calls.map(([event]) => event)).toEqual([
			'session_update',
			'session_extend',
			'session_event',
			'session_delete',
			'session_expire',
		])

		on.mock.calls[0]?.[1]({
			topic: session.topic,
			params: {
				namespaces: session.namespaces,
			},
		})
		on.mock.calls[1]?.[1]({
			topic: session.topic,
		})
		on.mock.calls[2]?.[1]({
			topic: session.topic,
			params: {
				chainId: 'eip155:1',
				event: {
					name: 'accountsChanged',
					data: [
						'0x3333333333333333333333333333333333333333',
					],
				},
			},
		})
		on.mock.calls[2]?.[1]({
			topic: session.topic,
			params: {
				chainId: 'eip155:1',
				event: {
					name: 'chainChanged',
					data: '0x89',
				},
			},
		})
		on.mock.calls[3]?.[1]({
			topic: session.topic,
		})
		on.mock.calls[4]?.[1]({
			topic: session.topic,
		})
		expect(events).toEqual([
			{
				event: 'session_update',
				topic: session.topic,
				namespaces: session.namespaces,
			},
			{
				event: 'session_extend',
				topic: session.topic,
				expiry: session.expiry + 600,
			},
			{
				event: 'session_event',
				topic: session.topic,
				chainId: 'eip155:1',
				name: 'accountsChanged',
				accountAddresses: [
					'0x3333333333333333333333333333333333333333',
				],
			},
			{
				event: 'session_event',
				topic: session.topic,
				chainId: 'eip155:1',
				name: 'chainChanged',
				nextChainId: 'eip155:137',
			},
			{
				event: 'session_delete',
				topic: session.topic,
			},
			{
				event: 'session_expire',
				topic: session.topic,
			},
		])

		await client.disconnect({
			topic: session.topic,
			reason: {
				code: 6000,
				message: 'User disconnected',
			},
		})
		stop()
		expect(disconnect).toHaveBeenCalledTimes(1)
		expect(off).toHaveBeenCalledTimes(5)
	})

	it('requests exact scopes as optional account access and owns the QR through exact-topic approval', async () => {
		const mock = createClient()
		const candidates: WalletCandidate[][] = []
		const displayUri = vi.fn()
		const adapter = createWalletConnectV2Adapter({
			client: mock.client,
			requestedScopes,
			onDisplayUri: displayUri,
		})
		const stop = adapter.start((nextCandidates) => candidates.push(nextCandidates))
		const connectionPromise = adapter.connect('walletconnect-v2')

		await vi.waitFor(() => expect(displayUri).toHaveBeenCalledWith('wc:proposal@2'))
		expect(candidates.at(-1)?.at(0)).toMatchObject({
			id: 'walletconnect-v2',
			connectionUri: 'wc:proposal@2',
		})
		expect(mock.client.connect).toHaveBeenCalledWith({
			requiredNamespaces: {},
			optionalNamespaces: {
				eip155: {
					chains: [
						'eip155:1',
						'eip155:137',
					],
					methods: [
						'personal_sign',
						'eth_sendTransaction',
					],
					events: [
						'accountsChanged',
						'chainChanged',
					],
				},
			},
		})
		expect(candidates.at(0)).toEqual([
			{
				id: 'walletconnect-v2',
				name: 'WalletConnect',
				icon: '',
				protocol: WalletProtocol.WalletConnectV2,
				discoveryKind: WalletDiscoveryKind.QrDeeplink,
				transportKind: WalletTransportKind.WalletConnectRelay,
				capabilities: [
					WalletCapability.Connect,
					WalletCapability.Reconnect,
					WalletCapability.Disconnect,
					WalletCapability.ListAccounts,
					WalletCapability.WatchAccounts,
					WalletCapability.WatchScopes,
				],
			},
		])

		mock.approve()
		await expect(connectionPromise).resolves.toMatchObject({
			connectionKey: 'session-topic',
			walletId: 'walletconnect-v2',
			status: BlockheadConnectionStatus.Connected,
			sessionTopic: 'session-topic',
			scopes: [
				expect.objectContaining({
					namespace: 'eip155',
					reference: '1',
				}),
				expect.objectContaining({
					namespace: 'eip155',
					reference: '137',
				}),
			],
		})
		expect((await connectionPromise)?.accounts.every((account) => (
			!account.capabilities.includes(WalletCapability.SignMessage)
		))).toBe(true)
		expect(displayUri.mock.calls).toEqual([
			['wc:proposal@2'],
			[undefined],
		])
		expect(candidates.at(-1)?.at(0)).not.toHaveProperty('connectionUri')

		stop()
	})

	it('accepts only the approved CAIP-10 subset rather than widening from session chains', async () => {
		const mock = createClient({
			session: {
				topic: 'subset-topic',
				expiry: Math.floor(Date.now() / 1_000) + 3_600,
				namespaces: {
					eip155: {
						accounts: [
							'eip155:137:0x2222222222222222222222222222222222222222',
						],
						chains: [
							'eip155:1',
							'eip155:137',
						],
						methods: [],
						events: [],
					},
				},
			},
		})
		const adapter = createWalletConnectV2Adapter({
			client: mock.client,
			requestedScopes,
		})
		adapter.start(() => {})
		const connection = adapter.connect('walletconnect-v2')
		mock.approve()

		await expect(connection).resolves.toMatchObject({
			connectionKey: 'subset-topic',
			scopes: [{
				namespace: 'eip155',
				reference: '137',
				methods: [],
				events: [],
			}],
			accounts: [{
				namespace: 'eip155',
				reference: '137',
				accountAddress: '0x2222222222222222222222222222222222222222',
			}],
		})
	})

	it('disconnects a settled session that approves no accounts', async () => {
		const mock = createClient({
			session: {
				topic: 'empty-topic',
				expiry: Math.floor(Date.now() / 1_000) + 3_600,
				namespaces: {
					eip155: {
						accounts: [],
						chains: ['eip155:1'],
						methods: [],
						events: [],
					},
				},
			},
		})
		const adapter = createWalletConnectV2Adapter({
			client: mock.client,
			requestedScopes,
		})
		adapter.start(() => {})
		const connection = adapter.connect('walletconnect-v2')
		mock.approve()

		await expect(connection).rejects.toThrow(
			'WalletConnect approved a session without accounts'
		)
		expect(mock.client.disconnect).toHaveBeenCalledWith({
			topic: 'empty-topic',
			reason: {
				code: 6000,
				message: 'WalletConnect approved a session without accounts',
			},
		})
	})

	it('clears a rejected or invalid approval and tears down an invalid session', async () => {
		const displayUri = vi.fn()
		const rejected = createClient()
		const rejectedCandidates: WalletCandidate[][] = []
		const rejectedAdapter = createWalletConnectV2Adapter({
			client: rejected.client,
			requestedScopes,
			onDisplayUri: displayUri,
		})
		rejectedAdapter.start((candidates) => rejectedCandidates.push(candidates))
		const rejectedConnection = rejectedAdapter.connect('walletconnect-v2')
		await vi.waitFor(() => expect(displayUri).toHaveBeenCalledTimes(1))
		expect(rejectedCandidates.at(-1)?.at(0).connectionUri).toBe('wc:proposal@2')
		const rejection = new Error('User rejected WalletConnect proposal')
		rejected.reject(rejection)
		await expect(rejectedConnection).rejects.toBe(rejection)
		expect(rejectedCandidates.at(-1)?.at(0)).not.toHaveProperty('connectionUri')

		const expired = createClient({
			session: eip155Session(
				'expired-approval',
				Math.floor(Date.now() / 1_000)
			),
		})
		const expiredAdapter = createWalletConnectV2Adapter({
			client: expired.client,
			requestedScopes,
			onDisplayUri: displayUri,
		})
		expiredAdapter.start(() => {})
		const expiredConnection = expiredAdapter.connect('walletconnect-v2')
		await vi.waitFor(() => expect(displayUri).toHaveBeenCalledTimes(3))
		expired.approve()
		await expect(expiredConnection).rejects.toThrow(
			'WalletConnect approved an expired session'
		)
		expect(expired.client.disconnect).toHaveBeenCalledWith({
			topic: 'expired-approval',
			reason: {
				code: 6000,
				message: 'WalletConnect approved an expired session',
			},
		})
		expect(displayUri.mock.calls).toEqual([
			['wc:proposal@2'],
			[undefined],
			['wc:proposal@2'],
			[undefined],
		])
	})

	it('restores by exact topic and reconciles approved account and chain events', () => {
		const session = eip155Session('event-topic')
		const mock = createClient({ sessions: [session] })
		const adapter = createWalletConnectV2Adapter({
			client: mock.client,
			requestedScopes,
		})
		adapter.start(() => {})
		const updates: WalletConnection[] = []
		adapter.subscribeConnection(
			'walletconnect-v2',
			(connection) => updates.push(connection),
			'event-topic'
		)

		expect(updates).toEqual([])
		expect(mock.client.connect).not.toHaveBeenCalled()

		mock.emit({
			event: 'session_event',
			topic: 'event-topic',
			chainId: 'eip155:1',
			name: 'chainChanged',
			nextChainId: 'eip155:137',
		})
		expect(updates.at(-1)).toMatchObject({
			connectionKey: 'event-topic',
			walletId: 'walletconnect-v2',
			sessionTopic: 'event-topic',
		})
		mock.emit({
			event: 'session_event',
			topic: 'event-topic',
			chainId: 'eip155:137',
			name: 'accountsChanged',
			accountAddresses: [
				'0x3333333333333333333333333333333333333333',
				'0x4444444444444444444444444444444444444444',
			],
		})
		expect(updates.at(-1)).toMatchObject({
			accounts: [
				expect.objectContaining({
					reference: '1',
				}),
				expect.objectContaining({
					reference: '137',
					accountAddress: '0x3333333333333333333333333333333333333333',
				}),
				expect.objectContaining({
					reference: '137',
					accountAddress: '0x4444444444444444444444444444444444444444',
				}),
			],
			activeAccount: {
				reference: '137',
				accountAddress: '0x3333333333333333333333333333333333333333',
			},
		})

		const updateCount = updates.length
		mock.emit({
			event: 'session_event',
			topic: 'event-topic',
			chainId: 'eip155:1',
			name: 'chainChanged',
			nextChainId: 'eip155:999',
		})
		expect(updates).toHaveLength(updateCount)
	})

	it('reschedules a restored session extension and expires it once', () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date('2026-07-22T12:00:00Z'))
		const now = Math.floor(Date.now() / 1_000)
		const mock = createClient({
			sessions: [eip155Session('timed-topic', now + 10)],
		})
		const adapter = createWalletConnectV2Adapter({
			client: mock.client,
			requestedScopes,
		})
		adapter.start(() => {})
		const updates: WalletConnection[] = []
		adapter.subscribeConnection(
			'walletconnect-v2',
			(connection) => updates.push(connection),
			'timed-topic'
		)
		mock.emit({
			event: 'session_extend',
			topic: 'timed-topic',
			expiry: now + 20,
		})

		vi.advanceTimersByTime(10_000)
		expect(updates).toEqual([])
		vi.advanceTimersByTime(10_000)
		expect(updates.at(-1)).toMatchObject({
			status: BlockheadConnectionStatus.Disconnected,
			error: 'WalletConnect session expired',
		})

		const updateCount = updates.length
		mock.emit({
			event: 'session_update',
			topic: 'timed-topic',
			namespaces: eip155Session().namespaces,
		})
		mock.emit({
			event: 'session_expire',
			topic: 'timed-topic',
		})
		expect(updates).toHaveLength(updateCount)
	})

	it('keeps a newer QR owned when a superseded approval completes late', async () => {
		const mock = createClient()
		const firstApproval = Promise.withResolvers<WalletConnectV2Session>()
		const secondApproval = Promise.withResolvers<WalletConnectV2Session>()
		mock.client.connect
			.mockResolvedValueOnce({
				uri: 'wc:first@2',
				approval: () => firstApproval.promise,
			})
			.mockResolvedValueOnce({
				uri: 'wc:second@2',
				approval: () => secondApproval.promise,
			})
		const displayUri = vi.fn()
		const candidates: WalletCandidate[][] = []
		const adapter = createWalletConnectV2Adapter({
			client: mock.client,
			requestedScopes,
			onDisplayUri: displayUri,
		})
		adapter.start((nextCandidates) => candidates.push(nextCandidates))
		const firstConnection = adapter.connect('walletconnect-v2')
		await vi.waitFor(() => expect(displayUri).toHaveBeenCalledWith('wc:first@2'))
		const secondConnection = adapter.connect('walletconnect-v2')
		await vi.waitFor(() => expect(displayUri).toHaveBeenCalledWith('wc:second@2'))

		firstApproval.resolve(eip155Session('first-topic'))
		await expect(firstConnection).rejects.toThrow(
			'WalletConnect connection request was superseded'
		)
		expect(displayUri.mock.calls).toEqual([
			['wc:first@2'],
			[undefined],
			['wc:second@2'],
		])

		secondApproval.resolve(eip155Session('second-topic'))
		await expect(secondConnection).resolves.toMatchObject({
			connectionKey: 'second-topic',
		})
		expect(displayUri.mock.calls.at(-1)).toEqual([undefined])
		expect(candidates.map(([candidate]) => candidate.connectionUri)).toEqual([
			undefined,
			'wc:first@2',
			undefined,
			'wc:second@2',
			undefined,
		])
		expect(mock.client.disconnect).toHaveBeenCalledWith({
			topic: 'first-topic',
			reason: {
				code: 6000,
				message: 'WalletConnect connection request was superseded',
			},
		})
	})

	it('suppresses a proposal URI that arrives after stop', async () => {
		const visible = createClient()
		const visibleCandidates: WalletCandidate[][] = []
		const visibleAdapter = createWalletConnectV2Adapter({
			client: visible.client,
			requestedScopes,
		})
		const stopVisible = visibleAdapter.start((candidates) => visibleCandidates.push(candidates))
		const visibleConnection = visibleAdapter.connect('walletconnect-v2')
		await vi.waitFor(() => expect(
			visibleCandidates.at(-1)?.at(0).connectionUri
		).toBe('wc:proposal@2'))
		stopVisible()
		expect(visibleCandidates.at(-1)?.at(0)).not.toHaveProperty('connectionUri')
		visible.approve()
		await expect(visibleConnection).rejects.toThrow(
			'WalletConnect connection request was superseded'
		)

		const proposal = Promise.withResolvers<Awaited<
			ReturnType<WalletConnectV2Client['connect']>
		>>()
		const mock = createClient()
		mock.client.connect.mockImplementationOnce(() => proposal.promise)
		const displayUri = vi.fn()
		const adapter = createWalletConnectV2Adapter({
			client: mock.client,
			requestedScopes,
			onDisplayUri: displayUri,
		})
		const stop = adapter.start(() => {})
		const connection = adapter.connect('walletconnect-v2')
		stop()
		proposal.resolve({
			uri: 'wc:stale@2',
			approval: () => Promise.resolve(eip155Session('stale-topic')),
		})

		await expect(connection).rejects.toThrow(
			'WalletConnect connection request was superseded'
		)
		expect(displayUri).not.toHaveBeenCalled()
	})

	it('disconnects one topic, disposes its subscribers, and ignores late events', async () => {
		const deletedSession = eip155Session('deleted-topic')
		const disconnectedSession = eip155Session('disconnect-topic')
		const mock = createClient({
			sessions: [
				deletedSession,
				disconnectedSession,
			],
		})
		const adapter = createWalletConnectV2Adapter({
			client: mock.client,
			requestedScopes,
		})
		adapter.start(() => {})
		const deletedUpdates: WalletConnection[] = []
		const disconnectedUpdates: WalletConnection[] = []
		adapter.subscribeConnection(
			'walletconnect-v2',
			(connection) => deletedUpdates.push(connection),
			'deleted-topic'
		)
		adapter.subscribeConnection(
			'walletconnect-v2',
			(connection) => disconnectedUpdates.push(connection),
			'disconnect-topic'
		)

		mock.emit({
			event: 'session_delete',
			topic: 'deleted-topic',
		})
		expect(deletedUpdates.at(-1)?.status).toBe(
			BlockheadConnectionStatus.Disconnected
		)
		const deletedUpdateCount = deletedUpdates.length
		mock.emit({
			event: 'session_update',
			topic: 'deleted-topic',
			namespaces: deletedSession.namespaces,
		})
		expect(deletedUpdates).toHaveLength(deletedUpdateCount)

		await adapter.disconnect('walletconnect-v2', 'disconnect-topic')
		expect(disconnectedUpdates.at(-1)?.status).toBe(
			BlockheadConnectionStatus.Disconnected
		)
		const disconnectedUpdateCount = disconnectedUpdates.length
		mock.emit({
			event: 'session_update',
			topic: 'disconnect-topic',
			namespaces: disconnectedSession.namespaces,
		})
		expect(disconnectedUpdates).toHaveLength(disconnectedUpdateCount)
		expect(mock.client.disconnect).toHaveBeenCalledWith({
			topic: 'disconnect-topic',
			reason: {
				code: 6000,
				message: 'User disconnected',
			},
		})
	})

	it('rejects invalid or unsupported scope authority before proposing', () => {
		expect(() => createWalletConnectV2Adapter({
			client: createClient().client,
			requestedScopes: [
				{
					namespace: 'eip155',
					reference: '1:137',
					methods: [],
					events: [],
				},
			],
		})).toThrow(
			'WalletConnect chain "eip155:1:137" is not a CAIP-2 ID'
		)
		expect(() => createWalletConnectV2Adapter({
			client: createClient().client,
			requestedScopes: [{
				namespace: 'bip122',
				reference: '000000000019d6689c085ae165831e93',
				methods: [],
				events: [],
			}],
		})).toThrow(
			'WalletConnect Bitcoin requires address-set session semantics'
		)
	})

	it('rejects approved accounts outside the optional proposal authority', async () => {
		const mock = createClient({
			session: {
				topic: 'widened-topic',
				expiry: Math.floor(Date.now() / 1_000) + 3_600,
				namespaces: {
					eip155: {
						accounts: [
							'eip155:10:0x3333333333333333333333333333333333333333',
						],
						methods: [],
						events: [],
					},
				},
			},
		})
		const adapter = createWalletConnectV2Adapter({
			client: mock.client,
			requestedScopes,
		})
		adapter.start(() => {})
		const connection = adapter.connect('walletconnect-v2')
		mock.approve()

		await expect(connection).rejects.toThrow(
			'WalletConnect account "eip155:10:0x3333333333333333333333333333333333333333" was not requested'
		)
		expect(mock.client.disconnect).toHaveBeenCalledWith({
			topic: 'widened-topic',
			reason: {
				code: 6000,
				message: 'WalletConnect account "eip155:10:0x3333333333333333333333333333333333333333" was not requested',
			},
		})
	})

	it('rejects approved methods and events outside the optional proposal authority', async () => {
		const mock = createClient({
			session: {
				...eip155Session(),
				topic: 'widened-capabilities-topic',
				namespaces: {
					eip155: {
						...eip155Session().namespaces.eip155,
						methods: [
							'personal_sign',
							'wallet_sendCalls',
						],
						events: [
							'accountsChanged',
							'chainChanged',
						],
					},
				},
			},
		})
		const adapter = createWalletConnectV2Adapter({
			client: mock.client,
			requestedScopes,
		})
		adapter.start(() => {})
		const connection = adapter.connect('walletconnect-v2')
		mock.approve()

		await expect(connection).rejects.toThrow(
			'WalletConnect namespace "eip155" exceeded requested authority'
		)
		expect(mock.client.disconnect).toHaveBeenCalledWith({
			topic: 'widened-capabilities-topic',
			reason: {
				code: 6000,
				message: 'WalletConnect namespace "eip155" exceeded requested authority',
			},
		})
	})
})
