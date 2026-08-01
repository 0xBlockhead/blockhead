// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ZeroGStorageLogEntry,
	labels: {
		singular: 'zero g storage log entry',
		plural: 'zero g storage log entries',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	logEntryId: {
		label: 'log entry ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$dataBlob: {
		label: 'data blob',
		entityType: EntityType.ZeroGDataBlob,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$consensusNetwork: {
		label: 'consensus network',
		entityType: EntityType.ZeroGConsensusNetwork,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sequenceNumber: {
		label: 'sequence number',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	commitment: {
		label: 'commitment',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkLogEntryId: [
			'$network',
			'logEntryId',
		],
	},
})
