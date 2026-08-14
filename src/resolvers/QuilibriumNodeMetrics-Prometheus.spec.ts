import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const {
	getMetrics,
} = vi.hoisted(() => ({
	getMetrics: vi.fn(),
}))

vi.mock('$/sources/QuilibriumNodeMetrics/Prometheus/queries.ts', async (importOriginal) => {
	const actual = await importOriginal<typeof import('$/sources/QuilibriumNodeMetrics/Prometheus/queries.ts')>()
	return {
		...actual,
		getMetrics,
	}
})

const queries = await import('$/sources/QuilibriumNodeMetrics/Prometheus/queries.ts')
const { default: quilibriumNodeMetrics } = await import('$/resolvers/QuilibriumNodeMetrics-Prometheus.ts')

const nodeStateResolver = quilibriumNodeMetrics.resolvers[0]

const network = {
	slug: 'quilibrium',
} as const

describe('Quilibrium node metrics prometheus parsing', () => {
	it('parses gauge samples and maps enrolled node observation fields', () => {
		const text = `
# HELP quilibrium_app_consensus_engine_state Current engine state
# TYPE quilibrium_app_consensus_engine_state gauge
quilibrium_app_consensus_engine_state 4
quilibrium_app_consensus_current_frame_number 12345
quilibrium_global_consensus_current_frame_number 12000
quilibrium_app_consensus_current_difficulty 10000
quilibrium_app_consensus_pending_messages_count 7
blossomsub_peers 42
quilibrium_app_consensus_time_since_last_proven_frame_seconds 12.5
quilibrium_build_info{revision="abcdef",version="2.1.0"} 1
`
		expect(queries.parsePrometheusGaugeSamples(text)).toMatchObject({
			quilibrium_app_consensus_engine_state: 4,
			quilibrium_app_consensus_current_frame_number: 12345,
			blossomsub_peers: 42,
		})
		expect(queries.nodeStateObservationFromPrometheusText(text, 1_000_000)).toEqual({
			nodeVersion: '2.1.0',
			engineState: 'proving',
			latestFrameNumber: 12345n,
			frameStoreHead: 12000n,
			difficulty: 10000n,
			pendingMessageCount: 7,
			peerCount: 42,
			lastSyncedAt: 1_000_000 - 12_500,
		})
	})
})

describe('Quilibrium node metrics BlockheadQuilibrium node projections', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		getMetrics.mockReset()
	})

	it('projects node-state tip timestamps and observation fields from prometheus text', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_785_556_800_444)
		getMetrics.mockResolvedValue(`
quilibrium_app_consensus_engine_state 5
quilibrium_app_consensus_current_frame_number 99
quilibrium_global_consensus_current_frame_number 80
quilibrium_app_consensus_current_difficulty 3
quilibrium_app_consensus_pending_messages_count 1
blossomsub_peers 42
quilibrium_app_consensus_time_since_last_proven_frame_seconds 12.5
quilibrium_build_info{revision="abcdef",version="2.1.0"} 1
`)

		await expect(
			nodeStateResolver.resolve.ConnectionIdNetwork.resolve({
				connectionId: 'node-1',
				$network: network,
			})
		).resolves.toEqual({
			connectionId: 'node-1',
			$network: {
				[EntityMetaKey.Selector]: network,
			},
			$$timestamps: [
				{
					[EntityMetaKey.Selector]: {
						$nodeState: {
							connectionId: 'node-1',
							$network: network,
						},
						timestampMs: 1_785_556_800_444,
						source: Source.QuilibriumNodeMetrics_Prometheus,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.BlockheadQuilibriumNodeState_Timestamp, [], 'engineState')]: 'publishing',
						[entityFieldAddressKey(EntityType.BlockheadQuilibriumNodeState_Timestamp, [], 'latestFrameNumber')]: 99n,
						[entityFieldAddressKey(EntityType.BlockheadQuilibriumNodeState_Timestamp, [], 'frameStoreHead')]: 80n,
						[entityFieldAddressKey(EntityType.BlockheadQuilibriumNodeState_Timestamp, [], 'difficulty')]: 3n,
						[entityFieldAddressKey(EntityType.BlockheadQuilibriumNodeState_Timestamp, [], 'pendingMessageCount')]: 1,
						[entityFieldAddressKey(EntityType.BlockheadQuilibriumNodeState_Timestamp, [], 'peerCount')]: 42,
						[entityFieldAddressKey(EntityType.BlockheadQuilibriumNodeState_Timestamp, [], 'lastSyncedAt')]: 1_785_556_800_444 - 12_500,
						[entityFieldAddressKey(EntityType.BlockheadQuilibriumNodeState_Timestamp, [], 'nodeVersion')]: '2.1.0',
					},
				},
			],
		})
		expect(getMetrics).toHaveBeenCalledTimes(1)
	})

	it('does not materialize an empty observation when the current metrics read fails', async () => {
		getMetrics.mockRejectedValue(new Error('metrics down'))

		await expect(
			nodeStateResolver.resolve.ConnectionIdNetwork.resolve({
				connectionId: 'node-1',
				$network: network,
			})
		).rejects.toThrow('metrics down')
	})

	it('rejects unsupported networks', async () => {
		await expect(
			nodeStateResolver.resolve.ConnectionIdNetwork.resolve({
				connectionId: 'node-1',
				$network: {
					slug: 'bitcoin',
				},
			})
		).rejects.toThrow('QuilibriumNodeMetrics_Prometheus: unsupported network')
		expect(getMetrics).not.toHaveBeenCalled()
	})

	it('enrolls only BlockheadQuilibrium node-state as a current parent read', () => {
		expect(quilibriumNodeMetrics.resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType.BlockheadQuilibriumNodeState,
		])
	})
})
