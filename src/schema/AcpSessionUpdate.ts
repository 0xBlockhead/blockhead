// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		label: 'session',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AcpSession,
		cardinality: EntityFieldCardinality.One,
	},
	sequence: {
		label: 'sequence',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	updateKind: {
		label: 'update kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payload: {
		label: 'payload',
		type: EntityFieldType.Primitive,
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
