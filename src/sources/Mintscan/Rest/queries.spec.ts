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
	getSyncing,
	getTx,
} = queries

const publicEnv = {
	PUBLIC_MINTSCAN_API_KEY: 'configured token',
}

const accountEnvelope = {
	account: {
		'@type': '/cosmos.auth.v1beta1.BaseAccount',
		address: 'cosmos1account',
		account_number: '11',
		sequence: '22',
	},
}

const blockEnvelope = {
	block_id: {
		hash: 'B'.repeat(64),
	},
	block: {
		header: {
			height: '24681012',
			time: '2026-07-23T04:48:08Z',
			proposer_address: 'proposer',
		},
		data: {
			txs: [
				'tx1',
			],
		},
	},
}

const nodeInfoEnvelope = {
	default_node_info: {
		network: 'cosmoshub-4',
		version: 'v0.38.0',
		moniker: 'mintscan-proxy',
	},
	application_version: {
		name: 'gaia',
		app_name: 'gaiad',
		version: 'v15.0.0',
		cosmos_sdk_version: 'v0.47.0',
	},
}

const syncingEnvelope = {
	syncing: false,
}

const txEnvelope = {
	tx: {
		body: {
			memo: 'mintscan',
			timeout_height: '0',
			messages: [
				{
					'@type': '/cosmos.bank.v1beta1.MsgSend',
					from_address: 'cosmos1sender',
				},
			],
		},
		auth_info: {
			fee: {
				amount: [
					{
						denom: 'uatom',
						amount: '1000',
					},
				],
				gas_limit: '200000',
			},
		},
		signatures: [
			'sig',
		],
	},
	tx_response: {
		height: '24681012',
		txhash: 'ABCD',
		code: 0,
		gas_wanted: '200000',
		gas_used: '100000',
		raw_log: '[]',
		events: [
			{
				type: 'transfer',
			},
		],
	},
}

describe('Mintscan Cosmos LCD proxy operations', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
		sourceFetch.mockResolvedValue(new Response(JSON.stringify(blockEnvelope)))
	})

	it.each([
		{
			query: () => {
				sourceFetch.mockResolvedValue(new Response(JSON.stringify(accountEnvelope)))
				return getAccount(publicEnv, {
					network: 'cosmos/path',
					address: 'cosmos1account/path',
				})
			},
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
			query: () => {
				sourceFetch.mockResolvedValue(new Response(JSON.stringify(nodeInfoEnvelope)))
				return getNodeInfo(publicEnv, {
					network: 'cosmos/path',
				})
			},
			url: 'https://apis.mintscan.io/cosmos%2Fpath/lcd/cosmos/base/tendermint/v1beta1/node_info',
		},
		{
			query: () => {
				sourceFetch.mockResolvedValue(new Response(JSON.stringify(syncingEnvelope)))
				return getSyncing(publicEnv, {
					network: 'cosmos/path',
				})
			},
			url: 'https://apis.mintscan.io/cosmos%2Fpath/lcd/cosmos/base/tendermint/v1beta1/syncing',
		},
		{
			query: () => {
				sourceFetch.mockResolvedValue(new Response(JSON.stringify(txEnvelope)))
				return getTx(publicEnv, {
					network: 'cosmos/path',
					txHash: 'AB/CD',
				})
			},
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
		await expect(getSyncing(publicEnv, {
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

	it('rejects empty path inputs before HTTP', async () => {
		await expect(getAccount(publicEnv, {
			network: '',
			address: 'cosmos1account',
		})).rejects.toThrow('Mintscan: network is empty')
		await expect(getAccount(publicEnv, {
			network: 'cosmos',
			address: '',
		})).rejects.toThrow('Mintscan: address is empty')
		await expect(getBlock(publicEnv, {
			network: 'cosmos',
			height: -1n,
		})).rejects.toThrow('Mintscan: invalid block height -1')
		await expect(getTx(publicEnv, {
			network: 'cosmos',
			txHash: '',
		})).rejects.toThrow('Mintscan: transaction hash is empty')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('fail-closes malformed LCD envelopes', async () => {
		sourceFetch.mockResolvedValue(new Response(JSON.stringify({
			block: {},
		})))
		await expect(getLatestBlock(publicEnv, {
			network: 'cosmos',
		})).rejects.toThrow('Mintscan: invalid latest block response envelope')

		sourceFetch.mockResolvedValue(new Response(JSON.stringify({})))
		await expect(getAccount(publicEnv, {
			network: 'cosmos',
			address: 'cosmos1account',
		})).rejects.toThrow('Mintscan: invalid account response envelope')

		sourceFetch.mockResolvedValue(new Response(JSON.stringify({
			default_node_info: {},
		})))
		await expect(getNodeInfo(publicEnv, {
			network: 'cosmos',
		})).rejects.toThrow('Mintscan: invalid node info response envelope')

		sourceFetch.mockResolvedValue(new Response(JSON.stringify({
			syncing: 'no',
		})))
		await expect(getSyncing(publicEnv, {
			network: 'cosmos',
		})).rejects.toThrow('Mintscan: invalid syncing response envelope')

		sourceFetch.mockResolvedValue(new Response(JSON.stringify({
			tx_response: {
				height: '1',
			},
		})))
		await expect(getTx(publicEnv, {
			network: 'cosmos',
			txHash: 'abcd',
		})).rejects.toThrow('Mintscan: invalid tx response envelope')
	})

	it('accepts live-shaped LCD envelopes', async () => {
		sourceFetch.mockResolvedValue(new Response(JSON.stringify(accountEnvelope)))
		await expect(getAccount(publicEnv, {
			network: 'cosmos',
			address: 'cosmos1account',
		})).resolves.toEqual(accountEnvelope)

		sourceFetch.mockResolvedValue(new Response(JSON.stringify(blockEnvelope)))
		await expect(getLatestBlock(publicEnv, {
			network: 'cosmos',
		})).resolves.toEqual(blockEnvelope)

		sourceFetch.mockResolvedValue(new Response(JSON.stringify(nodeInfoEnvelope)))
		await expect(getNodeInfo(publicEnv, {
			network: 'cosmos',
		})).resolves.toEqual(nodeInfoEnvelope)

		sourceFetch.mockResolvedValue(new Response(JSON.stringify(syncingEnvelope)))
		await expect(getSyncing(publicEnv, {
			network: 'cosmos',
		})).resolves.toEqual(syncingEnvelope)

		sourceFetch.mockResolvedValue(new Response(JSON.stringify(txEnvelope)))
		await expect(getTx(publicEnv, {
			network: 'cosmos',
			txHash: 'ABCD',
		})).resolves.toEqual(txEnvelope)
	})

	it('exports only endpoint-specific operations', () => {
		expect(Object.keys(queries).sort()).toEqual([
			'getAccount',
			'getBlock',
			'getLatestBlock',
			'getNodeInfo',
			'getSyncing',
			'getTx',
		])
	})
})
