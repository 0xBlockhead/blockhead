// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.A2aAgentSkill,
	labels: {
		singular: 'a2a agent skill',
		plural: 'a2a agent skills',
	},
})({
	$cardSnapshot: {
		label: 'card snapshot',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.A2aAgentCard_Snapshot,
		cardinality: EntityFieldCardinality.One,
	},
	skillId: {
		label: 'skill ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tags: {
		label: 'tags',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	examples: {
		label: 'examples',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	inputModes: {
		label: 'input modes',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	outputModes: {
		label: 'output modes',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		CardSnapshotSkillId: [
			'$cardSnapshot',
			'skillId',
		],
	},
})
