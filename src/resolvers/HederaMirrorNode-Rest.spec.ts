import { readFileSync } from 'node:fs'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	materializeResolverOutput,
	ResolverOutputMaterialization,
} from '$/collections/assertLoadedCollectionRows.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	entitySelectorKey,
	indexSchema,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import bindings from '$/sources/HederaMirrorNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import {
	getAccount,
	getAccountAllowances,
	getAccounts,
	getAccountNfts,
	getAccountTokens,
	getBlock,
	getBlockByConsensusTimestamp,
	getBlocks,
	getContractResultByTransactionIdNonce,
	getSchedule,
	getTopic,
	getTopicMessage,
	getTopicMessages,
	getToken,
	getTokenNft,
	getTokenNfts,
	getTransactionByIdNonce,
	getTransactions,
} from '$/sources/HederaMirrorNode/Rest/queries.ts'
import type {
	HederaMirrorNodeAccount,
	HederaMirrorNodeAccounts,
	HederaMirrorNodeAccountTokens,
	HederaMirrorNodeBlock,
	HederaMirrorNodeBlocks,
	HederaMirrorNodeContractResult,
	HederaMirrorNodeCryptoAllowances,
	HederaMirrorNodeNftAllowances,
	HederaMirrorNodeNfts,
	HederaMirrorNodeSchedule,
	HederaMirrorNodeTopic,
	HederaMirrorNodeTopicMessage,
	HederaMirrorNodeTopicMessages,
	HederaMirrorNodeToken,
	HederaMirrorNodeTokenAllowances,
	HederaMirrorNodeTransaction,
	HederaMirrorNodeTransactions,
} from '$/sources/HederaMirrorNode/Rest/types.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://mainnet-public.mirrornode.hedera.com',
	sourceFetch,
	sourceGetJson: async (_binding: unknown, url: string) => {
		const response = await sourceFetch(_binding, url)
		if (!response.ok)
			throw new Error(`HederaMirrorNode_Rest: HTTP ${String(response.status)}`)

		return response.json()
	},
	sourceGetText: async (_binding: unknown, url: string) => {
		const response = await sourceFetch(_binding, url)
		if (!response.ok)
			throw new Error(`HederaMirrorNode_Rest: HTTP ${String(response.status)}`)

		return response.text()
	},
}))

const { default: hederaMirrorNode } = await import('$/resolvers/HederaMirrorNode-Rest.ts')

const fixture = JSON.parse(readFileSync(
	new URL('../sources/HederaMirrorNode/Rest/fixtures/block.json', import.meta.url),
	'utf8'
)) satisfies HederaMirrorNodeBlock

const accountFixture = {
	account: '0.0.98',
	alias: 'JBSWY3DPEHPK3PXP',
	auto_renew_period: 7_776_000,
	balance: {
		timestamp: '1710000000.123456789',
		balance: '9007199254740993',
		tokens: [],
	},
	created_timestamp: '1700000000.000000001',
	decline_reward: false,
	deleted: false,
	ethereum_nonce: 2,
	evm_address: 'ac384c53f03855fa1b3616052f8ba32c6c2a2fec',
	expiry_timestamp: '1800000000.000000001',
	key: {
		_type: 'ED25519',
		key: 'key',
	},
	max_automatic_token_associations: 10,
	memo: 'account memo',
	pending_reward: '25',
	receiver_sig_required: true,
	staked_account_id: null,
	staked_node_id: 3,
	stake_period_start: '1700000000.000000001',
} satisfies HederaMirrorNodeAccount

const transactionFixture = {
	batch_key: null,
	bytes: null,
	charged_tx_fee: '9007199254740993',
	consensus_timestamp: '1710000001.000000007',
	entity_id: null,
	high_volume: false,
	high_volume_pricing_multiplier: 1,
	max_custom_fees: [],
	max_fee: '9007199254740994',
	memo_base64: null,
	name: 'CRYPTOTRANSFER',
	nft_transfers: [],
	node: '0.0.3',
	nonce: 0,
	parent_consensus_timestamp: null,
	result: 'SUCCESS',
	scheduled: false,
	staking_reward_transfers: [],
	token_transfers: [],
	transaction_hash: 'transaction-hash',
	transaction_id: '0.0.98-1710000000-000000006',
	transfers: [
		{
			account: '0.0.98',
			amount: '1',
			is_approval: false,
		},
	],
	valid_duration_seconds: '120',
	valid_start_timestamp: '1710000000.000000006',
} satisfies HederaMirrorNodeTransaction

const cryptoAllowanceFixture = {
	amount: '9007199254740993',
	amount_granted: '9007199254740994',
	owner: '0.0.98',
	spender: '0.0.99',
	timestamp: {
		from: '1710000002.000000001',
		to: '1710000003.000000002',
	},
}

const tokenAllowanceFixture = {
	...cryptoAllowanceFixture,
	token_id: '0.0.700',
}

const nftAllowanceFixture = {
	approved_for_all: true,
	owner: '0.0.98',
	payer_account_id: '0.0.97',
	spender: '0.0.99',
	timestamp: {
		from: '1710000004.000000003',
		to: '1710000005.000000004',
	},
	token_id: '0.0.701',
}

const accountTokenFixture = {
	automatic_association: true,
	balance: '9007199254740995',
	created_timestamp: '1710000006.000000005',
	decimals: 8,
	freeze_status: 'UNFROZEN',
	kyc_status: 'GRANTED',
	token_id: '0.0.700',
}

const nftFixture = {
	account_id: '0.0.98',
	created_timestamp: '1710000007.000000006',
	delegating_spender: '0.0.97',
	deleted: false,
	metadata: 'VGhpcyBpcyBhIHRlc3QgTkZU',
	modified_timestamp: '1710000008.000000007',
	serial_number: '9007199254740997',
	spender_id: '0.0.99',
	token_id: '0.0.701',
}

const topicFixture = {
	admin_key: {
		_type: 'ED25519',
		key: 'admin-key',
	},
	auto_renew_account: '0.0.98',
	auto_renew_period: 7_776_000,
	created_timestamp: '1710000000.000000001',
	custom_fees: {
		fixed_fees: [],
	},
	deleted: false,
	fee_exempt_key_list: [],
	fee_schedule_key: null,
	memo: 'topic memo',
	running_hash: 'running-hash',
	sequence_number: '7',
	submit_key: null,
	timestamp: {
		from: '1710000000.000000001',
		to: null,
	},
	topic_id: '0.0.700',
} satisfies HederaMirrorNodeTopic

const topicMessageFixture = {
	chunk_info: {
		number: 1,
		total: 1,
	},
	consensus_timestamp: '1710000001.000000002',
	message: 'bWVzc2FnZQ==',
	payer_account_id: '0.0.98',
	running_hash: 'message-running-hash',
	sequence_number: '7',
	topic_id: '0.0.700',
} satisfies HederaMirrorNodeTopicMessage

const tokenFixture = {
	admin_key: {
		_type: 'ED25519',
		key: 'admin-key',
	},
	auto_renew_account: '0.0.98',
	auto_renew_period: 7_776_000,
	created_timestamp: '1710000000.000000001',
	custom_fees: null,
	decimals: 8,
	deleted: false,
	expiry_timestamp: null,
	fee_schedule_key: null,
	freeze_key: null,
	kyc_key: null,
	max_supply: '9007199254740993',
	modified_timestamp: '1710000002.000000003',
	name: 'Example token',
	pause_key: null,
	pause_status: 'UNPAUSED',
	supply_key: null,
	supply_type: 'FINITE',
	symbol: 'EXAMPLE',
	token_id: '0.0.700',
	total_supply: '9007199254740992',
	treasury_account_id: '0.0.98',
	type: 'NON_FUNGIBLE_UNIQUE',
	wipe_key: null,
} satisfies HederaMirrorNodeToken

const tokenNftFixture = {
	...nftFixture,
	serial_number: '7',
	token_id: '0.0.700',
}

const binding = bindings[Source.HederaMirrorNode_Rest][0]

const network = {
	slug: 'hedera',
}

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('Hedera Mirror Node block query', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('addresses a block selector without losing integer precision at the call site', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(fixture)))

		await expect(getBlock('77')).resolves.toEqual(fixture)
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://mainnet-public.mirrornode.hedera.com/api/v1/blocks/77'
		)
	})

	it('lists newest blocks through the registered proxy binding', async () => {
		const blocks = {
			blocks: [fixture],
			links: {
				next: null,
			},
		} satisfies HederaMirrorNodeBlocks
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(blocks)))

		await expect(getBlocks(16)).resolves.toEqual(blocks)
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://mainnet-public.mirrornode.hedera.com/api/v1/blocks?limit=16&order=desc'
		)
	})

	it('selects the one canonical Hedera mainnet binding', () => {
		expect(binding).toMatchObject({
			endpoints: [{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://mainnet-public.mirrornode.hedera.com',
				corsEnabled: false,
			}],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: [SourceOperationGroup.GenericRead],
			delivery: SourceDelivery.HttpProxy,
			credentials: [],
		})
	})

	it('accepts documented hash selectors and rejects invalid selectors before transport', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(fixture)))

		await getBlock(fixture.hash.slice(2))
		expect(sourceFetch.mock.calls[0][1]).toBe(
			`https://mainnet-public.mirrornode.hedera.com/api/v1/blocks/${fixture.hash.slice(2)}`
		)
		await expect(getBlock('hash/value')).rejects.toThrow('invalid block selector')
		await expect(getBlock(' ')).rejects.toThrow('invalid block selector')
	})
})

