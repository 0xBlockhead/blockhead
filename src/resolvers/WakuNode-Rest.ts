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
import bindings from '$/sources/WakuNode/bindings.ts'

const connectionId = 'waku-node'
const binding = bindings[Source.WakuNode][0]

const loadWakuQueries = async () => {
	if (typeof window !== 'undefined')
		return import('$/sources/WakuNode/Rest/queries.remote.ts')

	const queries = await import('$/sources/WakuNode/Rest/queries.ts')
	return {
		getDebugInfo: () => queries.getDebugInfo(binding),
		getHealth: () => queries.getHealth(binding),
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

						const { getDebugInfo, getHealth } = await loadWakuQueries()
						const timestampMs = Date.now()
						const [debugInfo, health] = await Promise.all([
							getDebugInfo(),
							getHealth(),
						])
						if (debugInfo.enrUri == null)
							throw new Error('WakuNode_Rest: debug info does not expose an ENR node identity')
						if (nodeId !== debugInfo.enrUri)
							throw new Error(`WakuNode_Rest: local node ${debugInfo.enrUri} does not match ${nodeId}`)

						const $nodeState = {
							connectionId,
							nodeId,
						}

						return {
							...$nodeState,
							endpoint: binding.endpoints[0].locator,
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$nodeState,
										timestampMs,
										source: Source.WakuNode,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.BlockheadWakuNodeState_Timestamp, [], 'health')]: health,
										[entityFieldAddressKey(EntityType.BlockheadWakuNodeState_Timestamp, [], 'listenAddresses')]: debugInfo.listenAddresses,
										[entityFieldAddressKey(EntityType.BlockheadWakuNodeState_Timestamp, [], 'enrUri')]: debugInfo.enrUri,
									},
								},
							],
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
				resolveCount: (nodeState) => nodeState.$$timestamps.length,
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
