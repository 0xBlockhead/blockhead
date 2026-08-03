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
		entityType: EntityType.NearTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	outcomeId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	gasBurnt: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	$$receipts: {
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
