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
	entityType: EntityType.MoneroTransaction,

	label: 'Monero Transaction',
	labelPlural: 'Monero Transactions',

	id: type({
		$network: Network.id,
		txHash: 'string',
	}),

	fields: [
		{
			name: '$block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MoneroBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'version',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'unlockTime',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'feeAtomicUnits',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$keyImages',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MoneroKeyImage,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$stealthOutputs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MoneroStealthOutput,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