describe('Hedera Mirror Node topic lifecycle', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('uses native topic detail, message history, and direct message routes', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify(topicFixture)))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				messages: [topicMessageFixture],
				links: {
					next: '/api/v1/topics/0.0.700/messages?limit=1&order=desc&sequencenumber=lt%3A7',
				},
			} satisfies HederaMirrorNodeTopicMessages)))
			.mockResolvedValueOnce(new Response(JSON.stringify(topicMessageFixture)))

		await expect(getTopic('0.0.700')).resolves.toEqual(topicFixture)
		await expect(getTopicMessages('0.0.700', 1)).resolves.toEqual({
			messages: [topicMessageFixture],
			links: {
				next: '/api/v1/topics/0.0.700/messages?limit=1&order=desc&sequencenumber=lt%3A7',
			},
		})
		await expect(getTopicMessage('0.0.700', 7n)).resolves.toEqual(topicMessageFixture)
		expect(sourceFetch.mock.calls.map(([, url]) => url)).toEqual([
			'https://mainnet-public.mirrornode.hedera.com/api/v1/topics/0.0.700',
			'https://mainnet-public.mirrornode.hedera.com/api/v1/topics/0.0.700/messages?limit=1&order=desc',
			'https://mainnet-public.mirrornode.hedera.com/api/v1/topics/0.0.700/messages/7',
		])
	})

	it('materializes topic observations, message hierarchy, and continuation', async () => {
		const topicResolver = hederaMirrorNode.resolvers.find((candidate) => (
			candidate.entityType === EntityType.HederaTopic
			&& '$$timestamps' in candidate.projections
		))
		const topicMessagesResolver = hederaMirrorNode.resolvers.find((candidate) => (
			candidate.entityType === EntityType.HederaTopic
			&& '$$messages' in candidate.projections
		))
		const topicMessageResolver = hederaMirrorNode.resolvers.find((candidate) => (
			candidate.entityType === EntityType.HederaTopicMessage
			&& 'message' in candidate.projections
		))
		if (
			topicResolver == null
			|| topicMessagesResolver == null
			|| topicMessageResolver == null
		)
			throw new Error('Hedera Mirror Node topic resolvers are missing')

		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify(topicFixture)))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				messages: [topicMessageFixture],
				links: {
					next: '/api/v1/topics/0.0.700/messages?limit=1&order=desc&sequencenumber=lt%3A7',
				},
			} satisfies HederaMirrorNodeTopicMessages)))
			.mockResolvedValueOnce(new Response(JSON.stringify(topicMessageFixture)))

		const topic = {
			$network: network,
			topicId: '0.0.700',
		}
		const resolvedTopic = await topicResolver.resolve.NetworkTopicId?.resolve(topic, context)
		expect(topicResolver.projections.$$timestamps?.(resolvedTopic)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$topic: topic,
					timestampMs: 1_710_000_000_000,
					source: Source.HederaMirrorNode_Rest,
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.HederaTopic_Timestamp, [], 'memo')]: 'topic memo',
					[entityFieldAddressKey(EntityType.HederaTopic_Timestamp, [], 'sequenceNumber')]: 7n,
				}),
			},
		])

		const page = await topicMessagesResolver.resolve.NetworkTopicId?.resolve(topic, {
			...context,
			pagination: {
				limit: 1,
			},
		})
		expect(topicMessagesResolver.projections.$$messages.select(page, topic, context)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$topic: topic,
					sequenceNumber: 7n,
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.HederaTopicMessage, [], 'consensusTimestamp')]: '1710000001.000000002',
					[entityFieldAddressKey(EntityType.HederaTopicMessage, [], 'message')]: 'bWVzc2FnZQ==',
				}),
			},
		])
		expect(topicMessagesResolver.projections.$$messages.continuation(page, topic, {
			...context,
			pagination: {
				limit: 1,
			},
		})).toMatchObject({
			operation: 'topic-messages',
			target: '0.0.700',
			terminal: false,
		})

		await expect(topicMessageResolver.resolve.TopicSequenceNumber?.resolve({
			$topic: topic,
			sequenceNumber: 7n,
		}, context)).resolves.toEqual(expect.objectContaining({
			[entityFieldAddressKey(EntityType.HederaTopicMessage, [], 'payerAccount')]: '0.0.98',
			[entityFieldAddressKey(EntityType.HederaTopicMessage, [], 'message')]: 'bWVzc2FnZQ==',
		}))
	})

	it('rejects substituted topic and message identities before projection', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				...topicFixture,
				topic_id: '0.0.701',
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				...topicMessageFixture,
				sequence_number: '8',
			})))

		await expect(getTopic('0.0.700')).rejects.toThrow('topic response does not match request')
		await expect(getTopicMessage('0.0.700', 7n)).rejects.toThrow('topic message response does not match request')
	})
})

describe('Hedera Mirror Node token and NFT hierarchy', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('uses native token detail, token-owned NFTs, and direct NFT routes', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify(tokenFixture)))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				nfts: [tokenNftFixture],
				links: {
					next: '/api/v1/tokens/0.0.700/nfts?limit=1&order=desc&serialnumber=lt%3A7',
				},
			} satisfies HederaMirrorNodeNfts)))
			.mockResolvedValueOnce(new Response(JSON.stringify(tokenNftFixture)))

		await expect(getToken('0.0.700')).resolves.toEqual(tokenFixture)
		await expect(getTokenNfts('0.0.700', 1)).resolves.toEqual({
			nfts: [tokenNftFixture],
			links: {
				next: '/api/v1/tokens/0.0.700/nfts?limit=1&order=desc&serialnumber=lt%3A7',
			},
		})
		await expect(getTokenNft('0.0.700', 7n)).resolves.toEqual(tokenNftFixture)
		expect(sourceFetch.mock.calls.map(([, url]) => url)).toEqual([
			'https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/0.0.700',
			'https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/0.0.700/nfts?limit=1&order=desc',
			'https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/0.0.700/nfts/7',
		])
	})

	it('materializes token observations, NFT hierarchy, and direct NFT detail', async () => {
		const tokenResolver = hederaMirrorNode.resolvers.find((candidate) => (
			candidate.entityType === EntityType.HederaToken
			&& '$$timestamps' in candidate.projections
		))
		const tokenNftsResolver = hederaMirrorNode.resolvers.find((candidate) => (
			candidate.entityType === EntityType.HederaToken
			&& '$$nfts' in candidate.projections
		))
		const nftResolver = hederaMirrorNode.resolvers.find((candidate) => (
			candidate.entityType === EntityType.HederaNft
			&& 'metadata' in candidate.projections
		))
		if (
			tokenResolver == null
			|| tokenNftsResolver == null
			|| nftResolver == null
		)
			throw new Error('Hedera Mirror Node token resolvers are missing')

		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify(tokenFixture)))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				nfts: [tokenNftFixture],
				links: {
					next: '/api/v1/tokens/0.0.700/nfts?limit=1&order=desc&serialnumber=lt%3A7',
				},
			} satisfies HederaMirrorNodeNfts)))
			.mockResolvedValueOnce(new Response(JSON.stringify(tokenNftFixture)))

		const token = {
			$network: network,
			tokenId: '0.0.700',
		}
		const resolvedToken = await tokenResolver.resolve.NetworkTokenId?.resolve(token, context)
		expect(tokenResolver.projections.$$timestamps?.(resolvedToken)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$token: token,
					timestampMs: 1_710_000_002_000,
					source: Source.HederaMirrorNode_Rest,
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'name')]: 'Example token',
					[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'totalSupply')]: 9_007_199_254_740_992n,
					[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'maxSupply')]: 9_007_199_254_740_993n,
					[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'paused')]: false,
				}),
			},
		])

		const page = await tokenNftsResolver.resolve.NetworkTokenId?.resolve(token, {
			...context,
			pagination: {
				limit: 1,
			},
		})
		expect(tokenNftsResolver.projections.$$nfts.select(page, token, context)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$token: token,
					serialNumber: 7n,
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.HederaNft, [], 'metadata')]: 'VGhpcyBpcyBhIHRlc3QgTkZU',
					[entityFieldAddressKey(EntityType.HederaNft, [], '$$timestamps')]: [
						expect.objectContaining({
							[EntityMetaKey.Fields]: expect.objectContaining({
								[entityFieldAddressKey(EntityType.HederaNft_Timestamp, [], 'ownerAccountId')]: '0.0.98',
							}),
						}),
					],
				}),
			},
		])
		expect(tokenNftsResolver.projections.$$nfts.continuation(page, token, {
			...context,
			pagination: {
				limit: 1,
			},
		})).toMatchObject({
			operation: 'token-nfts',
			target: '0.0.700',
			terminal: false,
		})

		await expect(nftResolver.resolve.TokenSerialNumber?.resolve({
			$token: token,
			serialNumber: 7n,
		}, context)).resolves.toEqual(expect.objectContaining({
			[entityFieldAddressKey(EntityType.HederaNft, [], 'metadata')]: 'VGhpcyBpcyBhIHRlc3QgTkZU',
		}))
	})

	it('materializes typed fixed, fractional, and royalty custom-fee children', async () => {
		const tokenResolver = hederaMirrorNode.resolvers.find((candidate) => (
			candidate.entityType === EntityType.HederaToken
			&& '$$timestamps' in candidate.projections
		))
		const customFeeResolver = hederaMirrorNode.resolvers.find((candidate) => (
			candidate.entityType === EntityType.HederaTokenCustomFee
		))
		if (tokenResolver == null || customFeeResolver == null)
			throw new Error('Hedera Mirror Node custom fee resolvers are missing')

		const customFeeToken = {
			...tokenFixture,
			custom_fees: {
				created_timestamp: '1710000002.000000003',
				fixed_fees: [{
					all_collectors_are_exempt: true,
					amount: '9007199254740993',
					collector_account_id: '0.0.98',
					denominating_token_id: '0.0.701',
				}],
				fractional_fees: [{
					amount: {
						denominator: '29',
						numerator: '12',
					},
					collector_account_id: '0.0.99',
					denominating_token_id: '0.0.700',
					maximum: '120',
					minimum: '30',
					net_of_transfers: true,
				}],
				royalty_fees: [{
					all_collectors_are_exempt: false,
					amount: {
						denominator: '100',
						numerator: '5',
					},
					collector_account_id: '0.0.100',
					fallback_fee: {
						amount: '1',
						denominating_token_id: '0.0.701',
					},
				}],
			},
		} satisfies HederaMirrorNodeToken
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(customFeeToken)))

		const token = {
			$network: network,
			tokenId: '0.0.700',
		}
		const resolvedToken = await tokenResolver.resolve.NetworkTokenId?.resolve(token, context)
		const tokenTimestamp = tokenResolver.projections.$$timestamps?.(resolvedToken)[0]
		if (tokenTimestamp == null)
			throw new Error('Hedera Mirror Node token timestamp is missing')
		const customFees = tokenTimestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], '$$customFees')]
		expect(customFees).toHaveLength(3)
		expect(customFees.map((fee) => fee[EntityMetaKey.Selector].feeIndex)).toEqual([
			0,
			1,
			2,
		])
		expect(customFees[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'feeKind')]: 'fixed',
			[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'amount')]: 9_007_199_254_740_993n,
			[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], '$collector')]: {
				[EntityMetaKey.Selector]: {
					$network: network,
					accountId: '0.0.98',
				},
			},
			[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], '$denominatingToken')]: {
				[EntityMetaKey.Selector]: {
					$network: network,
					tokenId: '0.0.701',
				},
			},
		})
		expect(customFees[1][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'feeKind')]: 'fractional',
			[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'numerator')]: 12n,
			[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'denominator')]: 29n,
			[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'minimumAmount')]: 30n,
			[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'maximumAmount')]: 120n,
			[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'netOfTransfers')]: true,
		})
		expect(customFees[2][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'feeKind')]: 'royalty',
			[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'numerator')]: 5n,
			[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'denominator')]: 100n,
			[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'amount')]: 1n,
			[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'denominatingTokenId')]: '0.0.701',
		})

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(customFeeToken)))
		await expect(customFeeResolver.resolve.TokenTimestampFeeIndex.resolve({
			$tokenTimestamp: tokenTimestamp[EntityMetaKey.Selector],
			feeIndex: 1,
		}, context)).resolves.toMatchObject(customFees[1][EntityMetaKey.Fields])
	})

	it('rejects substituted token and NFT identities before projection', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				...tokenFixture,
				token_id: '0.0.701',
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				...tokenNftFixture,
				serial_number: '8',
			})))

		await expect(getToken('0.0.700')).rejects.toThrow('token response does not match request')
		await expect(getTokenNft('0.0.700', 7n)).rejects.toThrow('token NFT response does not match request')
	})
})

