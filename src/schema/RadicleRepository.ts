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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$gitRepository: {
		entityType: EntityType.GitRepository,
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	visibility: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	defaultBranch: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$delegates: {
		entityType: EntityType.RadicleDelegate,
		cardinality: EntityFieldCardinality.Many,
	},
	$$signedRefs: {
		entityType: EntityType.RadicleSignedRef,
		cardinality: EntityFieldCardinality.Many,
	},
	$$issues: {
		entityType: EntityType.RadicleIssue,
		cardinality: EntityFieldCardinality.Many,
	},
	$$patches: {
		entityType: EntityType.RadiclePatch,
		cardinality: EntityFieldCardinality.Many,
	},
	$$seedObservations: {
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
