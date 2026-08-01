// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	orderId: {
		label: 'order ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$quote: {
		label: 'quote',
		entityType: EntityType.BlockheadIntentQuote,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$sessionAction: {
		label: 'session action',
		entityType: EntityType.BlockheadSessionAction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerProtocol: {
		label: 'provider protocol',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	submittedAt: {
		label: 'submitted AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	signatureHash: {
		label: 'signature hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	orderPayloadHash: {
		label: 'order payload hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	orderSummary: {
		label: 'order summary',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
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
