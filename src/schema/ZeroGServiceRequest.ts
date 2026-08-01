// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ZeroGServiceRequest,
	labels: {
		singular: 'zero g service request',
		plural: 'zero g service requests',
	},
})({
	$serviceProvider: {
		entityType: EntityType.ZeroGServiceProvider,
		cardinality: EntityFieldCardinality.One,
	},
	requestId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$requester: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	responseHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$settlementTrace: {
		entityType: EntityType.ZeroGSettlementTrace,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ZeroGServiceProviderRequestId: [
			'$serviceProvider',
			'requestId',
		],
	},
})
