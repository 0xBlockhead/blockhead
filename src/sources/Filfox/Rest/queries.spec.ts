import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Filfox/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: {
		endpoints: {
			locator: string
		}[]
	}) => binding.endpoints[0]?.locator,
	sourceGetJson,
}))

const {
	getAddress,
	getAddressMessages,
	getBlock,
	getBlockMessages,
	getDeal,
	getDeals,
	getMessage,
	getMessageEvents,
	getMessageSubcalls,
	getMessages,
	getOverview,
	getTipset,
} = await import('$/sources/Filfox/Rest/queries.ts')

const binding = bindings[Source.Filfox_Rest][0]

const messageDetail = {
	cid: 'bafy-message',
	height: 6_258_067,
	timestamp: 1_786_048_410,
	confirmations: 1,
	blocks: [
		'bafy-block-a',
		'bafy-block-b',
	],
	version: 0,
	from: 'f1from',
	fromId: 'f01234',
	fromActor: 'account',
	to: 'f1to',
	toId: 'f05678',
	toActor: 'account',
	nonce: 3,
	value: '1000',
	gasLimit: 50_000_000,
	gasFeeCap: '100',
	gasPremium: '100',
	method: 'Send',
	methodNumber: 0,
	params: '',
	receipt: {
		exitCode: 0,
		return: '0x40',
		gasUsed: 1_234_567,
	},
	size: 120,
	error: '',
	baseFee: '100',
	fee: {
		baseFeeBurn: '1',
		overEstimationBurn: '2',
		minerPenalty: '0',
		minerTip: '3',
		refund: '4',
	},
	transfers: [{
		from: 'f1from',
		fromId: 'f01234',
		to: 'f099',
		toId: 'f099',
		value: '1',
		type: 'burn-fee',
	}],
	ethTransactionHash: '0xabc',
	eventLogCount: 0,
	subcallCount: 0,
	tokenTransfers: [],
} as const

