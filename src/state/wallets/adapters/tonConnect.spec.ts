import { afterEach, describe, expect, it, vi } from 'vitest'

import { readFile } from 'node:fs/promises'

import { WalletCapability, WalletProtocol } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { createTonConnectAdapter } from './tonConnect.ts'
import type { WalletCandidate, WalletConnection } from './types.ts'

const address = `0:${'ab'.repeat(32)}`

const connectEvent = (
	network = '-239',
	accountAddress = address
) => ({
	event: 'connect' as const,
	payload: {
		items: [
			{
				name: 'ton_addr' as const,
				address: accountAddress,
				network,
			},
		],
	},
})

type BridgeEvent =
	| ReturnType<typeof connectEvent>
	| {
		event: 'disconnect'
		payload: Record<string, never>
	}
	| {
		event: 'connect_error'
		payload: {
			message: string
		}
	}

const createBridge = (restored: BridgeEvent) => {
	let listener = (_event: BridgeEvent) => {}
	const stop = vi.fn()

	return {
		bridge: {
			connect: vi.fn(async (): Promise<BridgeEvent> => connectEvent()),
			restoreConnection: vi.fn(async () => restored),
			send: vi.fn(async () => ({})),
			listen: vi.fn((nextListener: typeof listener) => {
				listener = nextListener

				return stop
			}),
		},
		emit: (event: Parameters<typeof listener>[0]) => listener(event),
		stop,
	}
}

