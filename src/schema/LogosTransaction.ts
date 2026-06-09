import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/Network.ts'

export default {
	entityType: EntityType.LogosTransaction,

	label: 'Logos Transaction',
	labelPlural: 'Logos Transactions',

	id: type({
		$network: Network.id,
		transactionHash: 'string',
	}),

	fields: [
		{
			name: '$account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LogosAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$zone',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LogosZone,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transactionKind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
