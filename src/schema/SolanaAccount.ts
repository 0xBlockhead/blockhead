import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/Network.ts'

export default {
	entityType: EntityType.SolanaAccount,

	label: 'Solana Account',
	labelPlural: 'Solana Accounts',

	id: type({
		$network: Network.id,
		pubkey: 'string',
	}),

	fields: [
		{
			name: '$ownerProgram',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SolanaProgram,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lamports',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'rentEpoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'executable',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'dataEncoding',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
