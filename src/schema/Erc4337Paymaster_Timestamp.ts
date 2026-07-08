// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum Erc4337Paymaster_TimestampSelector {
	PaymasterTimestampMsSource = 'PaymasterTimestampMsSource',
}
export const Erc4337Paymaster_Timestamp = entity({
	entityType: EntityType.Erc4337Paymaster_Timestamp,
	label: 'ERC-4337 paymaster timestamp',
	labelPlural: 'ERC-4337 paymaster observations',
})({
	$paymaster: {
		label: 'Paymaster',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Erc4337Paymaster,
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
	userOperationsCount: {
		label: 'User operations',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		PaymasterTimestampMsSource: [
			'$paymaster',
			'timestampMs',
			'source',
		],
	},
})
