import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/HederaMirrorNode/bindings.ts'
import {
	SourceDelivery,
	SourceTargetKind,
} from '$/sources/SourceBinding.ts'

const sourceGetText = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetText,
}))

const {
	getBlock,
	getNetworkExchangeRate,
	getNetworkFees,
	getNetworkStake,
	getNetworkSupply,
	getNode,
	getNodes,
	getTransactions,
} = await import('$/sources/HederaMirrorNode/Rest/queries.ts')

const binding = bindings[Source.HederaMirrorNode_Rest][0]

const cases = [
	{
		getPage: (limit: number, continuationToken?: string) => getTransactions({
			continuationToken,
			limit,
		}),
		path: '/api/v1/transactions',
		order: 'desc',
		rowsKey: 'transactions',
		identityKey: 'transaction_id',
		identities: [
			'0.0.800-1750000000-000000001',
			'0.0.801-1750000000-000000002',
		],
		largeKey: 'charged_tx_fee',
		continuation: '/api/v1/transactions?limit=2&order=desc&timestamp=lt:1750000000.000000001',
	},
	{
		getPage: getNodes,
		path: '/api/v1/network/nodes',
		order: 'asc',
		rowsKey: 'nodes',
		identityKey: 'node_account_id',
		identities: [
			'0.0.3',
			'0.0.4',
		],
		largeKey: 'max_stake',
		continuation: '/api/v1/network/nodes?limit=2&order=asc&node.id=gt:4',
	},
] as const

