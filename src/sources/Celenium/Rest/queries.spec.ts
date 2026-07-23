import { afterEach, describe, expect, it, vi } from 'vitest'

import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import {
	getAddress,
	getBlock,
	getHead,
	getTransaction,
	listBlobMetadata,
	listBlocks,
	listNamespaces,
} from '$/sources/Celenium/Rest/queries.ts'
import * as httpRestClient from '$/sources/_shared/wire/HttpRest/client.ts'

const binding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((candidate) => candidate.source === Source.Celenium_Rest)

if (binding == null)
	throw new Error('Celenium REST binding is not registered')

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

	it('preserves head heights, aggregate sizes, fees, and supply losslessly', async () => {
		vi.spyOn(httpRestClient, 'getJson').mockResolvedValue({
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
		})

		await expect(getHead(binding)).resolves.toMatchObject({
			chainId: 'celestia',
			latestHeight: 12_424_720n,
			totalFeeUtia: 4_276_859_431_859_007_199_254_740_993n,
			totalSupplyUtia: 11_734_771_038_079_209_007_199_254_740_993n,
		})
	})

	it('rejects foreign head and substituted block identities', async () => {
		const getJson = vi.spyOn(httpRestClient, 'getJson')
		getJson.mockResolvedValueOnce({
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
		await expect(getHead(binding)).rejects.toThrow('foreign chain head')

		getJson.mockResolvedValueOnce(blockWire)
		await expect(getBlock(
			binding,
			1n
		)).rejects.toThrow('mismatched height')
	})

	it('enforces bounded block and namespace pages', async () => {
		const getJson = vi.spyOn(httpRestClient, 'getJson')
		await expect(listBlocks({
			binding,
			limit: 101,
			offset: 0,
		})).rejects.toThrow('limit must be from 1 through 100')
		expect(getJson).not.toHaveBeenCalled()

		getJson.mockResolvedValueOnce([
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
			binding,
			limit: 1,
			offset: 0,
		})).resolves.toEqual([
			expect.objectContaining({
				namespaceId,
				sizeBytes: 9_007_199_254_740_991n,
				lastHeight: 9_007_199_254_740_991n,
			}),
		])
	})

	it('returns bounded blob metadata without downloading blob bodies', async () => {
		const getJson = vi.spyOn(httpRestClient, 'getJson').mockResolvedValue([
			{
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
				data: 'must not enter the public metadata result',
			},
		])

		const result = await listBlobMetadata({
			binding,
			limit: 1,
			offset: 0,
		})
		expect(result).toEqual([
			expect.objectContaining({
				height: 12_424_743n,
				sizeBytes: 24_857n,
				transactionHash: hash,
			}),
		])
		expect(result[0]).not.toHaveProperty('data')
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/v1/blob?limit=1&offset=0&sort=desc&joins=true'
		)
	})

	it('rejects malformed namespace, blob, account, and transaction subjects', async () => {
		const getJson = vi.spyOn(httpRestClient, 'getJson')
		getJson.mockResolvedValueOnce([
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
			binding,
			limit: 1,
			offset: 0,
		})).rejects.toThrow('invalid namespace ID')

		await expect(getAddress(
			binding,
			'not-an-address'
		)).rejects.toThrow('invalid Celestia account address')
		await expect(getTransaction(
			binding,
			'short'
		)).rejects.toThrow('invalid transaction hash')
		expect(getJson).toHaveBeenCalledTimes(1)
	})

	it('preserves account balances and transaction fees as integer units', async () => {
		const getJson = vi.spyOn(httpRestClient, 'getJson')
		getJson.mockResolvedValueOnce({
			first_height: 10_143_589,
			last_height: 12_424_748,
			hash: address,
			balance: {
				currency: 'utia',
				spendable: '900719925474099312345',
				delegated: '2',
				unbonding: '3',
			},
		})
		await expect(getAddress(
			binding,
			address
		)).resolves.toMatchObject({
			address,
			spendableAmount: 900_719_925_474_099_312_345n,
		})

		getJson.mockResolvedValueOnce({
			height: 12_424_743,
			position: 3,
			gas_wanted: 289_167,
			gas_used: 262_979,
			hash,
			fee: '900719925474099312345',
			time: '2026-07-23T04:49:13Z',
			status: 'success',
			signers: [
				{
					hash: address,
				},
			],
			message_types: ['MsgPayForBlobs'],
		})
		await expect(getTransaction(
			binding,
			hash
		)).resolves.toMatchObject({
			hash,
			feeUtia: 900_719_925_474_099_312_345n,
			messageTypes: ['MsgPayForBlobs'],
		})
	})
})
