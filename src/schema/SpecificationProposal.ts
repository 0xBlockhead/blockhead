// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SpecificationProposal,
	labels: {
		singular: 'Specification proposal',
		plural: 'specification proposals',
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
	number: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	realmLabel: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	categoryLabel: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	categoryLabelPlural: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	documentCategory: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	documentTitle: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	documentStatus: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	documentBody: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		RealmCategoryNumber: [
			'realm',
			'category',
			'number',
		],
	},
})
