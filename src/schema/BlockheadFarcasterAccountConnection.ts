// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { BlockheadFarcasterConnectionAuthMethod } from '$/schema/BlockheadFarcasterConnectionAuthMethod.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadFarcasterAccountConnection,
	labels: {
		singular: 'Blockhead Farcaster account connection',
		plural: 'Blockhead Farcaster account connections',
	},
})({
	connectionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$user: {
		entityType: EntityType.FarcasterUser,
		cardinality: EntityFieldCardinality.One,
	},
	signerAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	authMethod: {
		primitiveType: type.enumerated(...Object.values(BlockheadFarcasterConnectionAuthMethod)),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verifiedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	expiresAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	associationFingerprint: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	selected: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		ConnectionId: [
			'connectionId',
		],
	},
})
