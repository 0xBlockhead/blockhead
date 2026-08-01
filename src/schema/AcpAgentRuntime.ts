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
		label: 'runtime ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		entityType: EntityType.BlockheadSource,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$programVersion: {
		label: 'program version',
		entityType: EntityType.AcpAgentProgramVersion,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$programInstall: {
		label: 'program install',
		entityType: EntityType.BlockheadAgentProgramInstall,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transportKind: {
		label: 'transport kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	processId: {
		label: 'process ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	initializedAt: {
		label: 'initialized AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$sessions: {
		label: 'sessions',
		entityType: EntityType.AcpSession,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
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
