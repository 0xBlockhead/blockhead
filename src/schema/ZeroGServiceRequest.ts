// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ZeroGServiceProvider,
		cardinality: EntityFieldCardinality.One,
	},
	requestId: {
		label: 'request ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$requester: {
		label: 'requester',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestHash: {
		label: 'request hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	responseHash: {
		label: 'response hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$settlementTrace: {
		label: 'settlement trace',
		type: EntityFieldType.EntityReference,
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
