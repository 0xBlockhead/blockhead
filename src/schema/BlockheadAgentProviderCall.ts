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
		entityType: EntityType.BlockheadAgentConversationTurn,
		cardinality: EntityFieldCardinality.One,
	},
	indexInTurn: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$connection: {
		entityType: EntityType.BlockheadAgentConnection,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$provider: {
		entityType: EntityType.AiModelProvider,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$model: {
		entityType: EntityType.AiModel,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$operation: {
		entityType: EntityType.AiProviderApiOperation,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$mcpToolCall: {
		entityType: EntityType.McpToolCall,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$a2aTask: {
		entityType: EntityType.A2aTask,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$acpSession: {
		entityType: EntityType.AcpSession,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$acpPromptTurn: {
		entityType: EntityType.AcpPromptTurn,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerRequestId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerResponseId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	startedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	completedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestHashAlgorithm: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	responseHashAlgorithm: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	responseHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	inputTokenCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	outputTokenCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cost: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	latencyMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
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
