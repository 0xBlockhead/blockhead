// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum LensUsernameSelector {
	NamespaceLocalName = 'NamespaceLocalName',
	Id = 'Id',
}
export default {
	entityType: EntityType.LensUsername,
	label: 'Lens username',
	labelPlural: 'Lens usernames',
	selectors: [
		{
			name: LensUsernameSelector.NamespaceLocalName,
			fields: [
				'namespace',
				'localName',
			],
		},
		{
			name: LensUsernameSelector.Id,
			fields: [
				'id',
			],
		},
	],
	fields: [
		{
				name: 'namespace',
				label: 'Namespace',
				description: 'The namespace that qualifies the identifier.',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'localName',
				label: 'Local name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'id',
				label: 'ID',
				description: 'The identifier assigned by the source domain.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'value',
				label: 'Value',
				description: 'The source-domain value.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'ownedBy',
				label: 'Owned by',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'linkedTo',
				label: 'Linked to',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'timestamp',
				label: 'Timestamp',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$namespace',
				label: 'Namespace',
				description: 'The namespace that qualifies the identifier.',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.LensUsernameNamespace,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$account',
				label: 'Account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.LensAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$owner',
				label: 'Owner',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
