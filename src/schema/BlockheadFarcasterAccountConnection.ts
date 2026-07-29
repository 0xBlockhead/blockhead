// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { BlockheadFarcasterConnectionAuthMethod } from '$/schema/BlockheadFarcasterConnectionAuthMethod.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$user: {
		label: 'Farcaster user',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FarcasterUser,
		cardinality: EntityFieldCardinality.One,
	},
	signerAddress: {
		label: 'Verified signer',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	authMethod: {
		label: 'Auth method',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(BlockheadFarcasterConnectionAuthMethod)),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verifiedAt: {
		label: 'Verified',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	expiresAt: {
		label: 'Expires',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	associationFingerprint: {
		label: 'Association fingerprint',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	selected: {
		label: 'Selected viewer',
		type: EntityFieldType.Primitive,
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
