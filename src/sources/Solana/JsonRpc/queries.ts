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
	SolanaRpcTokenAccountsByOwner,
	SolanaRpcTransaction,
	SolanaRpcVersion,
	SolanaRpcVoteAccounts,
} from '$/sources/Solana/JsonRpc/types.ts'
import {
	SourceDelivery,
	SourceEndpointKind,
	sourceBindingId,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/PublicNode/bindings.ts'
import { solanaSlotLive } from '$/sources/Solana/JsonRpc/live.remote.ts'
import { base58, base64 } from '@scure/base'
import { type as arktype } from 'arktype'

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

const nonNegativeSafeInteger = 'number.integer >= 0 & number <= 9007199254740991'
const solanaCommitmentWire = arktype("'confirmed' | 'finalized' | 'processed'").or('null')

/** Classic SPL Token program id — default filter for getTokenAccountsByOwner when mint is omitted. */
export const solanaTokenProgramId = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'

/** Token-2022 program id — optional getTokenAccountsByOwner programId filter. */
export const solanaToken2022ProgramId = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'

export const solanaUpgradeableLoaderProgramId = 'BPFLoaderUpgradeab1e11111111111111111111111'

const solanaRpcContextWire = arktype({
	slot: nonNegativeSafeInteger,
	'apiVersion?': 'string',
})

const solanaParsedTokenAccountInfoFieldsWire = arktype({
	mint: 'string > 0',
	owner: 'string > 0',
	tokenAmount: {
		amount: '/^(0|[1-9][0-9]*)$/',
		decimals: 'number.integer >= 0 & number <= 255',
		'uiAmountString?': 'string',
	},
	'state?': 'string',
	'isNative?': 'boolean',
	'delegate?': 'string',
	'delegatedAmount?': {
		amount: '/^(0|[1-9][0-9]*)$/',
	},
	'rentExemptReserve?': {
		amount: '/^(0|[1-9][0-9]*)$/',
	},
	'closeAuthority?': 'string',
})

const solanaInstructionWire = arktype({
	programId: 'string > 0',
	'program?': 'string',
	'parsed?': {
		'type?': 'string',
		'info?': {
			'account?': 'string',
			'destination?': 'string',
			'mint?': 'string',
			'newAccount?': 'string',
			'source?': 'string',
		},
	},
	'accounts?': 'string[]',
	'data?': 'string',
	'stackHeight?': nonNegativeSafeInteger,
})

const solanaAccountKeyWire = arktype({
	pubkey: 'string > 0',
	signer: 'boolean',
	writable: 'boolean',
	'source?': 'string',
})

const solanaTransactionWire = arktype({
	'slot?': nonNegativeSafeInteger,
	'blockTime?': arktype(nonNegativeSafeInteger).or('null'),
	transaction: {
		signatures: arktype('string > 0').array(),
		message: {
			accountKeys: solanaAccountKeyWire.array(),
			instructions: solanaInstructionWire.array(),
		},
	},
	'meta?': {
		err: 'unknown',
		fee: nonNegativeSafeInteger,
		'computeUnitsConsumed?': nonNegativeSafeInteger,
		'innerInstructions?': arktype({
			index: nonNegativeSafeInteger,
			instructions: solanaInstructionWire.array(),
		}).array(),
	},
})

const solanaBlockWire = arktype({
	'blockHeight?': nonNegativeSafeInteger,
	'blockTime?': arktype(nonNegativeSafeInteger).or('null'),
	blockhash: 'string > 0',
	parentSlot: nonNegativeSafeInteger,
	previousBlockhash: 'string > 0',
	transactions: solanaTransactionWire.array(),
})

const solanaAddressSignatureWire = arktype({
	signature: 'string > 0',
	slot: nonNegativeSafeInteger,
	err: 'unknown',
	memo: arktype('string').or('null'),
	blockTime: arktype(nonNegativeSafeInteger).or('null'),
	confirmationStatus: solanaCommitmentWire,
})

const solanaPerformanceSampleWire = arktype({
	slot: nonNegativeSafeInteger,
	numTransactions: nonNegativeSafeInteger,
	numSlots: nonNegativeSafeInteger,
	samplePeriodSecs: nonNegativeSafeInteger,
	'numNonVoteTransactions?': arktype(nonNegativeSafeInteger).or('null'),
})

const solanaAccountInfoWire = arktype({
	context: solanaRpcContextWire,
	value: arktype({
		lamports: nonNegativeSafeInteger,
		owner: 'string > 0',
		executable: 'boolean',
		rentEpoch: 'number >= 0',
		data: arktype(['string', 'string']),
	}).or('null'),
})

const solanaParsedTokenMintAccountInfoWire = arktype({
	context: solanaRpcContextWire,
	value: arktype({
		data: {
			parsed: {
				info: {
					supply: '/^(0|[1-9][0-9]*)$/',
					decimals: 'number.integer >= 0 & number <= 255',
					'isInitialized?': 'boolean',
					'mintAuthority?': arktype('string').or('null'),
					'freezeAuthority?': arktype('string').or('null'),
				},
			},
		},
	}).or('null'),
})

const solanaParsedTokenAccountInfoWire = arktype({
	context: solanaRpcContextWire,
	value: arktype({
		data: {
			parsed: {
				info: solanaParsedTokenAccountInfoFieldsWire,
			},
		},
	}).or('null'),
})

const solanaTokenAccountsByOwnerWire = arktype({
	context: solanaRpcContextWire,
	value: arktype({
		pubkey: 'string > 0',
		account: {
			lamports: nonNegativeSafeInteger,
			owner: 'string > 0',
			executable: 'boolean',
			rentEpoch: 'number >= 0',
			data: {
				program: 'string > 0',
				parsed: {
					info: solanaParsedTokenAccountInfoFieldsWire,
					'type?': 'string',
				},
				'space?': nonNegativeSafeInteger,
			},
		},
	}).array(),
})

const solanaSignatureStatusWire = arktype({
	slot: nonNegativeSafeInteger,
	confirmations: arktype(nonNegativeSafeInteger).or('null'),
	err: 'unknown',
	'confirmationStatus?': 'string',
})

const solanaVoteAccountWire = arktype({
	activatedStake: nonNegativeSafeInteger,
	commission: 'number.integer >= 0 & number <= 100',
	epochVoteAccount: 'boolean',
	'epochCredits?': 'unknown',
	lastVote: nonNegativeSafeInteger,
	nodePubkey: 'string > 0',
	rootSlot: nonNegativeSafeInteger,
	votePubkey: 'string > 0',
})

const solanaVoteAccountsWire = arktype({
	current: solanaVoteAccountWire.array(),
	delinquent: solanaVoteAccountWire.array(),
})

const solanaEpochInfoWire = arktype({
	absoluteSlot: nonNegativeSafeInteger,
	blockHeight: nonNegativeSafeInteger,
	epoch: nonNegativeSafeInteger,
	slotIndex: nonNegativeSafeInteger,
	slotsInEpoch: nonNegativeSafeInteger,
	'transactionCount?': nonNegativeSafeInteger,
})

const solanaVersionWire = arktype({
	'solana-core': 'string > 0',
	'feature-set?': nonNegativeSafeInteger,
})

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`${Source.Solana_JsonRpc}: invalid ${label} response envelope`)
	}
}

