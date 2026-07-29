// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.NearTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	outcomeId: {
		label: 'Outcome ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	status: {
		label: 'Status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	gasBurnt: {
		label: 'Gas burnt',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	$$receipts: {
		label: 'Receipts',
		type: EntityFieldType.EntitiesReference,
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
