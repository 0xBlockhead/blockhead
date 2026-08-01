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
		label: 'Realm',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	category: {
		label: 'Category',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	number: {
		label: 'Number',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	realmLabel: {
		label: 'Realm label',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	categoryLabel: {
		label: 'Category label',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	categoryLabelPlural: {
		label: 'Category label plural',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	documentCategory: {
		label: 'Document category',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	documentTitle: {
		label: 'Document title',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	documentStatus: {
		label: 'Document status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	documentBody: {
		label: 'Document body',
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
