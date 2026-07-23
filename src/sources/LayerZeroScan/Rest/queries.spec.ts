import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const {
	getLatestMessages,
	getMessageByGuid,
	getMessagesByOApp,
	getMessagesByPathway,
	getMessagesByTransaction,
} = await import('$/sources/LayerZeroScan/Rest/queries.ts')

const binding = {
	provider: SourceProvider.LayerZeroScan,
	source: Source.LayerZeroScan_Rest,
	target: {
		kind: SourceTargetKind.Global,
		key: 'layerzero-scan-api',
	},
	endpoints: [{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://scan.layerzero-api.com',
		origin: 'https://scan.layerzero-api.com',
		corsEnabled: false,
	}],
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: [SourceOperationGroup.GenericRead],
	delivery: SourceDelivery.RemoteQuery,
	credentials: [{ scope: SourceCredentialScope.None }],
} as const satisfies SourceBinding

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

describe('LayerZero Scan public message observation', () => {
	beforeEach(() => {
		getJson.mockReset()
		getJson.mockResolvedValue({
			data: [message],
			nextToken: 'opaque-token',
		})
	})

	it('preserves exact pathway, nonce, transaction, lifecycle, and units', async () => {
		await expect(getLatestMessages({
			binding,
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
			observedBy: 'LayerZeroScan_Rest',
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/v1/messages/latest?limit=1&srcChainIds=30101&dstChainIds=30110'
		)
	})

	it.each([
		{
			query: () => getMessagesByTransaction({
				binding,
				transactionHash,
			}),
			path: `/v1/messages/tx/${transactionHash}`,
		},
		{
			query: () => getMessageByGuid({
				binding,
				guid,
			}),
			path: `/v1/messages/guid/${guid}`,
		},
		{
			query: () => getMessagesByPathway({
				binding,
				pathwayId,
				limit: 1,
			}),
			path: `/v1/messages/pathway/${pathwayId}?limit=1`,
		},
		{
			query: () => getMessagesByOApp({
				binding,
				endpointId: 30101,
				address: sender,
				limit: 1,
			}),
			path: `/v1/messages/oapp/30101/${sender}?limit=1`,
		},
	])('uses the exact read-only identity endpoint', async ({ query, path }) => {
		await query()
		expect(getJson).toHaveBeenCalledWith(binding, path)
	})

	it('carries opaque pagination without inventing offset semantics', async () => {
		await getMessagesByPathway({
			binding,
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
			binding,
			limit: 101,
		})).rejects.toThrow('invalid page limit')
		await expect(getMessagesByOApp({
			binding,
			endpointId: 0,
			address: sender,
		})).rejects.toThrow('invalid endpoint id')
		await expect(getMessageByGuid({
			binding,
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
		await expect(getLatestMessages({ binding }))
			.rejects.toThrow('unsafe message nonce')
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
			error: 'invalid lossless transaction unit',
		},
		{
			mutate: {
				updated: '2026-07-22T05:09:24.000Z',
			},
			error: 'timestamps are reversed',
		},
	])('rejects malformed observed messages', async ({ mutate, error }) => {
		getJson.mockResolvedValue({
			data: [{
				...message,
				...mutate,
			}],
		})
		await expect(getLatestMessages({ binding })).rejects.toThrow(error)
	})

	it('rejects foreign transaction and OApp subjects', async () => {
		await expect(getMessagesByTransaction({
			binding,
			transactionHash: `0x${'6'.repeat(64)}`,
		})).rejects.toThrow('foreign transaction message')
		await expect(getMessagesByOApp({
			binding,
			endpointId: 30101,
			address: receiver,
		})).rejects.toThrow('foreign OApp message')

		expect('query' in await import('$/sources/LayerZeroScan/Rest/queries.ts')).toBe(false)
	})
})
