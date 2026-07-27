// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.PolkadotBlock,
	labels: {
		singular: 'Polkadot block',
		plural: 'Polkadot blocks',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	blockNumber: {
		label: 'Block number',
		description: 'The block height or number in its network.',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		label: 'Hash',
		description: 'The hash that identifies this object in its protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$parent: {
		label: 'Parent',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.PolkadotBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stateRoot: {
		label: 'State root',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	extrinsicsRoot: {
		label: 'Extrinsics root',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$extrinsics: {
		label: 'Extrinsics',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.PolkadotExtrinsic,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Polkadot_JsonRpc,
			Source.SubstrateSidecar_Rest,
		],
	},
	$$events: {
		label: 'Events',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.PolkadotEvent,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.SubstrateSidecar_Rest,
		],
	},
})({
	selectors: {
		NetworkBlockNumber: [
			'$network',
			'blockNumber',
		],
		NetworkBlockNumberHash: [
			'$network',
			'blockNumber',
			'hash',
		],
	},
})
