// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.A2aAgentCard_Snapshot,
		cardinality: EntityFieldCardinality.One,
	},
	skillId: {
		label: 'skill ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tags: {
		label: 'tags',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	examples: {
		label: 'examples',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	inputModes: {
		label: 'input modes',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	outputModes: {
		label: 'output modes',
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
