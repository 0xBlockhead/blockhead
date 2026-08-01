// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HederaContractState_Timestamp,
	labels: {
		singular: 'hedera contract state timestamp',
		plural: 'hedera contract state observations',
	},
})({
	$contract: {
		label: 'contract',
		entityType: EntityType.HederaContract,
		cardinality: EntityFieldCardinality.One,
	},
	slot: {
		label: 'slot',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	value: {
		label: 'Value',
		description: 'The source-domain value.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ContractSlotTimestampMsSource: [
			'$contract',
			'slot',
			'timestampMs',
			'source',
		],
	},
})