describe('Filfox REST queries', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
		sourceGetJson.mockResolvedValue({})
	})

	it('appends the API-family prefix for every product endpoint', async () => {
		sourceGetJson
			.mockResolvedValueOnce({})
			.mockResolvedValueOnce(messageDetail)
			.mockResolvedValueOnce([])
			.mockResolvedValueOnce([])
			.mockResolvedValueOnce({
				totalCount: 0,
				messages: [],
			})
			.mockResolvedValueOnce({})
			.mockResolvedValueOnce({
				totalCount: 0,
				messages: [],
			})
			.mockResolvedValueOnce({})
			.mockResolvedValueOnce({
				totalCount: 0,
				messages: [],
			})
			.mockResolvedValueOnce({})
			.mockResolvedValueOnce({})
			.mockResolvedValueOnce({})

		await getTipset({
			height: 42n,
		})
		await getMessage({
			messageCid: 'bafy-message',
		})
		await getMessageEvents({
			messageCid: 'bafy-message',
		})
		await getMessageSubcalls({
			messageCid: 'bafy-message',
		})
		await getMessages({
			page: 0,
			pageSize: 16,
			method: 'PublishStorageDeals',
		})
		await getBlock({
			blockCid: 'bafy-block',
		})
		await getBlockMessages({
			blockCid: 'bafy-block',
			pageSize: 16,
		})
		await getAddress({
			address: 'f01234',
		})
		await getAddressMessages({
			address: 'f01234',
			page: 1,
			pageSize: 8,
		})
		await getOverview()
		await getDeals({
			page: 3,
			pageSize: 16,
		})
		await getDeal({
			dealId: 42n,
		})

		expect(sourceGetJson.mock.calls).toEqual([
			[
				binding,
				'https://filfox.info/api/v1/tipset/42',
			],
			[
				binding,
				'https://filfox.info/api/v1/message/bafy-message',
			],
			[
				binding,
				'https://filfox.info/api/v1/message/bafy-message/events',
			],
			[
				binding,
				'https://filfox.info/api/v1/message/bafy-message/subcalls',
			],
			[
				binding,
				'https://filfox.info/api/v1/message/list?page=0&pageSize=16&method=PublishStorageDeals',
			],
			[
				binding,
				'https://filfox.info/api/v1/block/bafy-block',
			],
			[
				binding,
				'https://filfox.info/api/v1/block/bafy-block/messages?pageSize=16',
			],
			[
				binding,
				'https://filfox.info/api/v1/address/f01234',
			],
			[
				binding,
				'https://filfox.info/api/v1/address/f01234/messages?page=1&pageSize=8',
			],
			[
				binding,
				'https://filfox.info/api/v1/overview',
			],
			[
				binding,
				'https://filfox.info/api/v1/deal/list?pageSize=16&page=3',
			],
			[
				binding,
				'https://filfox.info/api/v1/deal/42',
			],
		])
	})

	it('returns message height/timestamp/blocks/receipt envelopes unchanged', async () => {
		sourceGetJson.mockResolvedValueOnce(messageDetail)

		await expect(getMessage({
			messageCid: 'bafy-message',
		})).resolves.toEqual(messageDetail)
	})

	it('rejects a message detail whose cid does not match the request', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...messageDetail,
			cid: 'bafy-other',
		})

		await expect(getMessage({
			messageCid: 'bafy-message',
		})).rejects.toThrow(`${Source.Filfox_Rest}: message cid mismatch bafy-other !== bafy-message`)
	})

	it('rejects a malformed message detail envelope instead of soft-emptying', async () => {
		sourceGetJson.mockResolvedValueOnce({
			cid: 'bafy-message',
			from: 'f1from',
			to: 'f1to',
			value: '0',
			method: 'Send',
		})

		await expect(getMessage({
			messageCid: 'bafy-message',
		})).rejects.toThrow(`${Source.Filfox_Rest}: invalid message response envelope`)
	})

	it('rejects malformed message receipt / blocks shapes', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...messageDetail,
			receipt: {
				exitCode: '0',
			},
		})
		await expect(getMessage({
			messageCid: 'bafy-message',
		})).rejects.toThrow(`${Source.Filfox_Rest}: invalid message response envelope`)

		sourceGetJson.mockResolvedValueOnce({
			...messageDetail,
			blocks: [
				{
					cid: 'bafy-block-a',
				},
			],
		})
		await expect(getMessage({
			messageCid: 'bafy-message',
		})).rejects.toThrow(`${Source.Filfox_Rest}: invalid message response envelope`)
	})

	it('hard-fails when sourceGetJson rejects instead of soft-emptying', async () => {
		sourceGetJson.mockRejectedValueOnce(new Error('GET https://filfox.info/api/v1/message/missing → 404'))

		await expect(getMessage({
			messageCid: 'missing',
		})).rejects.toThrow('404')
		expect(sourceGetJson).toHaveBeenCalledTimes(1)
	})

	it('rejects empty message cids before transport', () => {
		expect(() => getMessage({
			messageCid: '',
		})).toThrow(`${Source.Filfox_Rest}: empty message cid`)
		expect(() => getMessageEvents({
			messageCid: '',
		})).toThrow(`${Source.Filfox_Rest}: empty message cid`)
		expect(() => getMessageSubcalls({
			messageCid: '',
		})).toThrow(`${Source.Filfox_Rest}: empty message cid`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('returns typed message event and subcall envelopes', async () => {
		const events = [{
			address: 'f410fxloqxewby4oqfz6ved3eycdwkoh2evl7wlysraq',
			name: 'PiecesAdded(uint256,uint256[],(bytes)[])',
			data: '0x00',
			topics: [
				'0x396df50222a87662e94bb7d173792d5e61fe0b193b6ccf791f7ce433f0b28207',
			],
			removed: false,
			logIndex: 45,
		}]
		const subcalls = [{
			from: 'f03677600',
			fromId: 'f03677600',
			fromActor: 'evm',
			to: 'f03785034',
			toId: 'f03785034',
			toActor: 'evm',
			value: '0',
			method: 'GetBytecode',
			methodNumber: 3,
			params: '0x',
			receipt: {
				exitCode: 0,
				return: '0xd82a',
			},
			subcalls: [],
		}]
		sourceGetJson
			.mockResolvedValueOnce(events)
			.mockResolvedValueOnce(subcalls)

		await expect(getMessageEvents({
			messageCid: 'bafy-message',
		})).resolves.toEqual(events)
		await expect(getMessageSubcalls({
			messageCid: 'bafy-message',
		})).resolves.toEqual(subcalls)
		expect(sourceGetJson.mock.calls).toEqual([
			[
				binding,
				'https://filfox.info/api/v1/message/bafy-message/events',
			],
			[
				binding,
				'https://filfox.info/api/v1/message/bafy-message/subcalls',
			],
		])
	})

	it('rejects malformed message event / subcall envelopes instead of soft-emptying', async () => {
		sourceGetJson.mockResolvedValueOnce([
			{
				address: 'f410',
				data: '0x00',
			},
		])
		await expect(getMessageEvents({
			messageCid: 'bafy-message',
		})).rejects.toThrow(`${Source.Filfox_Rest}: invalid message events response envelope`)

		sourceGetJson.mockResolvedValueOnce([
			{
				from: 'f1',
				to: 'f2',
				value: '0',
			},
		])
		await expect(getMessageSubcalls({
			messageCid: 'bafy-message',
		})).rejects.toThrow(`${Source.Filfox_Rest}: invalid message subcalls response envelope`)
	})

	it('accepts typed tokenTransfers on message detail', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...messageDetail,
			tokenTransfers: [{
				from: 'f1from',
				to: 'f1to',
				value: '100',
				type: 'erc20',
				token: 'f410token',
				tokenSymbol: 'USDFC',
			}],
		})

		await expect(getMessage({
			messageCid: 'bafy-message',
		})).resolves.toMatchObject({
			tokenTransfers: [{
				tokenSymbol: 'USDFC',
				value: '100',
			}],
		})
	})

	it('rejects malformed tokenTransfers on message detail', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...messageDetail,
			tokenTransfers: [{
				from: 'f1from',
				value: '100',
			}],
		})
		await expect(getMessage({
			messageCid: 'bafy-message',
		})).rejects.toThrow(`${Source.Filfox_Rest}: invalid message response envelope`)
	})

	it('returns typed global / address / block message list pages with observation clocks', async () => {
		const listPage = {
			totalCount: 2,
			messages: [{
				cid: 'bafy-msg-1',
				height: 100,
				timestamp: 1_700_000_000,
				from: 'f1from',
				to: 'f1to',
				nonce: 1,
				value: '0',
				method: 'Send',
				receipt: {
					exitCode: 0,
					return: '0x40',
				},
			}],
			methods: [],
		}
		sourceGetJson
			.mockResolvedValueOnce(listPage)
			.mockResolvedValueOnce(listPage)
			.mockResolvedValueOnce(listPage)

		await expect(getMessages({
			page: 0,
			pageSize: 1,
		})).resolves.toEqual(listPage)
		await expect(getAddressMessages({
			address: 'f01234',
			page: 0,
			pageSize: 1,
		})).resolves.toEqual(listPage)
		await expect(getBlockMessages({
			blockCid: 'bafy-block',
			pageSize: 1,
		})).resolves.toEqual(listPage)
	})

	it('rejects malformed message list envelopes instead of treating them as empty', async () => {
		sourceGetJson.mockResolvedValueOnce({
			messages: [],
		})
		await expect(getMessages({
			page: 0,
			pageSize: 1,
		})).rejects.toThrow(`${Source.Filfox_Rest}: invalid messages response envelope`)

		sourceGetJson.mockResolvedValueOnce({
			totalCount: 1,
			messages: [{
				cid: 'bafy-msg',
				from: 'f1from',
				to: 'f1to',
				value: '0',
				method: 'Send',
				height: '100',
			}],
		})
		await expect(getBlockMessages({
			blockCid: 'bafy-block',
			pageSize: 1,
		})).rejects.toThrow(`${Source.Filfox_Rest}: invalid messages response envelope`)
	})

	it('rejects invalid message list pagination before transport', () => {
		expect(() => getMessages({
			page: -1,
			pageSize: 1,
		})).toThrow(`${Source.Filfox_Rest}: invalid page -1`)
		expect(() => getAddressMessages({
			address: 'f01234',
			pageSize: 0,
		})).toThrow(`${Source.Filfox_Rest}: invalid pageSize 0`)
		expect(() => getBlockMessages({
			blockCid: 'bafy-block',
			pageSize: 101,
		})).toThrow(`${Source.Filfox_Rest}: invalid pageSize 101`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('returns typed deal list and detail responses unchanged', async () => {
		sourceGetJson
			.mockResolvedValueOnce({
				totalCount: 1,
				deals: [{
					id: 42,
					height: 100,
					timestamp: 1_700_000_000,
					pieceSize: 2048,
					verifiedDeal: true,
					client: 'f1client',
					provider: 'f01000',
					startEpoch: 101,
					startTimestamp: 1_700_000_030,
					endEpoch: 201,
					endTimestamp: 1_700_003_030,
					stroagePrice: '0',
				}],
			})
			.mockResolvedValueOnce({
				id: 42,
				height: 100,
				timestamp: 1_700_000_000,
				pieceCid: 'baga-piece',
				pieceSize: 2048,
				verifiedDeal: true,
				client: 'f1client',
				clientTag: {
					name: 'Official',
					signed: false,
				},
				provider: 'f01000',
				providerTag: {
					name: 'Official',
					signed: false,
				},
				startEpoch: 101,
				startTimestamp: 1_700_000_030,
				endEpoch: 201,
				endTimestamp: 1_700_003_030,
				storagePricePerEpoch: '0',
				stroagePrice: '0',
				clientCollateral: '1',
				providerCollateral: '2',
			})

		await expect(getDeals({
			page: 0,
			pageSize: 1,
		})).resolves.toMatchObject({
			totalCount: 1,
			deals: [{
				id: 42,
				stroagePrice: '0',
			}],
		})
		await expect(getDeal({
			dealId: 42n,
		})).resolves.toMatchObject({
			id: 42,
			storagePricePerEpoch: '0',
			clientCollateral: '1',
			providerCollateral: '2',
		})
	})
})
