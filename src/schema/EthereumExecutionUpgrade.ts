// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ExecutionProtocol } from '$/schema/NetworkUpgradeProtocols.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum EthereumExecutionUpgradeSelector {
	EvmNetworkUpgradeId = 'EvmNetworkUpgradeId',
	EvmNetworkSlug = 'EvmNetworkSlug',
}
export default {
	entityType: EntityType.EthereumExecutionUpgrade,
	label: 'Ethereum execution upgrade',
	labelPlural: 'Ethereum execution upgrades',
	selectors: [
		{
			name: EthereumExecutionUpgradeSelector.EvmNetworkUpgradeId,
			fields: [
				'$network',
				'upgradeId',
			],
		},
		{
			name: EthereumExecutionUpgradeSelector.EvmNetworkSlug,
			fields: [
				'$network',
				'slug',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'upgradeId',
				label: 'Upgrade ID',
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
				defaultSources: [
					Source.Constants_Internal,
				],
		},
		{
				name: 'slug',
				label: 'Slug',
				description: 'A stable short name used by catalogs and URLs.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
		},
		{
				name: 'activationBlock',
				label: 'Activation block',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
		},
		{
				name: 'activationTimestampMs',
				label: 'Activation time',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
		},
		{
				name: 'activationEpoch',
				label: 'Activation epoch',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
		},
		{
				name: 'protocol',
				label: 'Execution fork',
				type: EntityFieldType.Primitive,
				primitiveType: type.enumerated(...Object.values(ExecutionProtocol)),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'layer',
				label: 'Layer',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'forkHash',
				label: 'Fork hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'linkEthereumOrg',
				label: 'Ethereum.org',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'linkExecutionDocs',
				label: 'Execution docs',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'linkForkcast',
				label: 'Forkcast',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'executionSpecsPinnedMarkdownFilename',
				label: 'Execution specs markdown',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'executionSpecsMainnetUpgradeMarkdown',
				label: 'Mainnet upgrade markdown',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$proposals',
				label: 'Specification proposals',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SpecificationProposal,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
