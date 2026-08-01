// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.McpToolCall,
	labels: {
		singular: 'mcp tool call',
		plural: 'mcp tool calls',
	},
})({
	$server: {
		label: 'server',
		entityType: EntityType.McpServer,
		cardinality: EntityFieldCardinality.One,
	},
	callId: {
		label: 'call ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$tool: {
		label: 'tool',
		entityType: EntityType.McpTool,
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
		entityType: EntityType.McpToolCall_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ServerCallId: [
			'$server',
			'callId',
		],
	},
})
