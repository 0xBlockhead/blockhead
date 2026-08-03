// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const payjoinDirectoryRestSources = [
	Source.PayjoinDirectory_Rest,
] as const

export default entity({
	entityType: EntityType.PayjoinDirectory,
	labels: {
		singular: 'payjoin directory',
		plural: 'payjoin directories',
	},
})({
	directoryUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	ohttpGatewayUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: payjoinDirectoryRestSources,
	},
	ohttpKeyConfig: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: payjoinDirectoryRestSources,
	},
	maxPayloadBytes: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$blockheadSessions: {
		entityType: EntityType.BlockheadPayjoinSession,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		DirectoryUrl: [
			'directoryUrl',
		],
	},
})
