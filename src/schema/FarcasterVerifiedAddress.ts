// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum FarcasterVerifiedAddressSelector {
	FidProtocolAddress = 'FidProtocolAddress',
}
export const FarcasterVerifiedAddress = entity({
	entityType: EntityType.FarcasterVerifiedAddress,
	labels: {
		singular: 'Farcaster verified address',
		plural: 'Farcaster verified addresses',
	},
})({
	fid: {
		label: 'FID',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	protocol: {
		label: 'Protocol',
		type: EntityFieldType.Primitive,
		primitiveType: (type('"ethereum" | "solana"')),
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$user: {
		label: 'User',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FarcasterUser,
		cardinality: EntityFieldCardinality.One,
	},
	$evmAccount: {
		label: 'EVM account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$solanaAccount: {
		label: 'Solana account',
		type: EntityFieldType.EntityReference,
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
