import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SourceDelivery } from '$/sources/SourceBinding.ts'
import { base58, base64 } from '@scure/base'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceFetch,
}))

const {
	getBlockHeight,
	getBlocks,
	getRecentPerformanceSamples,
	getSignaturesForAddress,
	getTransaction,
	getTransactionsForAddress,
	getProgramInfo,
	solanaUpgradeableLoaderProgramId,
} = await import('$/sources/Solana/JsonRpc/queries.ts')

const pubkey = 'Account111111111111111111111111111111111'
const firstSignature = 'Signature111111111111111111111111111111111111111111111111111111111111'
const secondSignature = 'Signature222222222222222222222222222222222222222222222222222222222222'

const rpcResponse = (result: unknown) => (
	new Response(JSON.stringify({
		jsonrpc: '2.0',
		id: 1,
		result,
	}))
)

const performanceSample = {
	slot: 348_125,
	numTransactions: 126,
	numSlots: 126,
	samplePeriodSecs: 60,
	numNonVoteTransactions: 1,
} as const

const addressSignature = {
	signature: firstSignature,
	slot: 123,
	err: null,
	memo: null,
	blockTime: 1_750_000_000,
	confirmationStatus: 'confirmed',
} as const

const transaction = {
	slot: 123,
	blockTime: 1_750_000_000,
	transaction: {
		signatures: [firstSignature],
		message: {
			accountKeys: [
				{
					pubkey,
					signer: true,
					writable: true,
				},
			],
			instructions: [],
		},
	},
	meta: {
		err: null,
		fee: 5_000,
	},
}

describe('Solana account transaction JSON-RPC', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('preserves before/until pagination and uses the HttpProxy source binding', async () => {
		sourceFetch.mockResolvedValueOnce(rpcResponse([
			addressSignature,
			{
				...addressSignature,
				signature: secondSignature,
				slot: 122,
			},
		]))

		await expect(getSignaturesForAddress({
			pubkey,
			limit: 2,
			before: 'BeforeSignature',
			until: 'UntilSignature',
			commitment: 'finalized',
		})).resolves.toMatchObject({
			pagination: {
				limit: 2,
				before: 'BeforeSignature',
				until: 'UntilSignature',
				nextBefore: secondSignature,
			},
		})
		expect(sourceFetch.mock.calls[0][0]).toMatchObject({
			delivery: SourceDelivery.HttpProxy,
		})
		expect(sourceFetch.mock.calls[0][1]).toBe('https://solana-rpc.publicnode.com')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body)).toEqual({
			jsonrpc: '2.0',
			id: 1,
			method: 'getSignaturesForAddress',
			params: [
				pubkey,
				{
					commitment: 'finalized',
					limit: 2,
					before: 'BeforeSignature',
					until: 'UntilSignature',
				},
			],
		})
	})

	it('loads minimal transaction facts and rejects a transaction outside the exact account subject', async () => {
		sourceFetch
			.mockResolvedValueOnce(rpcResponse([addressSignature]))
			.mockResolvedValueOnce(rpcResponse(transaction))

		await expect(getTransactionsForAddress({
			pubkey,
			limit: 1,
		})).resolves.toEqual({
			transactions: [{
				...addressSignature,
				transaction,
			}],
			pagination: {
				limit: 1,
				nextBefore: firstSignature,
			},
		})
		expect(JSON.parse(sourceFetch.mock.calls[1][2].body)).toMatchObject({
			method: 'getTransaction',
			params: [
				firstSignature,
				{
					commitment: 'confirmed',
					encoding: 'jsonParsed',
					maxSupportedTransactionVersion: 0,
				},
			],
		})

		sourceFetch
			.mockResolvedValueOnce(rpcResponse([addressSignature]))
			.mockResolvedValueOnce(rpcResponse({
				...transaction,
				transaction: {
					...transaction.transaction,
					message: {
						...transaction.transaction.message,
						accountKeys: [{
							pubkey: 'DifferentAccount',
							signer: true,
							writable: true,
						}],
					},
				},
			}))
		await expect(getTransactionsForAddress({
			pubkey,
			limit: 1,
		})).rejects.toThrow(`outside account ${pubkey}`)
	})

	it('fails closed on malformed pages and mismatched detail identities', async () => {
		const malformedPages = [
			{
				result: [addressSignature, addressSignature],
				message: 'duplicate transaction signature',
			},
			{
				result: [{ ...addressSignature, signature: '' }],
				message: 'invalid address signatures response envelope',
			},
			{
				result: [{ ...addressSignature, slot: -1 }],
				message: 'invalid address signatures response envelope',
			},
			{
				result: [{ ...addressSignature, blockTime: -1 }],
				message: 'invalid address signatures response envelope',
			},
			{
				result: [
					addressSignature,
					{
						...addressSignature,
						signature: secondSignature,
					},
				],
				message: 'exceeded the requested limit',
				limit: 1,
			},
		]
		for (const { result, message, limit = 2 } of malformedPages) {
			sourceFetch.mockResolvedValueOnce(rpcResponse(result))
			await expect(getSignaturesForAddress({
				pubkey,
				limit,
			})).rejects.toThrow(message)
		}

		for (const mismatchedTransaction of [
			null,
			{
				...transaction,
				slot: 124,
			},
			{
				...transaction,
				transaction: {
					...transaction.transaction,
					signatures: [secondSignature],
				},
			},
		]) {
			sourceFetch
				.mockResolvedValueOnce(rpcResponse([addressSignature]))
				.mockResolvedValueOnce(rpcResponse(mismatchedTransaction))
			await expect(getTransactionsForAddress({
				pubkey,
				limit: 1,
			})).rejects.toThrow(
				mismatchedTransaction == null ?
					'did not find'
				:
					'mismatched'
			)
		}
	})

	it('rejects invalid requests and performs no transport for a zero limit', async () => {
		for (const request of [
			{ pubkey: '', limit: 1 },
			{ pubkey, limit: -1 },
			{ pubkey, limit: 1_001 },
			{ pubkey, limit: 0.5 },
			{ pubkey, limit: 1, before: '' },
			{ pubkey, limit: 1, until: '' },
			{
				pubkey,
				limit: 1,
				before: firstSignature,
				until: firstSignature,
			},
		])
			await expect(getSignaturesForAddress({
				...request,
			})).rejects.toThrow()

		await expect(getSignaturesForAddress({
			pubkey,
			limit: 0,
			before: firstSignature,
		})).resolves.toEqual({
			signatures: [],
			pagination: {
				limit: 0,
				before: firstSignature,
			},
		})
		expect(sourceFetch).not.toHaveBeenCalled()
	})
})

