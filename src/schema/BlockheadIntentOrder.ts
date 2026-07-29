// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadIntentOrder,
	labels: {
		singular: 'blockhead intent order',
		plural: 'blockhead intent orders',
	},
})({
	id: {
		label: 'ID',
		description: 'The identifier assigned by the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	orderId: {
		label: 'order ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$quote: {
		label: 'quote',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadIntentQuote,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$sessionAction: {
		label: 'session action',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadSessionAction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerProtocol: {
		label: 'provider protocol',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	submittedAt: {
		label: 'submitted AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	signatureHash: {
		label: 'signature hash',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	orderPayloadHash: {
		label: 'order payload hash',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	orderSummary: {
		label: 'order summary',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadIntentOrder_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
