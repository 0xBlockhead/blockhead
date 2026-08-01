// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadTransferRequest,
	labels: {
		singular: 'blockhead transfer request',
		plural: 'blockhead transfer requests',
	},
})({
	id: {
		label: 'ID',
		description: 'The identifier assigned by the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$room: {
		label: 'room',
		entityType: EntityType.BlockheadRoom,
		cardinality: EntityFieldCardinality.One,
	},
	$from: {
		label: 'from',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$to: {
		label: 'to',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	allocations: {
		label: 'allocations',
		primitiveType: type({
			destination: type('string'),
			token: type('string'),
			amount: type('bigint'),
		}).array(),
		cardinality: EntityFieldCardinality.One,
	},
	status: {
		label: 'status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	expiresAt: {
		label: 'expires AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		IdEvmNetwork: [
			'id',
			'$network',
		],
	},
})
