// Generated from APP.ts. Do not edit by hand.

import { Caip2Namespace, Caip2Reference } from '$/constants/Network.ts'
import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NetworkSelector {
	Caip2 = 'Caip2',
	Slug = 'Slug',
}
export default {
	entityType: EntityType.Network,
	label: 'Network',
	labelPlural: 'networks',
	description: 'A blockchain, ledger, or protocol network with its own identity and supporting metadata.',
	selectors: [
		{
			name: NetworkSelector.Caip2,
			fields: [
				'caip2',
			],
		},
		{
			name: NetworkSelector.Slug,
			fields: [
				'slug',
			],
		},
	],
	fields: [
		{
			name: 'caip2',
			label: 'CAIP-2',
			description: 'The chain identifier in CAIP-2 namespace and reference form.',
			type: EntityFieldType.Primitive,
			primitiveType: type({ 'namespace': type.enumerated(...Object.values(Caip2Namespace)), 'reference': type.enumerated(...Object.values(Caip2Reference)) }),
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
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'namespace',
			label: 'Namespace',
			description: 'The namespace that qualifies the identifier.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$networkStack',
			label: 'Network stack',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NetworkStack,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'environment',
			label: 'Environment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
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
			name: '$$nativeAssets',
			label: 'Native assets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AssetInstance,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$blockExplorerUrls',
			label: 'Block explorer URLs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Url,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$faucetUrls',
			label: 'Faucet URLs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Url,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'Timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Network_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
