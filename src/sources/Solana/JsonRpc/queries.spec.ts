import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SourceDelivery } from '$/sources/SourceBinding.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceFetch,
}))

const {
	getSignaturesForAddress,
	getTransactionsForAddress,
} = await import('$/sources/Solana/JsonRpc/queries.ts')

const pubkey = 'Account111111111111111111111111111111111'
const firstSignature = 'Signature111111111111111111111111111111111111111111111111111111111111'
const secondSignature = 'Signature222222222222222222222222222222222222222222222222222222222222'

const rpcResponse = (result: object | object[] | null) => (
	new Response(JSON.stringify({
		jsonrpc: '2.0',
		id: 1,
		result,
	}))
)

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
			rpcUrl: 'https://solana-rpc.publicnode.com',
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
			rpcUrl: 'https://solana-rpc.publicnode.com',
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
			rpcUrl: 'https://solana-rpc.publicnode.com',
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
				message: 'empty transaction signature',
			},
			{
				result: [{ ...addressSignature, slot: -1 }],
				message: 'invalid slot',
			},
			{
				result: [{ ...addressSignature, blockTime: -1 }],
				message: 'invalid block time',
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
				rpcUrl: 'https://solana-rpc.publicnode.com',
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
				rpcUrl: 'https://solana-rpc.publicnode.com',
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
				rpcUrl: 'https://solana-rpc.publicnode.com',
				...request,
			})).rejects.toThrow()

		await expect(getSignaturesForAddress({
			rpcUrl: 'https://solana-rpc.publicnode.com',
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
