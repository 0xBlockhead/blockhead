import { throwHttpError } from '$/lib/http.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { SourceEndpointKind } from '$/sources/SourceBinding.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
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

const solanaMainnetHttpUrl = 'https://solana-rpc.publicnode.com' as const

export const solanaOrigins = [
	{
		origin: solanaMainnetHttpUrl,
		corsEnabled: false,
	},
] as const

export const solanaMainnetRpcEndpoints = [
	{
		url: solanaMainnetHttpUrl,
		transportType: TransportType.Http,
		providerName: 'PublicNode',
	},
	{
		url: 'wss://solana-rpc.publicnode.com',
		transportType: TransportType.WebSocket,
		providerName: 'PublicNode',
	},
] as const

const solanaMainnetHttpBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((binding) => (
	binding.source === Source.Solana_JsonRpc
	&& binding.endpoints.some((endpoint) => (
		endpoint.endpointKind === SourceEndpointKind.HttpUrl
		&& endpoint.locator === solanaMainnetHttpUrl
	))
))
if (solanaMainnetHttpBinding == null)
	throw new Error('Solana_JsonRpc: mainnet HTTP source binding is missing')

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
	rpcUrl,
	method,
	params,
}: {
	rpcUrl: string
	method: string
	params: JsonValue[]
}) => {
	const response = await sourceFetch(
		solanaMainnetHttpBinding,
		rpcUrl,
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
	rpcUrl,
	slot,
}: {
	rpcUrl: string
	slot: bigint
}) => (
	solanaJsonRpc<SolanaRpcBlock | null>({
		rpcUrl,
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
	rpcUrl,
}: {
	rpcUrl: string
}) => (
	solanaJsonRpc<number>({
		rpcUrl,
		method: 'getSlot',
		params: [
			{
				commitment: 'finalized',
			},
		],
	})
)

export const getBlocks = ({
	rpcUrl,
	startSlot,
	endSlot,
}: {
	rpcUrl: string
	startSlot: bigint
	endSlot: bigint
}) => (
	solanaJsonRpc<number[]>({
		rpcUrl,
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
	rpcUrl,
}: {
	rpcUrl: string
}) => (
	solanaJsonRpc<SolanaRpcEpochInfo>({
		rpcUrl,
		method: 'getEpochInfo',
		params: [
			{
				commitment: 'finalized',
			},
		],
	})
)

export const getHealth = ({
	rpcUrl,
}: {
	rpcUrl: string
}) => (
	solanaJsonRpc<string>({
		rpcUrl,
		method: 'getHealth',
		params: [],
	})
)

export const getVersion = ({
	rpcUrl,
}: {
	rpcUrl: string
}) => (
	solanaJsonRpc<SolanaRpcVersion>({
		rpcUrl,
		method: 'getVersion',
		params: [],
	})
)

export const getTransaction = ({
	rpcUrl,
	signature,
	commitment = 'confirmed',
}: {
	rpcUrl: string
	signature: string
	commitment?: SolanaRpcCommitment
}) => (
	solanaJsonRpc<SolanaRpcTransaction | null>({
		rpcUrl,
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
	rpcUrl,
	pubkey,
	limit,
	before,
	until,
	commitment = 'confirmed',
}: {
	rpcUrl: string
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
		rpcUrl,
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
	rpcUrl,
	pubkey,
	limit,
	before,
	until,
	commitment = 'confirmed',
}: {
	rpcUrl: string
	pubkey: string
	limit: number
	before?: string
	until?: string
	commitment?: SolanaRpcCommitment
}) => {
	const page = await getSignaturesForAddress({
		rpcUrl,
		pubkey,
		limit,
		before,
		until,
		commitment,
	})
	const transactions: SolanaRpcAddressTransaction[] = await Promise.all(
		page.signatures.map(async (signature) => {
			const transaction = await getTransaction({
				rpcUrl,
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
	rpcUrl,
	pubkey,
}: {
	rpcUrl: string
	pubkey: string
}) => (
	solanaJsonRpc<SolanaRpcAccountInfo>({
		rpcUrl,
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
	rpcUrl,
	pubkey,
}: {
	rpcUrl: string
	pubkey: string
}) => (
	solanaJsonRpc<SolanaRpcParsedTokenMintAccountInfo>({
		rpcUrl,
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
	rpcUrl,
	pubkey,
}: {
	rpcUrl: string
	pubkey: string
}) => (
	solanaJsonRpc<SolanaRpcParsedTokenAccountInfo>({
		rpcUrl,
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
	rpcUrl,
	signatures,
}: {
	rpcUrl: string
	signatures: readonly string[]
}) => (
	solanaJsonRpc<{
		value: (SolanaRpcSignatureStatus | null)[]
	}>({
		rpcUrl,
		method: 'getSignatureStatuses',
		params: [[...signatures]],
	})
)

export const getVoteAccounts = ({
	rpcUrl,
	votePubkey,
}: {
	rpcUrl: string
	votePubkey?: string
}) => (
	solanaJsonRpc<SolanaRpcVoteAccounts>({
		rpcUrl,
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
