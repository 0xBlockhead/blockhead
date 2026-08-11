import { describe, expect, it, vi } from 'vitest'
import { EntityMetaKey } from '$/schema/$schema.ts'
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

const nodeStateResolver = quilibriumNodeMetrics.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadQuilibriumNodeState
))
const nodeStateTimestampResolver = quilibriumNodeMetrics.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadQuilibriumNodeState_Timestamp
))

if (nodeStateResolver == null || nodeStateTimestampResolver == null)
	throw new Error('QuilibriumNodeMetrics-Prometheus spec missing resolver')

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
	it('projects node-state tip timestamps and observation fields from prometheus text', async () => {
		getMetrics.mockResolvedValue(`
quilibrium_app_consensus_engine_state 5
quilibrium_app_consensus_current_frame_number 99
quilibrium_app_consensus_current_difficulty 3
quilibrium_app_consensus_pending_messages_count 1
`)

		await expect(
			nodeStateResolver.resolve.ConnectionIdNetwork.resolve({
				connectionId: 'node-1',
				$network: network,
			})
		).resolves.toMatchObject({
			connectionId: 'node-1',
			$$timestamps: [
				{
					[EntityMetaKey.Selector]: {
						$nodeState: {
							connectionId: 'node-1',
							$network: network,
						},
						source: Source.QuilibriumNodeMetrics_Prometheus,
					},
				},
			],
		})

		await expect(
			nodeStateTimestampResolver.resolve.NodeStateTimestampMsSource.resolve({
				$nodeState: {
					connectionId: 'node-1',
					$network: network,
				},
				timestampMs: 1,
				source: Source.QuilibriumNodeMetrics_Prometheus,
			})
		).resolves.toMatchObject({
			engineState: 'publishing',
			latestFrameNumber: 99n,
			difficulty: 3n,
			pendingMessageCount: 1,
		})
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
	})
})
