// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum XUserSelector {
	Id = 'Id',
	Username = 'Username',
}
export default {
	entityType: EntityType.XUser,
	label: 'X user',
	labelPlural: 'X users',
	selectors: [
		{
			name: XUserSelector.Id,
			fields: [
				'id',
			],
		},
		{
			name: XUserSelector.Username,
			fields: [
				'username',
			],
		},
	],
	fields: [
		{
				name: 'id',
				label: 'ID',
				description: 'The identifier assigned by the source domain.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'username',
				label: 'Username',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'name',
				label: 'Name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'description',
				label: 'Description',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'verified',
				label: 'Verified',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
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
				name: 'location',
				label: 'Location',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'websiteUrl',
				label: 'Website URL',
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
				name: '$profileBanner',
				label: 'Profile banner',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Media,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.XUser_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.X_Rest,
					Source.X_FxEmbed_Rest,
				],
		},
		{
				name: '$$posts',
				label: 'Posts',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.XPost,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.X_Rest,
				],
		},
	],
} as const satisfies EntityDefinition
