// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Eip7702Authorization,
	labels: {
		singular: 'eip7702 authorization',
		plural: 'eip7702 authorizations',
	},
})({
	$transaction: {
		label: 'transaction',
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	authorizationIndex: {
		label: 'authorization index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	chainId: {
		label: 'Chain ID',
		description: 'The chain identifier used by the network family.',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	delegationAddress: {
		label: 'delegation address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	authority: {
		label: 'authority',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nonce: {
		label: 'nonce',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	yParity: {
		label: 'y parity',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	r: {
		label: 'r',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	s: {
		label: 's',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	verificationStatus: {
		label: 'verification status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verifiedAtMs: {
		label: 'verified AT ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$authorityAccount: {
		label: 'authority account',
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$delegationContract: {
		label: 'delegation contract',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TransactionAuthorizationIndex: [
			'$transaction',
			'authorizationIndex',
		],
	},
})
