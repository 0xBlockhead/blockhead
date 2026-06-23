import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CardanoNetworkSelector {
	Network = '$network',
}
export default {
	entityType: EntityType.CardanoNetwork,
	label: 'cardano network',
	labelPlural: 'cardano networks',
	selectors: [
		{
			name: CardanoNetworkSelector.Network,
			fields: [
				'$network',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$blocks',
			label: 'blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoBlock,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$addresses',
			label: 'addresses',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoAddress,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$stakeCredentials',
			label: 'stake credentials',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoStakeCredential,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$stakePools',
			label: 'stake pools',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoStakePool,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$dReps',
			label: 'd reps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoDRep,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$governanceProposals',
			label: 'governance proposals',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoGovernanceProposal,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$assets',
			label: 'assets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoNativeAsset,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$protocolParameterEpochs',
			label: 'protocol parameter epochs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoProtocolParameters_Epoch,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$constitutionEpochs',
			label: 'constitution epochs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoConstitution_Epoch,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$committeeEpochs',
			label: 'committee epochs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoCommittee_Epoch,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
