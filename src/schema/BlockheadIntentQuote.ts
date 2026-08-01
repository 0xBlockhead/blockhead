// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadIntentQuote,
	labels: {
		singular: 'blockhead intent quote',
		plural: 'blockhead intent quotes',
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
	quoteRequestHash: {
		label: 'quote request hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
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
	intentType: {
		label: 'intent type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	userInteropAddress: {
		label: 'user interop address',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestedAt: {
		label: 'requested AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	requestPayloadHash: {
		label: 'request payload hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestSummary: {
		label: 'request summary',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BlockheadIntentQuote_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
