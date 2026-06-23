import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum XrplTrustlineSelector {
	NetworkAccountCurrencyIssuer = '$network+account+currency+issuer',
}
export default {
	entityType: EntityType.XrplTrustline,
	label: 'xrpl trustline',
	labelPlural: 'xrpl trustlines',
	selectors: [
		{
			name: XrplTrustlineSelector.NetworkAccountCurrencyIssuer,
			fields: [
				'$network',
				'account',
				'currency',
				'issuer',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.XrplNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'account',
			label: 'account',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'currency',
			label: 'currency',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'issuer',
			label: 'issuer',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$account',
			label: 'account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.XrplAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$issuerAccount',
			label: 'issuer account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.XrplAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.XrplTrustline_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
