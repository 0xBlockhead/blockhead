import { type } from 'arktype'
import {
	NetworkEnvironment,
	NetworkNamespace,
} from '$/constants/Network.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import {
	conditionalOn,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum NetworkSelector {
	Caip2 = 'caip2',
	Slug = 'slug',
}

const networkBaseFields = [
	{
		name: 'slug',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	{
		name: 'name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	{
		name: 'caip2',
		type: EntityFieldType.Primitive,
		primitiveType: type({
			namespace: 'string',
			reference: 'string',
		}),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	{
		name: 'namespace',
		type: EntityFieldType.Primitive,
		primitiveType: type.valueOf(NetworkNamespace),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	{
		name: 'environment',
		type: EntityFieldType.Primitive,
		primitiveType: type.valueOf(NetworkEnvironment),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
] as const satisfies readonly EntityFieldDefinition[]

const evmNetworkCondition = conditionalOn(
	networkBaseFields,
	'namespace',
	[
		NetworkNamespace.Evm,
	]
)

export const networkFields = [
	...networkBaseFields,
	{
		name: '$parent',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		when: evmNetworkCondition,
		defaultSources: [
			Source.Constants_Internal,
			Source.Chainlist_Rest,
			Source.EthereumLists_Rest,
			Source.Superchain_Github,
			Source.L2Beat_Rest,
		],
	},
	{
		name: 'layerNumber',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		when: evmNetworkCondition,
		defaultSources: [
			Source.Constants_Internal,
			Source.Chainlist_Rest,
			Source.EthereumLists_Rest,
		],
	},
	{
		name: '$mainnet',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		when: evmNetworkCondition,
		defaultSources: [
			Source.Constants_Internal,
			Source.Chainlist_Rest,
			Source.Superchain_Github,
		],
	},
	{
		name: '$$testnets',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrMany,
		when: evmNetworkCondition,
		defaultSources: [
			Source.Constants_Internal,
			Source.Chainlist_Rest,
			Source.Superchain_Github,
		],
	},
	{
		name: '$$childLayers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrMany,
		when: evmNetworkCondition,
		defaultSources: [
			Source.Constants_Internal,
			Source.Chainlist_Rest,
			Source.EthereumLists_Rest,
			Source.Superchain_Github,
			Source.L2Beat_Rest,
		],
	},
	{
		name: '$icon',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Chainlist_Rest,
			Source.EthereumLists_Rest,
			Source.Lifi_Rest,
			Source.TrustWalletAssets_Github,
		],
	},
	{
		name: '$$executionEnvironments',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ExecutionEnvironment,
		cardinality: EntityFieldCardinality.ZeroOrMany,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	{
		name: '$$consensusMechanisms',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ConsensusMechanism,
		cardinality: EntityFieldCardinality.ZeroOrMany,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	{
		name: '$networkStack',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.NetworkStack,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	{
		name: '$$nativeAssets',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.ZeroOrMany,
		defaultSources: [
			Source.Constants_Internal,
			Source.CosmosChainRegistry_Github,
		],
	},
	{
		name: '$$faucetUrls',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Url,
		cardinality: EntityFieldCardinality.ZeroOrMany,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	{
		name: '$$blockExplorerUrls',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Url,
		cardinality: EntityFieldCardinality.ZeroOrMany,
		defaultSources: [
			Source.Constants_Internal,
			Source.CosmosChainRegistry_Github,
		],
	},
] as const satisfies readonly EntityFieldDefinition[]

export const networkFieldByName = Object.fromEntries(
	networkFields.map((field) => [
		field.name,
		field,
	])
)

export default {
	entityType: EntityType.Network,

	label: 'Network',
	labelPlural: 'Networks',

	selectors: [
		{
			name: NetworkSelector.Caip2,
			fields: ['caip2'],
		},
		{
			name: NetworkSelector.Slug,
			fields: ['slug'],
		},
	],

	fields: networkFields,
} as const satisfies EntityDefinition
