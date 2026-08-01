// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { BlockheadSessionStatus } from '$/schema/BlockheadSessionStatus.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'Status',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(BlockheadSessionStatus)),
		cardinality: EntityFieldCardinality.One,
	},
	createdAt: {
		label: 'Created',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	updatedAt: {
		label: 'Updated',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	lockedAt: {
		label: 'Locked',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$latestSimulation: {
		label: 'Latest simulation',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadSessionSimulation,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	simulationCount: {
		label: 'Simulation count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$actions: {
		label: 'Actions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadSessionAction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$intentInvocations: {
		label: 'intent invocations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadIntentInvocation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$simulations: {
		label: 'Simulations',
		type: EntityFieldType.EntitiesReference,
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
