// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaToken,
		cardinality: EntityFieldCardinality.One,
	},
	serialNumber: {
		label: 'serial number',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	metadata: {
		label: 'metadata',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdTimestamp: {
		label: 'created timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transfers: {
		label: 'transfers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
