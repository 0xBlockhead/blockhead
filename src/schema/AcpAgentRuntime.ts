// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AcpAgentRuntime,
	labels: {
		singular: 'acp agent runtime',
		plural: 'acp agent runtimes',
	},
})({
	runtimeId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$source: {
		entityType: EntityType.BlockheadSource,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$programVersion: {
		entityType: EntityType.AcpAgentProgramVersion,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$programInstall: {
		entityType: EntityType.BlockheadAgentProgramInstall,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transportKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	processId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	initializedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$sessions: {
		entityType: EntityType.AcpSession,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType.AcpAgentRuntime_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		RuntimeId: [
			'runtimeId',
		],
	},
})
