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
	entityType: EntityType.PolkadotBlock,

	label: 'Polkadot Block',
	labelPlural: 'Polkadot Blocks',

	id: type({
		$network: Network.id,
		blockNumber: 'bigint',
		'hash?': 'string',
	}),

	identities: [
		{
			name: 'numberHash',
			fields: [
				{
					name: '$network',
				},
				{
					name: 'blockNumber',
				},
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
			name: '$parent',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PolkadotBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'stateRoot',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'extrinsicsRoot',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$extrinsics',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotExtrinsic,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$events',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotEvent,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
