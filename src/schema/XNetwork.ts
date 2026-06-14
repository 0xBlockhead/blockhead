import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'

export enum XNetworkSelector {
	Scope = 'scope',
}

export default {
	entityType: EntityType.XNetwork,

	label: 'X network',
	labelPlural: 'X networks',

	selectors: [
		{
			name: XNetworkSelector.Scope,
			fields: [
				'scope',
			],
		},
	],

	fields: [
		{
			name: 'scope',
			type: EntityFieldType.Primitive,
			primitiveType: type.unit('XNetwork'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'protocolName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'homeUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'docsUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'registryLabel',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'topology',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$$xUsers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.XUser,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.X_Rest,
				Source.X_FxEmbed_Rest,
			],
		},
		{
			name: '$$xPosts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.XPost,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.X_Rest,
				Source.X_FxEmbed_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
