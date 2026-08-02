import { afterEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Arweave/bindings.ts'
import {
	fetchBrowseResult,
	getTransaction,
	getTransactionStatus,
	getWalletBalance,
} from '$/sources/Arweave/Rest/queries.ts'
import * as httpRestClient from '$/sources/_shared/wire/HttpRest/client.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Arweave_Rest][0]

const transactionId = 'A'.repeat(43)
const recipientAddress = 'B'.repeat(43)

describe('Arweave public gateway metadata', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('preserves wallet balances and transaction amounts as winston strings', async () => {
		vi.spyOn(httpRestClient, 'getText').mockResolvedValue('9007199254740993')
		await expect(getWalletBalance(
			binding,
			recipientAddress
		)).resolves.toBe('9007199254740993')

		vi.spyOn(httpRestClient, 'getJson').mockResolvedValue({
			format: 2,
			id: transactionId,
			last_tx: '',
			owner: 'owner-key',
			tags: [],
			target: recipientAddress,
			quantity: '1000000000000',
			data: '',
			data_size: '0',
			data_root: '',
			reward: '12345678901234567',
			signature: 'signature',
		})
		await expect(getTransaction(
			binding,
			transactionId
		)).resolves.toMatchObject({
			quantity: '1000000000000',
			reward: '12345678901234567',
		})
	})

	it('rejects substituted transaction and malformed confirmed block identity', async () => {
		const getJson = vi.spyOn(httpRestClient, 'getJson')
		getJson.mockResolvedValueOnce({
			id: 'Z'.repeat(43),
		})
		await expect(getTransaction(
			binding,
			transactionId
		)).rejects.toThrow('mismatched identity')

		getJson.mockResolvedValueOnce({
			block_height: 1,
			block_indep_hash: 'short',
			number_of_confirmations: 1,
		})
		await expect(getTransactionStatus(
			binding,
			transactionId
		)).rejects.toThrow('invalid status block hash')
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
			binding,
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
			binding,
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
			binding,
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
			binding,
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
			binding,
			transactionId,
		})).rejects.toThrow('content body exceeds declared or configured size')
	})
})