describe('Hedera Mirror Node account query and resolver', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('addresses a canonical account ID through the registered binding', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(accountFixture)))

		await expect(getAccount(accountFixture.account)).resolves.toEqual(accountFixture)
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://mainnet-public.mirrornode.hedera.com/api/v1/accounts/0.0.98?transactions=false'
		)
	})

	it('preserves exact int64 account balances from JSON transport', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(accountFixture).replace(
			'"balance":"9007199254740993"',
			'"balance":9007199254740993'
		)))

		await expect(getAccount(accountFixture.account)).resolves.toMatchObject({
			balance: {
				balance: '9007199254740993',
			},
		})
	})

	it('rejects malformed account selectors before transport', () => {
		expect(() => getAccount('0.0.account')).toThrow('invalid account selector')
		expect(() => getAccount('0.0.1/path')).toThrow('invalid account selector')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('resolves only a matching Hedera mainnet account identity', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(accountFixture)))

		await expect(hederaMirrorNode.resolvers[0].resolve[
			'NetworkAccountId'
		].resolve({
			$network: network,
			accountId: '0.0.98',
		}, context)).resolves.toEqual({
			accountId: '0.0.98',
			$$timestamps: [
				{
					[EntityMetaKey.Selector]: {
						$account: {
							$network: network,
							accountId: '0.0.98',
						},
						timestampMs: 1_710_000_000_123,
						source: Source.HederaMirrorNode_Rest,
					},
					[EntityMetaKey.Fields]: expect.objectContaining({
						[entityFieldAddressKey(EntityType.HederaAccount_Timestamp, [], 'balanceTinybar')]: 9_007_199_254_740_993n,
						[entityFieldAddressKey(EntityType.HederaAccount_Timestamp, [], 'pendingRewardTinybar')]: 25n,
						[entityFieldAddressKey(EntityType.HederaAccount_Timestamp, [], 'evmAddress')]: '0xac384c53f03855fa1b3616052f8ba32c6c2a2fec',
					}),
				},
			],
		})
		expect(Object.keys(hederaMirrorNode.resolvers[0].projections)).toEqual([
			'accountId',
			'$$timestamps',
		])

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			...accountFixture,
			account: '0.0.99',
		} satisfies HederaMirrorNodeAccount)))
		await expect(hederaMirrorNode.resolvers[0].resolve[
			'NetworkAccountId'
		].resolve({
			$network: network,
			accountId: '0.0.98',
		}, context)).rejects.toThrow('response account does not match request')
	})

	it('rejects unsupported networks before account transport', async () => {
		await expect(hederaMirrorNode.resolvers[0].resolve[
			'NetworkAccountId'
		].resolve({
			$network: {
				slug: 'ethereum',
			},
			accountId: '0.0.98',
		}, context)).rejects.toThrow('unsupported network')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('fails closed on malformed account transport leftovers without projecting them', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			...accountFixture,
			ethereum_nonce: -1,
		} satisfies HederaMirrorNodeAccount)))
		await expect(hederaMirrorNode.resolvers[0].resolve[
			'NetworkAccountId'
		].resolve({
			$network: network,
			accountId: '0.0.98',
		}, context)).rejects.toThrow('malformed ethereum nonce')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			...accountFixture,
			balance: {
				...accountFixture.balance,
				tokens: [{
					token_id: 'not-an-id',
					balance: '1',
				}],
			},
		} satisfies HederaMirrorNodeAccount)))
		await expect(hederaMirrorNode.resolvers[0].resolve[
			'NetworkAccountId'
		].resolve({
			$network: network,
			accountId: '0.0.98',
		}, context)).rejects.toThrow('malformed account token balance token ID')
	})
})

describe('Hedera Mirror Node block resolver', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('maps every owned Hedera block field from the typed fixture', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(fixture)))

		await expect(hederaMirrorNode.resolvers[2].resolve[
			'NetworkBlockNumber'
		].resolve({
			$network: network,
			blockNumber: 77n,
		}, context)).resolves.toEqual({
			blockNumber: 77n,
			blockHash: fixture.hash,
			consensusStartTimestamp: '1651560386.060890949',
			consensusEndTimestamp: '1651560386.661997287',
			gasUsed: 300000n,
			recordFileName: '2022-05-03T06_46_26.060890949Z.rcd',
			transactionCount: 3,
		})
		expect(Object.keys(hederaMirrorNode.resolvers[2].projections).sort()).toEqual([
			'blockHash',
			'blockNumber',
			'consensusEndTimestamp',
			'consensusStartTimestamp',
			'gasUsed',
			'recordFileName',
			'transactionCount',
		])
	})

	it('resolves block hashes case-insensitively and rejects mismatched responses', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(fixture)))
		await expect(hederaMirrorNode.resolvers[2].resolve[
			'NetworkBlockHash'
		].resolve({
			$network: network,
			blockHash: fixture.hash.slice(2).toUpperCase(),
		}, context)).resolves.toMatchObject({
			blockHash: fixture.hash,
		})

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			...fixture,
			number: 78,
		})))
		await expect(hederaMirrorNode.resolvers[2].resolve[
			'NetworkBlockNumber'
		].resolve({
			$network: network,
			blockNumber: 77n,
		}, context)).rejects.toThrow('block response does not match request')
	})

	it('rejects unsupported networks before transport', async () => {
		await expect(hederaMirrorNode.resolvers[2].resolve[
			'NetworkBlockNumber'
		].resolve({
			$network: {
				slug: 'ethereum',
			},
			blockNumber: 77n,
		}, context)).rejects.toThrow('unsupported network')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('fails closed on malformed integral wire fields', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			...fixture,
			gas_used: -1,
		})))
		await expect(hederaMirrorNode.resolvers[2].resolve[
			'NetworkBlockNumber'
		].resolve({
			$network: network,
			blockNumber: 77n,
		}, context)).rejects.toThrow('malformed gas used')
	})

	it('fails closed on empty previous_hash leftover without projecting it', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			...fixture,
			previous_hash: '',
		})))
		await expect(hederaMirrorNode.resolvers[2].resolve[
			'NetworkBlockNumber'
		].resolve({
			$network: network,
			blockNumber: 77n,
		}, context)).rejects.toThrow('malformed previous block hash')
	})

	it('fails closed on negative block size leftover', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			...fixture,
			size: -1,
		})))
		await expect(hederaMirrorNode.resolvers[2].resolve[
			'NetworkBlockNumber'
		].resolve({
			$network: network,
			blockNumber: 77n,
		}, context)).rejects.toThrow('malformed block size')
	})

	it('keeps a nullable wire gas total absent from the optional schema field', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			...fixture,
			gas_used: null,
		})))

		await expect(hederaMirrorNode.resolvers[2].resolve[
			'NetworkBlockNumber'
		].resolve({
			$network: network,
			blockNumber: 77n,
		}, context)).resolves.not.toHaveProperty('gasUsed')
	})
})

