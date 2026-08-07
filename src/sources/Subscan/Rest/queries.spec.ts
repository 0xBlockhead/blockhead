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
	listBlocks,
	listReferenda,
	referendumLifecycleBlockNumbers,
} = await import('$/sources/Subscan/Rest/queries.ts')

const binding = bindings[Source.Subscan_Rest][0]

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
	ayes_amount: '123000000000',
	nays_amount: '45000000000',
	timeline: [
		{
			block: 20_000_000,
			status: 'Submitted',
			time: 1_753_000_000,
		},
	],
}
const referendumListItem = {
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
	list = [referendumListItem],
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
				list: [referendumListItem],
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
				...referendumListItem,
				status: 'Approved',
			},
		], 31))

		await expect(listReferenda({
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
				value: response([{ ...referendumListItem, referendum_index: -1 }]),
				message: 'invalid referenda response envelope',
			},
			{
				value: response([referendumListItem, referendumListItem]),
				message: 'duplicate referendum identity',
			},
			{
				value: response([referendumListItem], -1),
				message: 'invalid referenda response envelope',
			},
			{
				value: response([referendumListItem, { ...referendumListItem, referendum_index: 24 }]),
				message: 'exceeded the requested row limit',
			},
			{
				value: response([{ ...referendumListItem, origins: 'Signed' }]),
				message: 'mismatched origin',
			},
			{
				value: response([{ ...referendumListItem, status: 'Rejected' }]),
				message: 'mismatched status',
			},
			{
				value: response([referendumListItem], 20),
				message: 'exceeded its reported count',
			},
		]

		for (const { value, message } of cases) {
			corsFetch.mockResolvedValueOnce(value)
			await expect(listReferenda({
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
			await expect(getReferendum({
				referendumIndex,
				publicEnv,
			})).rejects.toThrow('nonnegative safe integer')

		expect(corsFetch).not.toHaveBeenCalled()
		corsFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			code: 10004,
			message: 'Record Not Found',
			generated_at: 1_753_000_100,
			data: null,
		})))
		await expect(getReferendum({
			referendumIndex: 23,
			publicEnv,
		})).rejects.toThrow('Record Not Found')
	})

	it('fails closed on malformed referendum detail envelopes', async () => {
		corsFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			code: 0,
			message: 'Success',
			generated_at: 1_753_000_100,
			data: {
				...referendum,
				ayes_amount: '12.5',
				nays_amount: '1',
				timeline: [],
			},
		})))
		await expect(getReferendum({
			referendumIndex: 23,
			publicEnv,
		})).rejects.toThrow('invalid referendum response envelope')
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
			[[{ ...accountExtrinsic, fee: '1.5' }], 'invalid account extrinsics response envelope'],
			[[{ ...accountExtrinsic, nonce: -1 }], 'invalid account extrinsics response envelope'],
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
				...request,
				publicEnv,
			})).rejects.toThrow()

		expect(corsFetch).not.toHaveBeenCalled()
	})
})

