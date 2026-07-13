// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaContractState_TimestampSelector {
	ContractSlotTimestampMsSource = 'ContractSlotTimestampMsSource',
}
export const HederaContractState_Timestamp = entity({
	entityType: EntityType.HederaContractState_Timestamp,
	labels: {
		singular: 'hedera contract state timestamp',
		plural: 'hedera contract state observations',
	},
})({
	$contract: {
		label: 'contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaContract,
		cardinality: EntityFieldCardinality.One,
	},
	slot: {
		label: 'slot',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	value: {
		label: 'Value',
		description: 'The source-domain value.',
		type: EntityFieldType.Primitive,
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
