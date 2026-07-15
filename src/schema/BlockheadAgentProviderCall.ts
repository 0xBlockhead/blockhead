// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BlockheadAgentProviderCallSelector {
	TurnIndexInTurn = 'TurnIndexInTurn',
}
export const BlockheadAgentProviderCall = entity({
	entityType: EntityType.BlockheadAgentProviderCall,
	labels: {
		singular: 'blockhead agent provider call',
		plural: 'blockhead agent provider calls',
	},
})({
	$turn: {
		label: 'turn',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadAgentConversationTurn,
		cardinality: EntityFieldCardinality.One,
	},
	indexInTurn: {
		label: 'index in turn',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$connection: {
		label: 'connection',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadAgentConnection,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$provider: {
		label: 'provider',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AiModelProvider,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$model: {
		label: 'model',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AiModel,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$operation: {
		label: 'operation',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AiProviderApiOperation,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$mcpToolCall: {
		label: 'MCP tool call',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.McpToolCall,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$a2aTask: {
		label: 'A2A task',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.A2aTask,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$acpSession: {
		label: 'ACP session',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AcpSession,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$acpPromptTurn: {
		label: 'ACP prompt turn',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AcpPromptTurn,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerRequestId: {
		label: 'provider request ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerResponseId: {
		label: 'provider response ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	startedAt: {
		label: 'started AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	completedAt: {
		label: 'completed AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestHashAlgorithm: {
		label: 'request hash algorithm',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestHash: {
		label: 'request hash',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	responseHashAlgorithm: {
		label: 'response hash algorithm',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	responseHash: {
		label: 'response hash',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	inputTokenCount: {
		label: 'input token count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	outputTokenCount: {
		label: 'output token count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cost: {
		label: 'cost',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	latencyMs: {
		label: 'latency ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'error',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TurnIndexInTurn: [
			'$turn',
			'indexInTurn',
		],
	},
})