export const getBlock = async ({
	slot,
}: {
	slot: bigint
}) => {
	const block = await jsonRpc2<unknown>(binding, 'getBlock', [
		Number(slot),
		{
			encoding: 'jsonParsed',
			transactionDetails: 'full',
			rewards: false,
			maxSupportedTransactionVersion: 0,
		},
	])
	if (block == null)
		return null

	return assertEnvelope('block', solanaBlockWire, block) as SolanaRpcBlock
}

export const getBlockTime = async ({
	slot,
}: {
	slot: bigint
}) => (
	assertEnvelope(
		'block time',
		arktype(nonNegativeSafeInteger).or('null'),
		await jsonRpc2<unknown>(binding, 'getBlockTime', [Number(slot)])
	)
)

export const getSlot = async () => (
	assertEnvelope(
		'slot',
		arktype(nonNegativeSafeInteger),
		await jsonRpc2<unknown>(binding, 'getSlot', [
			{
				commitment: 'finalized',
			},
		])
	)
)

export const getBlockHeight = async () => {
	const blockHeight = await jsonRpc2<unknown>(binding, 'getBlockHeight', [
		{
			commitment: 'finalized',
		},
	])
	if (!Number.isSafeInteger(blockHeight) || (blockHeight as number) < 0)
		throw new Error('Solana getBlockHeight returned an invalid block height')

	return assertEnvelope(
		'block height',
		arktype(nonNegativeSafeInteger),
		blockHeight
	)
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

	const samples = assertEnvelope(
		'performance samples',
		solanaPerformanceSampleWire.array(),
		await jsonRpc2<unknown>(
			binding,
			'getRecentPerformanceSamples',
			limit != null ? [limit] : []
		)
	)
	if (limit != null && samples.length > limit)
		throw new Error('Solana getRecentPerformanceSamples exceeded the requested limit')

	return samples
}

