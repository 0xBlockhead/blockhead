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
		label: 'Contract',
		entityType: EntityType.NearContract,
		cardinality: EntityFieldCardinality.One,
	},
	keyBase64: {
		label: 'Key base64',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	blockHeight: {
		label: 'Block height',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	blockHash: {
		label: 'Block hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueBase64: {
		label: 'Value base64',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueHash: {
		label: 'Value hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	prefixBase64: {
		label: 'Prefix base64',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deleted: {
		label: 'Deleted',
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
