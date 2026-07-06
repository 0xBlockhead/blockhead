// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum EvmTraceSelector {
	TransactionTraceAddress = 'TransactionTraceAddress',
}
export default {
	entityType: EntityType.EvmTrace,
	label: 'EVM trace',
	labelPlural: 'EVM traces',
	selectors: [
		{
			name: EvmTraceSelector.TransactionTraceAddress,
			fields: [
				'$transaction',
				'traceAddress',
			],
		},
	],
	fields: [
		{
			name: '$transaction',
			label: 'Transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'traceAddress',
			label: 'Trace address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'index',
			label: 'Index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'type',
			label: 'Type',
			description: 'The source-domain type or category.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'from',
			label: 'From',
			type: EntityFieldType.Primitive,
			primitiveType: (EvmAddress),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'to',
			label: 'To',
			type: EntityFieldType.Primitive,
			primitiveType: (EvmAddress),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'value',
			label: 'Value',
			description: 'The source-domain value.',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'gas',
			label: 'Gas',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'gasUsed',
			label: 'Gas used',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'input',
			label: 'Input',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'output',
			label: 'Output',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'error',
			label: 'Error',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$children',
			label: 'Children',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmTrace,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
