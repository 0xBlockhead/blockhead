import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/Tzkt/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const { getJson } = vi.hoisted(() => ({
	getJson: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: SourceBinding) => binding.endpoints[0]?.locator,
	sourceGetJson: (binding: SourceBinding, url: string) => getJson(url, binding),
}))

const tzktRestBinding = bindings[Source.Tzkt_Rest]

const {
	getBlock,
	listAccountOperations,
} = await import('$/sources/Tzkt/Rest/queries.ts')
const { default: tzktResolvers } = await import('$/resolvers/Tzkt-Rest.ts')

const networkResolver = tzktResolvers.resolvers.find((candidate) => (
	candidate.entityType === EntityType.TezosNetwork
	&& '$network' in candidate.projections
))

if (networkResolver == null)
	throw new Error('TzKT REST spec missing TezosNetwork identity resolver')

const blockResolver = tzktResolvers.resolvers.find((candidate) => (
	candidate.entityType === EntityType.TezosBlock
))

if (blockResolver == null)
	throw new Error('TzKT REST spec missing TezosBlock resolver')

const accountResolverFor = (fieldName: string) => {
	const resolver = tzktResolvers.resolvers.find((candidate) => (
		candidate.entityType === EntityType.TezosAccount
		&& fieldName in candidate.projections
	))
	if (resolver == null)
		throw new Error(`TzKT REST spec missing TezosAccount.${fieldName} resolver`)

	return resolver
}

const account = {
	$network: {
		$network: {
			slug: 'tezos',
		},
	},
	address: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
}
const accountOperation = {
	type: 'transaction',
	id: 91,
	level: 5_000_000,
	timestamp: '2026-07-16T12:34:56Z',
	hash: 'opHash',
	counter: 42,
	sender: {
		address: account.address,
	},
	target: {
		address: 'tz1Recipient',
	},
	status: 'applied',
	parameter: {
		entrypoint: 'transfer',
	},
}
const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 2,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('TzKT Tezos identity contract', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it.each([
		{ slug: 'tezos' },
		{
			caip2: {
				namespace: 'tezos',
				reference: 'NetXdQprcVkpaWU',
			},
		},
	])('accepts canonical mainnet selector $slug$caip2.reference', async ($network) => {
		await expect(networkResolver.resolve['Network'].resolve({
			$network,
		})).resolves.toEqual({
			$network: {
				[EntityMetaKey.Selector]: $network,
			},
		})
	})

	it.each([
		{ slug: 'tezos-ghostnet' },
		{ caip2: { namespace: 'tezos', reference: 'NetXnHfVqm9iesp' } },
		{ caip2: { namespace: 'eip155', reference: 'NetXdQprcVkpaWU' } },
		{ caip2: { namespace: 'tezos', reference: 'mainnet' } },
	])('rejects noncanonical selector $slug$caip2.namespace:$caip2.reference', async ($network) => {
		await expect(networkResolver.resolve['Network'].resolve({
			$network,
		})).rejects.toThrow('Tzkt_Rest: unsupported network')
	})
})

