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
		label: 'rid',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	revision: {
		label: 'revision',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	previousRevision: {
		label: 'previous revision',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	documentHash: {
		label: 'document hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	delegateDids: {
		label: 'delegate dids',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	threshold: {
		label: 'threshold',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signedByDids: {
		label: 'signed by dids',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	verificationStatus: {
		label: 'verification status',
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