describe('TON Connect injected adapter', () => {
	afterEach(() => {
		vi.useRealTimers()
		vi.unstubAllGlobals()
	})

	it('publishes the canonical TON Connect app manifest', async () => {
		expect(JSON.parse(await readFile(
			new URL('../../../../static/tonconnect-manifest.json', import.meta.url),
			'utf8'
		))).toEqual({
			url: 'https://blockhead.info',
			name: 'Blockhead',
			iconUrl: 'https://blockhead.info/favicon.png',
		})
	})

	it('discovers only present standard registry JS bridge keys', () => {
		const tonkeeper = createBridge(connectEvent())
		const openmask = createBridge(connectEvent())
		vi.stubGlobal('window', {
			location: { origin: 'https://blockhead.info' },
			tonkeeper: { tonconnect: tonkeeper.bridge },
			openmask: { tonconnect: openmask.bridge },
		})

		const updates: WalletCandidate[][] = []
		createTonConnectAdapter().start((candidates) => updates.push(candidates))

		expect(updates.at(-1)).toEqual([
			expect.objectContaining({
				id: 'ton-connect:tonkeeper',
				name: 'Tonkeeper',
				protocol: WalletProtocol.TonConnect,
				capabilities: [
					WalletCapability.Discover,
					WalletCapability.Connect,
					WalletCapability.Reconnect,
					WalletCapability.Disconnect,
					WalletCapability.ListAccounts,
				],
			}),
			expect.objectContaining({
				id: 'ton-connect:openmask',
				name: 'OpenMask',
			}),
		])
	})

	it('stopDiscovery clears discovery timers so later ticks do not run', async () => {
		vi.useFakeTimers()
		const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')
		const injectedWindow = {
			location: { origin: 'https://blockhead.info' },
		}
		vi.stubGlobal('window', injectedWindow)
		const updates: WalletCandidate[][] = []
		const stop = createTonConnectAdapter().start((candidates) => updates.push(candidates))

		expect(updates).toEqual([[]])

		Object.assign(injectedWindow, {
			tonkeeper: {
				tonconnect: createBridge(connectEvent()).bridge,
			},
		})
		await vi.advanceTimersByTimeAsync(100)
		expect(updates).toHaveLength(2)

		stop()
		expect(clearIntervalSpy).toHaveBeenCalledOnce()

		delete injectedWindow.tonkeeper
		await vi.advanceTimersByTimeAsync(500)

		expect(updates).toHaveLength(2)

		vi.unstubAllGlobals()
		await vi.advanceTimersByTimeAsync(500)
	})

	it('discovers Tonkeeper when its injected bridge arrives after adapter startup', async () => {
		vi.useFakeTimers()
		const injectedWindow = {
			location: { origin: 'https://blockhead.info' },
		}
		vi.stubGlobal('window', injectedWindow)
		const updates: WalletCandidate[][] = []
		const stop = createTonConnectAdapter().start((candidates) => updates.push(candidates))

		expect(updates).toEqual([[]])

		Object.assign(injectedWindow, {
			tonkeeper: {
				tonconnect: createBridge(connectEvent()).bridge,
			},
		})
		await vi.advanceTimersByTimeAsync(100)

		expect(updates).toEqual([
			[],
			[
				expect.objectContaining({
					id: 'ton-connect:tonkeeper',
					name: 'Tonkeeper',
					protocol: WalletProtocol.TonConnect,
				}),
			],
		])

		stop()
	})

	it('restores the raw address, network, and truthful event surface', async () => {
		const mock = createBridge(connectEvent(
			'-3',
			`000:${'AB'.repeat(32)}`
		))
		vi.stubGlobal('window', {
			location: { origin: 'https://blockhead.info' },
			tonkeeper: { tonconnect: mock.bridge },
		})

		const adapter = createTonConnectAdapter()
		adapter.start(() => {})

		expect(await adapter.connect('ton-connect:tonkeeper')).toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.TonConnect,
			selected: true,
			scopes: [
				{
					namespace: 'ton',
					reference: '-3',
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
				expect.objectContaining({
					accountAddress: address,
					reference: '-3',
				}),
			],
		})
		expect(mock.bridge.connect).not.toHaveBeenCalled()
	})

	it('connects with protocol version 2 and the origin manifest when restore has no session', async () => {
		const mock = createBridge({
			event: 'disconnect',
			payload: {},
		})
		vi.stubGlobal('window', {
			location: { origin: 'https://blockhead.info' },
			mytonwallet: { tonconnect: mock.bridge },
		})

		const adapter = createTonConnectAdapter()
		adapter.start(() => {})
		await adapter.connect('ton-connect:mytonwallet')

		expect(mock.bridge.connect).toHaveBeenCalledWith(2, {
			manifestUrl: 'https://blockhead.info/tonconnect-manifest.json',
			items: [{ name: 'ton_addr' }],
		})
	})

	it('emits replacement sessions and disconnects through one listener', async () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date('2026-07-22T12:00:00Z'))
		const mock = createBridge(connectEvent())
		vi.stubGlobal('window', {
			location: { origin: 'https://blockhead.info' },
			tonkeeper: { tonconnect: mock.bridge },
		})

		const adapter = createTonConnectAdapter()
		const stopDiscovery = adapter.start(() => {})
		const initialConnection = await adapter.connect('ton-connect:tonkeeper')
		expect(initialConnection).not.toHaveProperty('sessionId')
		const updates: WalletConnection[] = []
		const stopConnection = adapter.subscribeConnection(
			'ton-connect:tonkeeper',
			(connection) => updates.push(connection)
		)

		const changedAddress = `-1:${'cd'.repeat(32)}`
		vi.setSystemTime(new Date('2026-07-22T12:01:00Z'))
		mock.emit({
			event: 'connect',
			payload: {
				items: [{
					name: 'ton_addr',
					address: `-0001:${'CD'.repeat(32)}`,
					network: '-3',
				}],
			},
		})
		expect(updates.at(-1)).toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			selected: true,
			scopes: [{ reference: '-3' }],
			accounts: [{
				accountAddress: changedAddress,
				reference: '-3',
			}],
			activeAccount: {
				accountAddress: changedAddress,
				reference: '-3',
			},
			connectedAt: Date.now(),
		})
		expect(updates.at(-1)).not.toHaveProperty('sessionId')

		mock.emit({
			event: 'disconnect',
			payload: {},
		})
		expect(updates.at(-1)).toMatchObject({
			status: BlockheadConnectionStatus.Disconnected,
			accounts: [],
		})
		expect(updates.at(-1)).not.toHaveProperty('activeAccount')
		expect(updates.at(-1)).not.toHaveProperty('connectedAt')
		expect(updates.at(-1)).not.toHaveProperty('sessionId')

		await adapter.disconnect('ton-connect:tonkeeper')
		expect(mock.bridge.send).toHaveBeenCalledWith({
			method: 'disconnect',
			params: [],
			id: expect.any(String),
		})

		stopConnection()
		stopDiscovery()
		expect(mock.stop).toHaveBeenCalledOnce()
	})

	it('settles cold restore errors and connect approval rejection without inventing a session', async () => {
		const mock = createBridge({
			event: 'connect_error',
			payload: {
				message: 'Stored TON session expired',
			},
		})
		vi.stubGlobal('window', {
			location: { origin: 'https://blockhead.info' },
			tonkeeper: { tonconnect: mock.bridge },
		})
		const adapter = createTonConnectAdapter()
		adapter.start(() => {})
		const updates: WalletConnection[] = []
		const unsubscribe = adapter.subscribeConnection(
			'ton-connect:tonkeeper',
			(connection) => updates.push(connection)
		)
		await vi.waitFor(() => expect(updates).toEqual([
			expect.objectContaining({
				status: BlockheadConnectionStatus.Error,
				accounts: [],
				error: 'Stored TON session expired',
			}),
		]))

		mock.bridge.restoreConnection.mockResolvedValueOnce({
			event: 'disconnect',
			payload: {},
		})
		mock.bridge.connect.mockResolvedValueOnce({
			event: 'connect_error',
			payload: {
				message: 'User rejected TON access',
			},
		})
		await expect(adapter.connect('ton-connect:tonkeeper')).rejects.toThrow(
			'User rejected TON access'
		)

		unsubscribe()
	})

	it('ignores a stale cold restore after a newer bridge event and cleans up its listener', async () => {
		const restore = Promise.withResolvers<BridgeEvent>()
		const mock = createBridge(connectEvent())
		mock.bridge.restoreConnection.mockImplementationOnce(() => restore.promise)
		vi.stubGlobal('window', {
			location: { origin: 'https://blockhead.info' },
			tonkeeper: { tonconnect: mock.bridge },
		})
		const adapter = createTonConnectAdapter()
		adapter.start(() => {})
		const updates: WalletConnection[] = []
		const unsubscribe = adapter.subscribeConnection(
			'ton-connect:tonkeeper',
			(connection) => updates.push(connection)
		)
		const changedAddress = `-1:${'cd'.repeat(32)}`
		mock.emit({
			event: 'connect',
			payload: {
				items: [{
					name: 'ton_addr',
					address: `-0001:${'CD'.repeat(32)}`,
					network: '-3',
				}],
			},
		})
		restore.resolve(connectEvent())
		await restore.promise
		await Promise.resolve()

		expect(updates).toEqual([
			expect.objectContaining({
				accounts: [expect.objectContaining({
					accountAddress: changedAddress,
					reference: '-3',
				})],
			}),
		])

		unsubscribe()
		expect(mock.stop).toHaveBeenCalledOnce()
	})

	it('lets only the newest overlapping connect completion create a lifecycle', async () => {
		const firstRestore = Promise.withResolvers<BridgeEvent>()
		const secondRestore = Promise.withResolvers<BridgeEvent>()
		const mock = createBridge(connectEvent())
		mock.bridge.restoreConnection
			.mockImplementationOnce(() => firstRestore.promise)
			.mockImplementationOnce(() => secondRestore.promise)
		vi.stubGlobal('window', {
			location: { origin: 'https://blockhead.info' },
			tonkeeper: { tonconnect: mock.bridge },
		})
		const adapter = createTonConnectAdapter()
		adapter.start(() => {})
		const firstConnection = adapter.connect('ton-connect:tonkeeper')
		const secondConnection = adapter.connect('ton-connect:tonkeeper')

		secondRestore.resolve(connectEvent('-3'))
		await expect(secondConnection).resolves.toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			scopes: [{ reference: '-3' }],
		})
		firstRestore.resolve(connectEvent())
		await expect(firstConnection).resolves.toBeUndefined()
	})

	it('invalidates pending direct and subscribed restores on disconnect', async () => {
		const directRestore = Promise.withResolvers<BridgeEvent>()
		const subscribedRestore = Promise.withResolvers<BridgeEvent>()
		const mock = createBridge(connectEvent())
		mock.bridge.restoreConnection
			.mockImplementationOnce(() => directRestore.promise)
			.mockImplementationOnce(() => subscribedRestore.promise)
		vi.stubGlobal('window', {
			location: { origin: 'https://blockhead.info' },
			tonkeeper: { tonconnect: mock.bridge },
		})
		const adapter = createTonConnectAdapter()
		adapter.start(() => {})
		const connection = adapter.connect('ton-connect:tonkeeper')
		const updates: WalletConnection[] = []
		const unsubscribe = adapter.subscribeConnection(
			'ton-connect:tonkeeper',
			(update) => updates.push(update)
		)

		await adapter.disconnect('ton-connect:tonkeeper')
		directRestore.resolve(connectEvent())
		subscribedRestore.resolve(connectEvent())
		await expect(connection).resolves.toBeUndefined()
		await subscribedRestore.promise
		await Promise.resolve()
		expect(updates).toEqual([])

		unsubscribe()
		expect(mock.stop).toHaveBeenCalledOnce()
	})

	it('invalidates pending work and removes the bridge listener on stop', async () => {
		const directRestore = Promise.withResolvers<BridgeEvent>()
		const subscribedRestore = Promise.withResolvers<BridgeEvent>()
		const mock = createBridge(connectEvent())
		mock.bridge.restoreConnection
			.mockImplementationOnce(() => directRestore.promise)
			.mockImplementationOnce(() => subscribedRestore.promise)
		vi.stubGlobal('window', {
			location: { origin: 'https://blockhead.info' },
			tonkeeper: { tonconnect: mock.bridge },
		})
		const adapter = createTonConnectAdapter()
		const stop = adapter.start(() => {})
		const connection = adapter.connect('ton-connect:tonkeeper')
		const updates: WalletConnection[] = []
		adapter.subscribeConnection(
			'ton-connect:tonkeeper',
			(update) => updates.push(update)
		)

		stop()
		directRestore.resolve(connectEvent())
		subscribedRestore.resolve(connectEvent())
		await expect(connection).resolves.toBeUndefined()
		await subscribedRestore.promise
		await Promise.resolve()
		expect(updates).toEqual([])
		expect(mock.stop).toHaveBeenCalledOnce()
	})

	it.each([
		['0000', '0'],
		['-0000', '0'],
		['0001', '1'],
		['-0001', '-1'],
		['2147483647', '2147483647'],
		['-2147483648', '-2147483648'],
	])('normalizes raw workchain variant %s to signed decimal %s', async (workchain, canonicalWorkchain) => {
		const mock = createBridge(connectEvent(
			'-239',
			`${workchain}:${'AB'.repeat(32)}`
		))
		vi.stubGlobal('window', {
			location: { origin: 'https://blockhead.info' },
			tonkeeper: { tonconnect: mock.bridge },
		})

		const adapter = createTonConnectAdapter()
		adapter.start(() => {})

		await expect(adapter.connect('ton-connect:tonkeeper')).resolves.toMatchObject({
			accounts: [
				expect.objectContaining({
					accountAddress: `${canonicalWorkchain}:${'ab'.repeat(32)}`,
				}),
			],
		})
	})

	it.each([
		`2147483648:${'ab'.repeat(32)}`,
		`-2147483649:${'ab'.repeat(32)}`,
		`+1:${'ab'.repeat(32)}`,
		`1.0:${'ab'.repeat(32)}`,
		`1e2:${'ab'.repeat(32)}`,
		` 1:${'ab'.repeat(32)}`,
		`1 :${'ab'.repeat(32)}`,
		`:${'ab'.repeat(32)}`,
		`--1:${'ab'.repeat(32)}`,
		`0:${'ab'.repeat(31)}`,
		`0:${'ab'.repeat(32)}0`,
		`0:${'ab'.repeat(31)}ag`,
		`0:0x${'ab'.repeat(32)}`,
		`0:${'ab'.repeat(32)} `,
		'EQinvalid',
	])('rejects malformed or out-of-range raw address %s', async (rawAddress) => {
		const mock = createBridge(connectEvent('-239', rawAddress))
		vi.stubGlobal('window', {
			location: { origin: 'https://blockhead.info' },
			tonkeeper: { tonconnect: mock.bridge },
		})

		const adapter = createTonConnectAdapter()
		adapter.start(() => {})

		await expect(adapter.connect('ton-connect:tonkeeper')).rejects.toThrow(
			'TON wallet returned a non-canonical raw address'
		)
	})

	it('rejects malformed cold and live statuses without publishing their account identity', async () => {
		const mock = createBridge(connectEvent(
			'-239',
			`2147483648:${'ab'.repeat(32)}`
		))
		vi.stubGlobal('window', {
			location: { origin: 'https://blockhead.info' },
			tonkeeper: { tonconnect: mock.bridge },
		})
		const adapter = createTonConnectAdapter()
		adapter.start(() => {})
		const updates: WalletConnection[] = []
		const unsubscribe = adapter.subscribeConnection(
			'ton-connect:tonkeeper',
			(connection) => updates.push(connection)
		)

		await vi.waitFor(() => {
			expect(updates.at(-1)).toMatchObject({
				status: BlockheadConnectionStatus.Error,
				accounts: [],
				error: expect.stringContaining('TON wallet returned a non-canonical raw address'),
			})
		})
		expect(updates).toHaveLength(1)

		mock.emit(connectEvent(
			'-3',
			`0:${'ab'.repeat(31)}`
		))
		expect(updates).toHaveLength(2)
		expect(updates.at(-1)).toMatchObject({
			status: BlockheadConnectionStatus.Error,
			accounts: [],
			error: expect.stringContaining('TON wallet returned a non-canonical raw address'),
		})

		mock.emit(connectEvent(
			'-3',
			`-0001:${'CD'.repeat(32)}`
		))
		expect(updates).toHaveLength(3)
		expect(updates.at(-1)).toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			accounts: [
				expect.objectContaining({
					accountAddress: `-1:${'cd'.repeat(32)}`,
					reference: '-3',
				}),
			],
		})

		unsubscribe()
	})

	it('keeps rejecting a non-canonical TON network independently of raw account normalization', async () => {
		const mock = createBridge(connectEvent('mainnet'))
		vi.stubGlobal('window', {
			location: { origin: 'https://blockhead.info' },
			tonkeeper: { tonconnect: mock.bridge },
		})

		const adapter = createTonConnectAdapter()
		adapter.start(() => {})

		await expect(adapter.connect('ton-connect:tonkeeper')).rejects.toThrow(
			'TON wallet did not expose a canonical network ID'
		)
	})
})
