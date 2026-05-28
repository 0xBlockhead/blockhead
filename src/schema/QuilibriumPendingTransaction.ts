import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/Network.ts'

export default {
	entityType: EntityType.QuilibriumPendingTransaction,

	label: 'Quilibrium Pending Transaction',
	labelPlural: 'Quilibrium Pending Transactions',

	id: type({
		$network: Network.id,
		transactionHash: 'string',
	}),

	fields: [
		{
			name: '$account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.QuilibriumAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transactionType',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
