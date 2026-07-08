// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ZeroGSettlementTraceSelector {
	ZeroGServiceRequestTraceId = 'ZeroGServiceRequestTraceId',
}
export const ZeroGSettlementTrace = entity({
	entityType: EntityType.ZeroGSettlementTrace,
	label: 'zero g settlement trace',
	labelPlural: 'zero g settlement traces',
})({
	$serviceRequest: {
		label: 'service request',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ZeroGServiceRequest,
		cardinality: EntityFieldCardinality.One,
	},
	traceId: {
		label: 'trace ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	settlementTransactionHash: {
		label: 'settlement transaction hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	acknowledgementSignature: {
		label: 'acknowledgement signature',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardAmount: {
		label: 'reward amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ZeroGServiceRequestTraceId: [
			'$serviceRequest',
			'traceId',
		],
	},
})