describe('Hedera Mirror Node account collections', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('addresses paginated account and transaction operations without changing subjects', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				accounts: [accountFixture],
				links: {
					next: null,
				},
			} satisfies HederaMirrorNodeAccounts)))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				transactions: [transactionFixture],
				links: {
					next: null,
				},
			} satisfies HederaMirrorNodeTransactions)))

		await getAccounts(16)
		await getTransactions({
			accountId: '0.0.98',
			limit: 16,
		})
		expect(sourceFetch.mock.calls.map(([, url]) => url)).toEqual([
			'https://mainnet-public.mirrornode.hedera.com/api/v1/accounts?limit=16&order=desc',
			'https://mainnet-public.mirrornode.hedera.com/api/v1/transactions?account.id=0.0.98&limit=16&order=desc',
		])
		expect(() => getTransactions({
			accountId: '0.0.98',
			continuationToken: '/api/v1/transactions?account.id=0.0.99',
			limit: 16,
		})).toThrow('continuation account does not match request')
		expect(() => getAccounts(
			16,
			'https://example.com/api/v1/accounts?limit=16'
		)).toThrow('invalid continuation')
	})

	it('materializes account-scoped transactions with exact integer fields and terminal empties', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				transactions: [transactionFixture],
				links: {
					next: '/api/v1/transactions?account.id=0.0.98&limit=1&timestamp=lt%3A1710000001.000000007',
				},
			} satisfies HederaMirrorNodeTransactions)))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				transactions: [],
				links: {
					next: null,
				},
			} satisfies HederaMirrorNodeTransactions)))

		const hederaAccount = {
			$network: network,
			accountId: '0.0.98',
		}
		const firstPage = await hederaMirrorNode.resolvers[3].resolve[
			'NetworkAccountId'
		].resolve(hederaAccount, {
			...context,
			pagination: {
				limit: 1,
			},
		})
		expect(hederaMirrorNode.resolvers[3].projections.$$transactions.select(
			firstPage,
			hederaAccount,
			context
		)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					consensusTimestamp: transactionFixture.consensus_timestamp,
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.HederaTransaction, [], 'transactionId')]: transactionFixture.transaction_id,
					[entityFieldAddressKey(EntityType.HederaTransaction, [], 'transactionType')]: transactionFixture.name,
					[entityFieldAddressKey(EntityType.HederaTransaction, [], 'chargedTxFeeTinybar')]: 9_007_199_254_740_993n,
				}),
			},
		])
		expect(hederaMirrorNode.resolvers[3].projections.$$transactions.continuation(
			firstPage,
			hederaAccount,
			context
		)).toMatchObject({
			terminal: false,
			target: '0.0.98',
		})

		const emptyPage = await hederaMirrorNode.resolvers[3].resolve[
			'NetworkAccountId'
		].resolve(hederaAccount, context)
		expect(hederaMirrorNode.resolvers[3].projections.$$transactions.select(
			emptyPage,
			hederaAccount,
			context
		)).toEqual([])
		expect(hederaMirrorNode.resolvers[3].projections.$$transactions.continuation(
			emptyPage,
			hederaAccount,
			context
		)).toMatchObject({
			terminal: true,
			target: '0.0.98',
		})
	})

	it('rejects transaction rows that do not belong to the requested account', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			transactions: [
				{
					...transactionFixture,
					transaction_id: '0.0.99-1710000000-000000006',
					transfers: [
						{
							account: '0.0.99',
						},
					],
				},
			],
			links: {
				next: null,
			},
		} satisfies HederaMirrorNodeTransactions)))

		const hederaAccount = {
			$network: network,
			accountId: '0.0.98',
		}
		const page = await hederaMirrorNode.resolvers[3].resolve[
			'NetworkAccountId'
		].resolve(hederaAccount, context)
		expect(() => hederaMirrorNode.resolvers[3].projections.$$transactions.select(
			page,
			hederaAccount,
			context
		)).toThrow('response transaction does not match request')
	})

	it('materializes network accounts and preserves an authoritative empty page', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				accounts: [accountFixture],
				links: {
					next: null,
				},
			} satisfies HederaMirrorNodeAccounts)))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				accounts: [],
				links: {
					next: null,
				},
			} satisfies HederaMirrorNodeAccounts)))

		const hederaNetwork = {
			caip2: networkBySlug.hedera.caip2,
		}
		const accountPage = await hederaMirrorNode.resolvers[4].resolve[
			'Caip2'
		].resolve(hederaNetwork, context)
		expect(hederaMirrorNode.resolvers[4].projections.Hedera.$$accounts.select(
			accountPage,
			hederaNetwork,
			context
		)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: hederaNetwork,
					accountId: '0.0.98',
				},
			},
		])

		const emptyPage = await hederaMirrorNode.resolvers[4].resolve[
			'Caip2'
		].resolve(hederaNetwork, context)
		expect(hederaMirrorNode.resolvers[4].projections.Hedera.$$accounts.select(
			emptyPage,
			hederaNetwork,
			context
		)).toEqual([])
		expect(hederaMirrorNode.resolvers[4].projections.Hedera.$$accounts.continuation(
			emptyPage,
			hederaNetwork,
			context
		)).toMatchObject({
			terminal: true,
			target: 'hedera:mainnet',
		})
	})

	it('rejects a provider continuation that does not advance', () => {
		const token = '/api/v1/transactions?account.id=0.0.98&limit=16&order=desc&timestamp=lt:1710000001.0'
		expect(() => hederaMirrorNode.resolvers[3].projections.$$transactions.continuation(
			{
				transactions: [],
				links: {
					next: token,
				},
			},
			{
				$network: network,
				accountId: '0.0.98',
			},
			{
				...context,
				providerContinuationToken: token,
			}
		)).toThrow('account-transactions continuation did not advance')
	})

	it('rejects non-mainnet subjects before account collection transport', async () => {
		await expect(hederaMirrorNode.resolvers[3].resolve[
			'NetworkAccountId'
		].resolve({
			$network: {
				slug: 'ethereum',
			},
			accountId: '0.0.98',
		}, context)).rejects.toThrow('unsupported network')
		await expect(hederaMirrorNode.resolvers[4].resolve[
			'Caip2'
		].resolve({
			caip2: networkBySlug.ethereum.caip2,
		}, context)).rejects.toThrow('unsupported network')
		expect(sourceFetch).not.toHaveBeenCalled()
	})
})

