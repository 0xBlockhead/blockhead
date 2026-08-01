// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FarcasterVerifiedAddress,
	labels: {
		singular: 'Farcaster verified address',
		plural: 'Farcaster verified addresses',
	},
})({
	fid: {
		label: 'FID',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	protocol: {
		label: 'Protocol',
		primitiveType: type('"ethereum" | "solana"'),
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$user: {
		label: 'User',
		entityType: EntityType.FarcasterUser,
		cardinality: EntityFieldCardinality.One,
	},
	$evmAccount: {
		label: 'EVM account',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$solanaAccount: {
		label: 'Solana account',
		entityType: EntityType.SolanaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		FidProtocolAddress: [
			'fid',
			'protocol',
			'address',
		],
	},
})
