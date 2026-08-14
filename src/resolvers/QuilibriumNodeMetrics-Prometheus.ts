import { networkBySlug } from '$/constants/Network.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { nodeStateObservationFromPrometheusText } from '$/sources/QuilibriumNodeMetrics/Prometheus/queries.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

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
						const { getMetrics } = await (
							typeof window === 'undefined' ?
								import('$/sources/QuilibriumNodeMetrics/Prometheus/queries.ts')
							:
								import('$/sources/QuilibriumNodeMetrics/Prometheus/queries.remote.ts')
						)
						const text = await getMetrics()
						const timestampMs = Date.now()
						const observation = nodeStateObservationFromPrometheusText(text, timestampMs)
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
									[EntityMetaKey.Fields]: Object.fromEntries(
										Object.entries(observation).map(([fieldName, value]) => [
											entityFieldAddressKey(EntityType.BlockheadQuilibriumNodeState_Timestamp, [], fieldName),
											value,
										])
									),
								},
							],
						}
					},
				},
			},
			resolveLive: {
				operatorState: {
					facetPath: [],
					publishes: {
						'$$timestamps': true,
					},
					start: ({
						fields,
						parentEntitySelector,
						signal,
					}) => {
						assertQuilibriumMainnet(parentEntitySelector.$network)
						let timeout: ReturnType<typeof setTimeout> | undefined
						const poll = async () => {
							const { getMetrics } = await (
								typeof window === 'undefined' ?
									import('$/sources/QuilibriumNodeMetrics/Prometheus/queries.ts')
								:
									import('$/sources/QuilibriumNodeMetrics/Prometheus/queries.remote.ts')
							)
							const text = await getMetrics()
							if (signal.aborted)
								return
							const timestampMs = Date.now()
							const observation = nodeStateObservationFromPrometheusText(text, timestampMs)
							fields.$$timestamps.replaceRows([{
								source: Source.QuilibriumNodeMetrics_Prometheus,
								value: [{
									[EntityMetaKey.Selector]: {
										$nodeState: parentEntitySelector,
										timestampMs,
										source: Source.QuilibriumNodeMetrics_Prometheus,
									},
									[EntityMetaKey.Fields]: Object.fromEntries(
										Object.entries(observation).map(([fieldName, value]) => [
											entityFieldAddressKey(EntityType.BlockheadQuilibriumNodeState_Timestamp, [], fieldName),
											value,
										])
									),
								}],
							}])
							timeout = setTimeout(() => { void poll() }, 10_000)
						}
						const abort = () => {
							if (timeout != null)
								clearTimeout(timeout)
						}
						signal.addEventListener('abort', abort, { once: true })
						void poll()
						return () => {
							signal.removeEventListener('abort', abort)
							abort()
						}
					},
				},
			},
		})({
			connectionId: (state) => state.connectionId,
			$network: (state) => state.$network,
			$$timestamps: (state) => state.$$timestamps,
		}),
	],
} satisfies RegisteredSourceResolverModule