describe('Subscan block extrinsic list', () => {
	beforeEach(() => {
		corsFetch.mockReset()
		corsFetch.mockResolvedValue(new Response(JSON.stringify({
			code: 0,
			message: 'Success',
			generated_at: 1_753_000_100,
			data: {
				count: 4,
				extrinsics: [accountExtrinsic],
			},
		})))
	})

	it('scopes rows to the requested block and hard-fails empty application payloads', async () => {
		const {
			listBlockExtrinsics,
		} = await import('$/sources/Subscan/Rest/queries.ts')

		await expect(listBlockExtrinsics({
			blockNumber: 20_000_000n,
			page: 0,
			row: 10,
			publicEnv,
		})).resolves.toMatchObject({
			data: {
				count: 4,
				extrinsics: [accountExtrinsic],
			},
		})
		expect(JSON.parse(corsFetch.mock.calls[0][1].init.body)).toEqual({
			block_num: 20_000_000,
			page: 0,
			row: 10,
		})

		corsFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			code: 0,
			message: 'Success',
			generated_at: 1_753_000_100,
			data: null,
		})))
		await expect(listBlockExtrinsics({
			blockNumber: 20_000_000n,
			page: 0,
			row: 10,
			publicEnv,
		})).rejects.toThrow('invalid block extrinsics response envelope')
	})

	it('fails closed on foreign block rows', async () => {
		const {
			listBlockExtrinsics,
		} = await import('$/sources/Subscan/Rest/queries.ts')
		corsFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			code: 0,
			message: 'Success',
			generated_at: 1_753_000_100,
			data: {
				count: 1,
				extrinsics: [{
					...accountExtrinsic,
					block_num: 20_000_001,
					extrinsic_index: '20000001-3',
				}],
			},
		})))
		await expect(listBlockExtrinsics({
			blockNumber: 20_000_000n,
			page: 0,
			row: 10,
			publicEnv,
		})).rejects.toThrow('foreign block')
	})
})

describe('Subscan block list', () => {
	const tipBlock = {
		block_num: 20_000_100,
		hash: '0xTIP',
		block_timestamp: 1_753_000_100,
		event_count: 12,
		extrinsics_count: 4,
		finalized: true,
	}
	const olderBlock = {
		block_num: 20_000_099,
		hash: '0xOLDER',
		block_timestamp: 1_753_000_094,
		finalized: true,
	}

	beforeEach(() => {
		corsFetch.mockReset()
		corsFetch.mockResolvedValue(new Response(JSON.stringify({
			code: 0,
			message: 'Success',
			generated_at: 1_753_000_100,
			data: {
				count: 20_000_101,
				blocks: [tipBlock, olderBlock],
			},
		})))
	})

	it('lists newest-first tip blocks from the v2 scan surface', async () => {
		await expect(listBlocks({
			page: 0,
			row: 2,
			publicEnv,
		})).resolves.toMatchObject({
			data: {
				count: 20_000_101,
				blocks: [tipBlock, olderBlock],
			},
		})
		expect(corsFetch).toHaveBeenCalledWith(
			'https://polkadot.api.subscan.io/api/v2/scan/blocks',
			expect.objectContaining({
				init: expect.objectContaining({
					body: JSON.stringify({
						page: 0,
						row: 2,
					}),
				}),
			})
		)
	})

	it('fails closed on ascending pages and malformed envelopes', async () => {
		corsFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			code: 0,
			message: 'Success',
			generated_at: 1_753_000_100,
			data: {
				count: 2,
				blocks: [olderBlock, tipBlock],
			},
		})))
		await expect(listBlocks({
			page: 0,
			row: 2,
			publicEnv,
		})).rejects.toThrow('newest-first')

		corsFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			code: 0,
			message: 'Success',
			generated_at: 1_753_000_100,
			data: {
				count: 1,
				blocks: [{
					block_num: 1,
					hash: '',
				}],
			},
		})))
		await expect(listBlocks({
			page: 0,
			row: 1,
			publicEnv,
		})).rejects.toThrow('invalid blocks response envelope')
	})
})

describe('Subscan referendum lifecycle leftovers', () => {
	it('maps confirming / decided / executed timeline statuses onto enrolled block clocks', () => {
		expect(referendumLifecycleBlockNumbers({
			...referendum,
			timeline: [
				{
					block: 20_000_010,
					status: 'Confirming',
					time: 1_753_000_010,
				},
				{
					block: 20_000_020,
					status: 'Approved',
					time: 1_753_000_020,
				},
				{
					block: 20_000_030,
					status: 'Executed',
					time: 1_753_000_030,
				},
			],
		})).toEqual({
			confirmationStartedAtBlockNumber: 20_000_010n,
			decidedAtBlockNumber: 20_000_020n,
			enactmentAtBlockNumber: 20_000_030n,
		})
	})
})
