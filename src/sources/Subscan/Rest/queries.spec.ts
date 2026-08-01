import { beforeEach, describe, expect, it, vi } from 'vitest'
import bindings from '$/sources/Subscan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceEndpointKind,
	SourceTargetKind,
	sourceBindingId,
} from '$/sources/SourceBinding.ts'

const corsFetch = vi.hoisted(() => vi.fn())

vi.mock('$/lib/http.ts', () => ({
	corsFetch,
	throwHttpError: vi.fn(),
}))

const {
	getReferendum,
	listAccountExtrinsics,
	listReferenda,
} = await import('$/sources/Subscan/Rest/queries.ts')

const binding = bindings[Source.Subscan_Rest]

const publicEnv = {
	PUBLIC_SUBSCAN_API_KEY: 'subscan-key',
}
const referendum = {
	referendum_index: 23,
	origins: 'Root',
	created_block: 20_000_000,
	latest_block_num: 20_000_100,
	latest_block_timestamp: 1_753_000_100,
	status: 'Deciding',
}
const accountId = '12dK7dBTwDJcb4VGBag9zRrwWBPq9VtfmDDbVQCM1jVweTVm'
const accountExtrinsic = {
	account_id: accountId,
	block_num: 20_000_000,
	block_timestamp: 1_753_000_000,
	call_module: 'balances',
	call_module_function: 'transfer_keep_alive',
	extrinsic_hash: '0xACCOUNT_EXTRINSIC',
	extrinsic_index: '20000000-3',
	fee: '9007199254740993',
	finalized: true,
	nonce: 42,
	success: true,
}

const response = (
	list = [referendum],
	count = 35
) => new Response(JSON.stringify({
	code: 0,
	message: 'Success',
	generated_at: 1_753_000_100,
	data: {
		count,
		list,
	},
}))

describe('Subscan referendum list', () => {
	beforeEach(() => {
		corsFetch.mockReset()
		corsFetch.mockResolvedValue(response())
	})

	it('uses the registered proxied origin, credential, filters, and zero-based provider pagination', async () => {
		await expect(listReferenda({
			binding,
			page: 2,
			row: 10,
			status: 'active',
			origin: 'Root',
			publicEnv,
		})).resolves.toEqual({
			code: 0,
			message: 'Success',
			generated_at: 1_753_000_100,
			data: {
				count: 35,
				list: [referendum],
			},
		})
		expect(corsFetch).toHaveBeenCalledWith(
			'https://polkadot.api.subscan.io/api/scan/referenda/referendums',
			{
				delivery: binding.delivery,
				origins: [{
					origin: 'https://polkadot.api.subscan.io',
					corsEnabled: false,
				}],
				proxy: {
					proxyId: sourceBindingId(binding),
					endpointIndex: 0,
				},
				init: {
					method: 'POST',
					headers: {
						'content-type': 'application/json',
						'X-API-Key': 'subscan-key',
					},
					body: JSON.stringify({
						page: 2,
						row: 10,
						status: 'active',
						origin: 'Root',
					}),
				},
			}
		)
	})

	it('deduplicates exact statuses and omits nextPage on the final provider page', async () => {
		corsFetch.mockResolvedValueOnce(response([
			{
				...referendum,
				status: 'Approved',
			},
		], 31))

		await expect(listReferenda({
			binding,
			page: 3,
			row: 10,
			statuses: [
				'Approved',
				'Approved',
			],
			publicEnv,
		})).resolves.toMatchObject({
			data: {
				count: 31,
				list: [{
					referendum_index: 23,
				}],
			},
		})
		expect(JSON.parse(corsFetch.mock.calls[0][1].init.body)).toEqual({
			page: 3,
			row: 10,
			multi_status: ['Approved'],
		})
	})

	it('accepts an empty page beyond the reported final page', async () => {
		corsFetch.mockResolvedValueOnce(response([], 35))

		await expect(listReferenda({
			binding,
			page: 4,
			row: 10,
			publicEnv,
		})).resolves.toEqual({
			code: 0,
			message: 'Success',
			generated_at: 1_753_000_100,
			data: {
				count: 35,
				list: [],
			},
		})
	})

	it('rejects malformed identities, counts, oversized pages, and filter mismatches', async () => {
		const cases = [
			{
				value: response([{ ...referendum, referendum_index: -1 }]),
				message: 'invalid referendum identity',
			},
			{
				value: response([referendum, referendum]),
				message: 'duplicate referendum identity',
			},
			{
				value: response([referendum], -1),
				message: 'invalid count',
			},
			{
				value: response([referendum, { ...referendum, referendum_index: 24 }]),
				message: 'exceeded the requested row limit',
			},
			{
				value: response([{ ...referendum, origins: 'Signed' }]),
				message: 'mismatched origin',
			},
			{
				value: response([{ ...referendum, status: 'Rejected' }]),
				message: 'mismatched status',
			},
			{
				value: response([referendum], 20),
				message: 'exceeded its reported count',
			},
		]

		for (const { value, message } of cases) {
			corsFetch.mockResolvedValueOnce(value)
			await expect(listReferenda({
				binding,
				page: message === 'exceeded its reported count' ? 2 : 0,
				row: message === 'exceeded the requested row limit' ? 1 : 10,
				statuses: message === 'mismatched status' ? ['Approved'] : undefined,
				origin: message === 'mismatched origin' ? 'Root' : undefined,
				publicEnv,
			})).rejects.toThrow(message)
		}
	})

	it('rejects invalid requests without transport', async () => {
		const invalidRequests = [
			{ page: -1, row: 10 },
			{ page: 0.5, row: 10 },
			{ page: 0, row: 0 },
			{ page: 0, row: 101 },
			{ page: Number.MAX_SAFE_INTEGER, row: 2 },
			{ page: 0, row: 10, status: '' },
			{ page: 0, row: 10, origin: '' },
			{ page: 0, row: 10, statuses: [] },
			{ page: 0, row: 10, statuses: [''] },
			{ page: 0, row: 10, status: 'active', statuses: ['Approved'] },
		]
		for (const request of invalidRequests)
			await expect(listReferenda({
				binding,
				...request,
				publicEnv,
			})).rejects.toThrow()

		expect(corsFetch).not.toHaveBeenCalled()
	})

	it('rejects unsafe detail identities and application-level failures', async () => {
		for (const referendumIndex of [
			-1,
			0.5,
			Number.MAX_SAFE_INTEGER + 1,
		])
				expect(() => getReferendum({
					binding,
					referendumIndex,
					publicEnv,
				})).toThrow('nonnegative safe integer')

		expect(corsFetch).not.toHaveBeenCalled()
		corsFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			code: 10004,
			message: 'Record Not Found',
			generated_at: 1_753_000_100,
			data: null,
		})))
		await expect(getReferendum({
			binding,
			referendumIndex: 23,
			publicEnv,
		})).rejects.toThrow('Record Not Found')
	})
})

