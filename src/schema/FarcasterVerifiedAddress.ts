import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum FarcasterVerifiedAddressSelector {
	FidProtocolAddress = 'fidProtocolAddress',
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
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'protocol',
			label: 'protocol',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'address',
			label: 'Address',
			description: 'The address or account identifier used by the source protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$user',
			label: 'user',
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
			label: 'solana account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SolanaAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
