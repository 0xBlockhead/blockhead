// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HederaNft_Timestamp,
	labels: {
		singular: 'hedera NFT timestamp',
		plural: 'hedera NFT observations',
	},
})({
	$nft: {
		entityType: EntityType.HederaNft,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$owner: {
		entityType: EntityType.HederaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ownerAccountId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deleted: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spenderAccountId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	modifiedTimestamp: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NftTimestampMsSource: [
			'$nft',
			'timestampMs',
			'source',
		],
	},
})