describe('Subscan account extrinsic list', () => {
	beforeEach(() => {
		corsFetch.mockReset()
		corsFetch.mockResolvedValue(new Response(JSON.stringify({
			code: 0,
			message: 'Success',
			generated_at: 1_753_000_100,
			data: {
				count: 21,
				extrinsics: [accountExtrinsic],
			},
		})))
	})

	it('preserves the SS58 subject and lossless indexed extrinsic facts', async () => {
		await expect(listAccountExtrinsics({
			binding,
			accountId,
			page: 1,
			row: 10,
			publicEnv,
		})).resolves.toEqual({
			code: 0,
			message: 'Success',
			generated_at: 1_753_000_100,
			data: {
				count: 21,
				extrinsics: [accountExtrinsic],
			},
		})
		expect(JSON.parse(corsFetch.mock.calls[0][1].init.body)).toEqual({
			address: accountId,
			page: 1,
			row: 10,
			signed: 'signed',
		})
	})

	it('fails closed on foreign, duplicate, and malformed indexed rows', async () => {
		for (const [extrinsics, message] of [
			[[{ ...accountExtrinsic, account_id: 'foreign' }], 'foreign account'],
			[[accountExtrinsic, accountExtrinsic], 'duplicate identity'],
			[[{ ...accountExtrinsic, extrinsic_index: '20000001-3' }], 'malformed identity'],
			[[{ ...accountExtrinsic, fee: '1.5' }], 'malformed fee'],
			[[{ ...accountExtrinsic, nonce: -1 }], 'malformed nonce'],
		] as const) {
			corsFetch.mockResolvedValueOnce(new Response(JSON.stringify({
				code: 0,
				message: 'Success',
				generated_at: 1_753_000_100,
				data: {
					count: 21,
					extrinsics,
				},
			})))
			await expect(listAccountExtrinsics({
				binding,
				accountId,
				page: 0,
				row: 10,
				publicEnv,
			})).rejects.toThrow(message)
		}
	})

	it('rejects unsafe pagination without transport', async () => {
		for (const request of [
			{ accountId: '', page: 0, row: 10 },
			{ accountId, page: -1, row: 10 },
			{ accountId, page: 0, row: 0 },
			{ accountId, page: 0, row: 101 },
			{ accountId, page: Number.MAX_SAFE_INTEGER, row: 2 },
		])
			await expect(listAccountExtrinsics({
				binding,
				...request,
				publicEnv,
			})).rejects.toThrow()

		expect(corsFetch).not.toHaveBeenCalled()
	})
})
