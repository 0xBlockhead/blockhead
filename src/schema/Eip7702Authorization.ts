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
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	authorizationIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	chainId: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	delegationAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	authority: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nonce: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	yParity: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	r: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	s: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	verificationStatus: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verifiedAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$authorityAccount: {
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$delegationContract: {
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
