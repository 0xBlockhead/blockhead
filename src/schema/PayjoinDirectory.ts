// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.PayjoinDirectory,
	labels: {
		singular: 'payjoin directory',
		plural: 'payjoin directories',
	},
})({
	directoryUrl: {
		label: 'directory URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	ohttpGatewayUrl: {
		label: 'ohttp gateway URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.PayjoinDirectory_Rest,
		],
	},
	ohttpKeyConfig: {
		label: 'ohttp key config',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.PayjoinDirectory_Rest,
		],
	},
	maxPayloadBytes: {
		label: 'max payload bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$blockheadSessions: {
		label: 'blockhead sessions',
		type: EntityFieldType.EntitiesReference,
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
