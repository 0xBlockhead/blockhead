// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BalancerPoolEvent,
	labels: {
		singular: 'Balancer pool event',
		plural: 'Balancer pool events',
	},
	description: 'A source-indexed swap, join, or exit event in a Balancer pool lifecycle.',
})({
	$pool: {
		entityType: EntityType.BalancerPool,
		cardinality: EntityFieldCardinality.One,
	},
	eventId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	eventType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	$transaction: {
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	$user: {
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	$block: {
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	occurredAtMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	valueUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
})({
	selectors: {
		PoolEventId: [
			'$pool',
			'eventId',
		],
	},
})