export const getBlocks = async ({
	startSlot,
	endSlot,
}: {
	startSlot: bigint
	endSlot: bigint
}) => {
	if (
		startSlot < 0n
		|| endSlot < startSlot
		|| endSlot > BigInt(Number.MAX_SAFE_INTEGER)
	)
		throw new Error('Solana getBlocks received an invalid slot range')

	const slots = assertEnvelope(
		'blocks',
		arktype(nonNegativeSafeInteger).array(),
		await jsonRpc2<unknown>(binding, 'getBlocks', [
			Number(startSlot),
			Number(endSlot),
			{
				commitment: 'finalized',
			},
		])
	)
	const seenSlots = new Set<number>()
	for (const slot of slots) {
		if (
			BigInt(slot) < startSlot
			|| BigInt(slot) > endSlot
			|| seenSlots.has(slot)
		)
			throw new Error('Solana getBlocks returned an invalid slot range')
		seenSlots.add(slot)
	}

	return slots
}

export const getEpochInfo = async () => (
	assertEnvelope(
		'epoch info',
		solanaEpochInfoWire,
		await jsonRpc2<unknown>(binding, 'getEpochInfo', [
			{
				commitment: 'finalized',
			},
		])
	) as SolanaRpcEpochInfo
)

export const getHealth = async () => (
	assertEnvelope(
		'health',
		arktype('string > 0'),
		await jsonRpc2<unknown>(binding, 'getHealth', [])
	)
)

export const getVersion = async () => (
	assertEnvelope(
		'version',
		solanaVersionWire,
		await jsonRpc2<unknown>(binding, 'getVersion', [])
	) as SolanaRpcVersion
)

