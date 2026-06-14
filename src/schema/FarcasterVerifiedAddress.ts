import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum FarcasterVerifiedAddressSelector {
	FidProtocolAddress = 'fidProtocolAddress',
}


const farcasterVerifiedAddressProtocol = type("'ethereum' | 'solana'")

export default {
	entityType: EntityType.FarcasterVerifiedAddress,

	label: 'Farcaster Verified Address',
	labelPlural: 'Farcaster Verified Addresses',

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
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'protocol',
			type: EntityFieldType.Primitive,
			primitiveType: farcasterVerifiedAddressProtocol,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$user',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterUser,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$evmAccount',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$solanaAccount',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SolanaAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
