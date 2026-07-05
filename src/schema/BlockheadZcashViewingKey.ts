// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadZcashViewingKeySelector {
	WalletIdKeyFingerprint = 'WalletIdKeyFingerprint',
}
export default {
	entityType: EntityType.BlockheadZcashViewingKey,
	label: 'blockhead zcash viewing key',
	labelPlural: 'blockhead zcash viewing keys',
	selectors: [
		{
			name: BlockheadZcashViewingKeySelector.WalletIdKeyFingerprint,
			fields: [
				'walletId',
				'keyFingerprint',
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
				name: 'keyFingerprint',
				label: 'key fingerprint',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'keyKind',
				label: 'key kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'pools',
				label: 'pools',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'accountIndex',
				label: 'account index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'birthdayHeight',
				label: 'birthday height',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'canViewIncoming',
				label: 'can view incoming',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'canViewOutgoing',
				label: 'can view outgoing',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'canSpend',
				label: 'can spend',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'importedAt',
				label: 'imported AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'viewingKeyMaterial',
				label: 'viewing key material',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadZcashViewingKey_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
