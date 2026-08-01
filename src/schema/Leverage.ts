// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Leverage,
	labels: {
		singular: 'leverage',
		plural: 'leverages',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	id: {
		label: 'ID',
		description: 'The identifier assigned by the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$pool: {
		label: 'Pool',
		entityType: EntityType.LiquidityPool,
		cardinality: EntityFieldCardinality.One,
	},
	$owner: {
		label: 'Owner',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	tickLower: {
		label: 'Tick lower',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	tickUpper: {
		label: 'Tick upper',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	liquidity: {
		label: 'Liquidity',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	token0Owed: {
		label: 'Token0 owed',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	token1Owed: {
		label: 'Token1 owed',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	tokenId: {
		label: 'Token ID',
		description: 'The token identifier within its collection or contract.',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	origin: {
		label: 'Origin',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAtTimestamp: {
		label: 'Created at timestamp',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		EvmNetworkId: [
			'$network',
			'id',
		],
	},
})
