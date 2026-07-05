// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum TronContract_TimestampSelector {
	ContractTimestampMsSource = 'ContractTimestampMsSource',
}
export default {
	entityType: EntityType.TronContract_Timestamp,
	label: 'tron contract timestamp',
	labelPlural: 'tron contract observations',
	selectors: [
		{
			name: TronContract_TimestampSelector.ContractTimestampMsSource,
			fields: [
				'$contract',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$contract',
				label: 'Contract',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TronContract,
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
				name: 'compiler',
				label: 'Compiler',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronScan_Rest,
				],
		},
		{
				name: 'verifyStatus',
				label: 'Verify status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronScan_Rest,
				],
		},
		{
				name: 'isProxy',
				label: 'Proxy',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronScan_Rest,
				],
		},
		{
				name: '$implementation',
				label: 'Implementation',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TronContract,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronScan_Rest,
				],
		},
	],
} as const satisfies EntityDefinition
