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
		label: 'service provider',
		entityType: EntityType.ZeroGServiceProvider,
		cardinality: EntityFieldCardinality.One,
	},
	requestId: {
		label: 'request ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$requester: {
		label: 'requester',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestHash: {
		label: 'request hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	responseHash: {
		label: 'response hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$settlementTrace: {
		label: 'settlement trace',
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
