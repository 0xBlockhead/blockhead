// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadSource,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$programVersion: {
		label: 'program version',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AcpAgentProgramVersion,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$programInstall: {
		label: 'program install',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadAgentProgramInstall,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transportKind: {
		label: 'transport kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	processId: {
		label: 'process ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	initializedAt: {
		label: 'initialized AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$sessions: {
		label: 'sessions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AcpSession,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
