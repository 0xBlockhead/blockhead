// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum EthereumNetworkUpgradeSelector {
	EvmNetworkUpgradeId = 'EvmNetworkUpgradeId',
	EvmNetworkSlug = 'EvmNetworkSlug',
}
export default {
	entityType: EntityType.EthereumNetworkUpgrade,
	label: 'Ethereum network upgrade',
	labelPlural: 'Ethereum network upgrades',
	selectors: [
		{
			name: EthereumNetworkUpgradeSelector.EvmNetworkUpgradeId,
			fields: [
				'$network',
				'upgradeId',
			],
		},
		{
			name: EthereumNetworkUpgradeSelector.EvmNetworkSlug,
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
			name: 'activationBlock',
			label: 'Activation block',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activationTimestampMs',
			label: 'Activation time',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activationEpoch',
			label: 'Activation epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$networkExecutionUpgrade',
			label: 'Execution layer',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EthereumExecutionUpgrade,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$networkConsensusUpgrade',
			label: 'Consensus layer',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EthereumConsensusUpgrade,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$$proposals',
			label: 'Specification proposals',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SpecificationProposal,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
	],
} as const satisfies EntityDefinition
