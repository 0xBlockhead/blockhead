// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BlockheadIntentOrderSelector {
	Id = 'Id',
}
export default {
	entityType: EntityType.BlockheadIntentOrder,
	label: 'blockhead intent order',
	labelPlural: 'blockhead intent orders',
	selectors: [
		{
			name: BlockheadIntentOrderSelector.Id,
			fields: [
				'id',
			],
		},
	],
	fields: [
		{
			name: 'id',
			label: 'ID',
			description: 'The identifier assigned by the source domain.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'orderId',
			label: 'order ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$quote',
			label: 'quote',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadIntentQuote,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$sessionAction',
			label: 'session action',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadSessionAction,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'providerProtocol',
			label: 'provider protocol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'submittedAt',
			label: 'submitted AT',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'signatureHash',
			label: 'signature hash',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'orderPayloadHash',
			label: 'order payload hash',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'orderSummary',
			label: 'order summary',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadIntentOrder_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
