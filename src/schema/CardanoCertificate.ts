// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CardanoCertificateSelector {
	TransactionCertificateIndex = 'TransactionCertificateIndex',
}
export const CardanoCertificate = entity({
	entityType: EntityType.CardanoCertificate,
	labels: {
		singular: 'cardano certificate',
		plural: 'cardano certificates',
	},
})({
	$transaction: {
		label: 'transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CardanoTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	certificateIndex: {
		label: 'certificate index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	certificateKind: {
		label: 'certificate kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$stakeCredential: {
		label: 'stake credential',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CardanoStakeCredential,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$stakePool: {
		label: 'stake pool',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CardanoStakePool,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$drep: {
		label: 'drep',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CardanoDRep,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	poolId: {
		label: 'pool ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardAddress: {
		label: 'reward address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	depositLovelace: {
		label: 'deposit lovelace',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	epoch: {
		label: 'epoch',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metadataUrl: {
		label: 'metadata URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metadataHash: {
		label: 'metadata hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payload: {
		label: 'payload',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TransactionCertificateIndex: [
			'$transaction',
			'certificateIndex',
		],
	},
})
