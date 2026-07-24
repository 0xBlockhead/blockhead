import { throwHttpError } from '$/lib/http.ts'
import { jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceEndpointKind,
	SourceTargetKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	SolanaRpcAccountInfo,
	SolanaRpcAddressSignature,
	SolanaRpcAddressTransaction,
	SolanaRpcBlock,
	SolanaRpcCommitment,
	SolanaRpcEpochInfo,
	SolanaRpcParsedTokenMintAccountInfo,
	SolanaRpcParsedTokenAccountInfo,
	SolanaRpcSignatureStatus,
	SolanaRpcTransaction,
	SolanaRpcVersion,
	SolanaRpcVoteAccounts,
} from '$/sources/Solana/JsonRpc/types.ts'

const assertSolanaMainnetHttpBinding = (binding: SourceBinding) => {
	if (
		binding.source !== Source.Solana_JsonRpc
		|| binding.target.kind !== SourceTargetKind.Caip2Network
		|| binding.target.key !== 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'
		|| !binding.endpoints.some((endpoint) => endpoint.endpointKind === SourceEndpointKind.HttpUrl)
	)
		throw new Error('Solana_JsonRpc: expected canonical Solana mainnet HTTP binding')
}

type JsonRpcResponse<_Result> = {
	jsonrpc: typeof jsonRpcVersion
	id: number | string | null
	result?: _Result
	error?: {
		code: number
		message: string
		data?: JsonValue
	}
}

const solanaJsonRpc = async <_Result>({
	binding,
	method,
	params,
}: {
	binding: SourceBinding
	method: string
	params: JsonValue[]
}) => {
	assertSolanaMainnetHttpBinding(binding)
	const response = await sourceFetch(
		binding,
		firstHttpUrlForBinding(binding),
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				jsonrpc: jsonRpcVersion,
				id: 1,
				method,
				params,
			}),
		}
	)
	if (!response.ok) await throwHttpError(`Solana ${method}`, response)
	const json = await response.json<JsonRpcResponse<_Result>>()
	if (json.error != null) throw new Error(`Solana ${method}: ${json.error.message}`)
	if (json.result === undefined) throw new Error(`Solana ${method}: missing result`)
	return json.result
}

export const getBlock = ({
	binding,
	slot,
}: {
	binding: SourceBinding
	slot: bigint
}) => (
	solanaJsonRpc<SolanaRpcBlock | null>({
		binding,
		method: 'getBlock',
		params: [
			Number(slot),
			{
				encoding: 'jsonParsed',
				transactionDetails: 'full',
				rewards: false,
				maxSupportedTransactionVersion: 0,
			},
		],
	})
)

export const getSlot = ({
	binding,
}: {
	binding: SourceBinding
}) => (
	solanaJsonRpc<number>({
		binding,
		method: 'getSlot',
		params: [
			{
				commitment: 'finalized',
			},
		],
	})
)

export const getBlocks = ({
	binding,
	startSlot,
	endSlot,
}: {
	binding: SourceBinding
	startSlot: bigint
	endSlot: bigint
}) => (
	solanaJsonRpc<number[]>({
		binding,
		method: 'getBlocks',
		params: [
			Number(startSlot),
			Number(endSlot),
			{
				commitment: 'finalized',
			},
		],
	})
)

export const getEpochInfo = ({
	binding,
}: {
	binding: SourceBinding
}) => (
	solanaJsonRpc<SolanaRpcEpochInfo>({
		binding,
		method: 'getEpochInfo',
		params: [
			{
				commitment: 'finalized',
			},
		],
	})
)

export const getHealth = ({
	binding,
}: {
	binding: SourceBinding
}) => (
	solanaJsonRpc<string>({
		binding,
		method: 'getHealth',
		params: [],
	})
)

export const getVersion = ({
	binding,
}: {
	binding: SourceBinding
}) => (
	solanaJsonRpc<SolanaRpcVersion>({
		binding,
		method: 'getVersion',
		params: [],
	})
)

export const getTransaction = ({
	binding,
	signature,
	commitment = 'confirmed',
}: {
	binding: SourceBinding
	signature: string
	commitment?: SolanaRpcCommitment
}) => (
	solanaJsonRpc<SolanaRpcTransaction | null>({
		binding,
		method: 'getTransaction',
		params: [
			signature,
			{
				commitment,
				encoding: 'jsonParsed',
				maxSupportedTransactionVersion: 0,
			},
		],
	})
)

