// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CronosNetworkProfile,
	labels: {
		singular: 'cronos network profile',
		plural: 'cronos network profiles',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$evmNetwork: {
		label: 'EVM network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$cosmosNetwork: {
		label: 'Cosmos network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	chainKind: {
		label: 'chain kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	consensusKind: {
		label: 'consensus kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bech32Prefix: {
		label: 'bech32 prefix',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	evmChainId: {
		label: 'EVM chain ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cosmosChainId: {
		label: 'Cosmos chain ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$ibcChannels: {
		label: 'ibc channels',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.IbcChannel,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Network_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