describe('Hedera Mirror Node account assets and allowances', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('addresses every paginated account endpoint and preserves exact integer wire values', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				allowances: [cryptoAllowanceFixture],
				links: {
					next: null,
				},
			} satisfies HederaMirrorNodeCryptoAllowances).replace(
				'"amount":"9007199254740993"',
				'"amount":9007199254740993'
			)))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				allowances: [tokenAllowanceFixture],
				links: {
					next: null,
				},
			} satisfies HederaMirrorNodeTokenAllowances)))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				allowances: [nftAllowanceFixture],
				links: {
					next: null,
				},
			} satisfies HederaMirrorNodeNftAllowances)))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				tokens: [accountTokenFixture],
				links: {
					next: null,
				},
			} satisfies HederaMirrorNodeAccountTokens)))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				nfts: [nftFixture],
				links: {
					next: null,
				},
			} satisfies HederaMirrorNodeNfts).replace(
				'"serial_number":"9007199254740997"',
				'"serial_number":9007199254740997'
			)))

		await expect(getAccountAllowances('0.0.98', 16)).resolves.toMatchObject({
			allowanceKind: 'crypto',
			page: {
				allowances: [
					expect.objectContaining({
						amount: '9007199254740993',
					}),
				],
			},
		})
		await getAccountAllowances('0.0.98', 16, '/api/v1/accounts/0.0.98/allowances/tokens')
		await getAccountAllowances('0.0.98', 16, '/api/v1/accounts/0.0.98/allowances/nfts')
		await getAccountTokens('0.0.98', 16)
		await expect(getAccountNfts('0.0.98', 16)).resolves.toMatchObject({
			nfts: [
				expect.objectContaining({
					serial_number: '9007199254740997',
				}),
			],
		})

		expect(sourceFetch.mock.calls.map(([, url]) => url)).toEqual([
			'https://mainnet-public.mirrornode.hedera.com/api/v1/accounts/0.0.98/allowances/crypto?limit=16&order=asc',
			'https://mainnet-public.mirrornode.hedera.com/api/v1/accounts/0.0.98/allowances/tokens?limit=16&order=asc',
			'https://mainnet-public.mirrornode.hedera.com/api/v1/accounts/0.0.98/allowances/nfts?limit=16&order=asc&owner=true',
			'https://mainnet-public.mirrornode.hedera.com/api/v1/accounts/0.0.98/tokens?limit=16&order=asc',
			'https://mainnet-public.mirrornode.hedera.com/api/v1/accounts/0.0.98/nfts?limit=16&order=desc',
		])
		expect(() => getAccountTokens(
			'0.0.98',
			16,
			'/api/v1/accounts/0.0.99/tokens?limit=16'
		)).toThrow('invalid continuation')
		await expect(() => getAccountAllowances(
			'0.0.98',
			16,
			'https://example.com/api/v1/accounts/0.0.98/allowances/crypto'
		)).rejects.toThrow('invalid continuation')
		expect(() => getAccountTokens(
			'0.0.98',
			16,
			'/api/v1/accounts/0.0.98/tokens'
		)).toThrow('invalid account collection continuation')
		expect(() => getAccountTokens(
			'0.0.98',
			16,
			'/api/v1/accounts/0.0.98/tokens?limit=16&order=asc&token.id=gt:0.0.700&unexpected=true'
		)).toThrow('invalid account collection continuation')
		expect(() => getAccountNfts(
			'0.0.98',
			16,
			'/api/v1/accounts/0.0.98/nfts?limit=16&order=asc&token.id=lt:0.0.701&serialnumber=lt:10'
		)).toThrow('invalid account collection continuation')
		expect(() => getAccounts(
			16,
			'/api/v1/accounts?limit=16&order=desc&account.id=lt:0.0.98&account.id=lt:0.0.97'
		)).toThrow('invalid account list continuation')
		expect(() => getTransactions({
			accountId: '0.0.98',
			continuationToken: '/api/v1/transactions?account.id=0.0.98&limit=16&order=desc&timestamp=lt:1710000001.0&result=success',
			limit: 16,
		})).toThrow('invalid account transaction continuation')
	})

	it('materializes canonical allowance identities across crypto, token, and NFT pages', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				allowances: [cryptoAllowanceFixture],
				links: {
					next: null,
				},
			} satisfies HederaMirrorNodeCryptoAllowances)))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				allowances: [tokenAllowanceFixture],
				links: {
					next: null,
				},
			} satisfies HederaMirrorNodeTokenAllowances)))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				allowances: [nftAllowanceFixture],
				links: {
					next: null,
				},
			} satisfies HederaMirrorNodeNftAllowances)))

		const hederaAccount = {
			$network: network,
			accountId: '0.0.98',
		}
		const allowanceResolver = hederaMirrorNode.resolvers[5]
		const cryptoPage = await allowanceResolver.resolve[
			'NetworkAccountId'
		].resolve(hederaAccount, context)
		const cryptoRows = allowanceResolver.projections.$$allowances.select(
			cryptoPage,
			hederaAccount,
			context
		)
		expect(cryptoRows).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$owner: hederaAccount,
					$spender: {
						$network: network,
						accountId: '0.0.99',
					},
					allowanceKind: 'crypto',
				},
			}),
		])
		const schemaIndex = indexSchema(schema)
		const fieldDefinition = schemaIndex.entityFieldDefinitionByEntityTypePathAndName[
			EntityType.HederaAccount
		][entityFieldAddressKey(EntityType.HederaAccount, [], '$$allowances')]
		if (fieldDefinition == null)
			throw new Error('Hedera account allowances field definition missing')

		expect(materializeResolverOutput({
			kind: ResolverOutputMaterialization.Field,
			schema,
			schemaIndex,
			entityDefinition: schemaIndex.entityDefinitionByType[EntityType.HederaAccount],
			parentSelector: hederaAccount,
			parentSelectorKey: entitySelectorKey(
				schema,
				schemaIndex.entityDefinitionByType[EntityType.HederaAccount],
				hederaAccount
			),
			source: Source.HederaMirrorNode_Rest,
			fieldDefinition,
			value: cryptoRows,
		})).toHaveLength(1)
		expect(cryptoRows[0][EntityMetaKey.Fields]?.[
			entityFieldAddressKey(EntityType.HederaAllowance, [], '$$timestamps')
		]?.[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.HederaAllowance_Timestamp, [], 'amount')]: 9_007_199_254_740_993n,
		})
		expect(allowanceResolver.projections.$$allowances.continuation(
			cryptoPage,
			hederaAccount,
			context
		)).toMatchObject({
			terminal: false,
			token: '/api/v1/accounts/0.0.98/allowances/tokens',
		})

		const tokenPage = await allowanceResolver.resolve[
			'NetworkAccountId'
		].resolve(hederaAccount, {
			...context,
			providerContinuationToken: '/api/v1/accounts/0.0.98/allowances/tokens',
		})
		expect(allowanceResolver.projections.$$allowances.select(
			tokenPage,
			hederaAccount,
			context
		)[0][EntityMetaKey.Selector]).toMatchObject({
			allowanceKind: 'token',
			tokenId: '0.0.700',
		})

		const nftPage = await allowanceResolver.resolve[
			'NetworkAccountId'
		].resolve(hederaAccount, {
			...context,
			providerContinuationToken: '/api/v1/accounts/0.0.98/allowances/nfts',
		})
		const nftRows = allowanceResolver.projections.$$allowances.select(
			nftPage,
			hederaAccount,
			context
		)
		expect(nftRows[0][EntityMetaKey.Selector]).toMatchObject({
			allowanceKind: 'nft',
			tokenId: '0.0.701',
		})
		expect(nftRows[0][EntityMetaKey.Fields]?.[
			entityFieldAddressKey(EntityType.HederaAllowance, [], '$$timestamps')
		]?.[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.HederaAllowance_Timestamp, [], 'approvedForAll')]: true,
		})
		expect(allowanceResolver.projections.$$allowances.continuation(
			nftPage,
			hederaAccount,
			context
		)).toMatchObject({
			terminal: true,
		})
		const emptyNftPage = {
			...nftPage,
			page: {
				allowances: [],
				links: {
					next: null,
				},
			},
		}
		expect(allowanceResolver.projections.$$allowances.select(
			emptyNftPage,
			hederaAccount,
			context
		)).toEqual([])
		expect(allowanceResolver.projections.$$allowances.continuation(
			emptyNftPage,
			hederaAccount,
			context
		)).toMatchObject({
			terminal: true,
		})
	})

	it('prefetches meaningful token relationship and NFT child fields with authoritative empties', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				tokens: [accountTokenFixture],
				links: {
					next: null,
				},
			} satisfies HederaMirrorNodeAccountTokens)))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				tokens: [],
				links: {
					next: null,
				},
			} satisfies HederaMirrorNodeAccountTokens)))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				nfts: [nftFixture],
				links: {
					next: null,
				},
			} satisfies HederaMirrorNodeNfts)))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				nfts: [],
				links: {
					next: null,
				},
			} satisfies HederaMirrorNodeNfts)))

		const hederaAccount = {
			$network: network,
			accountId: '0.0.98',
		}
		const tokenResolver = hederaMirrorNode.resolvers[6]
		const tokenPage = await tokenResolver.resolve[
			'NetworkAccountId'
		].resolve(hederaAccount, context)
		const tokenRows = tokenResolver.projections.$$tokens.select(
			tokenPage,
			hederaAccount,
			context
		)
		expect(tokenRows[0][EntityMetaKey.Selector]).toEqual({
			$account: hederaAccount,
			$token: {
				$network: network,
				tokenId: '0.0.700',
			},
		})
		expect(tokenRows[0][EntityMetaKey.Fields]?.[
			entityFieldAddressKey(EntityType.HederaTokenAssociation, [], '$$timestamps')
		]?.[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.HederaTokenAssociation_Timestamp, [], 'associationStatus')]: 'automatic',
			[entityFieldAddressKey(EntityType.HederaTokenAssociation_Timestamp, [], 'balance')]: 9_007_199_254_740_995n,
			[entityFieldAddressKey(EntityType.HederaTokenAssociation_Timestamp, [], 'kycStatus')]: 'GRANTED',
			[entityFieldAddressKey(EntityType.HederaTokenAssociation_Timestamp, [], 'freezeStatus')]: 'UNFROZEN',
		})

		const emptyTokenPage = await tokenResolver.resolve[
			'NetworkAccountId'
		].resolve(hederaAccount, context)
		expect(tokenResolver.projections.$$tokens.select(
			emptyTokenPage,
			hederaAccount,
			context
		)).toEqual([])
		expect(tokenResolver.projections.$$tokens.continuation(
			emptyTokenPage,
			hederaAccount,
			context
		)).toMatchObject({
			terminal: true,
		})

		const nftResolver = hederaMirrorNode.resolvers[7]
		const nftPage = await nftResolver.resolve[
			'NetworkAccountId'
		].resolve(hederaAccount, context)
		const nftRows = nftResolver.projections.$$nfts.select(
			nftPage,
			hederaAccount,
			context
		)
		expect(nftRows[0][EntityMetaKey.Selector]).toEqual({
			$token: {
				$network: network,
				tokenId: '0.0.701',
			},
			serialNumber: 9_007_199_254_740_997n,
		})
		expect(nftRows[0][EntityMetaKey.Fields]?.[
			entityFieldAddressKey(EntityType.HederaNft, [], '$$timestamps')
		]?.[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.HederaNft_Timestamp, [], 'ownerAccountId')]: '0.0.98',
			[entityFieldAddressKey(EntityType.HederaNft_Timestamp, [], 'spenderAccountId')]: '0.0.99',
			[entityFieldAddressKey(EntityType.HederaNft_Timestamp, [], 'deleted')]: false,
		})

		const emptyNftPage = await nftResolver.resolve[
			'NetworkAccountId'
		].resolve(hederaAccount, context)
		expect(nftResolver.projections.$$nfts.select(
			emptyNftPage,
			hederaAccount,
			context
		)).toEqual([])
		expect(nftResolver.projections.$$nfts.continuation(
			emptyNftPage,
			hederaAccount,
			context
		)).toMatchObject({
			terminal: true,
		})
	})

	it('rejects non-mainnet and mismatched account-scoped rows', async () => {
		for (const resolver of hederaMirrorNode.resolvers.slice(5, 8))
			await expect(resolver.resolve[
				'NetworkAccountId'
			].resolve({
				$network: {
					slug: 'ethereum',
				},
				accountId: '0.0.98',
			}, context)).rejects.toThrow('unsupported network')
		expect(sourceFetch).not.toHaveBeenCalled()

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			nfts: [
				{
					...nftFixture,
					account_id: '0.0.99',
				},
			],
			links: {
				next: null,
			},
		} satisfies HederaMirrorNodeNfts)))
		const hederaAccount = {
			$network: network,
			accountId: '0.0.98',
		}
		const page = await hederaMirrorNode.resolvers[7].resolve[
			'NetworkAccountId'
		].resolve(hederaAccount, context)
		expect(() => hederaMirrorNode.resolvers[7].projections.$$nfts.select(
			page,
			hederaAccount,
			context
		)).toThrow('response NFT does not match request')
	})
})

