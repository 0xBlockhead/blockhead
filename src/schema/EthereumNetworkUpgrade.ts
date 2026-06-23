import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum EthereumNetworkUpgradeSelector {
	EvmNetworkUpgradeId = 'evmNetworkUpgradeId',
	NetworkUpgradeId = '$network+upgradeId',
}
export default {
	entityType: EntityType.EthereumNetworkUpgrade,
	label: 'ethereum network upgrade',
	labelPlural: 'ethereum network upgrades',
	selectors: [
		{
			name: EthereumNetworkUpgradeSelector.EvmNetworkUpgradeId,
			fields: [
				'$network',
				'upgradeId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'upgradeId',
			label: 'upgrade ID',
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
			name: 'slug',
			label: 'Slug',
			description: 'A stable short name used by catalogs and URLs.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'activationBlock',
			label: 'activation block',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activationTimestampMs',
			label: 'activation timestamp ms',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activationEpoch',
			label: 'activation epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$networkExecutionUpgrade',
			label: 'network execution upgrade',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EthereumExecutionUpgrade,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$networkConsensusUpgrade',
			label: 'network consensus upgrade',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EthereumConsensusUpgrade,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$proposals',
			label: 'proposals',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SpecificationProposal,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
