// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum UtxoTransactionSelector {
	NetworkTxId = 'NetworkTxId',
}
export default {
	entityType: EntityType.UtxoTransaction,
	label: 'UTXO transaction',
	labelPlural: 'UTXO transactions',
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
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'txId',
			label: 'Transaction ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$block',
			label: 'Block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'version',
			label: 'Version',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lockTime',
			label: 'Lock time',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sizeBytes',
			label: 'Size',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'virtualSizeBytes',
			label: 'Virtual size',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'weightUnits',
			label: 'Weight',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'feeSats',
			label: 'Fee',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'isCoinbase',
			label: 'Coinbase',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$inputs',
			label: 'Inputs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.UtxoInput,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$outputs',
			label: 'Outputs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.UtxoOutput,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$zcashShieldedActions',
			label: 'Zcash shielded actions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZcashShieldedAction,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
