// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SpecificationProposalKind,
	labels: {
		singular: 'Specification proposal kind',
		plural: 'specification proposal kinds',
	},
})({
	realm: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	category: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	labelPlural: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	slug: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$specificationRealm: {
		entityType: EntityType.SpecificationRealm,
		cardinality: EntityFieldCardinality.One,
	},
	$$proposals: {
		entityType: EntityType.SpecificationProposal,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		RealmCategory: [
			'realm',
			'category',
		],
	},
})
