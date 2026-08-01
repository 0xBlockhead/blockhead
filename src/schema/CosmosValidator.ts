// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CosmosValidator,
	labels: {
		singular: 'Cosmos validator',
		plural: 'Cosmos validators',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	operatorAddress: {
		label: 'Operator address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	consensusPubkey: {
		label: 'Consensus public key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	moniker: {
		label: 'Moniker',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	identity: {
		label: 'Identity',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	website: {
		label: 'Website',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	securityContact: {
		label: 'Security contact',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	details: {
		label: 'Details',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Timestamps',
		entityType: EntityType.CosmosValidator_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.CosmosSdk_Rest,
		],
	},
})({
	selectors: {
		NetworkOperatorAddress: [
			'$network',
			'operatorAddress',
		],
	},
})
