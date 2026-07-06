// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum TronTransactionReceiptSelector {
	Transaction = 'Transaction',
}
export default {
	entityType: EntityType.TronTransactionReceipt,
	label: 'tron transaction receipt',
	labelPlural: 'tron transaction receipts',
	selectors: [
		{
			name: TronTransactionReceiptSelector.Transaction,
			fields: [
				'$transaction',
			],
		},
	],
	fields: [
		{
			name: '$transaction',
			label: 'Transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'feeSun',
			label: 'Fee sun',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
				Source.TronScan_Rest,
			],
		},
		{
			name: 'result',
			label: 'Result',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
				Source.TronScan_Rest,
			],
		},
		{
			name: 'resMessageHex',
			label: 'Result message hex',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'contractAddress',
			label: 'Contract address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'energyUsage',
			label: 'Energy usage',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'originEnergyUsage',
			label: 'Origin energy usage',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'energyUsageTotal',
			label: 'Energy usage total',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
			],
		},
		{
			name: 'energyFeeSun',
			label: 'Energy fee sun',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'energyPenaltyTotal',
			label: 'Energy penalty total',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'netUsage',
			label: 'Net usage',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
			],
		},
		{
			name: 'netFeeSun',
			label: 'Net fee sun',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'logCount',
			label: 'Logs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'internalTransactionCount',
			label: 'Internal transactions',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'contractResultHex',
			label: 'Contract result hex',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
			],
		},
	],
} as const satisfies EntityDefinition
