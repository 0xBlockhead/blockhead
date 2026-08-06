import { afterEach, describe, expect, it, vi } from 'vitest'

import {
	decodeArweaveTagField,
	fetchBrowseResult,
	getBlockByHash,
	getBlockByHeight,
	getNetworkInfo,
	getPeers,
	getPrice,
	getTransaction,
	getTransactionOffset,
	getTransactionStatus,
	getTxAnchor,
	getWalletBalance,
	ownerAddressFromOwnerKey,
} from '$/sources/Arweave/Rest/queries.ts'
import * as httpRestClient from '$/sources/_shared/wire/HttpRest/client.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => {
	const original = await importOriginal<typeof import('$/sources/_runtime/http.ts')>()
	return {
		...original,
		sourceFetch: vi.fn(original.sourceFetch),
	}
})

const transactionId = 'A'.repeat(43)
const recipientAddress = 'B'.repeat(43)
const blockId = 'D'.repeat(64)
const previousBlockId = 'F'.repeat(64)

describe('Arweave public gateway metadata', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
		vi.mocked(sourceFetch).mockReset()
	})

	it('maps GET /info and GET /block/height with X-Block-Format 2', async () => {
		vi.spyOn(httpRestClient, 'getJson').mockResolvedValueOnce({
			network: 'arweave.N.1',
			version: 5,
			release: 43,
			height: 551_511,
			current: blockId,
			blocks: 97_375,
			peers: 64,
			queue_length: 0,
		})
		await expect(getNetworkInfo()).resolves.toMatchObject({
			height: 551_511,
			current: blockId,
			network: 'arweave.N.1',
		})

		vi.mocked(sourceFetch).mockResolvedValueOnce(new Response(JSON.stringify({
			indep_hash: blockId,
			previous_block: previousBlockId,
			timestamp: 1_586_440_919,
			height: 422_250,
			txs: [
				transactionId,
			],
			tx_root: 'lsoo-p3Tj7oblZ-54WVPHoVguqgw5rA9Jf3lLH6H8zY',
			reward_pool: 3_026_104_059_201_252,
			weave_size: 407_672_420_044,
			block_size: 937_455,
			cumulative_diff: '99416580392277',
		}), {
			status: 200,
			headers: {
				'content-type': 'application/json',
			},
		}))
		await expect(getBlockByHeight(422_250)).resolves.toMatchObject({
			indep_hash: blockId,
			height: 422_250,
			txs: [
				transactionId,
			],
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			expect.anything(),
			expect.stringContaining('/block/height/422250'),
			expect.objectContaining({
				headers: expect.objectContaining({
					'X-Block-Format': '2',
				}),
			})
		)

		vi.mocked(sourceFetch).mockResolvedValueOnce(new Response(JSON.stringify({
			indep_hash: blockId,
			previous_block: previousBlockId,
			timestamp: 1_586_440_919,
			height: 422_250,
			txs: [],
		}), {
			status: 200,
			headers: {
				'content-type': 'application/json',
			},
		}))
		await expect(getBlockByHash(blockId)).resolves.toMatchObject({
			indep_hash: blockId,
		})
	})

	it('fail-closes mismatched block identity and invalid /info current hash', async () => {
		vi.spyOn(httpRestClient, 'getJson').mockResolvedValueOnce({
			network: 'arweave.N.1',
			version: 5,
			release: 43,
			height: 1,
			current: 'short',
			blocks: 1,
			peers: 1,
			queue_length: 0,
		})
		await expect(getNetworkInfo()).rejects.toThrow('invalid network-info response envelope')

		vi.mocked(sourceFetch).mockResolvedValueOnce(new Response(JSON.stringify({
			indep_hash: blockId,
			previous_block: previousBlockId,
			timestamp: 1,
			height: 1,
			txs: [],
		}), {
			status: 200,
			headers: {
				'content-type': 'application/json',
			},
		}))
		await expect(getBlockByHeight(422_250)).rejects.toThrow('block height mismatch')
	})

	it('accepts peers / tx_anchor / price / tx offset leftovers and fail-closes malformed envelopes', async () => {
		const getJson = vi.spyOn(httpRestClient, 'getJson')
		const getText = vi.spyOn(httpRestClient, 'getText')

		getJson.mockResolvedValueOnce([
			'1.2.3.4:1984',
			'[::1]:1984',
		])
		await expect(getPeers()).resolves.toEqual([
			'1.2.3.4:1984',
			'[::1]:1984',
		])

		getJson.mockResolvedValueOnce([
			'https://evil.example',
		])
		await expect(getPeers()).rejects.toThrow('invalid peer endpoint')

		getText.mockResolvedValueOnce(`${blockId}\n`)
		await expect(getTxAnchor()).resolves.toBe(blockId)

		getText.mockResolvedValueOnce('short')
		await expect(getTxAnchor()).rejects.toThrow('invalid tx_anchor')

		getText.mockResolvedValueOnce('321004937')
		await expect(getPrice({
			byteSize: 0,
		})).resolves.toBe('321004937')

		getText.mockResolvedValueOnce('321004937')
		await expect(getPrice({
			byteSize: 256,
			target: recipientAddress,
		})).resolves.toBe('321004937')
		expect(getText).toHaveBeenLastCalledWith(
			expect.anything(),
			`/price/256/${recipientAddress}`
		)

		getText.mockResolvedValueOnce('-1')
		await expect(getPrice({
			byteSize: 0,
		})).rejects.toThrow('invalid price')

		getJson.mockResolvedValueOnce({
			offset: '100',
			size: '42',
		})
		await expect(getTransactionOffset(transactionId)).resolves.toEqual({
			offset: '100',
			size: '42',
		})
		expect(getJson).toHaveBeenLastCalledWith(
			expect.anything(),
			`/tx/${transactionId}/offset`
		)

		getJson.mockResolvedValueOnce({
			offset: '100',
		})
		await expect(getTransactionOffset(transactionId)).rejects.toThrow(
			'invalid transaction-offset response envelope'
		)
	})

	it('preserves wallet balances and transaction amounts as winston strings', async () => {
		vi.spyOn(httpRestClient, 'getText').mockResolvedValue('9007199254740993')
		await expect(getWalletBalance(
			recipientAddress
		)).resolves.toBe('9007199254740993')

		const ownerKey = Buffer.alloc(512, 7).toString('base64url')
		vi.spyOn(httpRestClient, 'getJson').mockResolvedValue({
			format: 2,
			id: transactionId,
			last_tx: '',
			owner: ownerKey,
			tags: [
				{
					name: 'QXBwLU5hbWU',
					value: 'TXkgQXBw',
				},
			],
			target: recipientAddress,
			quantity: '1000000000000',
			data: '',
			data_size: '0',
			data_root: '',
			reward: '12345678901234567',
			signature: 'signature',
		})
		await expect(getTransaction(
			transactionId
		)).resolves.toMatchObject({
			quantity: '1000000000000',
			reward: '12345678901234567',
			owner: ownerKey,
		})
	})

	it('derives owner addresses and decodes gateway tag fields', async () => {
		const ownerKey = Buffer.alloc(512, 7).toString('base64url')
		await expect(ownerAddressFromOwnerKey(ownerKey)).resolves.toBe(
			'FZMwRJYP0jp9qqyc5RNV8fOYlNHD_m3iG1myjOLHfnc'
		)
		expect(decodeArweaveTagField('QXBwLU5hbWU', 'tag name')).toBe('App-Name')
		expect(decodeArweaveTagField('TXkgQXBw', 'tag value')).toBe('My App')
		expect(() => decodeArweaveTagField('!!!', 'tag name')).toThrow('invalid tag name')
	})

	it('treats Pending status as absent confirmation and rejects malformed confirmed status', async () => {
		const getJson = vi.spyOn(httpRestClient, 'getJson')
		getJson.mockResolvedValueOnce('Pending')
		await expect(getTransactionStatus(
			transactionId
		)).resolves.toBeUndefined()

		getJson.mockResolvedValueOnce({
			block_height: 1,
			block_indep_hash: 'short',
			number_of_confirmations: 1,
		})
		await expect(getTransactionStatus(
			transactionId
		)).rejects.toThrow('invalid transaction-status response envelope')
	})

	it('rejects substituted transaction and malformed confirmed block identity', async () => {
		const getJson = vi.spyOn(httpRestClient, 'getJson')
		getJson.mockResolvedValueOnce({
			id: 'Z'.repeat(43),
		})
		await expect(getTransaction(
			transactionId
		)).rejects.toThrow('invalid transaction response envelope')

		getJson.mockResolvedValueOnce({
			format: 2,
			id: transactionId,
			last_tx: '',
			owner: '',
			tags: [],
			target: '',
			quantity: '0',
			data: '',
			data_size: '0',
			data_root: '',
			reward: '0',
			signature: 'signature',
		})
		await expect(getTransaction(
			transactionId
		)).rejects.toThrow('invalid transaction response envelope')

		getJson.mockResolvedValueOnce({
			format: 2,
			id: 'Z'.repeat(43),
			last_tx: '',
			owner: Buffer.alloc(32, 1).toString('base64url'),
			tags: [],
			target: '',
			quantity: '0',
			data: '',
			data_size: '0',
			data_root: '',
			reward: '0',
			signature: 'signature',
		})
		await expect(getTransaction(
			transactionId
		)).rejects.toThrow('mismatched identity')
	})

	it.each([
		undefined,
		{
			offset: '1',
		},
		{
			offset: '1',
			size: '-1',
		},
	])('does not download content when exact offset size is absent or malformed', async (metadata) => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(
			metadata == null ?
				JSON.stringify({})
			:
				JSON.stringify(metadata),
			{
				status: 200,
				headers: {
					'content-type': 'application/json',
				},
			}
		))
		vi.stubGlobal('fetch', fetchMock)

		await expect(fetchBrowseResult({
			transactionId,
		})).rejects.toThrow('invalid transaction offset size')
		expect(fetchMock).toHaveBeenCalledTimes(2)
		expect(fetchMock.mock.calls.every(([url]) => (
			String(url).endsWith(`/tx/${transactionId}/offset`)
		))).toBe(true)
	})

	it('rejects declared oversize content before downloading it', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
			offset: '10000000',
			size: '5242881',
		}), {
			status: 200,
			headers: {
				'content-type': 'application/json',
			},
		}))
		vi.stubGlobal('fetch', fetchMock)

		await expect(fetchBrowseResult({
			transactionId,
		})).rejects.toThrow('content exceeds 1048576 byte inspection limit')
		expect(fetchMock).toHaveBeenCalledTimes(2)
	})

	it('reads compressed content without Content-Length through the bounded stream', async () => {
		const fetchMock = vi.fn<typeof fetch>()
			.mockResolvedValueOnce(new Response(JSON.stringify({
				offset: '5',
				size: '5',
			}), {
				status: 200,
				headers: {
					'content-type': 'application/json',
				},
			}))
			.mockResolvedValueOnce(new Response('hello', {
				status: 200,
				headers: {
					'content-encoding': 'gzip',
					'content-type': 'text/plain',
				},
			}))
		vi.stubGlobal('fetch', fetchMock)

		await expect(fetchBrowseResult({
			transactionId,
		})).resolves.toMatchObject({
			contentLength: 5,
			text: 'hello',
		})
	})

	it('does not apply manifest transaction size to a selected path body', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response('selected asset', {
			status: 200,
			headers: {
				'content-type': 'text/plain',
			},
		}))
		vi.stubGlobal('fetch', fetchMock)

		await expect(fetchBrowseResult({
			transactionId,
			contentPath: 'assets/selected.txt',
			maxContentBytes: 14,
		})).resolves.toMatchObject({
			contentLength: 14,
			text: 'selected asset',
		})
		expect(fetchMock).toHaveBeenCalledTimes(1)
		expect(String(fetchMock.mock.calls[0][0])).toBe(
			`https://arweave.net/${transactionId}/assets/selected.txt`
		)
	})

	it('cancels content that exceeds the declared size', async () => {
		const offsetResponse = () => new Response(JSON.stringify({
			offset: '4',
			size: '4',
		}), {
			status: 200,
			headers: {
				'content-type': 'application/json',
			},
		})
		const contentResponse = () => new Response('hello', {
			status: 200,
		})
		const fetchMock = vi.fn<typeof fetch>()
			.mockResolvedValueOnce(offsetResponse())
			.mockResolvedValueOnce(contentResponse())
			.mockResolvedValueOnce(offsetResponse())
			.mockResolvedValueOnce(contentResponse())
		vi.stubGlobal('fetch', fetchMock)

		await expect(fetchBrowseResult({
			transactionId,
		})).rejects.toThrow('content body exceeds declared or configured size')
	})
})
