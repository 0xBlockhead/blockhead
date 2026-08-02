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
		sourceGetText.mockResolvedValueOnce(`{"${rowsKey}":[{"${identityKey}":"${identities[0]}","${largeKey}":9007199254740993},{"${identityKey}":"${identities[1]}","${largeKey}":9007199254740995}],"links":{"next":"${continuation}"}}`)

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
			.mockResolvedValueOnce('{"malformed":"provider pass-through"}')

		await expect(getPage(16)).resolves.toEqual({
			[rowsKey]: [],
			links: { next: null },
		})
		await expect(getPage(2, continuation)).resolves.toEqual({
			malformed: 'provider pass-through',
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
})