describe('Hedera Mirror network collections', () => {
	beforeEach(() => {
		sourceGetText.mockReset()
	})

	it.each(cases)('preserves $rowsKey identities, large integers, and next links', async ({
		getPage,
		path,
		order,
		rowsKey,
		identityKey,
		identities,
		largeKey,
		continuation,
	}) => {
		sourceGetText.mockResolvedValueOnce(`{"${rowsKey}":[{"${identityKey}":"${identities[0]}","${largeKey}":9007199254740993${rowsKey === 'nodes' ? ',"service_endpoints":[{"domain_name":"node.example","port":50211}]' : ''}},{"${identityKey}":"${identities[1]}","${largeKey}":9007199254740995${rowsKey === 'nodes' ? ',"service_endpoints":[{"ip_address_v4":"192.0.2.1","port":50211}]' : ''}}],"links":{"next":"${continuation}"}}`)

		const page = await getPage(2)
		expect(page).toMatchObject({
			[rowsKey]: [
				{ [identityKey]: identities[0], [largeKey]: '9007199254740993' },
				{ [identityKey]: identities[1], [largeKey]: '9007199254740995' },
			],
			links: { next: continuation },
		})
		expect(sourceGetText).toHaveBeenCalledWith(
			binding,
			`https://mainnet-public.mirrornode.hedera.com${path}?limit=2&order=${order}`
		)
	})

	it('preserves unsafe node identifiers and the complete documented node wire', async () => {
		sourceGetText.mockResolvedValueOnce('{"nodes":[{"admin_key":null,"associated_registered_nodes":[1,9.007199254740993e15],"decline_reward":false,"description":"node","file_id":"0.0.102","max_stake":9.007199254740995e15,"memo":"0.0.3","min_stake":1,"node_account_id":"0.0.3","node_cert_hash":"hash","node_id":9007199254740997.0,"public_key":"key","reward_rate_start":2,"service_endpoints":[{"domain_name":"node.example","port":50211}],"stake":3,"stake_not_rewarded":4,"stake_rewarded":5,"staking_period":{"from":"1.0","to":null},"timestamp":{"from":"2.0","to":null}}],"links":{"next":null}}')

		await expect(getNodes(1)).resolves.toMatchObject({
			nodes: [{
				associated_registered_nodes: [
					'1',
					'9007199254740993',
				],
				max_stake: '9007199254740995',
				node_id: '9007199254740997',
			}],
		})
	})

	it('rejects substituted block number and hash identities', async () => {
		sourceGetText.mockResolvedValueOnce(JSON.stringify({
			number: 8,
			hash: 'aa'.repeat(48),
		}))
		await expect(getBlock('7')).rejects.toThrow('block response does not match request')

		sourceGetText.mockResolvedValueOnce(JSON.stringify({
			number: 7,
			hash: 'bb'.repeat(48),
		}))
		await expect(getBlock('aa'.repeat(48))).rejects.toThrow('block response does not match request')
	})

	it('parses exact node service endpoints while preserving the open node envelope', async () => {
		sourceGetText
			.mockResolvedValueOnce('{"nodes":[{"node_id":"3","node_extension":"provider-owned","service_endpoints":[{"domain_name":"node.example","ip_address_v4":"192.0.2.1","port":50211,"provider_extension":"dropped"}]}],"links":{"next":null}}')
			.mockResolvedValueOnce('{"nodes":[{"node_id":"3"}],"links":{"next":null}}')
			.mockResolvedValueOnce('{"nodes":[{"node_id":"3","service_endpoints":[{"port":50211}]}],"links":{"next":null}}')
			.mockResolvedValueOnce('{"nodes":[{"node_id":"3","service_endpoints":[{"domain_name":"node.example","port":"50211"}]}],"links":{"next":null}}')
			.mockResolvedValueOnce('{"nodes":[{"node_id":"3","service_endpoints":[{"domain_name":"node.example","port":65536}]}],"links":{"next":null}}')

		const page = await getNodes(1)
		expect(page).toMatchObject({
			nodes: [{
				node_extension: 'provider-owned',
				service_endpoints: [{
					domain_name: 'node.example',
					ip_address_v4: '192.0.2.1',
					port: 50211,
				}],
			}],
		})
		expect(page.nodes[0].service_endpoints).toEqual([{
			domain_name: 'node.example',
			ip_address_v4: '192.0.2.1',
			port: 50211,
		}])
		await expect(getNodes(1)).rejects.toThrow('invalid node service endpoints')
		await expect(getNodes(1)).rejects.toThrow('invalid node service endpoints')
		await expect(getNodes(1)).rejects.toThrow('invalid node service endpoints')
		await expect(getNodes(1)).rejects.toThrow('invalid node service endpoints')
	})

	it('preserves integer-valued exponent and fractional transaction fields', async () => {
		sourceGetText.mockResolvedValueOnce('{"transactions":[{"charged_tx_fee":9.007199254740993e15,"max_fee":-9.007199254740995e15,"valid_duration_seconds":1.1e1}],"links":{"next":null}}')

		await expect(getTransactions({ limit: 1 })).resolves.toMatchObject({
			transactions: [{
				charged_tx_fee: '9007199254740993',
				max_fee: '-9007199254740995',
				valid_duration_seconds: '11',
			}],
		})
	})

	it('accepts the documented transaction timestamp continuation grammar', async () => {
		sourceGetText
			.mockResolvedValueOnce('{"transactions":[],"links":{"next":null}}')
			.mockResolvedValueOnce('{"transactions":[],"links":{"next":null}}')

		await expect(getTransactions({
			continuationToken: '/api/v1/transactions?limit=2&order=desc&timestamp=ne:1750000000',
			limit: 2,
		})).resolves.toMatchObject({ transactions: [] })
		await expect(getTransactions({
			continuationToken: '/api/v1/transactions?limit=2&order=desc&timestamp=gte:1750000000&timestamp=lt:1750000001.000000001',
			limit: 2,
		})).resolves.toMatchObject({ transactions: [] })
	})

	it.each(cases)('preserves empty and provider-owned $rowsKey pages', async ({
		getPage,
		rowsKey,
		continuation,
	}) => {
		sourceGetText
			.mockResolvedValueOnce(`{"${rowsKey}":[],"links":{"next":null}}`)
			.mockResolvedValueOnce(`{"${rowsKey}":[],"links":{"next":null},"provider_extension":"pass-through"}`)

		await expect(getPage(16)).resolves.toEqual({
			[rowsKey]: [],
			links: { next: null },
		})
		await expect(getPage(2, continuation)).resolves.toEqual({
			[rowsKey]: [],
			links: { next: null },
			provider_extension: 'pass-through',
		})
		expect(sourceGetText).toHaveBeenLastCalledWith(
			binding,
			`https://mainnet-public.mirrornode.hedera.com${continuation}`
		)
	})

	it('rejects invalid limits and cross-operation continuations', () => {
		expect(() => getTransactions({ limit: 0 })).toThrow('invalid transaction list limit')
		expect(() => getNodes(101)).toThrow('invalid node list limit')
		expect(() => getTransactions({
			continuationToken: '/api/v1/network/nodes?limit=2',
			limit: 2,
		})).toThrow('invalid continuation')
		expect(() => getNodes(2, '/api/v1/transactions?limit=2')).toThrow('invalid continuation')
		expect(() => getTransactions({
			continuationToken: '/api/v1/transactions?account.id=0.0.3',
			limit: 2,
		})).toThrow('invalid global transaction continuation')
		expect(() => getTransactions({
			continuationToken: '/api/v1/transactions?limit=3&order=desc&timestamp=lt:1.0',
			limit: 2,
		})).toThrow('invalid global transaction continuation')
		expect(() => getTransactions({
			continuationToken: '/api/v1/transactions?limit=2&order=asc&timestamp=lt:1.0',
			limit: 2,
		})).toThrow('invalid global transaction continuation')
		expect(() => getTransactions({
			continuationToken: '/api/v1/transactions?limit=2&limit=2&order=desc&timestamp=lt:1.0',
			limit: 2,
		})).toThrow('invalid global transaction continuation')
		expect(() => getTransactions({
			continuationToken: '/api/v1/transactions?limit=2&order=desc&timestamp=drop',
			limit: 2,
		})).toThrow('invalid global transaction continuation')
		expect(() => getNodes(2, '/api/v1/network/nodes?limit=2&order=asc&file.id=0.0.102')).toThrow('invalid node continuation')
		expect(() => getNodes(2, '/api/v1/network/nodes?limit=2&order=asc&node.id=gt:4&node.id=gt:5')).toThrow('invalid node continuation')
		expect(() => getNodes(2, '/api/v1/network/nodes?limit=2&order=asc&node.id=drop')).toThrow('invalid node continuation')
		expect(() => getNodes(2, 'https://example.com/api/v1/network/nodes?limit=2&order=asc')).toThrow('invalid continuation')
		expect(() => getNodes(2, 'https://user@mainnet-public.mirrornode.hedera.com/api/v1/network/nodes?limit=2&order=asc&node.id=gt:4')).toThrow('invalid continuation')
		expect(() => getNodes(2, '/api/v1/network/nodes?limit=2&order=asc&node.id=gt:4#fragment')).toThrow('invalid continuation')
	})

	it('uses the canonical mainnet HTTP proxy binding', () => {
		expect(binding).toMatchObject({
			delivery: SourceDelivery.HttpProxy,
			endpoints: [{
				locator: 'https://mainnet-public.mirrornode.hedera.com',
				corsEnabled: false,
			}],
		})
	})

	it('addresses a single node and hard-fails empty or mismatched pages', async () => {
		sourceGetText
			.mockResolvedValueOnce('{"nodes":[{"node_id":"3","node_account_id":"0.0.3","max_stake":9007199254740993,"service_endpoints":[{"domain_name":"node.example","port":50211}]}],"links":{"next":null}}')
			.mockResolvedValueOnce('{"nodes":[],"links":{"next":null}}')
			.mockResolvedValueOnce('{"nodes":[{"node_id":"4","node_account_id":"0.0.4","service_endpoints":[{"domain_name":"node.example","port":50211}]}],"links":{"next":null}}')

		await expect(getNode(3)).resolves.toMatchObject({
			node_id: '3',
			max_stake: '9007199254740993',
		})
		expect(sourceGetText).toHaveBeenCalledWith(
			binding,
			'https://mainnet-public.mirrornode.hedera.com/api/v1/network/nodes?limit=1&order=asc&node.id=eq%3A3'
		)
		await expect(getNode(3)).rejects.toThrow('node not found')
		await expect(getNode(3)).rejects.toThrow('response node does not match request')
		expect(() => getNode(-1)).toThrow('invalid node selector')
	})

	it('loads network supply, stake, exchange rate, and fees through hard-fail text JSON', async () => {
		sourceGetText
			.mockResolvedValueOnce('{"released_supply":9007199254740993,"timestamp":"1710000000.123456789","total_supply":9007199254740995}')
			.mockResolvedValueOnce('{"max_stake_rewarded":1,"max_staking_reward_rate_per_hbar":2,"max_total_reward":3,"node_reward_fee_fraction":0.1,"reserved_staking_rewards":4,"reward_balance_threshold":5,"stake_total":9007199254740993,"staking_period":{"from":"1.0","to":null},"staking_period_duration":1,"staking_periods_stored":2,"staking_reward_fee_fraction":0.2,"staking_reward_rate":3,"staking_reward_start_threshold":6,"unreserved_staking_reward_balance":7}')
			.mockResolvedValueOnce('{"current_rate":{"cent_equivalent":12,"expiration_time":1710000001,"hbar_equivalent":1},"next_rate":{"cent_equivalent":24,"expiration_time":1710000002,"hbar_equivalent":2},"timestamp":"1710000000.0"}')
			.mockResolvedValueOnce('{"fees":[{"transaction_type":"CryptoTransfer","fees":{"total":1000}}],"timestamp":"1710000000.0"}')
			.mockRejectedValueOnce(new Error('HederaMirrorNode_Rest: HTTP 503 https://mainnet-public.mirrornode.hedera.com/api/v1/network/supply'))

		await expect(getNetworkSupply()).resolves.toEqual({
			released_supply: '9007199254740993',
			timestamp: '1710000000.123456789',
			total_supply: '9007199254740995',
		})
		await expect(getNetworkStake()).resolves.toMatchObject({
			stake_total: '9007199254740993',
			staking_period: {
				from: '1.0',
				to: null,
			},
		})
		await expect(getNetworkExchangeRate()).resolves.toMatchObject({
			current_rate: {
				cent_equivalent: 12,
				hbar_equivalent: 1,
			},
			timestamp: '1710000000.0',
		})
		await expect(getNetworkFees()).resolves.toEqual({
			fees: [{
				transaction_type: 'CryptoTransfer',
				fees: {
					total: 1000,
				},
			}],
			timestamp: '1710000000.0',
		})
		expect(sourceGetText.mock.calls.map(([, url]) => url)).toEqual([
			'https://mainnet-public.mirrornode.hedera.com/api/v1/network/supply',
			'https://mainnet-public.mirrornode.hedera.com/api/v1/network/stake',
			'https://mainnet-public.mirrornode.hedera.com/api/v1/network/exchangerate',
			'https://mainnet-public.mirrornode.hedera.com/api/v1/network/fees',
		])
		await expect(getNetworkSupply()).rejects.toThrow('HTTP 503')
	})
})
