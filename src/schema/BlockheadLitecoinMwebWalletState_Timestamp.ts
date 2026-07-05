// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadLitecoinMwebWalletState_TimestampSelector {
	WalletStateTimestampMsSource = 'WalletStateTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadLitecoinMwebWalletState_Timestamp,
	label: 'blockhead litecoin mweb wallet state timestamp',
	labelPlural: 'blockhead litecoin mweb wallet state observations',
	selectors: [
		{
			name: BlockheadLitecoinMwebWalletState_TimestampSelector.WalletStateTimestampMsSource,
			fields: [
				'$walletState',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$walletState',
				label: 'wallet state',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadLitecoinMwebWalletState,
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
				name: 'mwebAddress',
				label: 'MWEB address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'transparentAddress',
				label: 'transparent address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'balanceLitoshis',
				label: 'balance litoshis',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'mwebBalanceLitoshis',
				label: 'MWEB balance litoshis',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'transparentBalanceLitoshis',
				label: 'transparent balance litoshis',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'unconfirmedBalanceLitoshis',
				label: 'unconfirmed balance litoshis',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'immatureBalanceLitoshis',
				label: 'immature balance litoshis',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'lastScannedHeight',
				label: 'last scanned height',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'lastSyncedAt',
				label: 'last synced AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
