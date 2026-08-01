// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EigenLayerAvs,
	labels: {
		singular: 'eigen layer avs',
		plural: 'EigenLayer AVSs',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	avsAddress: {
		label: 'AVS address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$avsAccount: {
		label: 'AVS account',
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metadataUri: {
		label: 'metadata URI',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	website: {
		label: 'website',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.EigenLayerAvs_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$operators: {
		label: 'operators',
		entityType: EntityType.EigenLayerOperator,
		cardinality: EntityFieldCardinality.Many,
	},
	$$allocations: {
		label: 'allocations',
		entityType: EntityType.EigenLayerAllocation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$slashingEvents: {
		label: 'slashing events',
		entityType: EntityType.EigenLayerSlashingEvent,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAvsAddress: [
			'$network',
			'avsAddress',
		],
	},
})
