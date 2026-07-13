// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CardanoNetworkSelector {
	Network = 'Network',
}
export const CardanoNetwork = entity({
	entityType: EntityType.CardanoNetwork,
	labels: {
		singular: 'cardano network',
		plural: 'cardano networks',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$blocks: {
		label: 'blocks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$addresses: {
		label: 'addresses',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoAddress,
		cardinality: EntityFieldCardinality.Many,
	},
	$$stakeCredentials: {
		label: 'stake credentials',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoStakeCredential,
		cardinality: EntityFieldCardinality.Many,
	},
	$$stakePools: {
		label: 'stake pools',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoStakePool,
		cardinality: EntityFieldCardinality.Many,
	},
	$$dReps: {
		label: 'd reps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoDRep,
		cardinality: EntityFieldCardinality.Many,
	},
	$$governanceProposals: {
		label: 'governance proposals',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoGovernanceProposal,
		cardinality: EntityFieldCardinality.Many,
	},
	$$assets: {
		label: 'assets',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoNativeAsset,
		cardinality: EntityFieldCardinality.Many,
	},
	$$protocolParameterEpochs: {
		label: 'protocol parameter epochs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoProtocolParameters_Epoch,
		cardinality: EntityFieldCardinality.Many,
	},
	$$constitutionEpochs: {
		label: 'constitution epochs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoConstitution_Epoch,
		cardinality: EntityFieldCardinality.Many,
	},
	$$committeeEpochs: {
		label: 'committee epochs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoCommittee_Epoch,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
