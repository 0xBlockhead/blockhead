import { type } from 'arktype'
import { lowercaseHexIdentityValue } from '$/schema/$ZeroExHex.ts'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/Network.ts'

export default {
	entityType: EntityType.HyperliquidBlock,

	label: 'Hyperliquid Block',
	labelPlural: 'Hyperliquid Blocks',

	id: type.or(
		type({
			$network: Network.id,
			height: 'bigint',
		}),
		type({
			$network: Network.id,
			hash: 'string',
		}),
	),

	identities: [
		{
			name: 'height',
			fields: [
				'$network',
				'height',
			],
		},
		{
			name: 'hash',
			fields: [
				'$network',
				{
					name: 'hash',
					normalize: lowercaseHexIdentityValue,
				},
			],
		},
	],

	fields: [
		{
			name: 'hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HyperliquidTransaction,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
