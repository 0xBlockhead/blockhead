// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BnbBeaconToken_TimestampSelector {
	TokenTimestampMsSource = 'TokenTimestampMsSource',
}
export default {
	entityType: EntityType.BnbBeaconToken_Timestamp,
	label: 'bnb beacon token timestamp',
	labelPlural: 'bnb beacon token observations',
	selectors: [
		{
			name: BnbBeaconToken_TimestampSelector.TokenTimestampMsSource,
			fields: [
				'$token',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$token',
				label: 'token',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BnbBeaconToken,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'totalSupply',
				label: 'total supply',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'mintable',
				label: 'mintable',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'contractAddress',
				label: 'contract address',
				description: 'The contract address on its network.',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'holderCount',
				label: 'holder count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'transferCount',
				label: 'transfer count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
