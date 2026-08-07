import { type as arktype } from 'arktype'

export enum GetBlockSolanaIndexedArchiveResolution {
	Complete = 'Complete',
	Empty = 'Empty',
	Partial = 'Partial',
	Unsupported = 'Unsupported',
}

const nonEmptyString = arktype('string > 0')
const nonNegativeSafeIntegerString = arktype('/^(0|[1-9]\\d*)$/')
const nullableNonNegativeSafeInteger = arktype('number.integer >= 0').or('null')
const nullableNonEmptyString = nonEmptyString.or('null')
const nullableStatus = arktype("'success' | 'failed'").or('null')

export const getBlockSolanaIndexedArchiveInstructionWire = arktype({
	programId: nonEmptyString,
	accounts: nonEmptyString.array(),
	data: nonEmptyString,
	stackHeight: nullableNonNegativeSafeInteger,
})

export const getBlockSolanaIndexedArchiveTransactionWire = arktype({
	signature: nonEmptyString,
	slot: nonNegativeSafeIntegerString,
	blockTimeMs: nullableNonNegativeSafeInteger,
	feePayer: nonEmptyString,
	feeLamports: nullableNonEmptyString,
	computeUnitsConsumed: nullableNonNegativeSafeInteger,
	status: nullableStatus,
	instructions: getBlockSolanaIndexedArchiveInstructionWire.array(),
})

export const getBlockSolanaIndexedArchiveResponseWire = arktype({
	resolution: arktype("'Complete' | 'Empty' | 'Partial' | 'Unsupported'"),
	transaction: getBlockSolanaIndexedArchiveTransactionWire.or('null'),
	missingFields: nonEmptyString.array(),
})

export type GetBlockSolanaIndexedArchiveInstruction = typeof getBlockSolanaIndexedArchiveInstructionWire.infer
export type GetBlockSolanaIndexedArchiveTransaction = typeof getBlockSolanaIndexedArchiveTransactionWire.infer
export type GetBlockSolanaIndexedArchiveResponse = typeof getBlockSolanaIndexedArchiveResponseWire.infer
