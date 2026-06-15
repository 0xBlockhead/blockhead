import { type } from 'arktype'

import { EvmAddress } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum LensAccountSelector {
	Address = 'address',
	LocalName = 'localName',
	LegacyProfileId = 'legacyProfileId',
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
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'legacyProfileId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'localName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'displayName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'bio',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'followerCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'followingCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LensAccount_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Lens_Graphql,
			],
		},
		{
			name: '$icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lens_Graphql,
			],
		},
		{
			name: '$$posts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LensPost,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