describe('Hedera Mirror Node transaction detail', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	const detailedTransaction = {
		...transactionFixture,
		nft_transfers: [{
			is_approval: true,
			receiver_account_id: '0.0.100',
			serial_number: '9007199254740997',
			sender_account_id: '0.0.99',
			token_id: '0.0.701',
		}],
		token_transfers: [{
			account: '0.0.99',
			amount: '9007199254740995',
			is_approval: false,
			token_id: '0.0.700',
		}],
		transfers: [{
			account: '0.0.98',
			amount: '-9007199254740993',
			is_approval: false,
		}],
	} satisfies HederaMirrorNodeTransaction

	const containingBlock = {
		...fixture,
		number: 88,
		timestamp: {
			from: '1710000001.000000000',
			to: '1710000001.000000100',
		},
	} satisfies HederaMirrorNodeBlock

	const contractResultFixture = {
		access_list: null,
		address: '0x0000000000000000000000000000000000000167',
		amount: '9007199254740993',
		block_gas_used: 300000,
		block_hash: containingBlock.hash,
		block_number: 88,
		bloom: '0x00',
		call_result: '0x01',
		chain_id: '0x127',
		contract_id: '0.0.359',
		created_contract_ids: ['0.0.360'],
		error_message: null,
		failed_initcode: null,
		from: '0x0000000000000000000000000000000000000062',
		function_parameters: '0xbb9f02dc',
		gas_consumed: 35000,
		gas_limit: 100000,
		gas_price: '0x4a817c800',
		gas_used: 80000,
		hash: '0xfebbaa29c513d124a6377246ea3506ad917d740c21a88f61a1c55ba338fc2bb1',
		logs: [],
		max_fee_per_gas: '0x5',
		max_priority_fee_per_gas: '0x100',
		nonce: 0,
		r: '0xd693b532a80fed6392b428604171fb32fdbf953728a3a7ecc7d4062b1652c043',
		result: 'SUCCESS',
		s: '0x24e9c602ac800b983b035700a14b23f78a253ab762deab5dc27e3555a750b355',
		state_changes: [],
		status: '0x1',
		timestamp: detailedTransaction.consensus_timestamp,
		to: '0x0000000000000000000000000000000000000167',
		transaction_index: 1,
		type: 2,
		v: 1,
	} satisfies HederaMirrorNodeContractResult

	const scheduleFixture = {
		admin_key: null,
		consensus_timestamp: '1710000000.500000000',
		creator_account_id: '0.0.98',
		deleted: false,
		executed_timestamp: detailedTransaction.consensus_timestamp,
		expiration_time: null,
		memo: 'schedule',
		payer_account_id: '0.0.99',
		schedule_id: '0.0.7000',
		signatures: [{
			consensus_timestamp: '1710000000.600000000',
			public_key_prefix: 'AA==',
			signature: 'Aw==',
			type: 'ED25519',
		}],
		transaction_body: 'Kd6tvu8=',
		wait_for_expiry: false,
	} satisfies HederaMirrorNodeSchedule

	const mockTransactionJoins = ({
		block = containingBlock,
		contractResult,
		schedule,
	}: {
		block?: HederaMirrorNodeBlock | null
		contractResult?: HederaMirrorNodeContractResult | null
		schedule?: HederaMirrorNodeSchedule
	} = {}) => {
		if (schedule != null) {
			sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
				transactions: [{
					...detailedTransaction,
					name: 'SCHEDULECREATE',
					scheduled: false,
					entity_id: schedule.schedule_id,
					consensus_timestamp: schedule.consensus_timestamp,
				}],
			})))
		}
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			blocks: block == null ? [] : [block],
			links: {
				next: null,
			},
		} satisfies HederaMirrorNodeBlocks)))
		if (schedule != null)
			sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(schedule)))
		sourceFetch.mockResolvedValueOnce(
			contractResult == null ?
				new Response(JSON.stringify({
					_status: {
						messages: [{
							message: 'Not found',
						}],
					},
				}), {
					status: 404,
				})
			:
				new Response(JSON.stringify(contractResult))
		)
	}

	const transactionResolver = hederaMirrorNode.resolvers.find((resolver) => (
		resolver.entityType === EntityType.HederaTransaction
	))

	if (transactionResolver == null)
		throw new Error('HederaMirrorNode_Rest spec missing transaction resolver')
	const contractResultResolver = hederaMirrorNode.resolvers.find((resolver) => (
		resolver.entityType === EntityType.HederaContractResult
	))

	if (contractResultResolver == null)
		throw new Error('HederaMirrorNode_Rest spec missing contract result resolver')

	const scheduleResolver = hederaMirrorNode.resolvers.find((resolver) => (
		resolver.entityType === EntityType.HederaSchedule
	))
	const scheduleTimestampResolver = hederaMirrorNode.resolvers.find((resolver) => (
		resolver.entityType === EntityType.HederaSchedule_Timestamp
	))

	if (scheduleResolver == null || scheduleTimestampResolver == null)
		throw new Error('HederaMirrorNode_Rest spec missing schedule lifecycle resolvers')

	it('addresses both official detail forms and materializes lossless transfer children', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				transactions: [detailedTransaction],
				links: {
					next: null,
				},
			} satisfies HederaMirrorNodeTransactions)))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				transactions: [detailedTransaction],
			})))

		await expect(getTransactions({
			consensusTimestamp: detailedTransaction.consensus_timestamp,
		})).resolves.toMatchObject({
			transactions: [{
				consensus_timestamp: detailedTransaction.consensus_timestamp,
			}],
		})
		await expect(getTransactionByIdNonce(
			detailedTransaction.transaction_id,
			detailedTransaction.nonce
		)).resolves.toMatchObject({
			transactions: [{
				transaction_id: detailedTransaction.transaction_id,
			}],
		})
		expect(sourceFetch.mock.calls.map(([, url]) => url)).toEqual([
			'https://mainnet-public.mirrornode.hedera.com/api/v1/transactions?limit=2&order=desc&timestamp=eq%3A1710000001.000000007',
			'https://mainnet-public.mirrornode.hedera.com/api/v1/transactions/0.0.98-1710000000-000000006?nonce=0',
		])

		sourceFetch.mockReset()
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			transactions: [detailedTransaction],
			links: {
				next: null,
			},
		} satisfies HederaMirrorNodeTransactions)))
		mockTransactionJoins()
		const snapshot = await transactionResolver.resolve[
			'NetworkConsensusTimestamp'
		].resolve({
			$network: network,
			consensusTimestamp: detailedTransaction.consensus_timestamp,
		}, context)
		expect(snapshot).toMatchObject({
			transactionId: detailedTransaction.transaction_id,
			chargedTxFeeTinybar: 9_007_199_254_740_993n,
			$$hbarTransfers: [{
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network: network,
						consensusTimestamp: detailedTransaction.consensus_timestamp,
					},
					accountId: '0.0.98',
					transferIndex: 0,
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.HederaHbarTransfer, [], 'amountTinybar')]: -9_007_199_254_740_993n,
				}),
			}],
			$block: {
				[EntityMetaKey.Selector]: {
					$network: network,
					blockNumber: 88n,
				},
			},
			$schedule: undefined,
			$$contractResults: [],
		})
		expect(snapshot.$$tokenTransfers).toHaveLength(3)
		expect(snapshot.$$tokenTransfers.map((transfer) => transfer[EntityMetaKey.Selector])).toEqual([
			expect.objectContaining({
				tokenId: '0.0.700',
				accountId: '0.0.99',
				transferIndex: 0,
			}),
			expect.objectContaining({
				tokenId: '0.0.701',
				accountId: '0.0.99',
				transferIndex: 1,
			}),
			expect.objectContaining({
				tokenId: '0.0.701',
				accountId: '0.0.100',
				transferIndex: 2,
			}),
		])
		expect(Object.keys(transactionResolver.projections).sort()).toEqual([
			'$$contractResults',
			'$$hbarTransfers',
			'$$tokenTransfers',
			'$block',
			'$schedule',
			'chargedTxFeeTinybar',
			'consensusTimestamp',
			'nodeAccountId',
			'nonce',
			'payerAccount',
			'result',
			'scheduled',
			'transactionId',
			'transactionType',
			'validStartTimestamp',
		])
	})

	it('projects enrolled $block / $schedule / $$contractResults via Mirror joins', async () => {
		const scheduledTransaction = {
			...detailedTransaction,
			scheduled: true,
			node: null,
			name: 'CRYPTOTRANSFER',
			entity_id: null,
		} satisfies HederaMirrorNodeTransaction

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			transactions: [scheduledTransaction],
			links: {
				next: null,
			},
		} satisfies HederaMirrorNodeTransactions)))
		mockTransactionJoins({
			contractResult: contractResultFixture,
			schedule: scheduleFixture,
		})

		const snapshot = await transactionResolver.resolve[
			'NetworkConsensusTimestamp'
		].resolve({
			$network: network,
			consensusTimestamp: scheduledTransaction.consensus_timestamp,
		}, context)

		expect(transactionResolver.projections.$block(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				blockNumber: 88n,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.HederaBlock, [], 'blockHash')]: containingBlock.hash,
				[entityFieldAddressKey(EntityType.HederaBlock, [], 'consensusStartTimestamp')]: containingBlock.timestamp.from,
				[entityFieldAddressKey(EntityType.HederaBlock, [], 'consensusEndTimestamp')]: containingBlock.timestamp.to,
				[entityFieldAddressKey(EntityType.HederaBlock, [], 'gasUsed')]: 300000n,
				[entityFieldAddressKey(EntityType.HederaBlock, [], 'recordFileName')]: containingBlock.name,
				[entityFieldAddressKey(EntityType.HederaBlock, [], 'transactionCount')]: 3,
			},
		})
		expect(transactionResolver.projections.$schedule(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				scheduleId: '0.0.7000',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.HederaSchedule, [], 'creatorAccountId')]: '0.0.98',
				[entityFieldAddressKey(EntityType.HederaSchedule, [], 'payerAccountId')]: '0.0.99',
				[entityFieldAddressKey(EntityType.HederaSchedule, [], 'transactionBody')]: 'Kd6tvu8=',
			},
		})
		expect(transactionResolver.projections.$$contractResults(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: network,
					consensusTimestamp: scheduledTransaction.consensus_timestamp,
				},
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.HederaContractResult, [], '$contract')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						contractId: '0.0.359',
					},
				},
				[entityFieldAddressKey(EntityType.HederaContractResult, [], 'contractId')]: '0.0.359',
				[entityFieldAddressKey(EntityType.HederaContractResult, [], 'evmAddress')]: '0x0000000000000000000000000000000000000167',
				[entityFieldAddressKey(EntityType.HederaContractResult, [], 'ethereumHash')]: '0xfebbaa29c513d124a6377246ea3506ad917d740c21a88f61a1c55ba338fc2bb1',
				[entityFieldAddressKey(EntityType.HederaContractResult, [], 'functionParameters')]: '0xbb9f02dc',
				[entityFieldAddressKey(EntityType.HederaContractResult, [], 'gasLimit')]: 100000n,
				[entityFieldAddressKey(EntityType.HederaContractResult, [], 'gasUsed')]: 80000n,
				[entityFieldAddressKey(EntityType.HederaContractResult, [], 'amountTinybar')]: 9_007_199_254_740_993n,
				[entityFieldAddressKey(EntityType.HederaContractResult, [], 'status')]: '0x1',
				[entityFieldAddressKey(EntityType.HederaContractResult, [], 'bloom')]: '0x00',
			},
		}])
		expect(sourceFetch.mock.calls.map(([, url]) => url)).toEqual([
			'https://mainnet-public.mirrornode.hedera.com/api/v1/transactions?limit=2&order=desc&timestamp=eq%3A1710000001.000000007',
			'https://mainnet-public.mirrornode.hedera.com/api/v1/transactions/0.0.98-1710000000-000000006?nonce=0&scheduled=false',
			'https://mainnet-public.mirrornode.hedera.com/api/v1/blocks?limit=1&order=asc&timestamp=gte%3A1710000001.000000007',
			'https://mainnet-public.mirrornode.hedera.com/api/v1/schedules/0.0.7000',
			'https://mainnet-public.mirrornode.hedera.com/api/v1/contracts/results/0.0.98-1710000000-000000006?nonce=0',
		])
	})

	it('resolves a contract result directly through either transaction selector', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(contractResultFixture)))

		const transactionIdResult = await contractResultResolver.resolve.Transaction.resolve({
			$transaction: {
				$network: network,
				transactionId: detailedTransaction.transaction_id,
				nonce: detailedTransaction.nonce,
			},
		})

		expect(contractResultResolver.projections.status(transactionIdResult)).toBe('0x1')
		expect(contractResultResolver.projections.$contract(transactionIdResult)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				contractId: '0.0.359',
			},
		})

		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				transactions: [detailedTransaction],
				links: {
					next: null,
				},
			} satisfies HederaMirrorNodeTransactions)))
			.mockResolvedValueOnce(new Response(JSON.stringify(contractResultFixture)))

		await expect(contractResultResolver.resolve.Transaction.resolve({
			$transaction: {
				$network: network,
				consensusTimestamp: detailedTransaction.consensus_timestamp,
			},
		})).resolves.toEqual(transactionIdResult)
		expect(sourceFetch.mock.calls.map(([, url]) => url)).toEqual([
			'https://mainnet-public.mirrornode.hedera.com/api/v1/contracts/results/0.0.98-1710000000-000000006?nonce=0',
			'https://mainnet-public.mirrornode.hedera.com/api/v1/transactions?limit=2&order=desc&timestamp=eq%3A1710000001.000000007',
			'https://mainnet-public.mirrornode.hedera.com/api/v1/contracts/results/0.0.98-1710000000-000000006?nonce=0',
		])
	})

	it('resolves a schedule into its signer, lifecycle, and execution hierarchy', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(scheduleFixture)))

		const snapshot = await scheduleResolver.resolve.NetworkScheduleId.resolve({
			$network: network,
			scheduleId: scheduleFixture.schedule_id,
		})

		expect(snapshot).toMatchObject({
			scheduleId: scheduleFixture.schedule_id,
			creatorAccountId: scheduleFixture.creator_account_id,
			payerAccountId: scheduleFixture.payer_account_id,
			transactionBody: scheduleFixture.transaction_body,
		})
		expect(scheduleResolver.projections.$$signatures(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$schedule: {
					$network: network,
					scheduleId: scheduleFixture.schedule_id,
				},
				publicKeyPrefix: 'AA==',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.HederaScheduleSignature, [], 'consensusTimestamp')]: '1710000000.600000000',
				[entityFieldAddressKey(EntityType.HederaScheduleSignature, [], 'signature')]: 'Aw==',
			},
		}])
		expect(scheduleResolver.projections.$$timestamps(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$schedule: {
					$network: network,
					scheduleId: scheduleFixture.schedule_id,
				},
				timestampMs: 1710000000500,
				source: Source.HederaMirrorNode_Rest,
			},
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType.HederaSchedule_Timestamp, [], 'signatureCount')]: 1,
				[entityFieldAddressKey(EntityType.HederaSchedule_Timestamp, [], '$executionTransaction')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						consensusTimestamp: detailedTransaction.consensus_timestamp,
					},
				},
			}),
		}])

		expect(sourceFetch.mock.calls.map(([, url]) => url)).toEqual([
			'https://mainnet-public.mirrornode.hedera.com/api/v1/schedules/0.0.7000',
		])
	})

	it('preserves the schedule creation clock and rejects foreign source observations', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(scheduleFixture)))
		await expect(scheduleTimestampResolver.resolve.ScheduleTimestampMsSource.resolve({
			$schedule: {
				$network: network,
				scheduleId: scheduleFixture.schedule_id,
			},
			timestampMs: 1710000000500,
			source: Source.HederaMirrorNode_Rest,
		})).resolves.toMatchObject({
			timestampMs: 1710000000500,
			executedTimestamp: detailedTransaction.consensus_timestamp,
			signatureCount: 1,
		})

		await expect(scheduleTimestampResolver.resolve.ScheduleTimestampMsSource.resolve({
			$schedule: {
				$network: network,
				scheduleId: scheduleFixture.schedule_id,
			},
			timestampMs: 1710000000500,
			source: Source.Lotus_JsonRpc,
		})).rejects.toThrow('unsupported network timestamp source')
		expect(sourceFetch).toHaveBeenCalledTimes(1)
	})

	it('fail-closes unenrolled contract-result leftovers and mismatched Mirror joins', async () => {
		expect(() => getBlockByConsensusTimestamp('not-a-timestamp')).toThrow(
			'invalid block consensus timestamp'
		)
		expect(() => getSchedule('0.0.7000/path')).toThrow('invalid schedule selector')
		await expect(getContractResultByTransactionIdNonce('bad', 0)).rejects.toThrow('invalid transaction ID')
		expect(sourceFetch).not.toHaveBeenCalled()

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			transactions: [detailedTransaction],
			links: {
				next: null,
			},
		} satisfies HederaMirrorNodeTransactions)))
		mockTransactionJoins({
			block: {
				...containingBlock,
				timestamp: {
					from: '1710000002.000000000',
					to: '1710000002.000000100',
				},
			},
		})
		await expect(transactionResolver.resolve[
			'NetworkConsensusTimestamp'
		].resolve({
			$network: network,
			consensusTimestamp: detailedTransaction.consensus_timestamp,
		}, context)).rejects.toThrow('response block does not contain transaction')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			transactions: [detailedTransaction],
			links: {
				next: null,
			},
		} satisfies HederaMirrorNodeTransactions)))
		mockTransactionJoins({
			contractResult: {
				...contractResultFixture,
				call_result: '',
			},
		})
		await expect(transactionResolver.resolve[
			'NetworkConsensusTimestamp'
		].resolve({
			$network: network,
			consensusTimestamp: detailedTransaction.consensus_timestamp,
		}, context)).rejects.toThrow('malformed contract call result')
	})

	it('rejects ambiguous identities, malformed selectors, and unrepresentable children', async () => {
		expect(() => getTransactions({ consensusTimestamp: 'not-a-timestamp' })).toThrow(
			'invalid transaction consensus timestamp'
		)
		expect(() => getTransactionByIdNonce('0.0.98/path', 0)).toThrow(
			'invalid transaction ID'
		)
		expect(sourceFetch).not.toHaveBeenCalled()

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			transactions: [
				detailedTransaction,
				detailedTransaction,
			],
			links: {
				next: null,
			},
		} satisfies HederaMirrorNodeTransactions)))
		await expect(transactionResolver.resolve[
			'NetworkConsensusTimestamp'
		].resolve({
			$network: network,
			consensusTimestamp: detailedTransaction.consensus_timestamp,
		}, context)).rejects.toThrow('transaction response does not match consensus timestamp')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			transactions: [{
				...detailedTransaction,
				transfers: [{
					account: null,
					amount: '1',
					is_approval: false,
				}],
			}],
		})))
		mockTransactionJoins()
		await expect(transactionResolver.resolve[
			'NetworkTransactionIdNonce'
		].resolve({
			$network: network,
			transactionId: detailedTransaction.transaction_id,
			nonce: detailedTransaction.nonce,
		}, context)).rejects.toThrow('HBAR transfer account is missing')
	})
})

