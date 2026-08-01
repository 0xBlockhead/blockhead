// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AcpTerminal,
	labels: {
		singular: 'acp terminal',
		plural: 'acp terminals',
	},
})({
	$session: {
		entityType: EntityType.AcpSession,
		cardinality: EntityFieldCardinality.One,
	},
	terminalId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	command: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cwd: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	releasedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.AcpTerminal_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		SessionTerminalId: [
			'$session',
			'terminalId',
		],
	},
})