describe('Solana upgradeable program hierarchy', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('resolves the program-data account and current upgrade authority at one monotonic context', async () => {
		const programDataAddressBytes = new Uint8Array(32).fill(7)
		const authorityAddressBytes = new Uint8Array(32).fill(9)
		const programData = new Uint8Array(36)
		new DataView(programData.buffer).setUint32(0, 2, true)
		programData.set(programDataAddressBytes, 4)
		const authorityData = new Uint8Array(45)
		new DataView(authorityData.buffer).setUint32(0, 3, true)
		authorityData[12] = 1
		authorityData.set(authorityAddressBytes, 13)

		sourceFetch
			.mockResolvedValueOnce(rpcResponse({
				context: {
					slot: 100,
				},
				value: {
					lamports: 1,
					owner: solanaUpgradeableLoaderProgramId,
					executable: true,
					rentEpoch: 0,
					data: [base64.encode(programData), 'base64'],
				},
			}))
			.mockResolvedValueOnce(rpcResponse({
				context: {
					slot: 101,
				},
				value: {
					lamports: 1,
					owner: solanaUpgradeableLoaderProgramId,
					executable: false,
					rentEpoch: 0,
					data: [base64.encode(authorityData), 'base64'],
				},
			}))

		await expect(getProgramInfo({
			programId: pubkey,
		})).resolves.toEqual({
			loaderAddress: solanaUpgradeableLoaderProgramId,
			programDataAddress: base58.encode(programDataAddressBytes),
			upgradeAuthorityAddress: base58.encode(authorityAddressBytes),
			slot: 101,
		})
		expect(JSON.parse(sourceFetch.mock.calls[1][2].body).params).toEqual([
			base58.encode(programDataAddressBytes),
			{
				encoding: 'base64',
				minContextSlot: 100,
			},
		])
	})

	it('preserves an executable immutable program without inventing upgrade authority', async () => {
		sourceFetch.mockResolvedValueOnce(rpcResponse({
			context: {
				slot: 100,
			},
			value: {
				lamports: 1,
				owner: 'ForeignLoader11111111111111111111111111111',
				executable: true,
				rentEpoch: 0,
				data: [base64.encode(new Uint8Array(36)), 'base64'],
			},
		}))

		await expect(getProgramInfo({
			programId: pubkey,
		})).resolves.toEqual({
			loaderAddress: 'ForeignLoader11111111111111111111111111111',
			slot: 100,
		})
	})
})

