import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Mintscan/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://apis.mintscan.io',
	sourceFetch,
}))

const queries = await import('$/sources/Mintscan/Rest/queries.ts')
const {
	getAccount,
	getBlock,
	getLatestBlock,
	getNodeInfo,
	getTx,
} = queries

const publicEnv = {
	PUBLIC_MINTSCAN_API_KEY: 'configured token',
}

describe('Mintscan Cosmos LCD proxy operations', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
		sourceFetch.mockResolvedValue(new Response('{}'))
	})

	it.each([
		{
			query: () => getAccount(publicEnv, {
				network: 'cosmos/path',
				address: 'cosmos1account/path',
			}),
			url: 'https://apis.mintscan.io/cosmos%2Fpath/lcd/cosmos/auth/v1beta1/accounts/cosmos1account%2Fpath',
		},
		{
			query: () => getLatestBlock(publicEnv, {
				network: 'cosmos/path',
			}),
			url: 'https://apis.mintscan.io/cosmos%2Fpath/lcd/cosmos/base/tendermint/v1beta1/blocks/latest',
		},
		{
			query: () => getBlock(publicEnv, {
				network: 'cosmos/path',
				height: 24681012n,
			}),
			url: 'https://apis.mintscan.io/cosmos%2Fpath/lcd/cosmos/base/tendermint/v1beta1/blocks/24681012',
		},
		{
			query: () => getNodeInfo(publicEnv, {
				network: 'cosmos/path',
			}),
			url: 'https://apis.mintscan.io/cosmos%2Fpath/lcd/cosmos/base/tendermint/v1beta1/node_info',
		},
		{
			query: () => getTx(publicEnv, {
				network: 'cosmos/path',
				txHash: 'AB/CD',
			}),
			url: 'https://apis.mintscan.io/cosmos%2Fpath/lcd/cosmos/tx/v1beta1/txs/AB%2FCD',
		},
	])('queries the named LCD operation through the canonical binding', async ({ query, url }) => {
		await query()

		expect(sourceFetch).toHaveBeenCalledWith(
			bindings[Source.Mintscan][0],
			url,
			{
				headers: {
					Authorization: 'Bearer configured token',
				},
			}
		)
	})

	it('requires the documented bearer token', async () => {
		await expect(getLatestBlock({}, {
			network: 'cosmos',
		})).rejects.toThrow('Missing or empty required env: PUBLIC_MINTSCAN_API_KEY')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('hard-fails non-OK LCD responses', async () => {
		sourceFetch.mockResolvedValue(new Response(JSON.stringify({
			message: 'upstream timeout',
		}), {
			status: 502,
			statusText: 'Bad Gateway',
		}))

		await expect(getLatestBlock(publicEnv, {
			network: 'cosmos',
		})).rejects.toThrow(/Mintscan GET .*502/)
		await expect(getBlock(publicEnv, {
			network: 'cosmos',
			height: 1n,
		})).rejects.toThrow(/Mintscan GET .*502/)
		await expect(getNodeInfo(publicEnv, {
			network: 'cosmos',
		})).rejects.toThrow(/Mintscan GET .*502/)
		await expect(getTx(publicEnv, {
			network: 'cosmos',
			txHash: 'abcd',
		})).rejects.toThrow(/Mintscan GET .*502/)
		await expect(getAccount(publicEnv, {
			network: 'cosmos',
			address: 'cosmos1account',
		})).rejects.toThrow(/Mintscan GET .*502/)
	})

	it('rejects empty path inputs before HTTP', () => {
		expect(() => getAccount(publicEnv, {
			network: '',
			address: 'cosmos1account',
		})).toThrow('Mintscan: network is empty')
		expect(() => getAccount(publicEnv, {
			network: 'cosmos',
			address: '',
		})).toThrow('Mintscan: address is empty')
		expect(() => getBlock(publicEnv, {
			network: 'cosmos',
			height: -1n,
		})).toThrow('Mintscan: invalid block height -1')
		expect(() => getTx(publicEnv, {
			network: 'cosmos',
			txHash: '',
		})).toThrow('Mintscan: transaction hash is empty')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('exports only endpoint-specific operations', () => {
		expect(Object.keys(queries).sort()).toEqual([
			'getAccount',
			'getBlock',
			'getLatestBlock',
			'getNodeInfo',
			'getTx',
		])
	})
})
