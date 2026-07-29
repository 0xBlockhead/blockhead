// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadSharedAddress,
	labels: {
		singular: 'blockhead shared address',
		plural: 'blockhead shared addresses',
	},
})({
	id: {
		label: 'ID',
		description: 'The identifier assigned by the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$room: {
		label: 'room',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadRoom,
		cardinality: EntityFieldCardinality.One,
	},
	peerId: {
		label: 'peer ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	targetPeerIds: {
		label: 'target peer ids',
		type: EntityFieldType.Primitive,
		primitiveType: type("string[] | null"),
		cardinality: EntityFieldCardinality.One,
	},
	sharedAt: {
		label: 'shared AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
