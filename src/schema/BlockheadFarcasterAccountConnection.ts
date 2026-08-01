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
		label: 'Connection ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$user: {
		label: 'Farcaster user',
		entityType: EntityType.FarcasterUser,
		cardinality: EntityFieldCardinality.One,
	},
	signerAddress: {
		label: 'Verified signer',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	authMethod: {
		label: 'Auth method',
		primitiveType: type.enumerated(...Object.values(BlockheadFarcasterConnectionAuthMethod)),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verifiedAt: {
		label: 'Verified',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	expiresAt: {
		label: 'Expires',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	associationFingerprint: {
		label: 'Association fingerprint',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	selected: {
		label: 'Selected viewer',
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
