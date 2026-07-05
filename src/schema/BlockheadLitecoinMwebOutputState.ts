// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadLitecoinMwebOutputStateSelector {
	WalletIdCommitment = 'WalletIdCommitment',
}
export default {
	entityType: EntityType.BlockheadLitecoinMwebOutputState,
	label: 'blockhead litecoin mweb output state',
	labelPlural: 'blockhead litecoin mweb output states',
	selectors: [
		{
			name: BlockheadLitecoinMwebOutputStateSelector.WalletIdCommitment,
			fields: [
				'walletId',
				'commitment',
			],
		},
	],
	fields: [
		{
				name: 'walletId',
				label: 'wallet ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$wallet',
				label: 'wallet',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadWallet,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'commitment',
				label: 'commitment',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$publicOutput',
				label: 'public output',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.LitecoinMwebOutput,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'amountLitoshis',
				label: 'amount litoshis',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'address',
				label: 'address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'account',
				label: 'account',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'label',
				label: 'label',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadLitecoinMwebOutputState_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
