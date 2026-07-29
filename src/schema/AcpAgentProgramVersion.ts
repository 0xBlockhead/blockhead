// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AcpAgentProgramVersion,
	labels: {
		singular: 'acp agent program version',
		plural: 'acp agent program versions',
	},
})({
	$program: {
		label: 'program',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AcpAgentProgram,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		label: 'version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$artifact: {
		label: 'artifact',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AiArtifact,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	releaseDate: {
		label: 'release date',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	distributionKind: {
		label: 'distribution kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	distribution: {
		label: 'distribution',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	command: {
		label: 'command',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	arguments: {
		label: 'arguments',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	environmentKeys: {
		label: 'environment keys',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$documents: {
		label: 'documents',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AiDocument,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ProgramVersion: [
			'$program',
			'version',
		],
		Artifact: [
			'$artifact',
		],
	},
})