export const getTransaction = async ({
	signature,
	commitment = 'confirmed',
}: {
	signature: string
	commitment?: SolanaRpcCommitment
}) => {
	const transaction = await jsonRpc2<unknown>(binding, 'getTransaction', [
		signature,
		{
			commitment,
			encoding: 'jsonParsed',
			maxSupportedTransactionVersion: 0,
		},
	])
	if (transaction == null)
		return null

	const parsedTransaction = assertEnvelope(
		'transaction',
		solanaTransactionWire,
		transaction
	) as SolanaRpcTransaction
	if (parsedTransaction.transaction.signatures[0] !== signature)
		throw new Error('Solana getTransaction returned a mismatched signature')

	return parsedTransaction
}

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

	const signatures = assertEnvelope(
		'address signatures',
		solanaAddressSignatureWire.array(),
		await jsonRpc2<unknown>(binding, 'getSignaturesForAddress', [
			pubkey,
			{
				commitment,
				limit,
				...(before != null && { before }),
				...(until != null && { until }),
			},
		])
	) as SolanaRpcAddressSignature[]
	if (signatures.length > limit)
		throw new Error('Solana getSignaturesForAddress exceeded the requested limit')

	const seenSignatures = new Set<string>()
	for (const signature of signatures) {
		if (seenSignatures.has(signature.signature))
			throw new Error('Solana getSignaturesForAddress returned a duplicate transaction signature')

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

export const getAccountInfo = async ({
	pubkey,
	minContextSlot,
}: {
	pubkey: string
	minContextSlot?: number
}) => (
	assertEnvelope(
		'account info',
		solanaAccountInfoWire,
		await jsonRpc2<unknown>(binding, 'getAccountInfo', [
			pubkey,
			{
				encoding: 'base64',
				...(minContextSlot != null && {
					minContextSlot,
				}),
			},
		])
	) as SolanaRpcAccountInfo
)

export const getProgramInfo = async ({
	programId,
}: {
	programId: string
}) => {
	const programAccount = await getAccountInfo({
		pubkey: programId,
	})
	if (programAccount.value == null)
		throw new Error(`Solana program account not found for ${programId}`)
	if (!programAccount.value.executable)
		throw new Error(`Solana program account ${programId} is not executable`)
	if (programAccount.value.owner !== solanaUpgradeableLoaderProgramId)
		return {
			loaderAddress: programAccount.value.owner,
			slot: programAccount.context.slot,
		}
	if (programAccount.value.data[1] !== 'base64')
		throw new Error(`Solana program ${programId} did not return base64 account data`)

	const programData = base64.decode(programAccount.value.data[0])
	if (
		programData.length !== 36
		|| new DataView(programData.buffer, programData.byteOffset, programData.byteLength).getUint32(0, true) !== 2
	)
		throw new Error(`Solana program ${programId} has invalid upgradeable-loader program data`)

	const programDataAddress = base58.encode(programData.subarray(4))
	const programDataAccount = await getAccountInfo({
		pubkey: programDataAddress,
		minContextSlot: programAccount.context.slot,
	})
	if (programDataAccount.value == null)
		throw new Error(`Solana program-data account not found for ${programId}`)
	if (programDataAccount.value.owner !== solanaUpgradeableLoaderProgramId)
		throw new Error(`Solana program-data account for ${programId} has an invalid owner`)
	if (programDataAccount.value.data[1] !== 'base64')
		throw new Error(`Solana program-data account for ${programId} did not return base64 data`)

	const authorityData = base64.decode(programDataAccount.value.data[0])
	if (
		authorityData.length < 13
		|| new DataView(authorityData.buffer, authorityData.byteOffset, authorityData.byteLength).getUint32(0, true) !== 3
		|| (authorityData[12] === 0 && authorityData.length !== 13)
		|| (authorityData[12] === 1 && authorityData.length !== 45)
		|| (authorityData[12] !== 0 && authorityData[12] !== 1)
	)
		throw new Error(`Solana program-data account for ${programId} has invalid upgradeable-loader data`)

	return {
		loaderAddress: programAccount.value.owner,
		programDataAddress,
		upgradeAuthorityAddress: authorityData[12] === 1 ?
			base58.encode(authorityData.subarray(13))
		:
			undefined,
		slot: programDataAccount.context.slot,
	}
}

export const getParsedTokenMintAccountInfo = async ({
	pubkey,
}: {
	pubkey: string
}) => (
	assertEnvelope(
		'token mint account info',
		solanaParsedTokenMintAccountInfoWire,
		await jsonRpc2<unknown>(binding, 'getAccountInfo', [
			pubkey,
			{
				encoding: 'jsonParsed',
			},
		])
	) as SolanaRpcParsedTokenMintAccountInfo
)

export const getParsedTokenAccountInfo = async ({
	pubkey,
}: {
	pubkey: string
}) => (
	assertEnvelope(
		'token account info',
		solanaParsedTokenAccountInfoWire,
		await jsonRpc2<unknown>(binding, 'getAccountInfo', [
			pubkey,
			{
				encoding: 'jsonParsed',
			},
		])
	) as SolanaRpcParsedTokenAccountInfo
)

export const getTokenAccountsByOwner = async ({
	owner,
	mint,
	programId = solanaTokenProgramId,
	commitment = 'confirmed',
	limit,
}: {
	owner: string
	mint?: string
	programId?: string
	commitment?: SolanaRpcCommitment
	limit?: number
}) => {
	if (owner.length === 0)
		throw new Error('Solana getTokenAccountsByOwner owner must not be empty')
	if (mint != null && mint.length === 0)
		throw new Error('Solana getTokenAccountsByOwner mint must not be empty')
	if (mint == null && programId.length === 0)
		throw new Error('Solana getTokenAccountsByOwner programId must not be empty')
	if (limit != null && (!Number.isSafeInteger(limit) || limit < 0))
		throw new Error('Solana getTokenAccountsByOwner limit must be a non-negative safe integer')
	if (limit === 0)
		return {
			context: {
				slot: 0,
			},
			value: [],
		} satisfies SolanaRpcTokenAccountsByOwner

	const response = assertEnvelope(
		'token accounts by owner',
		solanaTokenAccountsByOwnerWire,
		await jsonRpc2<unknown>(binding, 'getTokenAccountsByOwner', [
			owner,
			(
				mint != null ?
					{
						mint,
					}
				:
					{
						programId,
					}
			),
			{
				commitment,
				encoding: 'jsonParsed',
			},
		])
	) as SolanaRpcTokenAccountsByOwner

	const seenPubkeys = new Set<string>()
	for (const tokenAccount of response.value) {
		if (seenPubkeys.has(tokenAccount.pubkey))
			throw new Error('Solana getTokenAccountsByOwner returned a duplicate token account pubkey')
		if (tokenAccount.account.data.parsed.info.owner !== owner)
			throw new Error(`Solana getTokenAccountsByOwner returned a token account outside owner ${owner}`)
		if (mint != null && tokenAccount.account.data.parsed.info.mint !== mint)
			throw new Error(`Solana getTokenAccountsByOwner returned a token account outside mint ${mint}`)

		seenPubkeys.add(tokenAccount.pubkey)
	}

	return (
		limit == null || response.value.length <= limit ?
			response
		:
			{
				context: response.context,
				value: response.value.slice(0, limit),
			}
	)
}

export const getSignatureStatuses = async ({
	signatures,
}: {
	signatures: readonly string[]
}) => (
	assertEnvelope(
		'signature statuses',
		arktype({
			value: solanaSignatureStatusWire.or('null').array(),
		}),
		await jsonRpc2<unknown>(binding, 'getSignatureStatuses', [[...signatures]])
	) as {
		value: (SolanaRpcSignatureStatus | null)[]
	}
)

export const getVoteAccounts = async ({
	votePubkey,
}: {
	votePubkey?: string
}) => {
	const [
		voteAccounts,
		slot,
	] = await Promise.all([
		assertEnvelope(
			'vote accounts',
			solanaVoteAccountsWire,
			await jsonRpc2<unknown>(binding, 'getVoteAccounts', [
				{
					commitment: 'finalized',
					...(votePubkey != null && {
						votePubkey,
					}),
				},
			])
		) as SolanaRpcVoteAccounts,
		getSlot(),
	])
	const blockTime = await getBlockTime({
		slot: BigInt(slot),
	})
	if (blockTime == null)
		throw new Error(`${Source.Solana_JsonRpc}: finalized head block has no blockTime`)

	return {
		...voteAccounts,
		observedAtMs: blockTime * 1000,
	}
}

// slotSubscribe — https://solana.com/docs/rpc/websocket/slotsubscribe
// PublicNode RemoteLive wss://solana-rpc.publicnode.com
export const subscribeSlot = async function* (
	binding: SourceBinding,
	signal?: AbortSignal
): AsyncGenerator<{
	slot: number
	parent: number
	root: number
}> {
	if (signal?.aborted)
		return

	const slots = solanaSlotLive({
		bindingId: sourceBindingId(binding),
		targetKey: binding.target.key,
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
