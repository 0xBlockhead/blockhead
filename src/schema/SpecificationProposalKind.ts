// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SpecificationProposalKindSelector {
	RealmCategory = 'RealmCategory',
}
export default {
	entityType: EntityType.SpecificationProposalKind,
	label: 'Specification proposal kind',
	labelPlural: 'specification proposal kinds',
	selectors: [
		{
			name: SpecificationProposalKindSelector.RealmCategory,
			fields: [
				'realm',
				'category',
			],
		},
	],
	fields: [
		{
				name: 'realm',
				label: 'Realm',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'category',
				label: 'Category',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'label',
				label: 'Label',
				description: 'A human-readable name for the subject.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'labelPlural',
				label: 'Label plural',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'slug',
				label: 'Slug',
				description: 'A stable short name used by catalogs and URLs.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$specificationRealm',
				label: 'Specification realm',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.SpecificationRealm,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$$proposals',
				label: 'Proposals',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SpecificationProposal,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
