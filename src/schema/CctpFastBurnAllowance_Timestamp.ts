// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CctpFastBurnAllowance_TimestampSelector {
	TimestampMsSource = 'TimestampMsSource',
}
export const CctpFastBurnAllowance_Timestamp = entity({
	entityType: EntityType.CctpFastBurnAllowance_Timestamp,
	labels: {
		singular: 'CCTP fast burn allowance timestamp',
		plural: 'CCTP fast burn allowance observations',
	},
})({
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
	allowanceUsdc: {
		label: 'Allowance USDC',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastUpdatedMs: {
		label: 'Last updated ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestId: {
		label: 'Request ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TimestampMsSource: [
			'timestampMs',
			'source',
		],
	},
})
