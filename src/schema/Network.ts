import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum NetworkSelector {
	Caip2 = 'caip2',
	Slug = 'slug',
}
export default {
	entityType: EntityType.Network,
	label: 'network',
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
			primitiveType: type({"namespace": "string", "reference": "string"}),
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
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'namespace',
			label: 'Namespace',
			description: 'The namespace that qualifies the identifier.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'environment',
			label: 'environment',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$networkStack',
			label: 'network stack',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NetworkStack,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'executionEnvironments',
			label: 'execution environments',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'consensusMechanisms',
			label: 'consensus mechanisms',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'iconUrl',
			label: 'icon URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$icon',
			label: 'icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$nativeAssets',
			label: 'native assets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AssetInstance,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$blockExplorerUrls',
			label: 'block explorer urls',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Url,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$faucetUrls',
			label: 'faucet urls',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Url,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Network_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
