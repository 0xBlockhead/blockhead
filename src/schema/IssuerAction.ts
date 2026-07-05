// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IssuerActionSelector {
	IssuerActionId = 'IssuerActionId',
}
export default {
	entityType: EntityType.IssuerAction,
	label: 'issuer action',
	labelPlural: 'issuer actions',
	selectors: [
		{
			name: IssuerActionSelector.IssuerActionId,
			fields: [
				'issuerActionId',
			],
		},
	],
	fields: [
		{
				name: 'issuerActionId',
				label: 'issuer action ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'actionKind',
				label: 'action kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$assetInstance',
				label: 'asset instance',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AssetInstance,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'targetSelector',
				label: 'target selector',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'amount',
				label: 'amount',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$issuerPower',
				label: 'issuer power',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.IssuerPower,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
