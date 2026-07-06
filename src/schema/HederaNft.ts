// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaNftSelector {
	TokenSerialNumber = 'TokenSerialNumber',
}
export default {
	entityType: EntityType.HederaNft,
	label: 'hedera NFT',
	labelPlural: 'hedera NFTs',
	selectors: [
		{
			name: HederaNftSelector.TokenSerialNumber,
			fields: [
				'$token',
				'serialNumber',
			],
		},
	],
	fields: [
		{
			name: '$token',
			label: 'token',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HederaToken,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'serialNumber',
			label: 'serial number',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'metadata',
			label: 'metadata',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdTimestamp',
			label: 'created timestamp',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$transfers',
			label: 'transfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaTokenTransfer,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaNft_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
