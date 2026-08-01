// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CardanoCertificate,
	labels: {
		singular: 'cardano certificate',
		plural: 'cardano certificates',
	},
})({
	$transaction: {
		label: 'transaction',
		entityType: EntityType.CardanoTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	certificateIndex: {
		label: 'certificate index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	certificateKind: {
		label: 'certificate kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$stakeCredential: {
		label: 'stake credential',
		entityType: EntityType.CardanoStakeCredential,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$stakePool: {
		label: 'stake pool',
		entityType: EntityType.CardanoStakePool,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$drep: {
		label: 'drep',
		entityType: EntityType.CardanoDRep,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	poolId: {
		label: 'pool ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardAddress: {
		label: 'reward address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	depositLovelace: {
		label: 'deposit lovelace',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	epoch: {
		label: 'epoch',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metadataUrl: {
		label: 'metadata URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metadataHash: {
		label: 'metadata hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payload: {
		label: 'payload',
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