describe('Solana exact transaction and block-range identity', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('rejects a substituted direct transaction signature', async () => {
		sourceFetch.mockResolvedValueOnce(rpcResponse({
			transaction: {
				signatures: [secondSignature],
				message: {
					accountKeys: [],
					instructions: [],
				},
			},
		}))

		await expect(getTransaction({
			signature: firstSignature,
		})).rejects.toThrow('mismatched signature')
	})

	it('rejects invalid requested and returned block ranges', async () => {
		await expect(getBlocks({
			startSlot: 2n,
			endSlot: 1n,
		})).rejects.toThrow('invalid slot range')
		expect(sourceFetch).not.toHaveBeenCalled()

		sourceFetch.mockResolvedValueOnce(rpcResponse([
			1,
			1,
		]))
		await expect(getBlocks({
			startSlot: 1n,
			endSlot: 2n,
		})).rejects.toThrow('invalid slot range')

		sourceFetch.mockResolvedValueOnce(rpcResponse([3]))
		await expect(getBlocks({
			startSlot: 1n,
			endSlot: 2n,
		})).rejects.toThrow('invalid slot range')
	})
})

describe('Solana network head JSON-RPC', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('reads finalized block height through the HttpProxy source binding', async () => {
		sourceFetch.mockResolvedValueOnce(rpcResponse(275_123_456))

		await expect(getBlockHeight()).resolves.toBe(275_123_456)
		expect(sourceFetch.mock.calls[0][0]).toMatchObject({
			delivery: SourceDelivery.HttpProxy,
		})
		expect(sourceFetch.mock.calls[0][1]).toBe('https://solana-rpc.publicnode.com')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body)).toEqual({
			jsonrpc: '2.0',
			id: 1,
			method: 'getBlockHeight',
			params: [
				{
					commitment: 'finalized',
				},
			],
		})
	})

	it('fails closed on an invalid block height', async () => {
		for (const result of [-1, 1.5, Number.MAX_SAFE_INTEGER + 1, null]) {
			sourceFetch.mockResolvedValueOnce(rpcResponse(result))
			await expect(getBlockHeight()).rejects.toThrow('invalid block height')
		}
	})

	it('loads bounded recent performance samples and fails closed on malformed rows', async () => {
		sourceFetch.mockResolvedValueOnce(rpcResponse([
			performanceSample,
			{
				...performanceSample,
				slot: 347_999,
			},
		]))

		await expect(getRecentPerformanceSamples({
			limit: 2,
		})).resolves.toEqual([
			performanceSample,
			{
				...performanceSample,
				slot: 347_999,
			},
		])
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body)).toEqual({
			jsonrpc: '2.0',
			id: 1,
			method: 'getRecentPerformanceSamples',
			params: [2],
		})

		for (const { result, message, limit = 2 } of [
			{
				result: [performanceSample, performanceSample],
				message: 'exceeded the requested limit',
				limit: 1,
			},
			{
				result: [{ ...performanceSample, slot: -1 }],
				message: 'invalid performance samples response envelope',
			},
			{
				result: [{ ...performanceSample, numTransactions: -1 }],
				message: 'invalid performance samples response envelope',
			},
			{
				result: [{ ...performanceSample, numSlots: 1.5 }],
				message: 'invalid performance samples response envelope',
			},
			{
				result: [{ ...performanceSample, samplePeriodSecs: -1 }],
				message: 'invalid performance samples response envelope',
			},
			{
				result: [{ ...performanceSample, numNonVoteTransactions: -1 }],
				message: 'invalid performance samples response envelope',
			},
		]) {
			sourceFetch.mockResolvedValueOnce(rpcResponse(result))
			await expect(getRecentPerformanceSamples({
				limit,
			})).rejects.toThrow(message)
		}
	})

	it('rejects an invalid performance sample limit and performs no transport for a zero limit', async () => {
		for (const limit of [-1, 721, 0.5])
			await expect(getRecentPerformanceSamples({
				limit,
			})).rejects.toThrow()

		await expect(getRecentPerformanceSamples({
			limit: 0,
		})).resolves.toEqual([])
		expect(sourceFetch).not.toHaveBeenCalled()
	})
})

