import {
	beforeEach,
	expect,
	it,
	vi,
} from 'vitest'

import type { LocalMutationContext } from '$/collections/localMutations.ts'
import { Source } from '$/sources/Source.ts'

const {
	createMintQuoteBolt11,
	getMintQuoteBolt11,
	writeLocalBlockheadCashuMintQuote,
} = vi.hoisted(() => ({
	createMintQuoteBolt11: vi.fn(),
	getMintQuoteBolt11: vi.fn(),
	writeLocalBlockheadCashuMintQuote: vi.fn(),
}))

vi.mock('$/collections/localMutations.ts', () => ({
	writeLocalBlockheadCashuMintQuote,
}))
vi.mock('$/sources/Cashu/Mint/Rest/queries.ts', () => ({
	createMintQuoteBolt11,
	getMintQuoteBolt11,
}))

const {
	createLocalCashuMintQuoteBolt11,
	refreshLocalCashuMintQuoteBolt11,
} = await import('$/state/cashu/cashuMintQuoteCreation.ts')

const context = {
	entityCollections: {},
	entityFieldCollections: {},
	entityFieldCountCollections: {},
} satisfies LocalMutationContext

beforeEach(() => {
	createMintQuoteBolt11.mockReset()
	getMintQuoteBolt11.mockReset()
	writeLocalBlockheadCashuMintQuote.mockReset()
})

it('creates and durably admits a matching BOLT11 mint quote', async () => {
	const signal = new AbortController().signal
	createMintQuoteBolt11.mockResolvedValue({
		quote: 'quote-1',
		request: 'lnbc-invoice',
		amount: 21,
		unit: 'sat',
		method: 'bolt11',
		amount_paid: 0,
		amount_issued: 0,
		updated_at: 1_700_000_000,
		state: 'UNPAID',
		expiry: 1_700_000_100,
	})
	writeLocalBlockheadCashuMintQuote.mockResolvedValue({
		entitySelector: {
			quoteId: 'quote-1',
		},
	})

	await expect(createLocalCashuMintQuoteBolt11(context, {
		mintUrl: 'https://mint.example',
		amount: 21,
		unit: 'sat',
		description: 'fund wallet',
		signal,
	})).resolves.toEqual({
		entitySelector: {
			quoteId: 'quote-1',
		},
	})
	expect(createMintQuoteBolt11).toHaveBeenCalledExactlyOnceWith(
		'https://mint.example',
		{
			amount: 21,
			unit: 'sat',
			description: 'fund wallet',
		},
		{ signal }
	)
	expect(writeLocalBlockheadCashuMintQuote).toHaveBeenCalledExactlyOnceWith(
		context,
		{
			mintUrl: 'https://mint.example',
			method: 'bolt11',
			quoteId: 'quote-1',
			request: 'lnbc-invoice',
			amount: 21n,
			unit: 'sat',
		},
		{
			timestampMs: 1_700_000_000_000,
			source: Source.CashuMint_Rest,
			state: 'UNPAID',
			expiryMs: 1_700_000_100_000,
		}
	)
})

it('rejects a quote for a different amount or unit before local admission', async () => {
	createMintQuoteBolt11.mockResolvedValue({
		quote: 'quote-foreign',
		request: 'lnbc-invoice',
		amount: 22,
		unit: 'sat',
		method: 'bolt11',
		amount_paid: 0,
		amount_issued: 0,
		updated_at: 1_700_000_000,
		state: 'UNPAID',
		expiry: null,
	})

	await expect(createLocalCashuMintQuoteBolt11(context, {
		mintUrl: 'https://mint.example',
		amount: 21,
		unit: 'sat',
	})).rejects.toThrow('does not match the requested amount and unit')
	expect(writeLocalBlockheadCashuMintQuote).not.toHaveBeenCalled()
})

it('persists a legacy state-less quote without fabricating an observation', async () => {
	createMintQuoteBolt11.mockResolvedValue({
		quote: 'quote-legacy',
		request: 'lnbc-invoice',
		amount: 21,
		unit: 'sat',
		method: 'bolt11',
		amount_paid: 0,
		amount_issued: 0,
		updated_at: 1_700_000_000,
		expiry: null,
	})

	await createLocalCashuMintQuoteBolt11(context, {
		mintUrl: 'https://mint.example',
		amount: 21,
		unit: 'sat',
	})

	expect(writeLocalBlockheadCashuMintQuote.mock.calls[0][2]).toBeUndefined()
})

it('refreshes an existing BOLT11 quote through the same durable owner', async () => {
	const signal = new AbortController().signal
	getMintQuoteBolt11.mockResolvedValue({
		quote: 'quote-1',
		request: 'lnbc-invoice',
		amount: 21,
		unit: 'sat',
		method: 'bolt11',
		amount_paid: 21,
		amount_issued: 0,
		updated_at: 1_700_000_010,
		state: 'PAID',
		expiry: 1_700_000_100,
	})

	await refreshLocalCashuMintQuoteBolt11(context, {
		mintUrl: 'https://mint.example',
		quoteId: 'quote-1',
		signal,
	})

	expect(getMintQuoteBolt11).toHaveBeenCalledExactlyOnceWith(
		'https://mint.example',
		'quote-1',
		{ signal }
	)
	expect(writeLocalBlockheadCashuMintQuote).toHaveBeenCalledExactlyOnceWith(
		context,
		{
			mintUrl: 'https://mint.example',
			method: 'bolt11',
			quoteId: 'quote-1',
			request: 'lnbc-invoice',
			amount: 21n,
			unit: 'sat',
		},
		{
			timestampMs: 1_700_000_010_000,
			source: Source.CashuMint_Rest,
			state: 'PAID',
			expiryMs: 1_700_000_100_000,
		}
	)
})

it('rejects a refresh response for a different quote identity', async () => {
	getMintQuoteBolt11.mockResolvedValue({
		quote: 'quote-other',
		request: 'lnbc-invoice',
		amount: 21,
		unit: 'sat',
		method: 'bolt11',
		amount_paid: 0,
		amount_issued: 0,
		updated_at: 1_700_000_000,
		state: 'UNPAID',
		expiry: null,
	})

	await expect(refreshLocalCashuMintQuoteBolt11(context, {
		mintUrl: 'https://mint.example',
		quoteId: 'quote-1',
	})).rejects.toThrow('quote-other !== quote-1')
	expect(writeLocalBlockheadCashuMintQuote).not.toHaveBeenCalled()
})
