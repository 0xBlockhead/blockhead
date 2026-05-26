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
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
