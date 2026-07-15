// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SpecificationProposalKindSelector {
	RealmCategory = 'RealmCategory',
}
export const SpecificationProposalKind = entity({
	entityType: EntityType.SpecificationProposalKind,
	labels: {
		singular: 'Specification proposal kind',
		plural: 'specification proposal kinds',
	},
})({
	realm: {
		label: 'Realm',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	category: {
		label: 'Category',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	labelPlural: {
		label: 'Label plural',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	slug: {
		label: 'Slug',
		description: 'A stable short name used by catalogs and URLs.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$specificationRealm: {
		label: 'Specification realm',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SpecificationRealm,
		cardinality: EntityFieldCardinality.One,
	},
	$$proposals: {
		label: 'Proposals',
		type: EntityFieldType.EntitiesReference,
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
