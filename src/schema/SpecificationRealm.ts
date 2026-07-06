// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SpecificationRealmSelector {
	Realm = 'Realm',
}
export default {
	entityType: EntityType.SpecificationRealm,
	label: 'Specification realm',
	labelPlural: 'specification realms',
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
			label: 'Realm',
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
			cardinality: EntityFieldCardinality.ZeroOrOne,
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
			name: '$$proposalKinds',
			label: 'Proposal kinds',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SpecificationProposalKind,
			cardinality: EntityFieldCardinality.Many,
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
