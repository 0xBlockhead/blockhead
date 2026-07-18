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
	SolanaRpcBlock,
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
}: {
	rpcUrl: string
	signature: string
}) => (
	solanaJsonRpc<SolanaRpcTransaction | null>({
		rpcUrl,
		method: 'getTransaction',
		params: [
			signature,
			{
				encoding: 'jsonParsed',
				maxSupportedTransactionVersion: 0,
			},
		],
	})
)

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
