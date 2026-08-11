import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/LayerZeroScan/bindings.ts'
import { Source } from '$/sources/Source.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const {
	getLatestMessages,
	getMessageByGuid,
	getMessagesByOApp,
	getMessagesByPathway,
	getMessagesByStatus,
	getMessagesByTransaction,
	getMessagesByWallet,
} = await import('$/sources/LayerZeroScan/Rest/queries.ts')

const binding = bindings[Source.LayerZeroScan_Rest][0]

const sender = '0x1111111111111111111111111111111111111111'
const receiver = '0x2222222222222222222222222222222222222222'
const transactionHash = `0x${'3'.repeat(64)}`
const guid = `0x${'4'.repeat(64)}`
const pathwayId = `30101-30110-${sender}-${receiver}`
const message = {
	pathway: {
		srcEid: 30101,
		dstEid: 30110,
		sender: {
			address: sender,
			chain: 'ethereum',
		},
		receiver: {
			address: receiver,
			chain: 'arbitrum',
		},
		id: pathwayId,
		nonce: 9_007_199_254_740_991,
	},
	source: {
		status: 'SUCCEEDED',
		tx: {
			txHash: transactionHash,
			blockHash: `0x${'5'.repeat(64)}`,
			blockNumber: '900719925474099312345',
			blockTimestamp: 1_784_783_358,
			from: sender,
			value: '900719925474099312345',
			readinessTimestamp: 1_784_783_360,
			options: {
				lzReceive: {
					gas: '900719925474099312345',
					value: '0',
				},
				nativeDrop: [{
					amount: '123456789012345678901',
					receiver,
				}],
			},
		},
	},
	destination: {
		status: 'WAITING',
		nativeDrop: {
			status: 'N/A',
		},
		lzCompose: {
			status: 'N/A',
		},
	},
	verification: {
		dvn: {
			status: 'WAITING',
			dvns: {
				'0xVerifier': {
					status: 'WAITING',
				},
			},
		},
		sealer: {
			status: 'WAITING',
		},
	},
	guid,
	config: {
		error: false,
		dvnConfigError: false,
		ulnSendVersion: 'V302',
		ulnReceiveVersion: 'V302',
	},
	status: {
		name: 'INFLIGHT',
		message: 'Ready for DVNs to verify',
	},
	created: '2026-07-23T05:09:22.000Z',
	updated: '2026-07-23T05:09:24.000Z',
} as const