describe('Solana account / validator / epoch JSON-RPC envelopes', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('fail-closes account info and vote account envelopes', async () => {
		const {
			getAccountInfo,
			getEpochInfo,
			getVoteAccounts,
		} = await import('$/sources/Solana/JsonRpc/queries.ts')

		sourceFetch.mockResolvedValueOnce(rpcResponse({
			context: {
				slot: 42,
			},
			value: {
				lamports: 1,
				owner: '11111111111111111111111111111111',
				executable: false,
				rentEpoch: 0,
				data: ['AQ==', 'base64'],
			},
		}))
		await expect(getAccountInfo({
			pubkey,
		})).resolves.toMatchObject({
			context: {
				slot: 42,
			},
			value: {
				lamports: 1,
				owner: '11111111111111111111111111111111',
			},
		})

		sourceFetch.mockResolvedValueOnce(rpcResponse({
			value: {
				lamports: 1,
				owner: '11111111111111111111111111111111',
				executable: false,
				rentEpoch: 0,
				data: ['AQ==', 'base64'],
			},
		}))
		await expect(getAccountInfo({
			pubkey,
		})).rejects.toThrow('invalid account info response envelope')

		sourceFetch.mockResolvedValueOnce(rpcResponse({
			context: {
				slot: 42,
			},
			value: {
				lamports: -1,
				owner: '11111111111111111111111111111111',
				executable: false,
				rentEpoch: 0,
				data: ['AQ==', 'base64'],
			},
		}))
		await expect(getAccountInfo({
			pubkey,
		})).rejects.toThrow('invalid account info response envelope')

		sourceFetch.mockResolvedValueOnce(rpcResponse({
			current: [{
				activatedStake: 10,
				commission: 5,
				epochVoteAccount: true,
				lastVote: 1,
				nodePubkey: 'Node111111111111111111111111111111111111111',
				rootSlot: 1,
				votePubkey: 'Vote111111111111111111111111111111111111111',
			}],
			delinquent: [],
		}))
		vi.spyOn(Date, 'now').mockReturnValueOnce(1_784_678_400_000)
		await expect(getVoteAccounts({})).resolves.toMatchObject({
			observedAtMs: 1_784_678_400_000,
			current: [
				{
					commission: 5,
				},
			],
		})

		sourceFetch.mockResolvedValueOnce(rpcResponse({
			current: [{
				activatedStake: 10,
				commission: 101,
				epochVoteAccount: true,
				lastVote: 1,
				nodePubkey: 'Node111111111111111111111111111111111111111',
				rootSlot: 1,
				votePubkey: 'Vote111111111111111111111111111111111111111',
			}],
			delinquent: [],
		}))
		await expect(getVoteAccounts({})).rejects.toThrow('invalid vote accounts response envelope')

		sourceFetch.mockResolvedValueOnce(rpcResponse({
			absoluteSlot: 1,
			blockHeight: 1,
			epoch: 1,
			slotIndex: 1,
			slotsInEpoch: 432_000,
		}))
		await expect(getEpochInfo()).resolves.toMatchObject({
			epoch: 1,
			slotsInEpoch: 432_000,
		})

		sourceFetch.mockResolvedValueOnce(rpcResponse({
			absoluteSlot: -1,
			blockHeight: 1,
			epoch: 1,
			slotIndex: 1,
			slotsInEpoch: 432_000,
		}))
		await expect(getEpochInfo()).rejects.toThrow('invalid epoch info response envelope')
	})
})

