// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AcpToolCall,
	labels: {
		singular: 'acp tool call',
		plural: 'acp tool calls',
	},
})({
	$promptTurn: {
		label: 'prompt turn',
		entityType: EntityType.AcpPromptTurn,
		cardinality: EntityFieldCardinality.One,
	},
	toolCallId: {
		label: 'tool call ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	toolName: {
		label: 'tool name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	serverName: {
		label: 'server name',
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
	inputHashAlgorithm: {
		label: 'input hash algorithm',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	inputHash: {
		label: 'input hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	outputHashAlgorithm: {
		label: 'output hash algorithm',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	outputHash: {
		label: 'output hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.AcpToolCall_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		PromptTurnToolCallId: [
			'$promptTurn',
			'toolCallId',
		],
	},
})
