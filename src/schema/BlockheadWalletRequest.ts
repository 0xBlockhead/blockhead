// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Hash32 } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadWalletRequest,
	labels: {
		singular: 'blockhead wallet request',
		plural: 'blockhead wallet requests',
	},
})({
	id: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$sessionAction: {
		entityType: EntityType.BlockheadSessionAction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$intentOrder: {
		entityType: EntityType.BlockheadIntentOrder,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$walletConnection: {
		entityType: EntityType.BlockheadWalletConnection,
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		entityType: EntityType.Account,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$evmRequest: {
		entityType: EntityType.BlockheadEvmWalletRequest,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	requestMethod: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	atomicRequired: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestPayloadHash: {
		primitiveType: Hash32,
		cardinality: EntityFieldCardinality.One,
	},
	requestedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	submittedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.BlockheadWalletRequest_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
