import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum SpecificationRealmSelector {
	Realm = 'realm',
}
export default {
	entityType: EntityType.SpecificationRealm,
	label: 'specification realm',
	labelPlural: 'specification realms',
	description: 'A standards or proposal namespace, such as Ethereum, Bitcoin, or Chain Agnostic.',
	selectors: [
		{
			name: SpecificationRealmSelector.Realm,
			fields: [
				'realm',
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
			cardinality: EntityFieldCardinality.ZeroOrOne,
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
			name: '$$proposalKinds',
			label: 'proposal kinds',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SpecificationProposalKind,
			cardinality: EntityFieldCardinality.Many,
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
