// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TonTransactionPhase,
	labels: {
		singular: 'ton transaction phase',
		plural: 'ton transaction phases',
	},
})({
	$transaction: {
		label: 'transaction',
		entityType: EntityType.TonTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	phaseKind: {
		label: 'phase kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	success: {
		label: 'success',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	exitCode: {
		label: 'exit code',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasUsed: {
		label: 'gas used',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasFeesNano: {
		label: 'gas fees nano',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	storageFeesNano: {
		label: 'storage fees nano',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	actionResultCode: {
		label: 'action result code',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	skippedReason: {
		label: 'skipped reason',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rawPhase: {
		label: 'raw phase',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TransactionPhaseKind: [
			'$transaction',
			'phaseKind',
		],
	},
})
