// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum TronAccount_TimestampSelector {
	AccountTimestampMsSource = 'AccountTimestampMsSource',
}
export default {
	entityType: EntityType.TronAccount_Timestamp,
	label: 'tron account timestamp',
	labelPlural: 'tron account observations',
	selectors: [
		{
			name: TronAccount_TimestampSelector.AccountTimestampMsSource,
			fields: [
				'$account',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$account',
				label: 'Account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TronAccount,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'blockHeight',
				label: 'Block height',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'balanceSun',
				label: 'Balance sun',
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
				name: 'createdTimestampMs',
				label: 'Created',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronScan_Rest,
				],
		},
		{
				name: 'latestOperationTimestampMs',
				label: 'Latest operation',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronScan_Rest,
				],
		},
		{
				name: 'totalTransactionCount',
				label: 'Total transactions',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronScan_Rest,
				],
		},
		{
				name: 'freeNetUsed',
				label: 'Free net used',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronGrid_Rest,
				],
		},
		{
				name: 'freeNetLimit',
				label: 'Free net limit',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronGrid_Rest,
				],
		},
		{
				name: 'netUsed',
				label: 'Net used',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronGrid_Rest,
				],
		},
		{
				name: 'netLimit',
				label: 'Net limit',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronGrid_Rest,
				],
		},
		{
				name: 'energyUsed',
				label: 'Energy used',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronGrid_Rest,
				],
		},
		{
				name: 'energyLimit',
				label: 'Energy limit',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronGrid_Rest,
				],
		},
		{
				name: 'tronPowerUsed',
				label: 'TRON power used',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'tronPowerLimit',
				label: 'TRON power limit',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'isContract',
				label: 'Contract',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronScan_Rest,
				],
		},
	],
} as const satisfies EntityDefinition
