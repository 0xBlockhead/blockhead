// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AcpSessionUpdate,
	labels: {
		singular: 'acp session update',
		plural: 'acp session updates',
	},
})({
	$session: {
		entityType: EntityType.AcpSession,
		cardinality: EntityFieldCardinality.One,
	},
	sequence: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	updateKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payload: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SessionSequence: [
			'$session',
			'sequence',
		],
	},
})
