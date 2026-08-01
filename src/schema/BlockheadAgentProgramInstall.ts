// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadAgentProgramInstall,
	labels: {
		singular: 'blockhead agent program install',
		plural: 'blockhead agent program installs',
	},
})({
	installId: {
		label: 'install ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		entityType: EntityType.BlockheadSource,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	installPath: {
		label: 'install path',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	command: {
		label: 'command',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	argsHashAlgorithm: {
		label: 'args hash algorithm',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	argsHash: {
		label: 'args hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	environmentScope: {
		label: 'environment scope',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	updatedAt: {
		label: 'Updated',
		description: 'The time when the subject was last updated according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BlockheadAgentProgramInstall_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		InstallId: [
			'installId',
		],
	},
})
