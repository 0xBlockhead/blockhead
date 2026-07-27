// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TezosOperationGroup,
		cardinality: EntityFieldCardinality.One,
	},
	contentIndex: {
		label: 'content index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	operationKind: {
		label: 'operation kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sourceAddress: {
		label: 'source address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	destinationAddress: {
		label: 'destination address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	delegateAddress: {
		label: 'delegate address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contractAddress: {
		label: 'contract address',
		description: 'The contract address on its network.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	counter: {
		label: 'counter',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeMutez: {
		label: 'fee mutez',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasLimit: {
		label: 'gas limit',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	storageLimit: {
		label: 'storage limit',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountMutez: {
		label: 'amount mutez',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parameters: {
		label: 'parameters',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	consumedGas: {
		label: 'consumed gas',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	storageSize: {
		label: 'storage size',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	paidStorageSizeDiff: {
		label: 'paid storage size diff',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	originatedContractAddresses: {
		label: 'originated contract addresses',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	$block: {
		label: 'block',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TezosBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$internalOperations: {
		label: 'internal operations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosInternalOperation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bigMapDiffs: {
		label: 'big map diffs',
		type: EntityFieldType.EntitiesReference,
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
