import { query } from '$app/server'
import { type } from 'arktype'

import {
	getAddressBalances as getAddressBalancesFromSui,
	getAddressObjects as getAddressObjectsFromSui,
	getAddressTransactions as getAddressTransactionsFromSui,
	getCheckpointByDigest as getCheckpointByDigestFromSui,
	getCheckpointBySequence as getCheckpointBySequenceFromSui,
	getCoinMetadata as getCoinMetadataFromSui,
	getLatestCheckpoint as getLatestCheckpointFromSui,
	getObject as getObjectFromSui,
	getPackage as getPackageFromSui,
	getRecentTransactions as getRecentTransactionsFromSui,
	getTransaction as getTransactionFromSui,
} from '$/sources/Sui/Graphql/queries.ts'

const pageInput = type({
	'after?': 'string',
	limit: 'number',
})

const addressPageInput = type({
	...pageInput.definition,
	address: 'string',
})

export const getAddressBalances = query(addressPageInput, (input) => getAddressBalancesFromSui(input))
export const getAddressTransactions = query(addressPageInput, (input) => getAddressTransactionsFromSui(input))
export const getAddressObjects = query(addressPageInput, (input) => getAddressObjectsFromSui(input))
export const getRecentTransactions = query(pageInput, (input) => getRecentTransactionsFromSui(input))
export const getLatestCheckpoint = query(() => getLatestCheckpointFromSui())
export const getCheckpointBySequence = query(type('bigint'), (sequence) => getCheckpointBySequenceFromSui(sequence))
export const getCheckpointByDigest = query(type('string'), (digest) => getCheckpointByDigestFromSui(digest))
export const getTransaction = query(type('string'), (digest) => getTransactionFromSui(digest))
export const getObject = query(type('string'), (objectId) => getObjectFromSui(objectId))
export const getCoinMetadata = query(type('string'), (coinType) => getCoinMetadataFromSui(coinType))
export const getPackage = query(
	type({
		'moduleAfter?': 'string',
		moduleLimit: 'number',
		packageId: 'string',
	}),
	(input) => getPackageFromSui(input)
)
