// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BeaconSlotSelector {
	EvmNetworkSlot = 'EvmNetworkSlot',
}
export const BeaconSlot = entity({
	entityType: EntityType.BeaconSlot,
	labels: {
		singular: 'beacon slot',
		plural: 'Beacon slots',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	slot: {
		label: 'Slot',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	epoch: {
		label: 'Epoch',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$epoch: {
		label: 'Epoch',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BeaconEpoch,
		cardinality: EntityFieldCardinality.One,
	},
	proposerIndex: {
		label: 'Proposer index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	root: {
		label: 'Root',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parentRoot: {
		label: 'Parent root',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stateRoot: {
		label: 'State root',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bodyRoot: {
		label: 'Body root',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	canonical: {
		label: 'Canonical',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signature: {
		label: 'Signature',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$beaconCommittees: {
		label: 'Beacon committees',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BeaconCommittee,
		cardinality: EntityFieldCardinality.Many,
	},
	$$beaconAttestations: {
		label: 'Beacon attestations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BeaconAttestation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$beaconWithdrawals: {
		label: 'Beacon withdrawals',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BeaconWithdrawal,
		cardinality: EntityFieldCardinality.Many,
	},
	$$beaconSlashings: {
		label: 'Beacon slashings',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BeaconSlashing,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		EvmNetworkSlot: [
			'$network',
			'slot',
		],
	},
})
