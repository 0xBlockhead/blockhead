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
		entityType: EntityType.ZeroGServiceRequest,
		cardinality: EntityFieldCardinality.One,
	},
	traceId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	settlementTransactionHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	acknowledgementSignature: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardAmount: {
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