describe('TzKT block transport and resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('selects the exact canonical Tezos mainnet binding', () => {
		expect(tzktRestBinding).toEqual({
			source: Source.Tzkt_Rest,
			target: {
				kind: SourceTargetKind.Caip2Network,
				key: 'tezos:NetXdQprcVkpaWU',
			},
			endpoints: [{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.tzkt.io',
				corsEnabled: false,
			}],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: [
				SourceOperationGroup.GenericRead,
			],
			delivery: SourceDelivery.HttpProxy,
			credentials: [],
		})
	})

	it('parses the typed block endpoint', async () => {
		const globalFetch = vi.spyOn(globalThis, 'fetch')
		getJson.mockResolvedValueOnce({
			level: 5_000_000,
			timestamp: '2026-07-16T12:34:56Z',
			hash: 'BLzyx',
		})

		await expect(getBlock({
			binding: tzktRestBinding,
			level: 5_000_000n,
		})).resolves.toEqual({
			level: 5_000_000,
			timestamp: '2026-07-16T12:34:56Z',
			hash: 'BLzyx',
		})
		expect(getJson).toHaveBeenCalledWith(
			'https://api.tzkt.io/v1/blocks/5000000',
			tzktRestBinding
		)
		expect(globalFetch).not.toHaveBeenCalled()
	})

	it.each([
		{
			level: -1,
			timestamp: '2026-07-16T12:34:56Z',
			hash: 'BLzyx',
		},
		{
			level: 5_000_000.5,
			timestamp: '2026-07-16T12:34:56Z',
			hash: 'BLzyx',
		},
		{
			level: 5_000_000,
			timestamp: 1_752_666_096,
			hash: 'BLzyx',
		},
	])('rejects malformed block wire data', async (wire) => {
		getJson.mockResolvedValueOnce(wire)

		await expect(getBlock({
			binding: tzktRestBinding,
			level: 5_000_000n,
		})).rejects.toThrow()
	})

	it('materializes provider-backed NetworkLevel fields', async () => {
		getJson.mockResolvedValueOnce({
			level: 5_000_000,
			timestamp: '2026-07-16T12:34:56Z',
			hash: 'BLzyx',
		})

		await expect(blockResolver.resolve['NetworkLevel'].resolve({
			$network: {
				$network: {
					slug: 'tezos',
				},
			},
			level: 5_000_000n,
		})).resolves.toEqual({
			$network: {
				[EntityMetaKey.Selector]: {
					$network: {
						slug: 'tezos',
					},
				},
			},
			level: 5_000_000n,
			hash: 'BLzyx',
			timestampMs: Date.parse('2026-07-16T12:34:56Z'),
		})
	})

	it('rejects a non-Tezos parent before transport', async () => {
		await expect(blockResolver.resolve['NetworkLevel'].resolve({
			$network: {
				$network: {
					slug: 'ethereum',
				},
			},
			level: 5_000_000n,
		})).rejects.toThrow('unsupported network')
		expect(getJson).not.toHaveBeenCalled()
	})

	it.each([
		-1n,
		BigInt(Number.MAX_SAFE_INTEGER) + 1n,
	])('rejects unsupported level %s before transport', async (level) => {
		await expect(blockResolver.resolve['NetworkLevel'].resolve({
			$network: {
				$network: {
					slug: 'tezos',
				},
			},
			level,
		})).rejects.toThrow('unsupported block level')
		expect(getJson).not.toHaveBeenCalled()
	})

	it.each([
		{
			level: 4_999_999,
			timestamp: '2026-07-16T12:34:56Z',
			hash: 'BLzyx',
			error: 'does not match',
		},
		{
			level: 5_000_000,
			timestamp: 'not-a-timestamp',
			hash: 'BLzyx',
			error: 'invalid timestamp',
		},
		{
			level: 5_000_000,
			timestamp: '2026-07-16T12:34:56Z',
			hash: '   ',
			error: 'empty hash',
		},
	])('rejects inconsistent provider block data', async ({
		error,
		...wire
	}) => {
		getJson.mockResolvedValueOnce(wire)

		await expect(blockResolver.resolve['NetworkLevel'].resolve({
			$network: {
				$network: {
					slug: 'tezos',
				},
			},
			level: 5_000_000n,
		})).rejects.toThrow(error)
	})
})

