// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AcpPromptTurn,
		cardinality: EntityFieldCardinality.One,
	},
	toolCallId: {
		label: 'tool call ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	toolName: {
		label: 'tool name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	serverName: {
		label: 'server name',
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
