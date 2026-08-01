// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmBlob,
	labels: {
		singular: 'EVM blob',
		plural: 'EVM blobs',
	},
	description: 'A blob sidecar referenced by an EIP-4844 EVM transaction.',
})({
	indexInTransaction: {
		label: 'Index in transaction',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	versionedHash: {
		label: 'Versioned hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	$transaction: {
		label: 'Transaction',
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		label: 'Block',
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.One,
	},
	kzgCommitment: {
		label: 'KZG commitment',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blobDataStorageReferences: {
		label: 'Blob data storage references',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TransactionIndexInTransaction: [
			'$transaction',
			'indexInTransaction',
		],
	},
})
