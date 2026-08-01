// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HederaToken,
	labels: {
		singular: 'hedera token',
		plural: 'hedera tokens',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	tokenId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	tokenType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	supplyType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	decimals: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$associations: {
		entityType: EntityType.HederaTokenAssociation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$nfts: {
		entityType: EntityType.HederaNft,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType.HederaToken_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkTokenId: [
			'$network',
			'tokenId',
		],
	},
})
