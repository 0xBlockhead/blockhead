import { afterEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Celenium/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	getAddress,
	getBlobMetadata,
	getBlock,
	getBlockByHash,
	getBlockCount,
	getHead,
	getNamespace,
	getTransaction,
	listBlobMetadata,
	listBlockBlobs,
	listBlocks,
	listNamespaceBlobs,
	listNamespaces,
	namespaceHashFromId,
} from '$/sources/Celenium/Rest/queries.ts'
import * as sourceHttp from '$/sources/_runtime/http.ts'

const binding = bindings[Source.Celenium_Rest][0]

const hash = 'a'.repeat(64)
const parentHash = 'b'.repeat(64)
const address = 'celestia1zwpvejau8kzhttlc39wmfggyf8n3eaxlpvd86u'
const namespaceId = '0'.repeat(56)
const namespaceHash = `${'A'.repeat(39)}=`
const commitment = `${'B'.repeat(43)}=`

const blockWire = {
	height: 9_007_199_254_740_991,
	hash,
	parent_hash: parentHash,
	app_hash: hash,
	data_hash: parentHash,
	time: '2026-07-23T04:49:10Z',
	proposer: {
		cons_address: 'c'.repeat(40),
	},
	stats: {
		tx_count: 5,
		blobs_count: 4,
		blobs_size: 9_007_199_254_740_991,
		fee: '900719925474099312345',
		bytes_in_block: 9_007_199_254_740_991,
	},
}

