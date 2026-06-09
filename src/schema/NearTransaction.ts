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
	entityType: EntityType.NearTransaction,

	label: 'NEAR Transaction',
	labelPlural: 'NEAR Transactions',

	id: type({
		$network: Network.id,
		hash: 'string',
		'signerAccountId?': 'string',
	}),

	fields: [
		{
			name: '$signer',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$receiver',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nonce',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$actions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearAction,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$executionOutcomes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearExecutionOutcome,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
