import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Source } from '$/sources/Source.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import type { TronScanTransactions } from '$/sources/TronScan/Rest/types.ts'

const { sourceGetJson } = vi.hoisted(() => ({
	sourceGetJson: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const { getAccountTransactions } = await import('$/sources/TronScan/Rest/queries.ts')

const binding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((candidate) => candidate.source === Source.TronScan_Rest)

if (binding == null)
	throw new Error('TronScan_Rest spec missing source binding')

describe('TronScan REST account transactions transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('uses the declared binding and exact account-filtered offset page', async () => {
		const response = {
			total: 12,
			rangeTotal: 12,
			data: [{
				hash: 'transaction-hash',
				block: 77,
				timestamp: 1_720_000_000_000,
				ownerAddress: 'T/account+address',
				toAddress: 'Trecipient',
				contractType: 1,
				contractRet: 'SUCCESS',
				amount: '42',
			}],
		} satisfies TronScanTransactions
		sourceGetJson.mockResolvedValueOnce(response)

		await expect(getAccountTransactions(
			binding,
			'T/account+address',
			20,
			40
		)).resolves.toBe(response)
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://apilist.tronscanapi.com/api/transaction?sort=-timestamp&count=true&limit=20&start=40&address=T%2Faccount%2Baddress'
		)
	})

	it('rejects pages outside TronScan transaction-list limits before transport', async () => {
		expect(() => getAccountTransactions(binding, 'Taccount', 51)).toThrow(
			'TronScan_Rest: transaction list limit must be an integer from 1 through 50'
		)
		expect(() => getAccountTransactions(binding, 'Taccount', 50, 9_951)).toThrow(
			'TronScan_Rest: transaction list range must be within the first 10000 rows'
		)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})
})
