// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BlockheadLogosBlockchainWalletKeyState_TimestampSelector {
	WalletKeyStateTimestampMsSource = 'WalletKeyStateTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp,
	label: 'blockhead Logos blockchain wallet key state timestamp',
	labelPlural: 'blockhead Logos blockchain wallet key state observations',
	selectors: [
		{
			name: BlockheadLogosBlockchainWalletKeyState_TimestampSelector.WalletKeyStateTimestampMsSource,
			fields: [
				'$walletKeyState',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$walletKeyState',
				label: 'wallet key state',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadLogosBlockchainWalletKeyState,
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
				name: 'tip',
				label: 'tip',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'balance',
				label: 'balance',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'address',
				label: 'Address',
				description: 'The address or account identifier used by the source protocol.',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
