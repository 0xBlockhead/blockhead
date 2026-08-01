// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IcpCanister_Timestamp,
	labels: {
		singular: 'icp canister timestamp',
		plural: 'icp canister observations',
	},
})({
	$canister: {
		label: 'canister',
		entityType: EntityType.IcpCanister,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$subnet: {
		label: 'subnet',
		entityType: EntityType.IcpSubnet,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subnetId: {
		label: 'subnet ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	canisterKind: {
		label: 'canister kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	candidInterfaceHash: {
		label: 'candid interface hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	moduleHash: {
		label: 'module hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	controllers: {
		label: 'controllers',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	cyclesBalance: {
		label: 'cycles balance',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	memorySizeBytes: {
		label: 'memory size bytes',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	freezingThresholdSeconds: {
		label: 'freezing threshold seconds',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	idleCyclesBurnedPerDay: {
		label: 'idle cycles burned per day',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	canisterVersion: {
		label: 'canister version',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	reservedCycles: {
		label: 'reserved cycles',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		CanisterTimestampMsSource: [
			'$canister',
			'timestampMs',
			'source',
		],
	},
})
