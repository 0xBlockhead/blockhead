// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum LensAccountSelector {
	Address = 'Address',
	LocalName = 'LocalName',
	LegacyProfileId = 'LegacyProfileId',
}
export default {
	entityType: EntityType.LensAccount,
	label: 'Lens account',
	labelPlural: 'Lens accounts',
	selectors: [
		{
			name: LensAccountSelector.Address,
			fields: [
				'address',
			],
		},
		{
			name: LensAccountSelector.LocalName,
			fields: [
				'localName',
			],
		},
		{
			name: LensAccountSelector.LegacyProfileId,
			fields: [
				'legacyProfileId',
			],
		},
	],
	fields: [
		{
			name: 'address',
			label: 'Address',
			type: EntityFieldType.Primitive,
			primitiveType: (EvmAddress),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'localName',
			label: 'Local name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'legacyProfileId',
			label: 'Legacy profile ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'displayName',
			label: 'Display name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'bio',
			label: 'Bio',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			label: 'Created',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'owner',
			label: 'Owner',
			type: EntityFieldType.Primitive,
			primitiveType: (EvmAddress),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'score',
			label: 'Score',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'isMemberOf',
			label: 'Memberships',
			type: EntityFieldType.Primitive,
			primitiveType: type('string').array(),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'iconUrl',
			label: 'Icon URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$icon',
			label: 'Icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LensAccount_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$managers',
			label: 'Managers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LensAccountManager,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$posts',
			label: 'Posts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LensPost,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Lens_Graphql,
			],
		},
	],
} as const satisfies EntityDefinition
