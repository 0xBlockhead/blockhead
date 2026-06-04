import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

const farcasterVerifiedAddressProtocol = type("'ethereum' | 'solana'")

export default {
	entityType: EntityType.FarcasterVerifiedAddress,

	label: 'Farcaster Verified Address',
	labelPlural: 'Farcaster Verified Addresses',

	id: type({
		fid: 'number',
		protocol: farcasterVerifiedAddressProtocol,
		address: 'string',
	}),

	fields: [
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