describe('Solana getTokenAccountsByOwner JSON-RPC envelopes', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	const tokenAccountPubkey = 'TokenAccount111111111111111111111111111111'
	const mintAddress = 'Mint111111111111111111111111111111111111111'
	const tokenAccountRow = {
		pubkey: tokenAccountPubkey,
		account: {
			lamports: 2_039_280,
			owner: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
			executable: false,
			rentEpoch: 18_446_744_073_709_551_615,
			data: {
				program: 'spl-token',
				parsed: {
					info: {
						mint: mintAddress,
						owner: pubkey,
						state: 'initialized',
						tokenAmount: {
							amount: '1000000',
							decimals: 6,
							uiAmountString: '1',
						},
					},
					type: 'account',
				},
				space: 165,
			},
		},
	} as const

	it('returns parsed token accounts with context.slot and default Token program filter', async () => {
		const {
			getTokenAccountsByOwner,
			solanaTokenProgramId,
		} = await import('$/sources/Solana/JsonRpc/queries.ts')

		sourceFetch.mockResolvedValueOnce(rpcResponse({
			context: {
				apiVersion: '2.0.0',
				slot: 341_197_933,
			},
			value: [tokenAccountRow],
		}))

		await expect(getTokenAccountsByOwner({
			owner: pubkey,
			limit: 16,
		})).resolves.toEqual({
			context: {
				apiVersion: '2.0.0',
				slot: 341_197_933,
			},
			value: [tokenAccountRow],
		})
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body)).toMatchObject({
			method: 'getTokenAccountsByOwner',
			params: [
				pubkey,
				{
					programId: solanaTokenProgramId,
				},
				{
					commitment: 'confirmed',
					encoding: 'jsonParsed',
				},
			],
		})
	})

	it('filters by mint, slices client limit, and fail-closes bad envelopes / ownership', async () => {
		const { getTokenAccountsByOwner } = await import('$/sources/Solana/JsonRpc/queries.ts')

		sourceFetch.mockResolvedValueOnce(rpcResponse({
			context: {
				slot: 10,
			},
			value: [
				tokenAccountRow,
				{
					...tokenAccountRow,
					pubkey: 'TokenAccount222222222222222222222222222222',
				},
			],
		}))
		await expect(getTokenAccountsByOwner({
			owner: pubkey,
			mint: mintAddress,
			limit: 1,
		})).resolves.toMatchObject({
			context: {
				slot: 10,
			},
			value: [
				{
					pubkey: tokenAccountPubkey,
				},
			],
		})
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).params[1]).toEqual({
			mint: mintAddress,
		})

		sourceFetch.mockResolvedValueOnce(rpcResponse({
			value: [tokenAccountRow],
		}))
		await expect(getTokenAccountsByOwner({
			owner: pubkey,
		})).rejects.toThrow('invalid token accounts by owner response envelope')

		sourceFetch.mockResolvedValueOnce(rpcResponse({
			context: {
				slot: 10,
			},
			value: [
				{
					...tokenAccountRow,
					account: {
						...tokenAccountRow.account,
						data: {
							...tokenAccountRow.account.data,
							parsed: {
								...tokenAccountRow.account.data.parsed,
								info: {
									...tokenAccountRow.account.data.parsed.info,
									owner: 'OtherOwner111111111111111111111111111111',
								},
							},
						},
					},
				},
			],
		}))
		await expect(getTokenAccountsByOwner({
			owner: pubkey,
		})).rejects.toThrow(`token account outside owner ${pubkey}`)

		sourceFetch.mockResolvedValueOnce(rpcResponse({
			context: {
				slot: 10,
			},
			value: [
				tokenAccountRow,
				tokenAccountRow,
			],
		}))
		await expect(getTokenAccountsByOwner({
			owner: pubkey,
		})).rejects.toThrow('duplicate token account pubkey')

		await expect(getTokenAccountsByOwner({
			owner: '',
		})).rejects.toThrow('owner must not be empty')
		await expect(getTokenAccountsByOwner({
			owner: pubkey,
			limit: 0,
		})).resolves.toEqual({
			context: {
				slot: 0,
			},
			value: [],
		})
		expect(sourceFetch).toHaveBeenCalledTimes(4)
	})
})