describe('Hedera Mirror Node network blocks resolver', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('materializes only mainnet block rows from the list operation', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			blocks: [fixture],
			links: {
				next: null,
			},
		} satisfies HederaMirrorNodeBlocks)))

		await expect(hederaMirrorNode.resolvers[1].resolve[
			'Caip2'
		].resolve({
			caip2: networkBySlug.hedera.caip2,
		}, {
			...context,
			pagination: {
				limit: 16,
			},
		})).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: {
						caip2: networkBySlug.hedera.caip2,
					},
					blockNumber: 77n,
				},
				blockNumber: 77n,
				blockHash: fixture.hash,
				consensusStartTimestamp: fixture.timestamp.from,
				consensusEndTimestamp: fixture.timestamp.to,
				gasUsed: 300000n,
				recordFileName: fixture.name,
				transactionCount: 3,
			},
		])
		expect(Object.keys(hederaMirrorNode.resolvers[1].projections)).toEqual([
			'Hedera',
		])
		expect(Object.keys(hederaMirrorNode.resolvers[1].projections.Hedera)).toEqual([
			'$$blocks',
		])
	})

	it('rejects non-Hedera CAIP-2 subjects before transport', async () => {
		await expect(hederaMirrorNode.resolvers[1].resolve[
			'Caip2'
		].resolve({
			caip2: networkBySlug.ethereum.caip2,
		}, context)).rejects.toThrow('unsupported network')
		expect(sourceFetch).not.toHaveBeenCalled()
	})
})