describe('LayerZero Scan public message queries', () => {
	beforeEach(() => {
		getJson.mockReset()
		getJson.mockResolvedValue({
			data: [message],
			nextToken: 'opaque-token',
		})
	})

	it('preserves exact pathway, nonce, transaction, lifecycle, and units', async () => {
		await expect(getLatestMessages({
			limit: 1,
			sourceEndpointIds: [30101],
			destinationEndpointIds: [30110],
		})).resolves.toMatchObject({
			data: [{
				pathway: {
					id: pathwayId,
					nonce: 9_007_199_254_740_991,
				},
				source: {
					status: 'SUCCEEDED',
					tx: {
						blockNumber: '900719925474099312345',
						value: '900719925474099312345',
					},
				},
				verification: {
					dvn: {
						status: 'WAITING',
					},
				},
				status: {
					name: 'INFLIGHT',
				},
			}],
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/v1/messages/latest?limit=1&srcChainIds=30101&dstChainIds=30110'
		)
	})

	it('keeps source lossless block numbers distinct from destination numeric block heights', async () => {
		getJson.mockResolvedValueOnce({
			data: [{
				...message,
				destination: {
					...message.destination,
					tx: {
						txHash: `0x${'6'.repeat(64)}`,
						blockHash: `0x${'7'.repeat(64)}`,
						blockNumber: 21_000_000,
						blockTimestamp: 1_784_783_400,
					},
				},
			}],
		})

		await expect(getLatestMessages()).resolves.toMatchObject({
			data: [{
				source: {
					tx: {
						blockNumber: '900719925474099312345',
					},
				},
				destination: {
					tx: {
						blockNumber: 21_000_000,
					},
				},
			}],
		})
	})

	it.each([
		{
			query: () => getMessagesByTransaction({
				transactionHash,
			}),
			path: `/v1/messages/tx/${transactionHash}`,
		},
		{
			query: () => getMessageByGuid({
				guid,
			}),
			path: `/v1/messages/guid/${guid}`,
		},
		{
			query: () => getMessagesByPathway({
				pathwayId,
				limit: 1,
			}),
			path: `/v1/messages/pathway/${pathwayId}?limit=1`,
		},
		{
			query: () => getMessagesByOApp({
				endpointId: 30101,
				address: sender,
				limit: 1,
			}),
			path: `/v1/messages/oapp/30101/${sender}?limit=1`,
		},
		{
			query: () => getMessagesByStatus({
				status: 'INFLIGHT',
				limit: 1,
			}),
			path: '/v1/messages/status/INFLIGHT?limit=1',
		},
		{
			query: () => getMessagesByWallet({
				srcAddress: sender,
				limit: 1,
			}),
			path: `/v1/messages/wallet/${sender}?limit=1`,
		},
	])('uses the exact read-only identity endpoint', async ({ query, path }) => {
		await query()
		expect(getJson).toHaveBeenCalledWith(binding, path)
	})

	it('carries opaque pagination without inventing offset semantics', async () => {
		await getMessagesByPathway({
			pathwayId,
			limit: 25,
			nextToken: 'eyJtZXNzYWdlSWQiOiIxIn0=',
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			`/v1/messages/pathway/${pathwayId}?limit=25&nextToken=eyJtZXNzYWdlSWQiOiIxIn0%3D`
		)
	})

	it('rejects malformed bounds and unsafe integer identities before transport', async () => {
		await expect(getLatestMessages({
			limit: 101,
		})).rejects.toThrow('invalid page limit')
		await expect(getMessagesByOApp({
			endpointId: 0,
			address: sender,
		})).rejects.toThrow('invalid endpoint id')
		await expect(getMessageByGuid({
			guid: 'not-a-guid',
		})).rejects.toThrow('invalid message GUID')

		getJson.mockResolvedValue({
			data: [{
				...message,
				pathway: {
					...message.pathway,
					nonce: Number.MAX_SAFE_INTEGER + 1,
				},
			}],
		})
		await expect(getLatestMessages())
			.rejects.toThrow('unsafe message nonce')
	})

	it('hard-fails when the messages page omits data', async () => {
		getJson.mockResolvedValue({})
		await expect(getLatestMessages()).rejects.toThrow(
			'LayerZeroScan_Rest: invalid messages response envelope'
		)
	})

	it('rejects duplicate message GUIDs before materializing bridge observations', async () => {
		getJson.mockResolvedValue({
			data: [
				message,
				{
					...message,
					pathway: {
						...message.pathway,
						nonce: message.pathway.nonce - 1,
					},
				},
			],
		})

		await expect(getLatestMessages({ limit: 2 })).rejects.toThrow(
			'response contains duplicate message identities'
		)
	})

	it.each([
		{
			mutate: {
				pathway: {
					...message.pathway,
					dstEid: 30111,
				},
			},
			error: 'mismatched pathway identity',
		},
		{
			mutate: {
				source: {
					...message.source,
					tx: {
						...message.source.tx,
						value: '1e18',
					},
				},
			},
			error: 'invalid messages response envelope',
		},
		{
			mutate: {
				updated: '2026-07-22T05:09:24.000Z',
			},
			error: 'timestamps are reversed',
		},
		{
			mutate: {
				status: {
					name: 'NOT_A_STATUS',
					message: 'invented',
				},
			},
			error: 'invalid message status',
		},
		{
			mutate: {
				status: undefined,
			},
			error: 'invalid messages response envelope',
		},
	])('rejects malformed observed messages', async ({ mutate, error }) => {
		getJson.mockResolvedValue({
			data: [{
				...message,
				...mutate,
			}],
		})
		await expect(getLatestMessages()).rejects.toThrow(error)
	})

	it('rejects foreign transaction and OApp subjects', async () => {
		await expect(getMessagesByTransaction({
			transactionHash: `0x${'6'.repeat(64)}`,
		})).rejects.toThrow('foreign transaction message')
		await expect(getMessagesByOApp({
			endpointId: 30101,
			address: receiver,
		})).rejects.toThrow('foreign OApp message')
		await expect(getMessagesByWallet({
			srcAddress: receiver,
		})).rejects.toThrow('foreign wallet message')
		await expect(getMessagesByStatus({
			status: 'DELIVERED',
		})).rejects.toThrow('foreign status message')

		expect('query' in await import('$/sources/LayerZeroScan/Rest/queries.ts')).toBe(false)
	})

	it('rejects unknown status path atoms before transport', async () => {
		await expect(getMessagesByStatus({
			// @ts-expect-error intentional invalid status probe
			status: 'NOT_A_STATUS',
		})).rejects.toThrow('invalid message status')
		expect(getJson).not.toHaveBeenCalled()
	})
})
