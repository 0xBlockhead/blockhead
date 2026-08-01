import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

const getAccount = vi.hoisted(() => vi.fn())
const getLatestBlock = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Mintscan/Rest/queries.ts', () => ({
	getAccount,
	getLatestBlock,
}))

const { default: mintscan } = await import('$/resolvers/Mintscan.ts')
const resolver = mintscan.resolvers[0]
const resolveAccount = (
	'NetworkAddress' in resolver.resolve ?
		resolver.resolve.NetworkAddress.resolve
	:
		undefined
)
if (resolveAccount == null)
	throw new Error('Mintscan Cosmos account resolver is not registered')

const account = {
	$network: {
		slug: 'cosmos',
	},
	address: 'cosmos1account',
} satisfies EntitySelector<typeof schema, EntityType.CosmosAccount>
const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {
		PUBLIC_MINTSCAN_API_KEY: 'configured token',
	},
}

describe('Mintscan Cosmos Hub account resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('registers exactly one Cosmos account resolver', () => {
		expect(mintscan).toMatchObject({
			source: Source.Mintscan,
		})
		expect(mintscan.resolvers).toHaveLength(1)
		expect(resolver.entityType).toBe(EntityType.CosmosAccount)
	})

	it('reads account and block concurrently and preserves lossless account counters', async () => {
		const accountRequest = Promise.withResolvers<{
			account: {
				address: string
				account_number: string
				sequence: string
			}
		}>()
		const blockRequest = Promise.withResolvers<{
			block_id: {
				hash: string
			}
			block: {
				header: {
					height: string
					time: string
					proposer_address: string
				}
				data: {}
			}
		}>()
		getAccount.mockReturnValue(accountRequest.promise)
		getLatestBlock.mockReturnValue(blockRequest.promise)

		const result = resolveAccount(account, context)
		await vi.waitFor(() => {
			expect(getAccount).toHaveBeenCalledWith(context.publicEnv, {
				network: 'cosmos',
				address: account.address,
			})
			expect(getLatestBlock).toHaveBeenCalledWith(context.publicEnv, {
				network: 'cosmos',
			})
		})

		accountRequest.resolve({
			account: {
				address: account.address,
				account_number: '900719925474099312345',
				sequence: '123456789012345678901',
			},
		})
		blockRequest.resolve({
			block_id: {
				hash: 'A'.repeat(64),
			},
			block: {
				header: {
					height: '24681012',
					time: '2026-07-23T04:48:08Z',
					proposer_address: 'proposer',
				},
				data: {},
			},
		})

		await expect(result).resolves.toEqual({
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					$account: account,
					timestampMs: 1_784_782_088_000,
					source: Source.Mintscan,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CosmosAccount_Timestamp, [], '$account')]: {
						[EntityMetaKey.Selector]: account,
					},
					[entityFieldAddressKey(EntityType.CosmosAccount_Timestamp, [], 'accountNumber')]: 900719925474099312345n,
					[entityFieldAddressKey(EntityType.CosmosAccount_Timestamp, [], 'sequence')]: 123456789012345678901n,
				},
			}],
		})
	})

	it('rejects an account response for another subject', async () => {
		getAccount.mockResolvedValue({
			account: {
				address: 'cosmos1foreign',
				account_number: '1',
				sequence: '2',
			},
		})
		getLatestBlock.mockResolvedValue({
			block: {
				header: {
					time: '2026-07-23T04:48:08Z',
				},
			},
		})

		await expect(resolveAccount(account, context)).rejects.toThrow(
			'Mintscan: account response does not match the subject'
		)
	})

	it.each([
		{
			accountNumber: '01',
			sequence: '2',
			time: '2026-07-23T04:48:08Z',
			error: 'Mintscan: invalid account number',
		},
		{
			accountNumber: '1',
			sequence: '2.5',
			time: '2026-07-23T04:48:08Z',
			error: 'Mintscan: invalid account sequence',
		},
		{
			accountNumber: '1',
			sequence: '2',
			time: 'not-a-time',
			error: 'Mintscan: latest block has an invalid timestamp',
		},
	])('rejects malformed source values without lossy coercion', async ({
		accountNumber,
		sequence,
		time,
		error,
	}) => {
		getAccount.mockResolvedValue({
			account: {
				address: account.address,
				account_number: accountNumber,
				sequence,
			},
		})
		getLatestBlock.mockResolvedValue({
			block: {
				header: {
					time,
				},
			},
		})

		await expect(resolveAccount(account, context)).rejects.toThrow(error)
	})

	it('rejects non-Cosmos-Hub selectors before source I/O', async () => {
		await expect(resolveAccount({
			$network: {
				slug: 'osmosis',
			},
			address: 'osmo1account',
		}, context)).rejects.toThrow('Mintscan: unsupported network')
		expect(getAccount).not.toHaveBeenCalled()
		expect(getLatestBlock).not.toHaveBeenCalled()
	})
})
