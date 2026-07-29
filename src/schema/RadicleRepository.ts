// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$gitRepository: {
		label: 'Git repository',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.GitRepository,
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	visibility: {
		label: 'visibility',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	defaultBranch: {
		label: 'default branch',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$delegates: {
		label: 'delegates',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.RadicleDelegate,
		cardinality: EntityFieldCardinality.Many,
	},
	$$signedRefs: {
		label: 'signed refs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.RadicleSignedRef,
		cardinality: EntityFieldCardinality.Many,
	},
	$$issues: {
		label: 'issues',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.RadicleIssue,
		cardinality: EntityFieldCardinality.Many,
	},
	$$patches: {
		label: 'patches',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.RadiclePatch,
		cardinality: EntityFieldCardinality.Many,
	},
	$$seedObservations: {
		label: 'seed observations',
		type: EntityFieldType.EntitiesReference,
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
