// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TezosOperation,
	labels: {
		singular: 'tezos operation',
		plural: 'tezos operations',
	},
})({
	$operationGroup: {
		label: 'operation group',
		entityType: EntityType.TezosOperationGroup,
		cardinality: EntityFieldCardinality.One,
	},
	contentIndex: {
		label: 'content index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	operationKind: {
		label: 'operation kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sourceAddress: {
		label: 'source address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	destinationAddress: {
		label: 'destination address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	delegateAddress: {
		label: 'delegate address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contractAddress: {
		label: 'contract address',
		description: 'The contract address on its network.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	counter: {
		label: 'counter',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeMutez: {
		label: 'fee mutez',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasLimit: {
		label: 'gas limit',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	storageLimit: {
		label: 'storage limit',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountMutez: {
		label: 'amount mutez',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parameters: {
		label: 'parameters',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	consumedGas: {
		label: 'consumed gas',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	storageSize: {
		label: 'storage size',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	paidStorageSizeDiff: {
		label: 'paid storage size diff',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	originatedContractAddresses: {
		label: 'originated contract addresses',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	$block: {
		label: 'block',
		entityType: EntityType.TezosBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$internalOperations: {
		label: 'internal operations',
		entityType: EntityType.TezosInternalOperation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bigMapDiffs: {
		label: 'big map diffs',
		entityType: EntityType.TezosBigMapDiff,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		OperationGroupContentIndex: [
			'$operationGroup',
			'contentIndex',
		],
	},
})
