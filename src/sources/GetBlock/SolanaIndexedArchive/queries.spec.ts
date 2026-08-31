import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	getSolanaTransaction,
} from '$/sources/GetBlock/SolanaIndexedArchive/queries.ts'
import {
	GetBlockSolanaIndexedArchiveResolution,
} from '$/sources/GetBlock/SolanaIndexedArchive/types.ts'
import transactionFixture from '$/sources/GetBlock/SolanaIndexedArchive/fixtures/transaction.json'
import bindings from '$/sources/GetBlock/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://archive.getblock.example',
	sourceFetch: vi.fn(),
}))

const binding = bindings[Source.GetBlockYellowstone_Grpc][0]

const respond = (
	body: unknown,
	status = 200
) => {
	vi.mocked(sourceFetch).mockResolvedValueOnce(new Response(
		body == null ? null : JSON.stringify(body),
		{ status }
	))
}

beforeEach(() => {
	vi.mocked(sourceFetch).mockReset()
})

describe('GetBlock Solana Indexed Archive transaction transport', () => {
	it('accepts complete transaction envelopes and maps resolution leftovers', async () => {
		respond(transactionFixture)
		await expect(getSolanaTransaction(
			binding,
			transactionFixture.transaction.signature
		)).resolves.toEqual(transactionFixture)
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://archive.getblock.example/transactions',
			expect.objectContaining({
				method: 'POST',
			})
		)
	})

	it('maps empty and unsupported status leftovers without parsing a body', async () => {
		respond(null, 404)
		await expect(getSolanaTransaction(
			binding,
			transactionFixture.transaction.signature
		)).resolves.toEqual({
			resolution: GetBlockSolanaIndexedArchiveResolution.Empty,
			transaction: null,
			missingFields: [],
		})
		respond(null, 422)
		await expect(getSolanaTransaction(
			binding,
			transactionFixture.transaction.signature
		)).resolves.toEqual({
			resolution: GetBlockSolanaIndexedArchiveResolution.Unsupported,
			transaction: null,
			missingFields: [],
		})
	})

	it('fails closed for malformed envelopes and identity mismatches', async () => {
		await expect(getSolanaTransaction(binding, '')).rejects.toThrow('signature must not be empty')
		respond({
			resolution: 'Complete',
			transaction: null,
			missingFields: [],
		})
		await expect(getSolanaTransaction(
			binding,
			transactionFixture.transaction.signature
		)).rejects.toThrow('complete response identity mismatch')
		respond({
			resolution: 'Complete',
			transaction: {
				...transactionFixture.transaction,
				slot: 'not-a-slot',
			},
			missingFields: [],
		})
		await expect(getSolanaTransaction(
			binding,
			transactionFixture.transaction.signature
		)).rejects.toThrow('invalid transaction response envelope')
	})
})
