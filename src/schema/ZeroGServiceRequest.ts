import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import ZeroGServiceProvider from '$/schema/ZeroGServiceProvider.ts'

export default {
	entityType: EntityType.ZeroGServiceRequest,

	label: '0G service request',
	labelPlural: '0G service requests',

	id: type({
		$serviceProvider: ZeroGServiceProvider.id,
		requestId: 'string',
	}),

	fields: [
		{
			name: 'requesterAddress',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
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
