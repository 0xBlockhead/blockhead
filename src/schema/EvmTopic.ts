// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmTopicHash } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmTopic,
	labels: {
		singular: 'EVM topic',
		plural: 'EVM topics',
	},
})({
	hex: {
		label: 'Hex',
		type: EntityFieldType.Primitive,
		primitiveType: EvmTopicHash,
		cardinality: EntityFieldCardinality.One,
	},
	signatures: {
		label: 'Signatures',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmTopic_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Hex: [
			'hex',
		],
	},
})
