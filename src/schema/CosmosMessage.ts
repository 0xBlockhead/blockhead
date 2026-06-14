import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum CosmosMessageSelector {
	CosmosTransactionMessageIndex = 'cosmosTransactionMessageIndex',
}

export default {
	entityType: EntityType.CosmosMessage,

	label: 'Cosmos Message',
	labelPlural: 'Cosmos Messages',

	selectors: [
		{
			name: CosmosMessageSelector.CosmosTransactionMessageIndex,
			fields: [
				'$transaction',
				'messageIndex',
			],
		},
	],

	fields: [
		{
			name: '$transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'messageIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
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
