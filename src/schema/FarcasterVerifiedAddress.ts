// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum FarcasterVerifiedAddressSelector {
	FidProtocolAddress = 'FidProtocolAddress',
}
export default {
	entityType: EntityType.FarcasterVerifiedAddress,
	label: 'Farcaster verified address',
	labelPlural: 'Farcaster verified addresses',
	selectors: [
		{
			name: FarcasterVerifiedAddressSelector.FidProtocolAddress,
			fields: [
				'fid',
				'protocol',
				'address',
			],
		},
	],
	fields: [
		{
				name: 'fid',
				label: 'FID',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'protocol',
				label: 'Protocol',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'address',
				label: 'Address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$user',
				label: 'User',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.FarcasterUser,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$evmAccount',
				label: 'EVM account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$solanaAccount',
				label: 'Solana account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.SolanaAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
