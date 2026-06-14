import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum UtxoTransactionSelector {
	NetworkTxId = 'networkTxId',
}

export default {
	entityType: EntityType.UtxoTransaction,

	label: 'UTXO Transaction',
	labelPlural: 'UTXO Transactions',

	selectors: [
		{
			name: UtxoTransactionSelector.NetworkTxId,
			fields: [
				'$network',
				'txId',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'txId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'version',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lockTime',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sizeBytes',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'virtualSizeBytes',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'weightUnits',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'feeSats',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'isCoinbase',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$inputs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.UtxoInput,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$outputs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.UtxoOutput,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$zcashShieldedActions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZcashShieldedAction,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
