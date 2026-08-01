// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadAgentProviderCall,
	labels: {
		singular: 'blockhead agent provider call',
		plural: 'blockhead agent provider calls',
	},
})({
	$turn: {
		label: 'turn',
		entityType: EntityType.BlockheadAgentConversationTurn,
		cardinality: EntityFieldCardinality.One,
	},
	indexInTurn: {
		label: 'index in turn',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$connection: {
		label: 'connection',
		entityType: EntityType.BlockheadAgentConnection,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$provider: {
		label: 'provider',
		entityType: EntityType.AiModelProvider,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$model: {
		label: 'model',
		entityType: EntityType.AiModel,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$operation: {
		label: 'operation',
		entityType: EntityType.AiProviderApiOperation,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$mcpToolCall: {
		label: 'MCP tool call',
		entityType: EntityType.McpToolCall,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$a2aTask: {
		label: 'A2A task',
		entityType: EntityType.A2aTask,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$acpSession: {
		label: 'ACP session',
		entityType: EntityType.AcpSession,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$acpPromptTurn: {
		label: 'ACP prompt turn',
		entityType: EntityType.AcpPromptTurn,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerRequestId: {
		label: 'provider request ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerResponseId: {
		label: 'provider response ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	startedAt: {
		label: 'started AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	completedAt: {
		label: 'completed AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestHashAlgorithm: {
		label: 'request hash algorithm',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestHash: {
		label: 'request hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	responseHashAlgorithm: {
		label: 'response hash algorithm',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	responseHash: {
		label: 'response hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	inputTokenCount: {
		label: 'input token count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	outputTokenCount: {
		label: 'output token count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cost: {
		label: 'cost',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	latencyMs: {
		label: 'latency ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'error',
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
