// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Erc4337Paymaster_Timestamp,
	labels: {
		singular: 'ERC-4337 paymaster timestamp',
		plural: 'ERC-4337 paymaster observations',
	},
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
		primitiveType: type('number.integer >= 0'),
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
