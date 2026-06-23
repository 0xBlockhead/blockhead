import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum SpecificationProposalKindSelector {
	RealmCategory = 'realmCategory',
}
export default {
	entityType: EntityType.SpecificationProposalKind,
	label: 'specification proposal kind',
	labelPlural: 'specification proposal kinds',
	description: 'A proposal category within a specification realm, such as EIP, BIP, or CAIP.',
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
			label: 'realm',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'category',
			label: 'category',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'label',
			label: 'Label',
			description: 'A human-readable name for the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'labelPlural',
			label: 'label plural',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'slug',
			label: 'Slug',
			description: 'A stable short name used by catalogs and URLs.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$specificationRealm',
			label: 'specification realm',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SpecificationRealm,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$proposals',
			label: 'proposals',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SpecificationProposal,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
