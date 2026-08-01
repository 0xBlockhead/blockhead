// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AcpFileOperation,
	labels: {
		singular: 'acp file operation',
		plural: 'acp file operations',
	},
})({
	$session: {
		label: 'session',
		entityType: EntityType.AcpSession,
		cardinality: EntityFieldCardinality.One,
	},
	operationId: {
		label: 'operation ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	operationKind: {
		label: 'operation kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	path: {
		label: 'path',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	startLine: {
		label: 'start line',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	endLine: {
		label: 'end line',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contentHashAlgorithm: {
		label: 'content hash algorithm',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contentHash: {
		label: 'content hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'error',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SessionOperationId: [
			'$session',
			'operationId',
		],
	},
})
