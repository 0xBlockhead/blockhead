import { TransportType } from '$/constants/TransportType.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type {
	SolanaRpcAccountInfo,
	SolanaRpcAddressSignature,
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
	SourceDelivery,
	SourceEndpointKind,
} from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/PublicNode/bindings.ts'
import { solanaSlotLive } from '$/sources/Solana/JsonRpc/live.remote.ts'

const binding = bindings[Source.Solana_JsonRpc].find(({ delivery }) => (
	delivery === SourceDelivery.HttpProxy
))

if (binding == null)
	throw new Error('Solana_JsonRpc: HTTP proxy binding is missing')

export const solanaRpcEndpoints = bindings[Source.Solana_JsonRpc].flatMap(({ endpoints }) => (
	endpoints.map((endpoint) => ({
		url: endpoint.locator,
		transportType: (
			endpoint.endpointKind === SourceEndpointKind.HttpUrl ?
				TransportType.Http
			:
				TransportType.WebSocket
		),
		providerName: 'PublicNode',
	}))
))

export const getBlock = ({
	slot,
}: {
	slot: bigint
}) => (
	jsonRpc2<SolanaRpcBlock | null>(binding, 'getBlock', [
		Number(slot),
		{
			encoding: 'jsonParsed',
			transactionDetails: 'full',
			rewards: false,
			maxSupportedTransactionVersion: 0,
		},
	])
)

export const getSlot = () => (
	jsonRpc2<number>(binding, 'getSlot', [
		{
			commitment: 'finalized',
		},
	])
)

export const getBlockHeight = async () => {
	const blockHeight = await jsonRpc2<number>(binding, 'getBlockHeight', [
		{
			commitment: 'finalized',
		},
	])
	if (!Number.isSafeInteger(blockHeight) || blockHeight < 0)
		throw new Error('Solana getBlockHeight returned an invalid block height')

	return blockHeight
}

export const getRecentPerformanceSamples = async ({
	limit,
}: {
	limit?: number
} = {}) => {
	if (limit != null && (!Number.isSafeInteger(limit) || limit < 0 || limit > 720))
		throw new Error('Solana getRecentPerformanceSamples limit must be a safe integer from 0 through 720')
	if (limit === 0)
		return []

	const samples = await jsonRpc2<{
		slot: number
		numTransactions: number
		numSlots: number
		samplePeriodSecs: number
		numNonVoteTransactions?: number | null
	}[]>(
		binding,
		'getRecentPerformanceSamples',
		limit != null ? [limit] : []
	)
	if (limit != null && samples.length > limit)
		throw new Error('Solana getRecentPerformanceSamples exceeded the requested limit')

	for (const sample of samples) {
		if (!Number.isSafeInteger(sample.slot) || sample.slot < 0)
			throw new Error('Solana getRecentPerformanceSamples returned an invalid slot')
		if (!Number.isSafeInteger(sample.numTransactions) || sample.numTransactions < 0)
			throw new Error('Solana getRecentPerformanceSamples returned an invalid transaction count')
		if (!Number.isSafeInteger(sample.numSlots) || sample.numSlots < 0)
			throw new Error('Solana getRecentPerformanceSamples returned an invalid slot count')
		if (!Number.isSafeInteger(sample.samplePeriodSecs) || sample.samplePeriodSecs < 0)
			throw new Error('Solana getRecentPerformanceSamples returned an invalid sample period')
		if (
			sample.numNonVoteTransactions != null
			&& (
				!Number.isSafeInteger(sample.numNonVoteTransactions)
				|| sample.numNonVoteTransactions < 0
			)
		)
			throw new Error('Solana getRecentPerformanceSamples returned an invalid non-vote transaction count')
	}

	return samples
}

export const getBlocks = ({
	startSlot,
	endSlot,
}: {
	startSlot: bigint
	endSlot: bigint
}) => (
	jsonRpc2<number[]>(binding, 'getBlocks', [
		Number(startSlot),
		Number(endSlot),
		{
			commitment: 'finalized',
		},
	])
)

export const getEpochInfo = () => (
	jsonRpc2<SolanaRpcEpochInfo>(binding, 'getEpochInfo', [
		{
			commitment: 'finalized',
		},
	])
)

export const getHealth = () => (
	jsonRpc2<string>(binding, 'getHealth', [])
)

export const getVersion = () => (
	jsonRpc2<SolanaRpcVersion>(binding, 'getVersion', [])
)

export const getTransaction = ({
	signature,
	commitment = 'confirmed',
}: {
	signature: string
	commitment?: SolanaRpcCommitment
}) => (
	jsonRpc2<SolanaRpcTransaction | null>(binding, 'getTransaction', [
		signature,
		{
			commitment,
			encoding: 'jsonParsed',
			maxSupportedTransactionVersion: 0,
		},
	])
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

	const signatures = await jsonRpc2<SolanaRpcAddressSignature[]>(binding, 'getSignaturesForAddress', [
		pubkey,
		{
			commitment,
			limit,
			...(before != null && { before }),
			...(until != null && { until }),
		},
	])
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
	const transactions = await Promise.all(
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
	jsonRpc2<SolanaRpcAccountInfo>(binding, 'getAccountInfo', [
		pubkey,
		{
			encoding: 'base64',
		},
	])
)

export const getParsedTokenMintAccountInfo = ({
	pubkey,
}: {
	pubkey: string
}) => (
	jsonRpc2<SolanaRpcParsedTokenMintAccountInfo>(binding, 'getAccountInfo', [
		pubkey,
		{
			encoding: 'jsonParsed',
		},
	])
)

export const getParsedTokenAccountInfo = ({
	pubkey,
}: {
	pubkey: string
}) => (
	jsonRpc2<SolanaRpcParsedTokenAccountInfo>(binding, 'getAccountInfo', [
		pubkey,
		{
			encoding: 'jsonParsed',
		},
	])
)

export const getSignatureStatuses = ({
	signatures,
}: {
	signatures: readonly string[]
}) => (
	jsonRpc2<{
		value: (SolanaRpcSignatureStatus | null)[]
	}>(binding, 'getSignatureStatuses', [[...signatures]])
)

export const getVoteAccounts = ({
	votePubkey,
}: {
	votePubkey?: string
}) => (
	jsonRpc2<SolanaRpcVoteAccounts>(binding, 'getVoteAccounts', [
		{
			commitment: 'finalized',
			...(votePubkey != null && {
				votePubkey,
			}),
		},
	])
)

// slotSubscribe — https://solana.com/docs/rpc/websocket/slotsubscribe
// PublicNode RemoteLive wss://solana-rpc.publicnode.com
export const subscribeSlot = async function* (
	signal?: AbortSignal
): AsyncGenerator<{
	slot: number
	parent: number
	root: number
}> {
	if (signal?.aborted)
		return

	const liveBinding = bindings[Source.Solana_JsonRpc].find(({ delivery }) => (
		delivery === SourceDelivery.RemoteLive
	))
	if (liveBinding == null)
		throw new Error('Solana_JsonRpc: subscribeSlot requires the RemoteLive WebSocket binding')

	const slots = solanaSlotLive({
		targetKey: liveBinding.target.key,
	})[Symbol.asyncIterator]()
	const abort = () => {
		void slots.return?.()
	}
	signal?.addEventListener('abort', abort, { once: true })

	try {
		for (
			let result = await slots.next();
			!result.done;
			result = await slots.next()
		) {
			if (signal?.aborted)
				return

			yield result.value
		}
	} finally {
		signal?.removeEventListener('abort', abort)
		await slots.return?.()
	}
}