describe('TzKT account state and activity', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('projects exact indexed account state with lossless values', async () => {
		getJson.mockResolvedValueOnce({
			address: account.address,
			type: 'user',
			balance: 9_007_199_254_740_991,
			counter: 42,
			delegate: {
				address: 'tz1Delegate',
			},
			revealed: true,
			publicKey: 'edpkPublicKey',
			firstLevel: 1,
			lastLevel: 5_000_000,
			firstActivity: '2018-06-30T17:39:57Z',
			lastActivity: '2026-07-16T12:34:56Z',
		})
		const resolver = accountResolverFor('accountKind')
		const snapshot = await resolver.resolve['NetworkAddress'].resolve(account, context)

		expect(resolver.projections.accountKind(snapshot)).toBe('user')
		expect(resolver.projections.$$timestamps(snapshot)).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$account: account,
					level: 5_000_000n,
					source: 'Tzkt_Rest',
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.TezosAccount_Timestamp, [], 'balanceMutez')]: 9_007_199_254_740_991n,
					[entityFieldAddressKey(EntityType.TezosAccount_Timestamp, [], 'counter')]: 42n,
				}),
			}),
		])
		expect(getJson.mock.calls[0][0]).toContain(`/v1/accounts/${account.address}`)
		expect(getJson.mock.calls.every(([, binding]) => binding === tzktRestBinding)).toBe(true)
	})

	it('bounds indexed account operations and rejects foreign rows', async () => {
		getJson.mockResolvedValueOnce([{
			type: 'transaction',
			id: 91,
			level: 5_000_000,
			timestamp: '2026-07-16T12:34:56Z',
			hash: 'opHash',
			sender: {
				address: account.address,
			},
			target: {
				address: 'tz1Recipient',
			},
		}])
		await expect(listAccountOperations({
			binding: tzktRestBinding,
			address: account.address,
			offset: 2,
			limit: 2,
		})).resolves.toHaveLength(1)
		expect(getJson.mock.calls[0][0]).toContain(
			`/v1/accounts/${account.address}/operations?offset=2&limit=2`
		)

		getJson.mockResolvedValueOnce([{
			type: 'transaction',
			id: 92,
			level: 5_000_000,
			timestamp: '2026-07-16T12:34:56Z',
			hash: 'opHash2',
			sender: {
				address: 'tz1Foreign',
			},
		}])
		await expect(listAccountOperations({
			binding: tzktRestBinding,
			address: account.address,
			offset: 0,
			limit: 2,
		})).rejects.toThrow('foreign row')
	})

	it('preserves account order while deriving canonical operation-group content indexes', async () => {
		getJson
			.mockResolvedValueOnce([
				accountOperation,
				{
					...accountOperation,
					type: 'delegation',
					id: 90,
					counter: 41,
					parameter: undefined,
				},
			])
			.mockResolvedValueOnce([
				{
					...accountOperation,
					type: 'delegation',
					id: 90,
					counter: 41,
					parameter: undefined,
				},
				accountOperation,
			])
		const resolver = accountResolverFor('$$operations')
		const page = await resolver.resolve['NetworkAddress'].resolve(account, context)
		const projection = resolver.projections.$$operations

		expect(projection.select(page, account, context)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$operationGroup: {
						$network: account.$network,
						operationHash: 'opHash',
					},
					contentIndex: 1,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.TezosOperation, [], 'operationKind')]: 'transaction:transfer',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$operationGroup: {
						$network: account.$network,
						operationHash: 'opHash',
					},
					contentIndex: 0,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.TezosOperation, [], 'operationKind')]: 'delegation',
				},
			},
		])
		expect(projection.continuation(page, account, context)).toEqual({
			operation: 'account-operations',
			target: account.address,
			terminal: false,
			token: '2',
		})
		expect(getJson.mock.calls.map(([url]) => url)).toEqual([
			expect.stringContaining(`/v1/accounts/${account.address}/operations?offset=0&limit=2`),
			expect.stringContaining('/v1/operations/opHash'),
		])
		expect(getJson.mock.calls.every(([, binding]) => binding === tzktRestBinding)).toBe(true)
	})

	it('fails closed when account and operation-group identities disagree', async () => {
		const resolver = accountResolverFor('$$operations')
		for (const operationGroup of [
			[{
				...accountOperation,
				hash: 'opOther',
			}],
			[
				accountOperation,
				accountOperation,
			],
			[{
				...accountOperation,
				id: 92,
			}],
			[{
				...accountOperation,
				target: {
					address: 'tz1Changed',
				},
			}],
		]) {
			getJson
				.mockResolvedValueOnce([accountOperation])
				.mockResolvedValueOnce(operationGroup)

			await expect(resolver.resolve['NetworkAddress'].resolve(
				account,
				context
			)).rejects.toThrow()
		}
	})

	it('returns a terminal empty operations page and rejects invalid subjects before transport', async () => {
		getJson.mockResolvedValueOnce([])
		const resolver = accountResolverFor('$$operations')
		const page = await resolver.resolve['NetworkAddress'].resolve(account, context)

		expect(resolver.projections.$$operations.select(page, account, context)).toEqual([])
		expect(resolver.projections.$$operations.continuation(page, account, context)).toEqual({
			operation: 'account-operations',
			target: account.address,
			terminal: true,
		})

		vi.clearAllMocks()
		await expect(resolver.resolve['NetworkAddress'].resolve({
			...account,
			$network: {
				$network: {
					slug: 'ethereum',
				},
			},
		}, context)).rejects.toThrow('unsupported network')
		expect(getJson).not.toHaveBeenCalled()
	})

	it('paginates exact token balances and preserves atomic values', async () => {
		getJson.mockResolvedValueOnce([{
			id: 1,
			account: {
				address: account.address,
			},
			token: {
				id: 10,
				contract: {
					address: 'KT1Token',
				},
				tokenId: '9007199254740993',
				standard: 'fa2',
			},
			balance: '123456789012345678901234',
			firstLevel: 4_000_000,
			lastLevel: 5_000_000,
			transfersCount: 7,
		}])
		const resolver = accountResolverFor('$$tokenBalanceTimestamps')
		const page = await resolver.resolve['NetworkAddress'].resolve(account, context)
		const projection = resolver.projections.$$tokenBalanceTimestamps

		expect(projection.select(page, account, context)).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: expect.objectContaining({
					$account: account,
					level: 5_000_000n,
					source: 'Tzkt_Rest',
				}),
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.TezosTokenBalance_Timestamp, [], 'balance')]: 123_456_789_012_345_678_901_234n,
					[entityFieldAddressKey(EntityType.TezosTokenBalance_Timestamp, [], 'tokenId')]: 9_007_199_254_740_993n,
				}),
			}),
		])
		expect(projection.continuation(page, account, context).terminal).toBe(true)
		expect(getJson.mock.calls[0][0]).toContain(`account=${account.address}&offset=0&limit=2`)
		expect(getJson.mock.calls[0][1]).toBe(tzktRestBinding)
	})

	it('paginates exact inbound and outbound token transfers', async () => {
		getJson.mockResolvedValueOnce([
			{
				id: 91,
				level: 5_000_000,
				timestamp: '2026-07-16T12:34:56Z',
				token: {
					id: 10,
					contract: {
						address: 'KT1Token',
					},
					tokenId: '0',
					standard: 'fa2',
				},
				from: {
					address: account.address,
				},
				to: {
					address: 'tz1Recipient',
				},
				amount: '9007199254740993',
				transactionId: 123,
			},
			{
				id: 90,
				level: 4_999_999,
				timestamp: '2026-07-16T12:30:00Z',
				token: {
					id: 10,
					contract: {
						address: 'KT1Token',
					},
					tokenId: '0',
				},
				from: {
					address: 'tz1Sender',
				},
				to: {
					address: account.address,
				},
				amount: '1',
			},
		])
		const resolver = accountResolverFor('$$tokenTransfers')
		const page = await resolver.resolve['NetworkAddress'].resolve(account, context)
		const projection = resolver.projections.$$tokenTransfers

		expect(projection.select(page, account, context)).toHaveLength(2)
		expect(projection.continuation(page, account, context)).toEqual({
			operation: 'account-token-transfers',
			target: account.address,
			terminal: false,
			token: '2',
		})
		expect(getJson.mock.calls[0][0]).toContain(`anyof.from.to=${account.address}`)
		expect(getJson.mock.calls[0][1]).toBe(tzktRestBinding)
	})

	it('rejects foreign rows, duplicates, malformed amounts, and invalid continuations', async () => {
		const resolver = accountResolverFor('$$tokenTransfers')
		for (const transfers of [
			[{
				id: 1,
				level: 1,
				timestamp: '2026-07-16T12:34:56Z',
				token: {
					id: 1,
					contract: { address: 'KT1Token' },
					tokenId: '0',
				},
				from: { address: 'tz1Foreign' },
				to: { address: 'tz1Other' },
				amount: '1',
			}],
			[{
				id: 1,
				level: 1,
				timestamp: '2026-07-16T12:34:56Z',
				token: {
					id: 1,
					contract: { address: 'KT1Token' },
					tokenId: '0',
				},
				from: { address: account.address },
				amount: '-1',
			}],
		]) {
			getJson.mockResolvedValueOnce(transfers)
			await expect(resolver.resolve['NetworkAddress'].resolve(
				account,
				context
			)).rejects.toThrow()
		}

		await expect(resolver.resolve['NetworkAddress'].resolve(account, {
			...context,
			providerContinuationToken: '01',
		})).rejects.toThrow('invalid account continuation')
	})
})
