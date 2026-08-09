import { networkBySlug } from '$/constants/Network.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import bindings from '$/sources/QuilibriumNodeMetrics/bindings.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const binding = bindings[Source.QuilibriumNodeMetrics_Prometheus][0]

const assertQuilibriumMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== networkBySlug.quilibrium.slug)
		throw new Error('QuilibriumNodeMetrics_Prometheus: unsupported network')
}

export default {
	source: Source.QuilibriumNodeMetrics_Prometheus,

	resolvers: [
		defineResolver({
			entityType: EntityType.BlockheadQuilibriumNodeState,
			resolve: {
				ConnectionIdNetwork: {
					resolve: async ({ connectionId, $network }) => {
						assertQuilibriumMainnet($network)
						const timestampMs = Date.now()
						return {
							connectionId,
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$nodeState: {
											connectionId,
											$network,
										},
										timestampMs,
										source: Source.QuilibriumNodeMetrics_Prometheus,
									},
								},
							],
						}
					},
				},
			},
		})({
			connectionId: (state) => state.connectionId,
			$network: (state) => state.$network,
			$$timestamps: (state) => state.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.BlockheadQuilibriumNodeState_Timestamp,
			resolve: {
				NodeStateTimestampMsSource: {
					resolve: async ({ $nodeState, source }) => {
						if (source !== Source.QuilibriumNodeMetrics_Prometheus)
							throw new Error(`QuilibriumNodeMetrics_Prometheus: unsupported source ${source}`)
						assertQuilibriumMainnet($nodeState.$network)
						const {
							getMetrics,
							nodeStateObservationFromPrometheusText,
						} = await import('$/sources/QuilibriumNodeMetrics/Prometheus/queries.ts')
						return nodeStateObservationFromPrometheusText(await getMetrics(binding))
					},
				},
			},
		})({
			nodeVersion: (snapshot) => snapshot.nodeVersion,
			engineState: (snapshot) => snapshot.engineState,
			latestFrameNumber: (snapshot) => snapshot.latestFrameNumber,
			difficulty: (snapshot) => snapshot.difficulty,
			peerCount: (snapshot) => snapshot.peerCount,
			pendingMessageCount: (snapshot) => snapshot.pendingMessageCount,
			frameStoreHead: (snapshot) => snapshot.frameStoreHead,
			lastSyncedAt: (snapshot) => snapshot.lastSyncedAt,
		}),
	],
} satisfies RegisteredSourceResolverModule
