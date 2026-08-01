// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HederaNft,
	labels: {
		singular: 'hedera NFT',
		plural: 'hedera NFTs',
	},
})({
	$token: {
		label: 'token',
		entityType: EntityType.HederaToken,
		cardinality: EntityFieldCardinality.One,
	},
	serialNumber: {
		label: 'serial number',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	metadata: {
		label: 'metadata',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdTimestamp: {
		label: 'created timestamp',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transfers: {
		label: 'transfers',
		entityType: EntityType.HederaTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.HederaNft_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		TokenSerialNumber: [
			'$token',
			'serialNumber',
		],
	},
})
