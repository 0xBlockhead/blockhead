// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ZeroGSettlementTrace,
	labels: {
		singular: 'zero g settlement trace',
		plural: 'zero g settlement traces',
	},
})({
	$serviceRequest: {
		label: 'service request',
		entityType: EntityType.ZeroGServiceRequest,
		cardinality: EntityFieldCardinality.One,
	},
	traceId: {
		label: 'trace ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	settlementTransactionHash: {
		label: 'settlement transaction hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	acknowledgementSignature: {
		label: 'acknowledgement signature',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardAmount: {
		label: 'reward amount',
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
