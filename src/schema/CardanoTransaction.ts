// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CardanoTransactionSelector {
	NetworkHash = 'NetworkHash',
}
export const CardanoTransaction = entity({
	entityType: EntityType.CardanoTransaction,
	labels: {
		singular: 'cardano transaction',
		plural: 'cardano transactions',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		label: 'Hash',
		description: 'The hash that identifies this object in its protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	blockSlot: {
		label: 'block slot',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fee: {
		label: 'fee',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deposit: {
		label: 'deposit',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sizeBytes: {
		label: 'size bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validityStartSlot: {
		label: 'validity start slot',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ttlSlot: {
		label: 'ttl slot',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metadata: {
		label: 'metadata',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$inputs: {
		label: 'inputs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoTxInput,
		cardinality: EntityFieldCardinality.Many,
	},
	$$outputs: {
		label: 'outputs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoTxOutput,
		cardinality: EntityFieldCardinality.Many,
	},
	$$certificates: {
		label: 'certificates',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoCertificate,
		cardinality: EntityFieldCardinality.Many,
	},
	$$scripts: {
		label: 'scripts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoScriptWitness,
		cardinality: EntityFieldCardinality.Many,
	},
	$$governanceProposals: {
		label: 'governance proposals',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoGovernanceProposal,
		cardinality: EntityFieldCardinality.Many,
	},
	$$governanceVotes: {
		label: 'governance votes',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoGovernanceVote,
		cardinality: EntityFieldCardinality.Many,
	},
	$$assets: {
		label: 'assets',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoNativeAsset,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkHash: [
			'$network',
			'hash',
		],
	},
})
