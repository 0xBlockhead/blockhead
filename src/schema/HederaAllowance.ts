// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaAllowanceSelector {
	OwnerSpenderAllowanceKindTokenIdSerialNumber = 'OwnerSpenderAllowanceKindTokenIdSerialNumber',
}
export default {
	entityType: EntityType.HederaAllowance,
	label: 'hedera allowance',
	labelPlural: 'hedera allowances',
	selectors: [
		{
			name: HederaAllowanceSelector.OwnerSpenderAllowanceKindTokenIdSerialNumber,
			fields: [
				'$owner',
				'$spender',
				'allowanceKind',
				'tokenId',
				'serialNumber',
			],
		},
	],
	fields: [
		{
				name: '$owner',
				label: 'owner',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HederaAccount,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$spender',
				label: 'spender',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HederaAccount,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'allowanceKind',
				label: 'allowance kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'tokenId',
				label: 'Token ID',
				description: 'The token identifier within its collection or contract.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'serialNumber',
				label: 'serial number',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$token',
				label: 'token',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HederaToken,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$nft',
				label: 'NFT',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HederaNft,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HederaAllowance_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
