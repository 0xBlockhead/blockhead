import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Kingnodes/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const { getDydxLatestBlock } = await import('$/sources/Kingnodes/Rest/queries.ts')

describe('Kingnodes dYdX node read transport', () => {
	it('owns the canonical dYdX mainnet binding', async () => {
		sourceGetJson.mockResolvedValue({
			block: {
				header: {
					chain_id: 'dydx-mainnet-1',
					height: '99785572',
					time: '2026-07-31T19:32:02.172381662Z',
				},
			},
		})

		await expect(getDydxLatestBlock()).resolves.toMatchObject({
			block: {
				header: {
					height: '99785572',
				},
			},
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			bindings[Source.KingnodesDydxNode][0],
			'https://dydx-rest.kingnodes.com/cosmos/base/tendermint/v1beta1/blocks/latest'
		)
	})

	it('rejects another consensus chain', async () => {
		sourceGetJson.mockResolvedValue({
			block: {
				header: {
					chain_id: 'foreign-1',
					height: '1',
					time: '2026-07-31T19:32:02.172381662Z',
				},
			},
		})

		await expect(getDydxLatestBlock()).rejects.toThrow('foreign chain')
	})
})
