import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Transaction from '$/schema/CosmosTransaction.ts'

export default {
	entityType: EntityType.CosmosMessage,

	label: 'Cosmos Message',
	labelPlural: 'Cosmos Messages',

	id: type({
		$transaction: Transaction.id,
		messageIndex: 'number',
	}),

	fields: [
		{
			name: 'typeUrl',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$signer',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
