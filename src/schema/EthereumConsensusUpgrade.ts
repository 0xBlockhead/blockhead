// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ConsensusProtocol } from '$/schema/NetworkUpgradeProtocols.ts'
import { type } from 'arktype'

export enum EthereumConsensusUpgradeSelector {
	EvmNetworkUpgradeId = 'EvmNetworkUpgradeId',
	EvmNetworkSlug = 'EvmNetworkSlug',
}
export default {
	entityType: EntityType.EthereumConsensusUpgrade,
	label: 'Ethereum consensus upgrade',
	labelPlural: 'Ethereum consensus upgrades',
	selectors: [
		{
			name: EthereumConsensusUpgradeSelector.EvmNetworkUpgradeId,
			fields: [
				'$network',
				'upgradeId',
			],
		},
		{
			name: EthereumConsensusUpgradeSelector.EvmNetworkSlug,
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
				name: 'previousForkVersion',
				label: 'Previous fork version',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'currentForkVersion',
				label: 'Current fork version',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'protocol',
				label: 'Consensus fork',
				type: EntityFieldType.Primitive,
				primitiveType: type.enumerated(...Object.values(ConsensusProtocol)),
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
				name: 'linkConsensusDocs',
				label: 'Consensus docs',
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
				name: '$$proposals',
				label: 'Specification proposals',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SpecificationProposal,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
