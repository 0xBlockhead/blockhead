import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	getBlock,
	getInfo,
	getOuts,
	getTransactions,
} from '$/sources/MoneroDaemonRpc/JsonRpc/queries.ts'
import bindings from '$/sources/MoneroDaemonRpc/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	sourceBindingId,
	SourceTargetKind,
} from '$/sources/SourceBinding.ts'


const fetchMock = vi.fn<typeof fetch>()

const moneroMainnetBinding = bindings[Source.MoneroDaemonRpc_JsonRpc].find(({ target }) => (
	target.kind === SourceTargetKind.Caip2Network
))

if (moneroMainnetBinding == null)
	throw new Error('MoneroDaemonRpc queries spec missing mainnet binding')

const proxyPath = (url: string) => (
	`/api-proxy/${encodeURIComponent(sourceBindingId(moneroMainnetBinding))}/0/${encodeURIComponent(url)}`
)

const rpcResponse = (result: unknown) => new Response(JSON.stringify({
	jsonrpc: '2.0',
	id: 1,
	result,
}), {
	headers: {
		'content-type': 'application/json',
	},
})

const infoEnvelope = {
	alt_blocks_count: 0,
	cumulative_difficulty: 2_000,
	difficulty: 2_500,
	grey_peerlist_size: 1_000,
	height: 3_400_001,
	incoming_connections_count: 8,
	mainnet: true,
	nettype: 'mainnet',
	offline: false,
	outgoing_connections_count: 8,
	stagenet: false,
	status: 'OK',
	synchronized: true,
	target: 120,
	target_height: 3_400_001,
	testnet: false,
	top_block_hash: 'top-block-hash',
	tx_count: 90_000_000,
	tx_pool_size: 12,
	untrusted: false,
	version: '0.18.3.4',
	was_bootstrap_ever_used: false,
	white_peerlist_size: 2_000,
}

const blockEnvelope = {
	blob: 'block-blob',
	block_header: {
		block_size: 1_000,
		block_weight: 1_100,
		cumulative_difficulty: 2_000,
		cumulative_difficulty_top64: 0,
		depth: 1,
		difficulty: 2_500,
		difficulty_top64: 0,
		hash: 'block-hash',
		height: 3_400_000,
		long_term_weight: 1_050,
		major_version: 16,
		minor_version: 16,
		nonce: 42,
		num_txes: 1,
		orphan_status: false,
		pow_hash: '',
		prev_hash: 'parent-hash',
		reward: 600_000_000_000,
		timestamp: 1_722_470_400,
	},
	miner_tx_hash: 'miner-transaction-hash',
	tx_hashes: ['transaction-hash'],
}

const outsEnvelope = {
	outs: [
		{
			height: 3_000_000,
			key: 'a'.repeat(64),
			mask: 'b'.repeat(64),
			txid: 'c'.repeat(64),
			unlocked: true,
		},
	],
	status: 'OK',
	untrusted: false,
}

describe('Monero daemon JSON-RPC queries', () => {
	beforeEach(() => {
		vi.stubGlobal('window', {})
		vi.stubGlobal('fetch', fetchMock)
		fetchMock.mockReset()
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('accepts get_info / get_block / get_outs / get_transactions envelopes', async () => {
		fetchMock
			.mockResolvedValueOnce(rpcResponse(infoEnvelope))
			.mockResolvedValueOnce(rpcResponse(blockEnvelope))
			.mockResolvedValueOnce(new Response(JSON.stringify(outsEnvelope), {
				headers: {
					'content-type': 'application/json',
				},
			}))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				txs: [
					{
						as_hex: 'deadbeef',
						as_json: JSON.stringify({
							version: 2,
							unlock_time: 0,
							vin: [],
							vout: [
								{
									amount: 0,
									target: {
										key: 'd'.repeat(64),
									},
								},
							],
							rct_signatures: {
								txnFee: 1,
								outPk: [
									{
										mask: 'e'.repeat(64),
									},
								],
							},
						}),
						block_height: 3_400_000,
						block_timestamp: 1_722_470_400,
						double_spend_seen: false,
						in_pool: false,
						output_indices: [42],
						tx_hash: 'transaction-hash',
					},
				],
				txs_as_hex: ['deadbeef'],
			}), {
				headers: {
					'content-type': 'application/json',
				},
			}))

		await expect(getInfo()).resolves.toMatchObject({
			height: 3_400_001,
			top_block_hash: 'top-block-hash',
			status: 'OK',
		})
		await expect(getBlock({
			height: 3_400_000n,
		})).resolves.toMatchObject({
			block_header: {
				hash: 'block-hash',
				height: 3_400_000,
			},
		})
		await expect(getOuts({
			outputs: [
				{
					amount: 0,
					index: 42n,
				},
			],
			getTxid: true,
		})).resolves.toMatchObject({
			outs: [
				{
					key: 'a'.repeat(64),
					unlocked: true,
				},
			],
			status: 'OK',
		})
		await expect(getTransactions({
			txHashes: ['transaction-hash'],
		})).resolves.toMatchObject({
			txs: [
				{
					tx_hash: 'transaction-hash',
					decoded_json: {
						vout: [
							{
								target: {
									key: 'd'.repeat(64),
								},
							},
						],
					},
				},
			],
		})

		expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
			proxyPath('https://xmr-node.cakewallet.com:18081/json_rpc'),
			proxyPath('https://xmr-node.cakewallet.com:18081/json_rpc'),
			proxyPath('https://xmr-node.cakewallet.com:18081/get_outs'),
			proxyPath('https://xmr-node.cakewallet.com:18081/get_transactions'),
		])
		expect(JSON.parse(String(fetchMock.mock.calls[2]?.[1]?.body))).toEqual({
			outputs: [
				{
					amount: 0,
					index: 42,
				},
			],
			get_txid: true,
		})
	})

	it('fail-closes malformed info / block / outs envelopes', async () => {
		fetchMock.mockResolvedValueOnce(rpcResponse({
			height: 1,
		}))
		await expect(getInfo()).rejects.toThrow('MoneroDaemonRpc_JsonRpc: all mainnet endpoints failed')

		fetchMock.mockReset()
		fetchMock.mockResolvedValue(rpcResponse({
			blob: 'block-blob',
		}))
		await expect(getBlock({
			height: 1n,
		})).rejects.toThrow('MoneroDaemonRpc_JsonRpc: all mainnet endpoints failed')

		fetchMock.mockReset()
		fetchMock.mockResolvedValue(new Response(JSON.stringify({
			status: 'OK',
		}), {
			headers: {
				'content-type': 'application/json',
			},
		}))
		await expect(getOuts({
			outputs: [
				{
					amount: 0,
					index: 1,
				},
			],
		})).rejects.toThrow('MoneroDaemonRpc_JsonRpc: all mainnet endpoints failed')
	})
})
