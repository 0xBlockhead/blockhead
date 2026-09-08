import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const connectionId = 'waku-node'

const loadWakuQueries = async () => {
	if (typeof window !== 'undefined')
		return import('$/sources/WakuNode/Rest/queries.remote.ts')

	const queries = await import('$/sources/WakuNode/Rest/queries.ts')
	return {
		getConnectedPeerCount: () => queries.getConnectedPeerCount(),
		getDebugInfo: () => queries.getDebugInfo(),
		getEndpoint: async () => queries.endpoint,
		getHealth: () => queries.getHealth(),
		getVersion: () => queries.getVersion(),
	}
}

export default {
	source: Source.WakuNode,

	resolvers: [
		defineResolver({
			entityType: EntityType.BlockheadWakuNodeState,
			resolve: {
				ConnectionIdNodeId: {
					resolve: async ({ connectionId: requestedConnectionId, nodeId }) => {
						if (requestedConnectionId !== connectionId)
							throw new Error(`WakuNode_Rest: unsupported connection ${requestedConnectionId}`)

						const { getConnectedPeerCount, getDebugInfo, getEndpoint, getHealth, getVersion } = await loadWakuQueries()
						const [debugInfo, health, version, peerCount, endpoint] = await Promise.all([
							getDebugInfo(),
							getHealth(),
							getVersion(),
							getConnectedPeerCount(),
							getEndpoint(),
						])
						if (debugInfo.enrUri == null)
							throw new Error('WakuNode_Rest: debug info does not expose an ENR node identity')
						if (nodeId !== debugInfo.enrUri)
							throw new Error(`WakuNode_Rest: local node ${debugInfo.enrUri} does not match ${nodeId}`)
						const timestampMs = Date.now()

						const $nodeState = {
							connectionId,
							nodeId,
						}

						return {
							...$nodeState,
							endpoint,
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$nodeState,
										timestampMs,
										source: Source.WakuNode,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.BlockheadWakuNodeState_Timestamp, [], 'health')]: health,
										[entityFieldAddressKey(EntityType.BlockheadWakuNodeState_Timestamp, [], 'version')]: version,
										[entityFieldAddressKey(EntityType.BlockheadWakuNodeState_Timestamp, [], 'peerCount')]: peerCount,
										[entityFieldAddressKey(EntityType.BlockheadWakuNodeState_Timestamp, [], 'listenAddresses')]: debugInfo.listenAddresses,
										[entityFieldAddressKey(EntityType.BlockheadWakuNodeState_Timestamp, [], 'enrUri')]: debugInfo.enrUri,
									},
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
						if (parentEntitySelector.connectionId !== connectionId)
							throw new Error(`WakuNode_Rest: unsupported connection ${parentEntitySelector.connectionId}`)

						let timeout: ReturnType<typeof setTimeout> | undefined
						const poll = async () => {
							const { getConnectedPeerCount, getDebugInfo, getHealth, getVersion } = await loadWakuQueries()
							const [debugInfo, health, version, peerCount] = await Promise.all([
								getDebugInfo(),
								getHealth(),
								getVersion(),
								getConnectedPeerCount(),
							])
							if (signal.aborted)
								return
							if (debugInfo.enrUri == null)
								throw new Error('WakuNode_Rest: debug info does not expose an ENR node identity')
							if (parentEntitySelector.nodeId !== debugInfo.enrUri)
								throw new Error(`WakuNode_Rest: local node ${debugInfo.enrUri} does not match ${parentEntitySelector.nodeId}`)

							fields.$$timestamps.replaceRows([{
								source: Source.WakuNode,
								value: [{
									[EntityMetaKey.Selector]: {
										$nodeState: parentEntitySelector,
										timestampMs: Date.now(),
										source: Source.WakuNode,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.BlockheadWakuNodeState_Timestamp, [], 'health')]: health,
										[entityFieldAddressKey(EntityType.BlockheadWakuNodeState_Timestamp, [], 'version')]: version,
										[entityFieldAddressKey(EntityType.BlockheadWakuNodeState_Timestamp, [], 'peerCount')]: peerCount,
										[entityFieldAddressKey(EntityType.BlockheadWakuNodeState_Timestamp, [], 'listenAddresses')]: debugInfo.listenAddresses,
										[entityFieldAddressKey(EntityType.BlockheadWakuNodeState_Timestamp, [], 'enrUri')]: debugInfo.enrUri,
									},
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
			connectionId: (nodeState) => nodeState.connectionId,
			nodeId: (nodeState) => nodeState.nodeId,
			endpoint: (nodeState) => nodeState.endpoint,
			$$timestamps: {
				select: (nodeState) => nodeState.$$timestamps,
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
