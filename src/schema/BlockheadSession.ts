// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { BlockheadSessionStatus } from '$/schema/BlockheadSessionStatus.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadSession,
	labels: {
		singular: 'session',
		plural: 'sessions',
	},
})({
	id: {
		label: 'ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'Status',
		primitiveType: type.enumerated(...Object.values(BlockheadSessionStatus)),
		cardinality: EntityFieldCardinality.One,
	},
	createdAt: {
		label: 'Created',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	updatedAt: {
		label: 'Updated',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	lockedAt: {
		label: 'Locked',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$latestSimulation: {
		label: 'Latest simulation',
		entityType: EntityType.BlockheadSessionSimulation,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	simulationCount: {
		label: 'Simulation count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$actions: {
		label: 'Actions',
		entityType: EntityType.BlockheadSessionAction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$intentInvocations: {
		label: 'intent invocations',
		entityType: EntityType.BlockheadIntentInvocation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$simulations: {
		label: 'Simulations',
		entityType: EntityType.BlockheadSessionSimulation,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
