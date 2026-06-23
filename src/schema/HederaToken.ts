import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum HederaTokenSelector {
	NetworkTokenId = '$network+tokenId',
}
export default {
	entityType: EntityType.HederaToken,
	label: 'hedera token',
	labelPlural: 'hedera tokens',
	selectors: [
		{
			name: HederaTokenSelector.NetworkTokenId,
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
			entityType: EntityType.HederaNetwork,
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
			name: 'tokenType',
			label: 'token type',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'supplyType',
			label: 'supply type',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'decimals',
			label: 'Decimals',
			description: 'The number of decimal places used to display the amount.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$associations',
			label: 'associations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaTokenAssociation,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$nfts',
			label: 'nfts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaNft,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaToken_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
