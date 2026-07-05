// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BlockheadAgentProviderCallSelector {
	TurnIndexInTurn = 'TurnIndexInTurn',
}
export default {
	entityType: EntityType.BlockheadAgentProviderCall,
	label: 'blockhead agent provider call',
	labelPlural: 'blockhead agent provider calls',
	selectors: [
		{
			name: BlockheadAgentProviderCallSelector.TurnIndexInTurn,
			fields: [
				'$turn',
				'indexInTurn',
			],
		},
	],
	fields: [
		{
				name: '$turn',
				label: 'turn',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadAgentConversationTurn,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'indexInTurn',
				label: 'index in turn',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$connection',
				label: 'connection',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadAgentConnection,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$provider',
				label: 'provider',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AiModelProvider,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$model',
				label: 'model',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AiModel,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$operation',
				label: 'operation',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AiProviderApiOperation,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'providerRequestId',
				label: 'provider request ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'providerResponseId',
				label: 'provider response ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'startedAt',
				label: 'started AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'completedAt',
				label: 'completed AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'status',
				label: 'status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'requestHashAlgorithm',
				label: 'request hash algorithm',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'requestHash',
				label: 'request hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'responseHashAlgorithm',
				label: 'response hash algorithm',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'responseHash',
				label: 'response hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'inputTokenCount',
				label: 'input token count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'outputTokenCount',
				label: 'output token count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'cost',
				label: 'cost',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'latencyMs',
				label: 'latency ms',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'error',
				label: 'error',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
