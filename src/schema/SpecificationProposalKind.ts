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
		label: 'Realm',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	category: {
		label: 'Category',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	labelPlural: {
		label: 'Label plural',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	slug: {
		label: 'Slug',
		description: 'A stable short name used by catalogs and URLs.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$specificationRealm: {
		label: 'Specification realm',
		entityType: EntityType.SpecificationRealm,
		cardinality: EntityFieldCardinality.One,
	},
	$$proposals: {
		label: 'Proposals',
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
