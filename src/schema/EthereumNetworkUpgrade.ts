import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/EvmNetwork.ts'
import { Source } from '$/sources/Source.ts'

export enum EthereumNetworkUpgradeSelector {
	EvmNetworkUpgradeId = 'evmNetworkUpgradeId',
}


/** Combined or single-layer upgrade label: references `NetworkExecutionUpgrade`; may also reference `NetworkConsensusUpgrade`. */
export default {
	entityType: EntityType.EthereumNetworkUpgrade,

	label: 'Network upgrade',
	labelPlural: 'Network upgrades',

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
			name: '$networkExecutionUpgrade',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EthereumExecutionUpgrade,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$networkConsensusUpgrade',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EthereumConsensusUpgrade,
			cardinality: EntityFieldCardinality.ZeroOrOne,
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
