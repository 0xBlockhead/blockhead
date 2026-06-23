import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum TronTokenStandard {
	Trc10 = 'TRC-10',
	Trc20 = 'TRC-20',
	Trc721 = 'TRC-721',
	Trc1155 = 'TRC-1155',
}
export enum TronTokenSelector {
	NetworkTokenId = 'networkTokenId',
}
export default {
	entityType: EntityType.TronToken,
	label: 'tron token',
	labelPlural: 'tron tokens',
	selectors: [
		{
			name: TronTokenSelector.NetworkTokenId,
			fields: [
				'$network',
				'tokenId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'tokenId',
			label: 'Token ID',
			description: 'The token identifier within its collection or contract.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'standard',
			label: 'standard',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$owner',
			label: 'owner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$contract',
			label: 'contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdTimestampMs',
			label: 'created timestamp ms',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$accountBalanceTimestamps',
			label: 'account balance timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronAccountTokenBalance_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronToken_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
