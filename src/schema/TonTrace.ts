// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TonTraceSelector {
	NetworkTraceIdSource = 'NetworkTraceIdSource',
	RootMessageSource = 'RootMessageSource',
}
export default {
	entityType: EntityType.TonTrace,
	label: 'ton trace',
	labelPlural: 'ton traces',
	selectors: [
		{
			name: TonTraceSelector.NetworkTraceIdSource,
			fields: [
				'$network',
				'traceId',
				'source',
			],
		},
		{
			name: TonTraceSelector.RootMessageSource,
			fields: [
				'$rootMessage',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'traceId',
			label: 'trace ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$rootMessage',
			label: 'root message',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonMessage,
			cardinality: EntityFieldCardinality.ZeroOrOne,
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
			name: 'rootTransactionSelector',
			label: 'root transaction selector',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'startedAtMs',
			label: 'started AT ms',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonTrace_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$messages',
			label: 'messages',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonMessage,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