describe('Hedera Mirror Node node and network observations', () => {
	const nodeFixture = {
		admin_key: null,
		associated_registered_nodes: ['1'],
		decline_reward: false,
		description: 'consensus node',
		file_id: '0.0.102',
		max_stake: '9007199254740995',
		memo: '0.0.3',
		min_stake: '1',
		node_account_id: '0.0.3',
		node_cert_hash: 'hash',
		node_id: '3',
		public_key: 'key',
		reward_rate_start: '2',
		service_endpoints: [{
			domain_name: 'node.example',
			port: 50211,
		}],
		stake: '3',
		stake_not_rewarded: '4',
		stake_rewarded: '5',
		staking_period: {
			from: '1710000000.0',
			to: null,
		},
		timestamp: {
			from: '1710000001.123456789',
			to: null,
		},
	}

	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('materializes HederaNode $$timestamps from getNode', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			nodes: [nodeFixture],
			links: {
				next: null,
			},
		})))

		await expect(hederaMirrorNode.resolvers[9].resolve[
			'NetworkNodeId'
		].resolve({
			$network: network,
			nodeId: 3,
		}, context)).resolves.toEqual({
			nodeId: 3,
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					$node: {
						$network: network,
						nodeId: 3,
					},
					timestampMs: 1710000001123,
					source: Source.HederaMirrorNode_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'nodeAccountId')]: '0.0.3',
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], '$account')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							accountId: '0.0.3',
						},
					},
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'description')]: 'consensus node',
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'fileId')]: '0.0.102',
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'memo')]: '0.0.3',
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'publicKey')]: 'key',
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'nodeCertHash')]: 'hash',
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'serviceEndpoints')]: [{
						domain_name: 'node.example',
						port: 50211,
					}],
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'stakeTinybar')]: 3n,
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'stakeRewardedTinybar')]: 5n,
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'stakeNotRewardedTinybar')]: 4n,
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'minStakeTinybar')]: 1n,
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'maxStakeTinybar')]: 9007199254740995n,
				},
			}],
		})
		expect(Object.keys(hederaMirrorNode.resolvers[9].projections).sort()).toEqual([
			'$$timestamps',
			'nodeId',
		])
	})

	it('rejects malformed node service endpoints before projecting schema fields', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			nodes: [{
				...nodeFixture,
				service_endpoints: [{
					port: 50211,
				}],
			}],
			links: {
				next: null,
			},
		})))

		await expect(hederaMirrorNode.resolvers[9].resolve[
			'NetworkNodeId'
		].resolve({
			$network: network,
			nodeId: 3,
		}, context)).rejects.toThrow('invalid node service endpoints')
	})

	it('maps supply, stake, exchange rate, and fee observations onto schema fields', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				released_supply: '100',
				timestamp: '1710000000.123000000',
				total_supply: '200',
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				max_stake_rewarded: '1',
				max_staking_reward_rate_per_hbar: 2,
				max_total_reward: '3',
				node_reward_fee_fraction: 0.1,
				reserved_staking_rewards: '4',
				reward_balance_threshold: '5',
				stake_total: '6',
				staking_period: {
					from: '1710000000.0',
					to: null,
				},
				staking_period_duration: 1,
				staking_periods_stored: 2,
				staking_reward_fee_fraction: 0.2,
				staking_reward_rate: 3,
				staking_reward_start_threshold: '7',
				unreserved_staking_reward_balance: '8',
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				current_rate: {
					cent_equivalent: 12,
					expiration_time: 1710000001,
					hbar_equivalent: 1,
				},
				next_rate: {
					cent_equivalent: 24,
					expiration_time: 1710000002,
					hbar_equivalent: 2,
				},
				timestamp: '1710000000.0',
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				fees: [{
					transaction_type: 'CryptoTransfer',
					gas: 10,
					fees: {
						base: 1,
						node: 2,
						network: 3,
						service: 4,
						total: 10,
					},
				}],
				timestamp: '1710000000.0',
			})))

		await expect(hederaMirrorNode.resolvers[10].resolve[
			'NetworkTimestampMsSource'
		].resolve({
			$network: network,
			timestampMs: 1710000000123,
			source: Source.HederaMirrorNode_Rest,
		}, context)).resolves.toMatchObject({
			releasedSupplyTinybar: 100n,
			totalSupplyTinybar: 200n,
			timestampMs: 1710000000123,
			source: Source.HederaMirrorNode_Rest,
		})

		await expect(hederaMirrorNode.resolvers[11].resolve[
			'NetworkTimestampMsSource'
		].resolve({
			$network: network,
			timestampMs: 1710000000000,
			source: Source.HederaMirrorNode_Rest,
		}, context)).resolves.toMatchObject({
			stakeTotalTinybar: 6n,
			stakingPeriodsStored: 2,
			timestampMs: 1710000000000,
		})

		await expect(hederaMirrorNode.resolvers[12].resolve[
			'NetworkTimestampMsSource'
		].resolve({
			$network: network,
			timestampMs: 1710000000000,
			source: Source.HederaMirrorNode_Rest,
		}, context)).resolves.toMatchObject({
			currentRateCentEquivalent: 12n,
			nextRateHbarEquivalent: 2n,
		})

		await expect(hederaMirrorNode.resolvers[13].resolve[
			'NetworkTransactionTypeTimestampMsSource'
		].resolve({
			$network: network,
			transactionType: 'CryptoTransfer',
			timestampMs: 1710000000000,
			source: Source.HederaMirrorNode_Rest,
		}, context)).resolves.toMatchObject({
			transactionType: 'CryptoTransfer',
			gasTinybar: 10n,
			totalTinycent: 10n,
		})
	})

	it('hard-fails empty nodes and mismatched observation clocks', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				nodes: [],
				links: {
					next: null,
				},
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				released_supply: '1',
				timestamp: '1710000000.0',
				total_supply: '2',
			})))

		await expect(hederaMirrorNode.resolvers[9].resolve[
			'NetworkNodeId'
		].resolve({
			$network: network,
			nodeId: 3,
		}, context)).rejects.toThrow('node not found')

		await expect(hederaMirrorNode.resolvers[10].resolve[
			'NetworkTimestampMsSource'
		].resolve({
			$network: network,
			timestampMs: 1,
			source: Source.HederaMirrorNode_Rest,
		}, context)).rejects.toThrow('response supply does not match request')
	})
})
