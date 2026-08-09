// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NearContractStorageEntry,
	labels: {
		singular: 'near contract storage entry',
		plural: 'near contract storage entries',
	},
})({
	$contract: {
		entityType: EntityType.NearContract,
		cardinality: EntityFieldCardinality.One,
	},
	keyBase64: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	blockHeight: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	blockHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueBase64: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	prefixBase64: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deleted: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ContractKeyBlockHeightSource: [
			'$contract',
			'keyBase64',
			'blockHeight',
			'source',
		],
	},
})
