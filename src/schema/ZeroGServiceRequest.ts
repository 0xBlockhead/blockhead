import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import ZeroGServiceProvider from '$/schema/ZeroGServiceProvider.ts'

export enum ZeroGServiceRequestSelector {
	ZeroGServiceProviderRequestId = 'zeroGServiceProviderRequestId',
}

export default {
	entityType: EntityType.ZeroGServiceRequest,

	label: '0G service request',
	labelPlural: '0G service requests',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGServiceProvider,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'requestId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$requester',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'requestHash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'responseHash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$settlementTrace',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGSettlementTrace,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
