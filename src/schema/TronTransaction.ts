import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum TronTransactionSelector {
	NetworkTransactionId = 'networkTransactionId',
}
import { Source } from '$/sources/Source.ts'

const tronPublicTransactionSources = [
	Source.TronScan_Rest,
	Source.TronGrid_Rest,
]

export default {
	entityType: EntityType.TronTransaction,

	label: 'TRON Transaction',
	labelPlural: 'TRON Transactions',

	selectors: [
		{
			name: TronTransactionSelector.NetworkTransactionId,
			fields: [
				'$network',
				'transactionId',
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
			name: 'transactionId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicTransactionSources,
		},
		{
			name: 'blockHeight',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicTransactionSources,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicTransactionSources,
		},
		{
			name: 'expirationTimestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: 'contractType',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicTransactionSources,
		},
		{
			name: 'result',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicTransactionSources,
		},
		{
			name: 'feeSun',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicTransactionSources,
		},
		{
			name: '$owner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicTransactionSources,
		},
		{
			name: '$to',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicTransactionSources,
		},
		{
			name: '$contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicTransactionSources,
		},
		{
			name: 'amountSun',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicTransactionSources,
		},
		{
			name: 'assetName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicTransactionSources,
		},
		{
			name: 'rawDataHex',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: 'signatures',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: '$$tokenTransfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronTokenTransfer,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
