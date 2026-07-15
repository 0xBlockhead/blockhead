// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum BlockheadWakuNodeStateSelector {
	ConnectionIdNodeId = 'ConnectionIdNodeId',
}
export const BlockheadWakuNodeState = entity({
	entityType: EntityType.BlockheadWakuNodeState,
	labels: {
		singular: 'blockhead waku node state',
		plural: 'blockhead waku node states',
	},
})({
	connectionId: {
		label: 'connection ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	nodeId: {
		label: 'node ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	endpoint: {
		label: 'endpoint',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadWakuNodeState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$messageObservations: {
		label: 'message observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadWakuMessageObservation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ConnectionIdNodeId: [
			'connectionId',
			'nodeId',
		],
	},
})
