import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadMoneroWalletStateSelector {
	WalletId = 'walletId',
}
export default {
	entityType: EntityType.BlockheadMoneroWalletState,
	label: 'blockhead monero wallet state',
	labelPlural: 'blockhead monero wallet states',
	selectors: [
		{
			name: BlockheadMoneroWalletStateSelector.WalletId,
			fields: [
				'walletId',
			],
		},
	],
	fields: [
		{
			name: 'walletId',
			label: 'wallet ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
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
			entityType: EntityType.MoneroNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'primaryAddress',
			label: 'primary address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'viewOnly',
			label: 'view only',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'trustedDaemon',
			label: 'trusted daemon',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'viewKeyFingerprint',
			label: 'view key fingerprint',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'spendKeyAvailable',
			label: 'spend key available',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadMoneroWalletState_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$subaddresses',
			label: 'subaddresses',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadMoneroSubaddressState,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$outputs',
			label: 'outputs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadMoneroOutputState,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$transfers',
			label: 'transfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadMoneroTransferState,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
