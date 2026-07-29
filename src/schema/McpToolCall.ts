// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.McpServer,
		cardinality: EntityFieldCardinality.One,
	},
	callId: {
		label: 'call ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$tool: {
		label: 'tool',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.McpTool,
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
	inputHashAlgorithm: {
		label: 'input hash algorithm',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	inputHash: {
		label: 'input hash',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	outputHashAlgorithm: {
		label: 'output hash algorithm',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	outputHash: {
		label: 'output hash',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
