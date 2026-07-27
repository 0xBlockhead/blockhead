import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Algod/bindings.ts'
import { Source } from '$/sources/Source.ts'

const { getJson } = vi.hoisted(() => ({
	getJson: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const { getAccount } = await import('$/sources/Algod/Rest/queries.ts')

const binding = bindings[Source.Algod_Rest]

const account = 'A'.repeat(58)

describe('Algod canonical account state transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads exact account state while preserving every safe integer', async () => {
		getJson.mockResolvedValueOnce({
			address: account,
			amount: Number.MAX_SAFE_INTEGER,
			'amount-without-pending-rewards': 10,
			'min-balance': 100_000,
			'pending-rewards': 0,
			rewards: 5,
			round: 100,
			status: 'Offline',
			'total-assets-opted-in': 2,
		})

		await expect(getAccount(binding, account)).resolves.toMatchObject({
			address: account,
			amount: Number.MAX_SAFE_INTEGER,
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			`/v2/accounts/${account}?exclude=all`
		)
	})

	it('fails closed on foreign identity and lossy uint64 amounts', async () => {
		getJson.mockResolvedValueOnce({
			address: 'B'.repeat(58),
		})
		await expect(getAccount(binding, account)).rejects.toThrow('identity does not match')

		getJson.mockResolvedValueOnce({
			address: account,
			amount: Number.MAX_SAFE_INTEGER + 1,
			'amount-without-pending-rewards': 10,
			'min-balance': 100_000,
			'pending-rewards': 0,
			rewards: 5,
			round: 100,
			status: 'Offline',
			'total-assets-opted-in': 2,
		})
		await expect(getAccount(binding, account)).rejects.toThrow(
			'exceeds lossless JSON integer range'
		)
	})
})
