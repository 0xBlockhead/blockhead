import { throwHttpError } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import { jsonRpcVersion } from '$/sources/_shared/wire/JsonRpc2/constants.ts'
import type {
	SolanaRpcAccountInfo,
	SolanaRpcAddressSignature,
	SolanaRpcAddressTransaction,
	SolanaRpcBlock,
	SolanaRpcCommitment,
	SolanaRpcEpochInfo,
	SolanaRpcParsedTokenAccountInfo,
	SolanaRpcParsedTokenMintAccountInfo,
	SolanaRpcSignatureStatus,
	SolanaRpcTransaction,
	SolanaRpcVersion,
	SolanaRpcVoteAccounts,
} from '$/sources/Solana/JsonRpc/types.ts'
import {
	SourceEndpointKind,
} from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/PublicNode/bindings.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const sourceBindings = bindings[Source.Solana_JsonRpc]
const binding = sourceBindings.find(({ endpoints }) => (
	endpoints[0].endpointKind === SourceEndpointKind.HttpUrl
))

if (binding == null)
	throw new Error('Solana_JsonRpc: canonical HTTP binding is missing')

export const solanaRpcEndpoints = sourceBindings.flatMap(({ endpoints }) => (
	endpoints.map((endpoint) => ({
		url: endpoint.locator,
		transportType: (
			endpoint.endpointKind === SourceEndpointKind.HttpUrl ?
				'Http'
			:
				'WebSocket'
		),
		providerName: 'PublicNode',
	}))
))

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
	method,
	params,
}: {
	method: string
	params: JsonValue[]
}) => {
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
	slot,
}: {
	slot: bigint
}) => (
	solanaJsonRpc<SolanaRpcBlock | null>({
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

export const getSlot = () => (
	solanaJsonRpc<number>({
		method: 'getSlot',
		params: [
			{
				commitment: 'finalized',
			},
		],
	})
)

export const getBlocks = ({
	startSlot,
	endSlot,
}: {
	startSlot: bigint
	endSlot: bigint
}) => (
	solanaJsonRpc<number[]>({
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

export const getEpochInfo = () => (
	solanaJsonRpc<SolanaRpcEpochInfo>({
		method: 'getEpochInfo',
		params: [
			{
				commitment: 'finalized',
			},
		],
	})
)

export const getHealth = () => (
	solanaJsonRpc<string>({
		method: 'getHealth',
		params: [],
	})
)

export const getVersion = () => (
	solanaJsonRpc<SolanaRpcVersion>({
		method: 'getVersion',
		params: [],
	})
)

export const getTransaction = ({
	signature,
	commitment = 'confirmed',
}: {
	signature: string
	commitment?: SolanaRpcCommitment
}) => (
	solanaJsonRpc<SolanaRpcTransaction | null>({
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
	pubkey,
	limit,
	before,
	until,
	commitment = 'confirmed',
}: {
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
	pubkey,
	limit,
	before,
	until,
	commitment = 'confirmed',
}: {
	pubkey: string
	limit: number
	before?: string
	until?: string
	commitment?: SolanaRpcCommitment
}) => {
	const page = await getSignaturesForAddress({
		pubkey,
		limit,
		before,
		until,
		commitment,
	})
	const transactions: SolanaRpcAddressTransaction[] = await Promise.all(
		page.signatures.map(async (signature) => {
			const transaction = await getTransaction({
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
	pubkey,
}: {
	pubkey: string
}) => (
	solanaJsonRpc<SolanaRpcAccountInfo>({
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
	pubkey,
}: {
	pubkey: string
}) => (
	solanaJsonRpc<SolanaRpcParsedTokenMintAccountInfo>({
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
	pubkey,
}: {
	pubkey: string
}) => (
	solanaJsonRpc<SolanaRpcParsedTokenAccountInfo>({
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
	signatures,
}: {
	signatures: readonly string[]
}) => (
	solanaJsonRpc<{
		value: (SolanaRpcSignatureStatus | null)[]
	}>({
		method: 'getSignatureStatuses',
		params: [[...signatures]],
	})
)

export const getVoteAccounts = ({
	votePubkey,
}: {
	votePubkey?: string
}) => (
	solanaJsonRpc<SolanaRpcVoteAccounts>({
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
