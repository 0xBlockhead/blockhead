// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadFarcasterConnectionAuthMethod {
	Custody = 'custody',
	AuthAddress = 'authAddress',
}
export enum BlockheadFarcasterAccountConnectionSelector {
	ConnectionId = 'ConnectionId',
}
export const BlockheadFarcasterAccountConnection = entity({
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
