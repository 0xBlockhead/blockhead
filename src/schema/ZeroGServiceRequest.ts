// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ZeroGServiceRequestSelector {
	ZeroGServiceProviderRequestId = 'ZeroGServiceProviderRequestId',
}
export const ZeroGServiceRequest = entity({
	entityType: EntityType.ZeroGServiceRequest,
	label: 'zero g service request',
	labelPlural: 'zero g service requests',
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
