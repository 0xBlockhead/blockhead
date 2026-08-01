// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NearExecutionOutcome,
	labels: {
		singular: 'near execution outcome',
		plural: 'near execution outcomes',
	},
})({
	$transaction: {
		label: 'Transaction',
		entityType: EntityType.NearTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	outcomeId: {
		label: 'Outcome ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	status: {
		label: 'Status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	gasBurnt: {
		label: 'Gas burnt',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	$$receipts: {
		label: 'Receipts',
		entityType: EntityType.NearReceipt,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
})({
	selectors: {
		NearTransactionOutcomeId: [
			'$transaction',
			'outcomeId',
		],
	},
})
