// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.RadicleRepository,
	labels: {
		singular: 'radicle repository',
		plural: 'radicle repositories',
	},
})({
	rid: {
		label: 'rid',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$gitRepository: {
		label: 'Git repository',
		entityType: EntityType.GitRepository,
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	visibility: {
		label: 'visibility',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	defaultBranch: {
		label: 'default branch',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$delegates: {
		label: 'delegates',
		entityType: EntityType.RadicleDelegate,
		cardinality: EntityFieldCardinality.Many,
	},
	$$signedRefs: {
		label: 'signed refs',
		entityType: EntityType.RadicleSignedRef,
		cardinality: EntityFieldCardinality.Many,
	},
	$$issues: {
		label: 'issues',
		entityType: EntityType.RadicleIssue,
		cardinality: EntityFieldCardinality.Many,
	},
	$$patches: {
		label: 'patches',
		entityType: EntityType.RadiclePatch,
		cardinality: EntityFieldCardinality.Many,
	},
	$$seedObservations: {
		label: 'seed observations',
		entityType: EntityType.BlockheadRadicleSeedObservation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Rid: [
			'rid',
		],
	},
})
