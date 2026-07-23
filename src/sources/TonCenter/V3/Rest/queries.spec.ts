import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	type SourceBinding,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	tonCenterV3Hash,
	tonCenterV3NonnegativeInt64,
	tonCenterV3RawAddress,
	tonCenterV3Shard,
} from '$/sources/TonCenter/V3/Rest/normalization.ts'
import type {
	TonCenterV3BlockWire,
	TonCenterV3JettonMasterWire,
	TonCenterV3MessageWire,
	TonCenterV3NftCollectionWire,
	TonCenterV3NftItemWire,
	TonCenterV3TraceWire,
	TonCenterV3TransactionWire,
} from '$/sources/TonCenter/V3/Rest/types.ts'

const { getJson } = vi.hoisted(() => ({
	getJson: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const {
	getTonCenterV3Blocks,
	getTonCenterV3CompletedTraces,
	getTonCenterV3JettonMasters,
	getTonCenterV3Messages,
	getTonCenterV3NftCollections,
	getTonCenterV3NftItems,
	getTonCenterV3Transactions,
} = await import('$/sources/TonCenter/V3/Rest/queries.ts')

const binding = {
	provider: SourceProvider.TonCenter,
	source: Source.TonCenter_V3_Rest,
	target: {
		kind: SourceTargetKind.Caip2Network,
		key: 'ton:-239',
	},
	endpoints: [{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://toncenter.com/api/v3/',
		origin: 'https://toncenter.com',
		corsEnabled: false,
	}],
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: [SourceOperationGroup.GenericRead],
	delivery: SourceDelivery.HttpProxy,
	credentials: [{
		scope: SourceCredentialScope.None,
	}],
	proxyId: 'TonCenter_V3_Rest-test',
} as const satisfies SourceBinding

const firstHash = '01'.repeat(32)
const secondHash = '02'.repeat(32)
const firstAddress = `0:${'ab'.repeat(32)}`
const secondAddress = `-1:${'cd'.repeat(32)}`
const thirdAddress = `0:${'ef'.repeat(32)}`
const message = {
	hash: firstHash.toUpperCase(),
	source: firstAddress.toUpperCase(),
	destination: secondAddress.toUpperCase(),
	created_at: '1753315200',
	created_lt: '9007199254740993',
	value: '1000000000',
	fwd_fee: '1234',
	ihr_fee: '0',
	import_fee: '55',
	opcode: -1,
	in_msg_tx_hash: secondHash.toUpperCase(),
} satisfies TonCenterV3MessageWire

const block = {
	workchain: -1,
	shard: '8000000000000000',
	seqno: 52_000_000,
	root_hash: firstHash.toUpperCase(),
	file_hash: secondHash.toUpperCase(),
	gen_utime: '1753315200',
	start_lt: '9007199254740993',
	end_lt: '9007199254740999',
	tx_count: 42,
} satisfies TonCenterV3BlockWire

const trace = {
	trace_id: firstHash,
	external_hash: secondHash,
	start_lt: '9007199254740993',
	end_lt: '9007199254740999',
	start_utime: 1_753_315_200,
	end_utime: 1_753_315_201,
	mc_seqno_start: '52000000',
	mc_seqno_end: '52000001',
	is_incomplete: false,
	trace: {
		in_msg_hash: firstHash,
		in_msg: message,
		tx_hash: secondHash,
	},
	transactions_order: [secondHash],
	trace_info: {
		messages: 1,
		pending_messages: 0,
		transactions: 1,
	},
} satisfies TonCenterV3TraceWire

const transaction = {
	account: secondAddress.toUpperCase(),
	hash: secondHash.toUpperCase(),
	lt: '9007199254740999',
	block_ref: {
		workchain: -1,
		shard: '8000000000000000',
		seqno: 52_000_000,
	},
	now: 1_753_315_200,
	total_fees: '9007199254740993',
	prev_trans_hash: firstHash.toUpperCase(),
	prev_trans_lt: '9007199254740993',
	orig_status: 'active',
	end_status: 'active',
	description: {
		type: 'ord',
		aborted: false,
		destroyed: false,
	},
	account_state_before: {
		balance: '9007199254740995',
	},
	account_state_after: {
		balance: '9007199254740994',
	},
	in_msg: message,
	out_msgs: [{
		...message,
		hash: '03'.repeat(32),
		source: secondAddress,
		destination: firstAddress,
		in_msg_tx_hash: firstHash,
		out_msg_tx_hash: secondHash,
	}],
	trace_id: firstHash,
	trace_external_hash: secondHash,
} satisfies TonCenterV3TransactionWire

const jettonMaster = {
	address: firstAddress.toUpperCase(),
	admin_address: secondAddress.toUpperCase(),
	code_hash: firstHash.toUpperCase(),
	data_hash: secondHash.toUpperCase(),
	jetton_content: {
		uri: 'ipfs://jetton-metadata',
		name: 'Example Jetton',
	},
	jetton_wallet_code_hash: '03'.repeat(32).toUpperCase(),
	last_transaction_lt: '9007199254740999',
	mintable: true,
	total_supply: '340282366920938463463374607431768211455',
} satisfies TonCenterV3JettonMasterWire

const nftCollection = {
	address: firstAddress.toUpperCase(),
	code_hash: firstHash.toUpperCase(),
	collection_content: {
		uri: 'https://example.com/collection.json',
		name: 'Example Collection',
	},
	data_hash: secondHash.toUpperCase(),
	last_transaction_lt: '9007199254740999',
	next_item_index: '340282366920938463463374607431768211455',
	owner_address: secondAddress.toUpperCase(),
} satisfies TonCenterV3NftCollectionWire

const nftItem = {
	address: thirdAddress.toUpperCase(),
	auction_contract_address: secondAddress.toUpperCase(),
	code_hash: firstHash.toUpperCase(),
	collection: nftCollection,
	collection_address: firstAddress.toUpperCase(),
	content: {
		uri: 'ipfs://item-metadata',
		attributes: [{
			trait_type: 'Type',
			value: 'Example',
		}],
	},
	data_hash: secondHash.toUpperCase(),
	index: '340282366920938463463374607431768211454',
	init: true,
	last_transaction_lt: '9007199254740998',
	on_sale: true,
	owner_address: secondAddress.toUpperCase(),
	real_owner: firstAddress.toUpperCase(),
	sale_contract_address: secondAddress.toUpperCase(),
} satisfies TonCenterV3NftItemWire

describe('TON Center v3 source foundation', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('preserves provider block order, exact identities and offset continuation', async () => {
		getJson.mockResolvedValueOnce({
			blocks: [
				block,
				{
					...block,
					shard: '4000000000000000',
					seqno: block.seqno - 1,
					root_hash: secondHash,
					file_hash: firstHash,
				},
			],
		})

		await expect(getTonCenterV3Blocks(binding, {
			limit: 2,
			offset: 4,
			order: 'desc',
		})).resolves.toEqual({
			source: Source.TonCenter_V3_Rest,
			target: 'ton:-239',
			rows: [
				{
					workchain: -1,
					shard: block.shard,
					seqno: block.seqno,
					rootHash: firstHash,
					fileHash: secondHash,
					genUtimeSeconds: 1_753_315_200,
					startLt: 9_007_199_254_740_993n,
					endLt: 9_007_199_254_740_999n,
					transactionCount: 42,
				},
				expect.objectContaining({
					shard: '4000000000000000',
					seqno: block.seqno - 1,
				}),
			],
			nextOffset: 6,
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'blocks?limit=2&offset=4&sort=desc'
		)
	})

	it('canonicalizes every shared TON wire identity representation', () => {
		expect(tonCenterV3RawAddress(`00:${'AB'.repeat(32)}`)).toBe(firstAddress)
		expect(tonCenterV3Hash(
			'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE=',
			'base64 hash'
		)).toBe(firstHash)
		expect(tonCenterV3Hash(
			'AgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI',
			'base64url hash'
		)).toBe(secondHash)
		expect(tonCenterV3Shard('ABCDEF0123456789')).toBe('abcdef0123456789')
		expect(tonCenterV3NonnegativeInt64(
			'9007199254740993',
			'logical time'
		)).toBe(9_007_199_254_740_993n)
	})

	it('normalizes message addresses, hashes, logical times, and nanotons losslessly', async () => {
		getJson.mockResolvedValueOnce({
			messages: [message],
		})

		await expect(getTonCenterV3Messages(binding, {
			limit: 2,
			offset: 0,
			order: 'asc',
		})).resolves.toEqual({
			source: Source.TonCenter_V3_Rest,
			target: 'ton:-239',
			rows: [{
				hash: firstHash,
				source: firstAddress,
				destination: secondAddress,
				createdAtSeconds: 1_753_315_200,
				createdLt: 9_007_199_254_740_993n,
				valueNano: 1_000_000_000n,
				forwardFeeNano: 1_234n,
				ihrFeeNano: 0n,
				importFeeNano: 55n,
				opcode: -1,
				inboundTransactionHash: secondHash,
			}],
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'messages?limit=2&offset=0&sort=asc'
		)
	})

	it('normalizes nullable external and log message endpoints and a null transaction input', async () => {
		getJson
			.mockResolvedValueOnce({
				messages: [{
					...message,
					source: null,
					destination: null,
				}],
			})
			.mockResolvedValueOnce({
				transactions: [{
					...transaction,
					in_msg: null,
				}],
			})

		await expect(getTonCenterV3Messages(binding, {
			limit: 1,
			offset: 0,
			order: 'desc',
		})).resolves.toEqual(expect.objectContaining({
			rows: [expect.not.objectContaining({
				source: expect.anything(),
				destination: expect.anything(),
			})],
		}))
		await expect(getTonCenterV3Transactions(binding, {
			limit: 1,
			offset: 0,
			order: 'desc',
		})).resolves.toEqual(expect.objectContaining({
			rows: [expect.not.objectContaining({
				inboundMessage: expect.anything(),
			})],
		}))
	})

	it('accepts completed traces only and requires the trace ID to be the root message identity', async () => {
		getJson.mockResolvedValueOnce({
			traces: [trace],
		})

		await expect(getTonCenterV3CompletedTraces(binding, {
			limit: 1,
			offset: 8,
			order: 'desc',
		})).resolves.toEqual({
			source: Source.TonCenter_V3_Rest,
			target: 'ton:-239',
			rows: [{
				traceId: firstHash,
				externalHash: secondHash,
				startLt: 9_007_199_254_740_993n,
				endLt: 9_007_199_254_740_999n,
				startUtimeSeconds: 1_753_315_200,
				endUtimeSeconds: 1_753_315_201,
				masterchainStartSeqno: 52_000_000n,
				masterchainEndSeqno: 52_000_001n,
				rootMessage: expect.objectContaining({
					hash: firstHash,
				}),
				transactionHashes: [secondHash],
				messageCount: 1,
				transactionCount: 1,
			}],
			nextOffset: 9,
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'traces?limit=1&offset=8&sort=desc'
		)
	})

	it('preserves transaction order, identity, relations, and bigint monetary values', async () => {
		getJson.mockResolvedValueOnce({
			transactions: [
				transaction,
				{
					...transaction,
					lt: '9007199254740998',
				},
			],
		})

		await expect(getTonCenterV3Transactions(binding, {
			limit: 2,
			offset: 5,
			order: 'desc',
		})).resolves.toEqual({
			source: Source.TonCenter_V3_Rest,
			target: 'ton:-239',
			rows: [
				{
					account: secondAddress,
					logicalTime: 9_007_199_254_740_999n,
					hash: secondHash,
					block: {
						workchain: -1,
						shard: '8000000000000000',
						seqno: 52_000_000,
					},
					timestampSeconds: 1_753_315_200,
					totalFeesNano: 9_007_199_254_740_993n,
					previousTransactionHash: firstHash,
					previousTransactionLogicalTime: 9_007_199_254_740_993n,
					originalStatus: 'active',
					endStatus: 'active',
					transactionKind: 'ord',
					aborted: false,
					destroyed: false,
					balanceBeforeNano: 9_007_199_254_740_995n,
					balanceAfterNano: 9_007_199_254_740_994n,
					inboundMessage: expect.objectContaining({
						hash: firstHash,
						destination: secondAddress,
						inboundTransactionHash: secondHash,
					}),
					outboundMessages: [expect.objectContaining({
						hash: '03'.repeat(32),
						source: secondAddress,
						outboundTransactionHash: secondHash,
					})],
					traceId: firstHash,
					traceExternalHash: secondHash,
				},
				expect.objectContaining({
					logicalTime: 9_007_199_254_740_998n,
					hash: secondHash,
				}),
			],
			nextOffset: 7,
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'transactions?limit=2&offset=5&sort=desc'
		)
	})

	it.each([
		{
			label: 'duplicate identity',
			rows: [
				transaction,
				transaction,
			],
			error: 'duplicate transaction identity',
		},
		{
			label: 'conflicting AccountLt hash identity',
			rows: [
				transaction,
				{
					...transaction,
					hash: firstHash,
				},
			],
			error: 'conflicting transaction hash identity',
		},
		{
			label: 'provider order',
			rows: [
				{
					...transaction,
					lt: '9007199254740998',
				},
				transaction,
			],
			error: 'not newest-first',
		},
		{
			label: 'foreign inbound message',
			rows: [{
				...transaction,
				in_msg: {
					...message,
					destination: firstAddress,
				},
			}],
			error: 'foreign inbound message',
		},
		{
			label: 'foreign outbound message',
			rows: [{
				...transaction,
				out_msgs: [{
					...transaction.out_msgs[0],
					source: firstAddress,
				}],
			}],
			error: 'foreign outbound message',
		},
		{
			label: 'malformed account',
			rows: [{
				...transaction,
				account: 'not-an-address',
			}],
			error: 'malformed raw TON address',
		},
		{
			label: 'overflowed fees',
			rows: [{
				...transaction,
				total_fees: '9223372036854775808',
			}],
			error: 'exceeds signed int64',
		},
		{
			label: 'overflowed balance',
			rows: [{
				...transaction,
				account_state_after: {
					balance: '9223372036854775808',
				},
			}],
			error: 'exceeds signed int64',
		},
	])('rejects transaction $label', async ({
		rows,
		error,
	}) => {
		getJson.mockResolvedValueOnce({
			transactions: rows,
		})

		await expect(getTonCenterV3Transactions(binding, {
			limit: rows.length,
			offset: 0,
			order: 'desc',
		})).rejects.toThrow(error)
	})

	it.each([
		{
			label: 'blocks',
			response: {
				blocks: [
					{
						...block,
						gen_utime: '1753315199',
						seqno: block.seqno - 1,
						root_hash: '03'.repeat(32),
						file_hash: '04'.repeat(32),
					},
					block,
				],
			},
			query: getTonCenterV3Blocks,
		},
		{
			label: 'messages',
			response: {
				messages: [
					{
						...message,
						created_lt: '9007199254740992',
						hash: '03'.repeat(32),
					},
					message,
				],
			},
			query: getTonCenterV3Messages,
		},
		{
			label: 'traces',
			response: {
				traces: [
					{
						...trace,
						trace_id: '03'.repeat(32),
						trace: {
							...trace.trace,
							in_msg_hash: '03'.repeat(32),
							in_msg: {
								...trace.trace.in_msg,
								hash: '03'.repeat(32),
							},
						},
						end_lt: '9007199254740998',
					},
					trace,
				],
			},
			query: getTonCenterV3CompletedTraces,
		},
	])('rejects non-descending $label provider order', async ({
		label,
		response,
		query,
	}) => {
		getJson.mockResolvedValueOnce(response)

		await expect(query(binding, {
			limit: 2,
			offset: 0,
			order: 'desc',
		})).rejects.toThrow(`TonCenter_V3_Rest: ${label} are not newest-first`)
	})

	it('rejects conflicting block hash selectors', async () => {
		getJson.mockResolvedValueOnce({
			blocks: [
				block,
				{
					...block,
					seqno: block.seqno - 1,
				},
			],
		})

		await expect(getTonCenterV3Blocks(binding, {
			limit: 2,
			offset: 0,
			order: 'desc',
		})).rejects.toThrow('duplicate block hash identity')
	})

	it.each([
		2 ** 31,
		(2 ** 31) - 2,
	])('rejects pages outside the official int32 offset domain', async (offset) => {
		await expect(getTonCenterV3Blocks(binding, {
			limit: 2,
			offset,
			order: 'desc',
		})).rejects.toThrow(/offset/)
		expect(getJson).not.toHaveBeenCalled()
	})

	it('preserves jetton master order, identity, content provenance, and unbounded supply units', async () => {
		getJson.mockResolvedValueOnce({
			jetton_masters: [
				jettonMaster,
				{
					...jettonMaster,
					address: thirdAddress,
				},
			],
		})

		await expect(getTonCenterV3JettonMasters(binding, {
			limit: 2,
			offset: 3,
		})).resolves.toEqual({
			source: Source.TonCenter_V3_Rest,
			target: 'ton:-239',
			rows: [
				{
					address: firstAddress,
					adminAddress: secondAddress,
					codeHash: firstHash,
					dataHash: secondHash,
					content: jettonMaster.jetton_content,
					metadataUri: 'ipfs://jetton-metadata',
					walletCodeHash: '03'.repeat(32),
					lastTransactionLogicalTime: 9_007_199_254_740_999n,
					mintable: true,
					totalSupplyUnits: 340_282_366_920_938_463_463_374_607_431_768_211_455n,
				},
				expect.objectContaining({
					address: thirdAddress,
				}),
			],
			nextOffset: 5,
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'jetton/masters?limit=2&offset=3'
		)
	})

	it('preserves NFT collection order, owner, metadata, and unbounded next index', async () => {
		getJson.mockResolvedValueOnce({
			nft_collections: [nftCollection],
		})

		await expect(getTonCenterV3NftCollections(binding, {
			limit: 2,
			offset: 0,
		})).resolves.toEqual({
			source: Source.TonCenter_V3_Rest,
			target: 'ton:-239',
			rows: [{
				address: firstAddress,
				codeHash: firstHash,
				content: nftCollection.collection_content,
				metadataUri: 'https://example.com/collection.json',
				dataHash: secondHash,
				lastTransactionLogicalTime: 9_007_199_254_740_999n,
				nextItemIndex: 340_282_366_920_938_463_463_374_607_431_768_211_455n,
				ownerAddress: secondAddress,
			}],
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'nft/collections?limit=2&offset=0'
		)
	})

	it('preserves NFT item collection/index identity, ownership, and content provenance', async () => {
		getJson.mockResolvedValueOnce({
			nft_items: [nftItem],
		})

		await expect(getTonCenterV3NftItems(binding, {
			limit: 1,
			offset: 6,
		})).resolves.toEqual({
			source: Source.TonCenter_V3_Rest,
			target: 'ton:-239',
			rows: [{
				address: thirdAddress,
				auctionContractAddress: secondAddress,
				codeHash: firstHash,
				collection: expect.objectContaining({
					address: firstAddress,
					ownerAddress: secondAddress,
				}),
				collectionAddress: firstAddress,
				content: nftItem.content,
				metadataUri: 'ipfs://item-metadata',
				dataHash: secondHash,
				index: 340_282_366_920_938_463_463_374_607_431_768_211_454n,
				initialized: true,
				lastTransactionLogicalTime: 9_007_199_254_740_998n,
				onSale: true,
				ownerAddress: secondAddress,
				realOwnerAddress: firstAddress,
				saleContractAddress: secondAddress,
			}],
			nextOffset: 7,
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'nft/items?limit=1&offset=6'
		)
	})

	it.each([
		{
			query: getTonCenterV3JettonMasters,
			response: {
				jetton_masters: [
					jettonMaster,
					jettonMaster,
				],
			},
			error: 'duplicate jetton master identity',
		},
		{
			query: getTonCenterV3NftCollections,
			response: {
				nft_collections: [
					nftCollection,
					nftCollection,
				],
			},
			error: 'duplicate NFT collection identity',
		},
		{
			query: getTonCenterV3NftItems,
			response: {
				nft_items: [
					nftItem,
					nftItem,
				],
			},
			error: 'duplicate NFT item identity',
		},
		{
			query: getTonCenterV3NftItems,
			response: {
				nft_items: [
					nftItem,
					{
						...nftItem,
						address: secondAddress,
					},
				],
			},
			error: 'duplicate NFT collection item identity',
		},
		{
			query: getTonCenterV3NftItems,
			response: {
				nft_items: [{
					...nftItem,
					collection_address: secondAddress,
				}],
			},
			error: 'foreign embedded collection',
		},
		{
			query: getTonCenterV3JettonMasters,
			response: {
				jetton_masters: [{
					...jettonMaster,
					total_supply: '1.5',
				}],
			},
			error: 'malformed jetton total supply',
		},
		{
			query: getTonCenterV3NftCollections,
			response: {
				nft_collections: [{
					...nftCollection,
					owner_address: 'not-an-address',
				}],
			},
			error: 'malformed raw TON address',
		},
		{
			query: getTonCenterV3NftItems,
			response: {
				nft_items: [{
					...nftItem,
					code_hash: 'not-a-hash',
				}],
			},
			error: 'malformed NFT item code hash',
		},
	])('fails closed on invalid token/NFT rows: $error', async ({
		query,
		response,
		error,
	}) => {
		getJson.mockResolvedValueOnce(response)

		await expect(query(binding, {
			limit: 2,
			offset: 0,
		})).rejects.toThrow(error)
	})

	it.each([
		{
			is_incomplete: true,
			error: 'trace is incomplete',
		},
		{
			trace_info: {
				...trace.trace_info,
				pending_messages: 1,
			},
			error: 'trace is incomplete',
		},
		{
			trace_id: secondHash,
			error: 'root message identity mismatch',
		},
		{
			transactions_order: [
				secondHash,
				secondHash,
			],
			trace_info: {
				...trace.trace_info,
				transactions: 2,
			},
			error: 'duplicate trace transaction identity',
		},
	])('fails closed on invalid completed-trace evidence', async ({
		error,
		...mutation
	}) => {
		getJson.mockResolvedValueOnce({
			traces: [{
				...trace,
				...mutation,
			}],
		})

		await expect(getTonCenterV3CompletedTraces(binding, {
			limit: 10,
			offset: 0,
			order: 'desc',
		})).rejects.toThrow(error)
	})

	it.each([
		[
			'wrong source',
			{
				...binding,
				source: Source.TonCenter_V2_Rest,
			},
		],
		[
			'wrong target',
			{
				...binding,
				target: {
					kind: SourceTargetKind.Global,
					key: 'toncenter-v3',
				},
			},
		],
		[
			'placeholder endpoint',
			{
				...binding,
				endpoints: [{
					...binding.endpoints[0],
					locator: 'https://{toncenter-v3-api-host}',
				}],
			},
		],
		[
			'remote-query delivery',
			{
				...binding,
				delivery: SourceDelivery.RemoteQuery,
			},
		],
	] satisfies [string, SourceBinding][])('rejects %s binding authority before transport', async (
		_label,
		invalidBinding
	) => {
		await expect(getTonCenterV3Blocks(invalidBinding, {
			limit: 1,
			offset: 0,
			order: 'desc',
		})).rejects.toThrow('canonical TON mainnet v3 binding')
		expect(getJson).not.toHaveBeenCalled()
	})

	it('rejects malformed identities, int64 overflow, duplicates, and pagination bounds', async () => {
		getJson.mockResolvedValueOnce({
			blocks: [{
				...block,
				root_hash: 'not-a-hash',
			}],
		})
		await expect(getTonCenterV3Blocks(binding, {
			limit: 1,
			offset: 0,
			order: 'desc',
		})).rejects.toThrow('malformed block root hash')

		getJson.mockResolvedValueOnce({
			messages: [{
				...message,
				created_lt: '9223372036854775808',
			}],
		})
		await expect(getTonCenterV3Messages(binding, {
			limit: 1,
			offset: 0,
			order: 'desc',
		})).rejects.toThrow('exceeds signed int64')

		getJson.mockResolvedValueOnce({
			blocks: [
				block,
				block,
			],
		})
		await expect(getTonCenterV3Blocks(binding, {
			limit: 2,
			offset: 0,
			order: 'desc',
		})).rejects.toThrow('duplicate block identity')

		vi.clearAllMocks()
		await expect(getTonCenterV3Messages(binding, {
			limit: 1_001,
			offset: 0,
			order: 'desc',
		})).rejects.toThrow('1 through 1000')
		expect(getJson).not.toHaveBeenCalled()
	})
})