export const getSignaturesForAddress = async ({
	binding,
	pubkey,
	limit,
	before,
	until,
	commitment = 'confirmed',
}: {
	binding: SourceBinding
	pubkey: string
	limit: number
	before?: string
	until?: string
	commitment?: SolanaRpcCommitment
}) => {
	if (pubkey.length === 0)
		throw new Error('Solana getSignaturesForAddress pubkey must not be empty')
	if (!Number.isSafeInteger(limit) || limit < 0 || limit > 1_000)
		throw new Error('Solana getSignaturesForAddress limit must be a safe integer from 0 through 1000')
	if (before === '' || until === '')
		throw new Error('Solana getSignaturesForAddress pagination signatures must not be empty')
	if (before != null && until != null && before === until)
		throw new Error('Solana getSignaturesForAddress before and until signatures must differ')
	if (limit === 0)
		return {
			signatures: [],
			pagination: {
				limit,
				...(before != null && { before }),
				...(until != null && { until }),
			},
		}

	const signatures = await solanaJsonRpc<SolanaRpcAddressSignature[]>({
		binding,
		method: 'getSignaturesForAddress',
		params: [
			pubkey,
			{
				commitment,
				limit,
				...(before != null && { before }),
				...(until != null && { until }),
			},
		],
	})
	if (signatures.length > limit)
		throw new Error('Solana getSignaturesForAddress exceeded the requested limit')

	const seenSignatures = new Set<string>()
	for (const signature of signatures) {
		if (signature.signature.length === 0)
			throw new Error('Solana getSignaturesForAddress returned an empty transaction signature')
		if (seenSignatures.has(signature.signature))
			throw new Error('Solana getSignaturesForAddress returned a duplicate transaction signature')
		if (!Number.isSafeInteger(signature.slot) || signature.slot < 0)
			throw new Error('Solana getSignaturesForAddress returned an invalid slot')
		if (
			signature.blockTime != null
			&& (!Number.isSafeInteger(signature.blockTime) || signature.blockTime < 0)
		)
			throw new Error('Solana getSignaturesForAddress returned an invalid block time')

		seenSignatures.add(signature.signature)
	}

	return {
		signatures,
		pagination: {
			limit,
			...(before != null && { before }),
			...(until != null && { until }),
			...(signatures.length === limit && {
				nextBefore: signatures.at(-1)?.signature,
			}),
		},
	}
}

export const getTransactionsForAddress = async ({
	binding,
	pubkey,
	limit,
	before,
	until,
	commitment = 'confirmed',
}: {
	binding: SourceBinding
	pubkey: string
	limit: number
	before?: string
	until?: string
	commitment?: SolanaRpcCommitment
}) => {
	const page = await getSignaturesForAddress({
		binding,
		pubkey,
		limit,
		before,
		until,
		commitment,
	})
	const transactions: SolanaRpcAddressTransaction[] = await Promise.all(
		page.signatures.map(async (signature) => {
			const transaction = await getTransaction({
				binding,
				signature: signature.signature,
				commitment,
			})
			if (transaction == null)
				throw new Error(`Solana getTransaction did not find ${signature.signature}`)
			if (transaction.transaction.signatures[0] !== signature.signature)
				throw new Error(`Solana getTransaction returned a mismatched signature for ${signature.signature}`)
			if (transaction.slot !== signature.slot)
				throw new Error(`Solana getTransaction returned a mismatched slot for ${signature.signature}`)
			if (!transaction.transaction.message.accountKeys.some((account) => account.pubkey === pubkey))
				throw new Error(`Solana getTransaction returned a transaction outside account ${pubkey}`)

			return {
				...signature,
				transaction,
			}
		})
	)
	return {
		transactions,
		pagination: page.pagination,
	}
}

export const getAccountInfo = ({
	binding,
	pubkey,
}: {
	binding: SourceBinding
	pubkey: string
}) => (
	solanaJsonRpc<SolanaRpcAccountInfo>({
		binding,
		method: 'getAccountInfo',
		params: [
			pubkey,
			{
				encoding: 'base64',
			},
		],
	})
)

export const getParsedTokenMintAccountInfo = ({
	binding,
	pubkey,
}: {
	binding: SourceBinding
	pubkey: string
}) => (
	solanaJsonRpc<SolanaRpcParsedTokenMintAccountInfo>({
		binding,
		method: 'getAccountInfo',
		params: [
			pubkey,
			{
				encoding: 'jsonParsed',
			},
		],
	})
)

export const getParsedTokenAccountInfo = ({
	binding,
	pubkey,
}: {
	binding: SourceBinding
	pubkey: string
}) => (
	solanaJsonRpc<SolanaRpcParsedTokenAccountInfo>({
		binding,
		method: 'getAccountInfo',
		params: [
			pubkey,
			{
				encoding: 'jsonParsed',
			},
		],
	})
)

export const getSignatureStatuses = ({
	binding,
	signatures,
}: {
	binding: SourceBinding
	signatures: readonly string[]
}) => (
	solanaJsonRpc<{
		value: (SolanaRpcSignatureStatus | null)[]
	}>({
		binding,
		method: 'getSignatureStatuses',
		params: [[...signatures]],
	})
)

export const getVoteAccounts = ({
	binding,
	votePubkey,
}: {
	binding: SourceBinding
	votePubkey?: string
}) => (
	solanaJsonRpc<SolanaRpcVoteAccounts>({
		binding,
		method: 'getVoteAccounts',
		params: [
			{
				commitment: 'finalized',
				...(votePubkey != null && {
					votePubkey,
				}),
			},
		],
	})
)
