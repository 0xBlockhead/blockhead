import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/CometBft/bindings.ts'
import { Source } from '$/sources/Source.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const {
	getBlock,
	getBlockchain,
	getStatus,
	getTx,
} = await import('$/sources/CometBft/Rest/queries.ts')

const binding = bindings[Source.CometBft_Rest][0]

const validBlock = {
	result: {
		block_id: {
			hash: 'BLOCKHASH',
		},
		block: {
			header: {
				height: '7',
				time: '2026-01-01T00:00:00.000Z',
				proposer_address: 'proposer',
			},
			data: {
				txs: [
					'tx-a',
				],
			},
		},
	},
}

describe('CometBFT REST queries', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it('uses the registered binding for block and transaction paths', async () => {
		getJson.mockResolvedValue(validBlock)
		await getBlock({
			height: 7n,
		})

		getJson.mockResolvedValue({
			result: {
				hash: 'ABCD',
				height: '1',
				index: 0,
				tx_result: {
					code: 0,
					gas_wanted: '1',
					gas_used: '1',
				},
			},
		})
		await getTx({
			txHash: '0xABCD',
		})

		expect(getJson.mock.calls).toEqual([
			[
				binding,
				'/block?height=7',
			],
			[
				binding,
				'/tx?hash=0xABCD',
			],
		])
	})

	it('fail-closes malformed block envelopes', async () => {
		getJson.mockResolvedValue({
			result: {
				block_id: {
					hash: 'BLOCKHASH',
				},
				block: {
					header: {
						height: '-1',
						time: '2026-01-01T00:00:00.000Z',
						proposer_address: 'proposer',
					},
					data: {},
				},
			},
		})
		await expect(getBlock({
			height: 1n,
		})).rejects.toThrow()
	})

	it('reads /status through the registered binding', async () => {
		getJson.mockResolvedValue({
			result: {
				node_info: {
					network: 'cosmoshub-4',
					version: '0.38.0',
				},
				sync_info: {
					latest_block_hash: 'TIPHASH',
					latest_block_height: '42',
					latest_block_time: '2026-01-01T00:00:00.000Z',
					catching_up: false,
				},
			},
		})
		const status = await getStatus()
		expect(status.result.sync_info.latest_block_height).toBe('42')
		expect(getJson).toHaveBeenCalledWith(binding, '/status')
	})

	it('accepts /status transport leftovers and fail-closes malformed earliest height', async () => {
		getJson.mockResolvedValue({
			result: {
				node_info: {
					network: 'cosmoshub-4',
					id: 'deadbeef',
					listen_addr: 'tcp://0.0.0.0:26656',
				},
				sync_info: {
					latest_block_hash: 'TIPHASH',
					latest_app_hash: 'APPHASH',
					latest_block_height: '42',
					latest_block_time: '2026-01-01T00:00:00.000Z',
					earliest_block_hash: 'EARLYHASH',
					earliest_app_hash: 'EARLYAPP',
					earliest_block_height: '1',
					earliest_block_time: '2019-01-01T00:00:00.000Z',
					catching_up: false,
				},
				validator_info: {
					address: 'VALIDATOR',
					voting_power: '0',
				},
			},
		})
		await expect(getStatus()).resolves.toMatchObject({
			result: {
				sync_info: {
					earliest_block_height: '1',
					latest_app_hash: 'APPHASH',
				},
				validator_info: {
					voting_power: '0',
				},
			},
		})

		getJson.mockResolvedValue({
			result: {
				node_info: {
					network: 'cosmoshub-4',
				},
				sync_info: {
					latest_block_hash: 'TIPHASH',
					latest_block_height: '42',
					latest_block_time: '2026-01-01T00:00:00.000Z',
					earliest_block_height: '-1',
					catching_up: false,
				},
			},
		})
		await expect(getStatus()).rejects.toThrow()
	})

	it('reads /blockchain height windows and rejects oversized ranges', async () => {
		getJson.mockResolvedValue({
			result: {
				last_height: '10',
				block_metas: [
					{
						block_id: {
							hash: 'META10',
						},
						header: {
							height: '10',
							time: '2026-01-01T00:00:10.000Z',
							proposer_address: 'proposer',
						},
						num_txs: '3',
					},
				],
			},
		})
		const blockchain = await getBlockchain({
			minHeight: 1n,
			maxHeight: 10n,
		})
		expect(blockchain.result.block_metas[0].block_id.hash).toBe('META10')
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/blockchain?minHeight=1&maxHeight=10'
		)

		expect(() => getBlockchain({
			minHeight: 1n,
			maxHeight: 200n,
		})).toThrow('height window exceeds 100 blocks')
	})

	it('fail-closes malformed /blockchain envelopes', async () => {
		getJson.mockResolvedValue({
			result: {
				last_height: '1',
				block_metas: [
					{
						block_id: {
							hash: '',
						},
						header: {
							height: '1',
							time: '2026-01-01T00:00:00.000Z',
							proposer_address: 'proposer',
						},
						num_txs: '0',
					},
				],
			},
		})
		await expect(getBlockchain({
			minHeight: 1n,
			maxHeight: 1n,
		})).rejects.toThrow()
	})
})
