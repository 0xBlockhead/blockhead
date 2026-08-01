// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.RadicleIdentityRevision,
	labels: {
		singular: 'radicle identity revision',
		plural: 'radicle identity revisions',
	},
})({
	rid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	revision: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	previousRevision: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	documentHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	delegateDids: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	threshold: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signedByDids: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	verificationStatus: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		RidRevision: [
			'rid',
			'revision',
		],
	},
})