describe('Celenium mainnet public indexer contracts', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('validates and preserves the endpoint-native head row', async () => {
		const head = {
			chain_id: 'celestia',
			last_height: 12_424_720,
			hash,
			last_time: '2026-07-23T04:48:08Z',
			total_tx: 64_039_630,
			total_accounts: 1_697_994,
			total_fee: '4276859431859007199254740993',
			total_blobs_size: 4_403_903_879_869,
			total_supply: '11734771038079209007199254740993',
			synced: true,
			total_namespaces: 1_095,
			id: 1,
			version: 9,
			name: 'celestia_indexer',
			total_proposals: 9,
			total_validators: 313,
			total_voting_power: '513006783',
			total_ibc_clients: 174,
			undeclared_tip: 'drop-me',
		}
		vi.spyOn(sourceHttp, 'sourceGetJson').mockResolvedValue(head)

		await expect(getHead()).resolves.toEqual({
			chain_id: 'celestia',
			last_height: 12_424_720,
			hash,
			last_time: '2026-07-23T04:48:08Z',
			total_tx: 64_039_630,
			total_accounts: 1_697_994,
			total_fee: '4276859431859007199254740993',
			total_blobs_size: 4_403_903_879_869,
			total_supply: '11734771038079209007199254740993',
			synced: true,
			total_namespaces: 1_095,
			id: 1,
			version: 9,
			name: 'celestia_indexer',
			total_proposals: 9,
			total_validators: 313,
			total_voting_power: '513006783',
			total_ibc_clients: 174,
		})
	})

	it('rejects foreign head and substituted block identities', async () => {
		const sourceGetJson = vi.spyOn(sourceHttp, 'sourceGetJson')
		sourceGetJson.mockResolvedValueOnce({
			chain_id: 'mocha-4',
			last_height: 1,
			hash,
			last_time: '2026-07-23T04:48:08Z',
			total_tx: 1,
			total_accounts: 1,
			total_fee: '1',
			total_blobs_size: 1,
			total_supply: '1',
			synced: true,
		})
		await expect(getHead()).rejects.toThrow('foreign chain head')

		sourceGetJson.mockResolvedValueOnce(blockWire)
		await expect(getBlock(1n)).rejects.toThrow('mismatched height')
	})

	it('rejects malformed endpoint clocks instead of exposing unverifiable observations', async () => {
		const sourceGetJson = vi.spyOn(sourceHttp, 'sourceGetJson')
		sourceGetJson.mockResolvedValueOnce({
			chain_id: 'celestia',
			last_height: 1,
			hash,
			last_time: 'not-a-timestamp',
			total_tx: 1,
			total_accounts: 1,
			total_fee: '1',
			total_blobs_size: 1,
			total_supply: '1',
			synced: true,
		})
		await expect(getHead()).rejects.toThrow('invalid head timestamp')

		sourceGetJson.mockResolvedValueOnce({
			...blockWire,
			time: 'not-a-timestamp',
		})
		await expect(getBlock(BigInt(blockWire.height))).rejects.toThrow('invalid block timestamp')
	})

	it('validates and preserves the endpoint-native block row', async () => {
		vi.spyOn(sourceHttp, 'sourceGetJson').mockResolvedValue(blockWire)

		await expect(getBlock(BigInt(blockWire.height))).resolves.toEqual(blockWire)
	})

	it('accepts live string block versions and explorer tip stats leftovers', async () => {
		vi.spyOn(sourceHttp, 'sourceGetJson').mockResolvedValue({
			...blockWire,
			version_block: '0',
			version_app: '9',
			stats: {
				...blockWire.stats,
				events_count: 212,
				gas_limit: 635_576,
				gas_used: 562_078,
				square_size: 16,
				block_time: 2_834,
				fill_rate: '0.0158',
				supply_change: '2413398',
				inflation_rate: '0.0232420563',
				rewards: '2368128.839999999869752868',
				commissions: '557891.035507093391079914',
				undeclared_stat: true,
			},
			undeclared_block: true,
		})

		await expect(getBlock(BigInt(blockWire.height))).resolves.toEqual({
			...blockWire,
			version_block: 0,
			version_app: 9,
			stats: {
				...blockWire.stats,
				events_count: 212,
				gas_limit: 635_576,
				gas_used: 562_078,
				square_size: 16,
				block_time: 2_834,
				fill_rate: '0.0158',
				supply_change: '2413398',
				inflation_rate: '0.0232420563',
				rewards: '2368128.839999999869752868',
				commissions: '557891.035507093391079914',
			},
		})
	})

	it('enforces bounded block and namespace pages', async () => {
		const sourceGetJson = vi.spyOn(sourceHttp, 'sourceGetJson')
		await expect(listBlocks({
			limit: 101,
			offset: 0,
		})).rejects.toThrow('limit must be from 1 through 100')
		expect(sourceGetJson).not.toHaveBeenCalled()

		sourceGetJson.mockResolvedValueOnce([blockWire])
		await expect(listBlocks({
			limit: 1,
			offset: 2,
		})).resolves.toEqual([blockWire])

		sourceGetJson.mockResolvedValueOnce([
			{
				size: 9_007_199_254_740_991,
				blobs_count: 2,
				version: 0,
				namespace_id: namespaceId,
				hash: namespaceHash,
				last_height: 9_007_199_254_740_991,
				reserved: false,
			},
		])
		await expect(listNamespaces({
			limit: 1,
			offset: 0,
		})).resolves.toEqual([
			{
				size: 9_007_199_254_740_991,
				blobs_count: 2,
				version: 0,
				namespace_id: namespaceId,
				hash: namespaceHash,
				last_height: 9_007_199_254_740_991,
				reserved: false,
			},
		])
	})

	it('returns bounded blob metadata without downloading blob bodies', async () => {
		const blobMetadata = {
			commitment,
			size: 24_857,
			share_version: 1,
			height: 12_424_743,
			time: '2026-07-23T04:49:13Z',
			content_type: 'application/octet-stream',
			namespace: namespaceHash,
			tx_hash: hash,
			signer: {
				hash: address,
			},
		}
		const sourceGetJson = vi.spyOn(sourceHttp, 'sourceGetJson').mockResolvedValue([
			{
				...blobMetadata,
				data: 'must not enter the public metadata result',
			},
		])

		await expect(listBlobMetadata({
			limit: 1,
			offset: 0,
		})).resolves.toEqual([blobMetadata])
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://api.celenium.io/v1/blob?limit=1&offset=0&sort=desc&joins=true'
		)
	})

	it('rejects malformed namespace, blob, account, and transaction subjects', async () => {
		const sourceGetJson = vi.spyOn(sourceHttp, 'sourceGetJson')
		sourceGetJson.mockResolvedValueOnce([
			{
				size: 1,
				blobs_count: 1,
				version: 0,
				namespace_id: 'short',
				hash: namespaceHash,
				last_height: 1,
				reserved: false,
			},
		])
		await expect(listNamespaces({
			limit: 1,
			offset: 0,
		})).rejects.toThrow('invalid namespace ID')

		await expect(getAddress('not-an-address')).rejects.toThrow('invalid Celestia account address')
		await expect(getTransaction('short')).rejects.toThrow('invalid transaction hash')
		expect(sourceGetJson).toHaveBeenCalledTimes(1)
	})

	it('validates and preserves the endpoint-native address row', async () => {
		const addressWire = {
			first_height: 10_143_589,
			last_height: 12_424_748,
			hash: address,
			balance: {
				currency: 'utia',
				spendable: '900719925474099312345',
				delegated: '2',
				unbonding: '3',
			},
		}
		vi.spyOn(sourceHttp, 'sourceGetJson').mockResolvedValue(addressWire)

		await expect(getAddress(address)).resolves.toEqual(addressWire)
		expect(sourceHttp.sourceGetJson).toHaveBeenCalledWith(
			binding,
			`https://api.celenium.io/v1/address/${address}`
		)
	})

	it('rejects substituted address identities', async () => {
		vi.spyOn(sourceHttp, 'sourceGetJson').mockResolvedValue({
			first_height: 10_143_589,
			last_height: 12_424_748,
			hash: 'celestia1l50j7c8fpdallag58y3g4q9tw7kppruhvga2lq',
			balance: {
				currency: 'utia',
				spendable: '1',
				delegated: '2',
				unbonding: '3',
			},
		})

		await expect(getAddress(address)).rejects.toThrow('mismatched identity')
	})

	it('validates and preserves the endpoint-native transaction row', async () => {
		const transactionWire = {
			height: 12_424_743,
			position: 3,
			gas_wanted: 289_167,
			gas_used: 262_979,
			hash,
			fee: '900719925474099312345',
			time: '2026-07-23T04:49:13Z',
			status: 'success',
			timeout_height: 0,
			memo: 'relayed by hermes',
			codespace: 'sdk',
			signers: [
				{
					hash: address,
				},
			],
			message_types: ['MsgPayForBlobs'],
		}
		vi.spyOn(sourceHttp, 'sourceGetJson').mockResolvedValue(transactionWire)

		await expect(getTransaction(hash)).resolves.toEqual(transactionWire)
		expect(sourceHttp.sourceGetJson).toHaveBeenCalledWith(
			binding,
			`https://api.celenium.io/v1/tx/${hash}`
		)
	})

	it('rejects substituted transaction identities', async () => {
		vi.spyOn(sourceHttp, 'sourceGetJson').mockResolvedValue({
			height: 12_424_743,
			position: 3,
			gas_wanted: 289_167,
			gas_used: 262_979,
			hash: parentHash,
			fee: '1',
			time: '2026-07-23T04:49:13Z',
			status: 'success',
			timeout_height: 0,
			signers: [],
			message_types: [],
		})

		await expect(getTransaction(hash)).rejects.toThrow('mismatched identity')
	})

	it('fail-closes invalid transaction status leftovers', async () => {
		vi.spyOn(sourceHttp, 'sourceGetJson').mockResolvedValue({
			height: 12_424_743,
			position: 3,
			gas_wanted: 289_167,
			gas_used: 262_979,
			hash,
			fee: '1',
			time: '2026-07-23T04:49:13Z',
			status: 'pending',
			timeout_height: 0,
			signers: [],
			message_types: [],
		})

		await expect(getTransaction(hash)).rejects.toThrow('invalid transaction status')
	})

	it('resolves block hash via search then height detail', async () => {
		const sourceGetJson = vi.spyOn(sourceHttp, 'sourceGetJson')
		sourceGetJson
			.mockResolvedValueOnce([
				{
					type: 'block',
					result: {
						height: blockWire.height,
						hash: hash.toUpperCase(),
					},
				},
			])
			.mockResolvedValueOnce(blockWire)

		await expect(getBlockByHash(hash)).resolves.toEqual(blockWire)
		expect(sourceGetJson).toHaveBeenNthCalledWith(
			1,
			binding,
			`https://api.celenium.io/v1/search?query=${hash}`
		)
		expect(sourceGetJson).toHaveBeenNthCalledWith(
			2,
			binding,
			`https://api.celenium.io/v1/block/${blockWire.height}?stats=true`
		)
	})

	it('fail-closes block count and namespace detail leftovers', async () => {
		const sourceGetJson = vi.spyOn(sourceHttp, 'sourceGetJson')
		sourceGetJson.mockResolvedValueOnce(12_424_720)
		await expect(getBlockCount()).resolves.toBe(12_424_720)

		sourceGetJson.mockResolvedValueOnce({
			size: 24_857,
			blobs_count: 4,
			version: 0,
			namespace_id: namespaceId,
			hash: namespaceHash,
			last_height: 12_424_720,
			name: 'PayForBlobs',
			reserved: false,
			pfb_count: 4,
		})
		await expect(getNamespace(`00${namespaceId}`)).resolves.toEqual({
			size: 24_857,
			blobs_count: 4,
			version: 0,
			namespace_id: namespaceId,
			hash: namespaceHash,
			last_height: 12_424_720,
			name: 'PayForBlobs',
			reserved: false,
			pfb_count: 4,
		})
		expect(sourceGetJson).toHaveBeenLastCalledWith(
			binding,
			`https://api.celenium.io/v1/namespace/${namespaceId}/0`
		)

		sourceGetJson.mockResolvedValueOnce('not-a-count')
		await expect(getBlockCount()).rejects.toThrow()
	})

	it('lists block and namespace blob leftovers with nested wires', async () => {
		const sourceGetJson = vi.spyOn(sourceHttp, 'sourceGetJson')
		sourceGetJson.mockResolvedValueOnce([
			{
				commitment,
				size: 379,
				share_version: 0,
				height: 12_424_743,
				time: '2026-07-23T04:49:13Z',
				content_type: 'application/octet-stream',
				namespace: {
					version: 0,
					namespace_id: namespaceId,
					hash: namespaceHash,
					blobs_count: 1,
				},
				tx: {
					hash,
				},
				signer: {
					hash: address,
				},
			},
		])
		await expect(listBlockBlobs({
			height: 12_424_743n,
			limit: 1,
			offset: 0,
		})).resolves.toEqual([
			{
				commitment,
				size: 379,
				share_version: 0,
				height: 12_424_743,
				time: '2026-07-23T04:49:13Z',
				content_type: 'application/octet-stream',
				namespace: namespaceHash,
				namespaceVersion: 0,
				namespaceId,
				tx_hash: hash,
				signer: {
					hash: address,
				},
			},
		])

		sourceGetJson.mockResolvedValueOnce([
			{
				commitment,
				size: 11,
				share_version: 0,
				height: 12_424_720,
				time: '2026-07-23T04:48:08Z',
				content_type: 'text/plain; charset=utf-8',
				tx_hash: hash,
				signer: {
					hash: address,
				},
			},
		])
		await expect(listNamespaceBlobs({
			namespaceId: `00${namespaceId}`,
			limit: 1,
			offset: 0,
		})).resolves.toEqual([
			{
				commitment,
				size: 11,
				share_version: 0,
				height: 12_424_720,
				time: '2026-07-23T04:48:08Z',
				content_type: 'text/plain; charset=utf-8',
				namespace: namespaceHashFromId(`00${namespaceId}`),
				namespaceVersion: 0,
				namespaceId,
				tx_hash: hash,
				signer: {
					hash: address,
				},
			},
		])
	})

	it('posts blob metadata without downloading blob bodies', async () => {
		const canonicalNamespaceHash = namespaceHashFromId(`00${namespaceId}`)
		const sourceFetch = vi.spyOn(sourceHttp, 'sourceFetch').mockResolvedValue(
			new Response(JSON.stringify({
				commitment,
				size: 379,
				share_version: 0,
				height: 12_424_743,
				time: '2026-07-23T04:49:13Z',
				content_type: 'application/octet-stream',
				namespace: {
					version: 0,
					namespace_id: namespaceId,
					hash: canonicalNamespaceHash,
				},
				tx: {
					hash,
				},
				signer: {
					hash: address,
				},
				data: 'must not enter metadata',
			}), {
				status: 200,
				headers: {
					'content-type': 'application/json',
				},
			})
		)

		await expect(getBlobMetadata({
			height: 12_424_743n,
			namespaceId: `00${namespaceId}`,
			commitment,
		})).resolves.toEqual({
			commitment,
			size: 379,
			share_version: 0,
			height: 12_424_743,
			time: '2026-07-23T04:49:13Z',
			content_type: 'application/octet-stream',
			namespace: canonicalNamespaceHash,
			tx_hash: hash,
			signer: {
				hash: address,
			},
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://api.celenium.io/v1/blob/metadata',
			expect.objectContaining({
				method: 'POST',
			})
		)
	})
})
