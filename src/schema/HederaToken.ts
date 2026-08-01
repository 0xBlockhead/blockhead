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
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	tokenId: {
		label: 'Token ID',
		description: 'The token identifier within its collection or contract.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	tokenType: {
		label: 'token type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	supplyType: {
		label: 'supply type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	decimals: {
		label: 'Decimals',
		description: 'The number of decimal places used to display the amount.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$associations: {
		label: 'associations',
		entityType: EntityType.HederaTokenAssociation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$nfts: {
		label: 'nfts',
		entityType: EntityType.HederaNft,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
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
