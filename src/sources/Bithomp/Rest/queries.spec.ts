import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Bithomp/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://bithomp.com/api/v2/',
	sourceFetch,
}))

const queries = await import('$/sources/Bithomp/Rest/queries.ts')
const {
	getAccount,
	getAccountTransactions,
	getAmm,
	getAmms,
	getLedgerEntry,
	getSearch,
	getTrustlines,
	getUsername,
} = queries

const publicEnv = {
	PUBLIC_BITHOMP_API_KEY: 'configured token',
}

const jsonResponse = (body: unknown, status = 200) => (
	new Response(JSON.stringify(body), { status })
)

describe('Bithomp Rest fail-closed envelopes', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('asserts account / amm / amms / trustlines / transactions / ledgerEntry envelopes', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonResponse({
				address: 'rAccount',
				ledgerInfo: {
					ledger: 98_765_432,
					ledgerTimestamp: 1_784_783_358,
					balance: '900719925474099312345',
					ownerCount: 3,
					sequence: 42,
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				account: 'rAmmAccount',
				amount: '13820630640',
				amount2: {
					currency: 'USD',
					issuer: 'rIssuer',
					value: '173068.8207730273',
				},
				updatedAt: 1_713_700_900,
				updatedLedgerIndex: 87_461_194,
				tradingFee: 290,
			}))
			.mockResolvedValueOnce(jsonResponse({
				order: 'createdOld',
				marker: 'NEXT',
				amms: [{
					account: 'rAmmAccount',
					amount: '1',
					amount2: {
						currency: 'USD',
						issuer: 'rIssuer',
						value: '2',
					},
				}],
			}))
			.mockResolvedValueOnce(jsonResponse([{
				counterparty: 'rIssuer',
				currency: 'USD',
				balance: '1.5',
				limit: '1000',
				ripplingDisabled: true,
				peer: {
					limit: '0',
					ripplingDisabled: true,
				},
			}]))
			.mockResolvedValueOnce(jsonResponse([{
				id: 'TXHASH',
				type: 'payment',
				address: 'rAccount',
				sequence: 1,
				outcome: {
					result: 'tesSUCCESS',
					timestamp: '2025-07-18T21:03:10.000Z',
					fee: '0.01',
					ledgerIndex: 97_563_734,
				},
				rawTransaction: JSON.stringify({
					hash: 'TXHASH',
					TransactionType: 'Payment',
					Account: 'rAccount',
					Sequence: 1,
					Fee: '10000',
					ledger_index: 97_563_734,
					validated: true,
					meta: {
						TransactionResult: 'tesSUCCESS',
					},
				}),
			}]))
			.mockResolvedValueOnce(jsonResponse({
				index: 'ENTRYHASH',
				ledger_hash: 'LEDGERHASH',
				ledger_index: 80_000_000,
				node: {
					LedgerEntryType: 'AccountRoot',
					Account: 'rAccount',
					PreviousTxnID: 'PREV',
					PreviousTxnLgrSeq: 79_999_999,
				},
				validated: true,
			}))

		await expect(getAccount(publicEnv, { address: 'rAccount/with path' })).resolves.toMatchObject({
			ledgerInfo: {
				balance: '900719925474099312345',
			},
		})
		expect(sourceFetch).toHaveBeenNthCalledWith(
			1,
			bindings[Source.Bithomp][0],
			'https://bithomp.com/api/v2/address/rAccount%2Fwith%20path?ledgerInfo=true',
			{
				headers: {
					'x-bithomp-token': 'configured token',
				},
			}
		)

		await expect(getAmm(publicEnv, { id: 'rAmm/with path' })).resolves.toMatchObject({
			account: 'rAmmAccount',
			amount: '13820630640',
		})
		await expect(getAmms(publicEnv, { marker: 'CUR', limit: 10 })).resolves.toMatchObject({
			marker: 'NEXT',
		})
		await expect(getTrustlines(publicEnv, { address: 'rAccount' })).resolves.toHaveLength(1)
		await expect(getAccountTransactions(publicEnv, { address: 'rAccount', limit: 1 })).resolves.toMatchObject([{
			id: 'TXHASH',
		}])
		await expect(getLedgerEntry(publicEnv, { index: 'ENTRYHASH' })).resolves.toMatchObject({
			validated: true,
		})
	})

	it('fail-closes malformed account / amm / trustlines / ledgerEntry envelopes', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonResponse({
				address: 'rAccount',
				ledgerInfo: {
					ledger: 1,
					ledgerTimestamp: 1,
					balance: '1.5',
					ownerCount: 0,
					sequence: 0,
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				account: 'rAmm',
				amount: 12,
				amount2: {
					currency: 'USD',
					value: '1',
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				lines: [],
			}))
			.mockResolvedValueOnce(jsonResponse({
				index: 'ENTRYHASH',
				ledger_hash: 'LEDGERHASH',
				ledger_index: 1,
				node: {
					LedgerEntryType: 'AccountRoot',
				},
				validated: 'yes',
			}))

		await expect(getAccount(publicEnv, { address: 'rAccount' }))
			.rejects.toThrow('invalid account response envelope')
		await expect(getAmm(publicEnv, { id: 'rAmm' }))
			.rejects.toThrow('invalid amm response envelope')
		await expect(getTrustlines(publicEnv, { address: 'rAccount' }))
			.rejects.toThrow('invalid trustlines response envelope')
		await expect(getLedgerEntry(publicEnv, { index: 'ENTRYHASH' }))
			.rejects.toThrow('invalid ledger entry response envelope')
	})

	it('hard-fails non-OK HTTP instead of soft-emptying', async () => {
		sourceFetch.mockResolvedValue(new Response('upstream', { status: 503 }))

		await expect(getAccount(publicEnv, { address: 'rAccount' })).rejects.toThrow(/503/)
	})

	it('rejects malformed transaction cursor coordinates before transport', async () => {
		await expect(getAccountTransactions(publicEnv, {
			address: 'rAccount',
			startTxHash: 'not-a-transaction-hash',
		})).rejects.toThrow('invalid account transaction start hash')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('asserts search / username transport leftovers', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonResponse({
				value: 'rAccount',
				type: 'address',
				result: {
					address: 'rAccount',
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				address: 'rAccount',
				username: 'bitstamp',
			}))

		await expect(getSearch(publicEnv, { value: 'rAccount' })).resolves.toMatchObject({
			type: 'address',
		})
		await expect(getUsername(publicEnv, { username: 'bitstamp' })).resolves.toMatchObject({
			address: 'rAccount',
		})
	})
})

describe('Bithomp Rest query surface', () => {
	it('exports the modeled explorer operations', () => {
		expect(Object.keys(queries).sort()).toEqual([
			'getAccount',
			'getAccountTransactions',
			'getAmm',
			'getAmms',
			'getLedgerEntry',
			'getSearch',
			'getTrustlines',
			'getUsername',
		])
	})
})
