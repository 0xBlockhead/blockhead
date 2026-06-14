import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import {
	ExecutionProtocol,
	NetworkExecutionUpgradeLayer,
} from '$/schema/NetworkUpgradeProtocols.ts'
import { Source } from '$/sources/Source.ts'

export enum EthereumExecutionUpgradeSelector {
	EvmNetworkUpgradeId = 'evmNetworkUpgradeId',
}

export default {
	entityType: EntityType.EthereumExecutionUpgrade,

	label: 'Execution Upgrade',
	labelPlural: 'Execution Upgrades',

	selectors: [
		{
			name: EthereumExecutionUpgradeSelector.EvmNetworkUpgradeId,
			fields: [
				'$network',
				'upgradeId',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'upgradeId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'slug',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'activationBlock',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activationTimestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activationEpoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'protocol',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(ExecutionProtocol),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'layer',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(NetworkExecutionUpgradeLayer),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'forkHash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'linkEthereumOrg',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'linkExecutionDocs',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'linkForkcast',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'executionSpecsPinnedMarkdownFilename',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'executionSpecsMainnetUpgradeMarkdown',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.EthereumSpecs_Github,
			],
		},
		{
			name: '$$proposals',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SpecificationProposal,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Constants_Internal],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
