import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { ConsensusProtocol } from '$/schema/NetworkUpgradeProtocols.ts'
import { Source } from '$/sources/Source.ts'

export enum EthereumConsensusUpgradeSelector {
	EvmNetworkUpgradeId = 'evmNetworkUpgradeId',
}

export default {
	entityType: EntityType.EthereumConsensusUpgrade,

	label: 'Consensus Upgrade',
	labelPlural: 'Consensus Upgrades',

	selectors: [
		{
			name: EthereumConsensusUpgradeSelector.EvmNetworkUpgradeId,
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
			name: 'previousForkVersion',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'currentForkVersion',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'protocol',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(ConsensusProtocol),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'linkEthereumOrg',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'linkConsensusDocs',
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
			name: '$$proposals',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SpecificationProposal,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Constants_Internal],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
