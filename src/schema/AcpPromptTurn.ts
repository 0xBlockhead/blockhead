// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AcpPromptTurn,
	labels: {
		singular: 'acp prompt turn',
		plural: 'acp prompt turns',
	},
})({
	$session: {
		label: 'session',
		entityType: EntityType.AcpSession,
		cardinality: EntityFieldCardinality.One,
	},
	turnId: {
		label: 'turn ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
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
	cancelledAt: {
		label: 'cancelled AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stopReason: {
		label: 'stop reason',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	userPromptHashAlgorithm: {
		label: 'user prompt hash algorithm',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	userPromptHash: {
		label: 'user prompt hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SessionTurnId: [
			'$session',
			'turnId',
		],
	},
})
