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
		label: 'session',
		entityType: EntityType.AcpSession,
		cardinality: EntityFieldCardinality.One,
	},
	terminalId: {
		label: 'terminal ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	command: {
		label: 'command',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cwd: {
		label: 'cwd',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	releasedAt: {
		label: 'released AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
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
