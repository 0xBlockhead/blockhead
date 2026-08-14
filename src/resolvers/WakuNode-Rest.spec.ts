import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { endpoint } from '$/sources/WakuNode/Rest/queries.ts'

const {
	getJson,
	getText,
} = vi.hoisted(() => ({
	getJson: vi.fn(),
	getText: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
	getText,
}))

const resolverModule = (await import('$/resolvers/WakuNode-Rest.ts')).default
const [nodeStateResolver] = resolverModule.resolvers

const resolveNodeState = nodeStateResolver.resolve.ConnectionIdNodeId.resolve

describe('Waku local node journey', () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	beforeEach(() => {
		vi.clearAllMocks()
		getJson.mockImplementation(async (_binding, path) => (
			path === '/admin/v1/peers' ?
				[
					{ connectedness: 'Connected' },
					{ connectedness: 'CanConnect' },
				]
			:
				{
					listenAddresses: [
						'/ip4/127.0.0.1/tcp/60000',
					],
					enrUri: 'enr:-waku-node',
				}
		))
		getText.mockImplementation(async (_binding, path) => (
			path === '/debug/v1/version' ?
				'nwaku/v0.35.0'
			:
				'Ready'
		))
	})

	it('materializes the configured node identity and source-clocked health observation', async () => {
		const now = vi.spyOn(Date, 'now').mockReturnValue(1_799_000_000_000)
		getText.mockImplementation(async (_binding, path) => {
			now.mockReturnValue(1_800_000_000_000)
			return path === '/debug/v1/version' ?
				'nwaku/v0.35.0'
			:
				'Ready'
		})
		const snapshot = await resolveNodeState({
			connectionId: 'waku-node',
			nodeId: 'enr:-waku-node',
		})

		expect(snapshot).toMatchObject({
			connectionId: 'waku-node',
			nodeId: 'enr:-waku-node',
			endpoint,
		})
		expect(snapshot.$$timestamps).toHaveLength(1)
		expect(snapshot.$$timestamps[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$nodeState: {
					connectionId: 'waku-node',
					nodeId: 'enr:-waku-node',
				},
				source: Source.WakuNode,
				timestampMs: 1_800_000_000_000,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BlockheadWakuNodeState_Timestamp, [], 'health')]: 'Ready',
				[entityFieldAddressKey(EntityType.BlockheadWakuNodeState_Timestamp, [], 'version')]: 'nwaku/v0.35.0',
				[entityFieldAddressKey(EntityType.BlockheadWakuNodeState_Timestamp, [], 'peerCount')]: 1,
				[entityFieldAddressKey(EntityType.BlockheadWakuNodeState_Timestamp, [], 'listenAddresses')]: [
					'/ip4/127.0.0.1/tcp/60000',
				],
				[entityFieldAddressKey(EntityType.BlockheadWakuNodeState_Timestamp, [], 'enrUri')]: 'enr:-waku-node',
			},
		})
		expect(typeof snapshot.$$timestamps[0][EntityMetaKey.Selector].timestampMs).toBe('number')
		expect(nodeStateResolver.projections.$$timestamps.resolveCount(snapshot)).toBe(1)
	})

	it('keeps local node health current until the owner is released', async () => {
		vi.useFakeTimers()
		const replaceTimestamps = vi.fn()
		const abortController = new AbortController()
		const cleanup = nodeStateResolver.resolveLive.operatorState.start({
			parentEntitySelector: {
				connectionId: 'waku-node',
				nodeId: 'enr:-waku-node',
			},
			queryClient: {},
			signal: abortController.signal,
			trigger: {
				publicEnv: {},
				pagination: { limit: 25 },
			},
			fields: {
				$$timestamps: {
					replaceRows: replaceTimestamps,
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
			},
		})
		await vi.waitFor(() => expect(replaceTimestamps).toHaveBeenCalledOnce())

		expect(replaceTimestamps).toHaveBeenCalledWith([{
			source: Source.WakuNode,
			value: [expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$nodeState: {
						connectionId: 'waku-node',
						nodeId: 'enr:-waku-node',
					},
					timestampMs: expect.any(Number),
					source: Source.WakuNode,
				},
			})],
		}])

		getText.mockImplementationOnce(async () => 'Not Ready')
		getText.mockImplementationOnce(async () => 'nwaku/v0.35.0')
		await vi.advanceTimersByTimeAsync(10_000)
		await vi.waitFor(() => expect(replaceTimestamps).toHaveBeenCalledTimes(2))
		expect(replaceTimestamps.mock.calls[1][0][0].value[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.BlockheadWakuNodeState_Timestamp, [], 'health')]: 'Not Ready',
		})

		abortController.abort()
		cleanup()
		await vi.advanceTimersByTimeAsync(10_000)
		expect(getText).toHaveBeenCalledTimes(4)
		expect(getJson).toHaveBeenCalledTimes(4)
	})

	it('fails closed when the requested node does not match configured node identity', async () => {
		await expect(resolveNodeState({
			connectionId: 'waku-node',
			nodeId: 'enr:-different-node',
		})).rejects.toThrow('local node enr:-waku-node does not match enr:-different-node')
	})

	it('requires the provider to expose an ENR identity', async () => {
		getJson.mockImplementation(async (_binding, path) => (
			path === '/admin/v1/peers' ?
				[]
			:
				{
					listenAddresses: [
						'/ip4/127.0.0.1/tcp/60000',
					],
				}
		))

		await expect(resolveNodeState({
			connectionId: 'waku-node',
			nodeId: 'enr:-waku-node',
		})).rejects.toThrow('debug info does not expose an ENR node identity')
	})
})
