// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ZeroGServiceRequestSelector {
	ZeroGServiceProviderRequestId = 'ZeroGServiceProviderRequestId',
}
export default {
	entityType: EntityType.ZeroGServiceRequest,
	label: 'zero g service request',
	labelPlural: 'zero g service requests',
	selectors: [
		{
			name: ZeroGServiceRequestSelector.ZeroGServiceProviderRequestId,
			fields: [
				'$serviceProvider',
				'requestId',
			],
		},
	],
	fields: [
		{
			name: '$serviceProvider',
			label: 'service provider',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGServiceProvider,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'requestId',
			label: 'request ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$requester',
			label: 'requester',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'requestHash',
			label: 'request hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'responseHash',
			label: 'response hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$settlementTrace',
			label: 'settlement trace',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGSettlementTrace,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
