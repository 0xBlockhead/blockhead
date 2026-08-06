import { describe, expect, it, vi } from 'vitest'

import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { EnsSubgraphDomain } from '$/sources/TheGraph/Graphql/Ens/types.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/TheGraph/bindings.ts'


const getName = vi.fn()
const getDomainsByOwner = vi.fn()
const getDomainsByResolvedAddress = vi.fn()
const getDomainsContaining = vi.fn()
const getEnsSubgraphReachability = vi.fn()

vi.mock('@tevm/voltaire/Ens', () => ({
	normalize: (name: string) => name,
	toString: (name: string) => name,
}))

vi.mock('$/sources/TheGraph/Graphql/Ens/queries.ts', () => ({
	getName,
	getDomainsByOwner,
	getDomainsByResolvedAddress,
	getDomainsContaining,
	getEnsSubgraphReachability,
}))

const { default: ensTheGraphResolvers } = await import('$/resolvers/Ens-TheGraph.ts')

const ensNameResolver = ensTheGraphResolvers.resolvers.find((
	resolver
) => resolver.entityType === EntityType.EnsName)

const globalEnsNetworkTimestampResolver = ensTheGraphResolvers.resolvers.find((
	resolver
): resolver is Extract<
	typeof ensTheGraphResolvers.resolvers[number],
	{ entityType: EntityType._GlobalEnsNetwork_Timestamp }
> => resolver.entityType === EntityType._GlobalEnsNetwork_Timestamp)

if (globalEnsNetworkTimestampResolver == null)
	throw new Error('Ens-TheGraph spec missing _GlobalEnsNetwork_Timestamp resolver')

const ensNamesOwnedResolver = ensTheGraphResolvers.resolvers.find((
	resolver
	): resolver is Extract<
		typeof ensTheGraphResolvers.resolvers[number],
		{ entityType: EntityType.EvmAccount }
	> => (
		resolver.entityType === EntityType.EvmAccount
	))

if (ensNameResolver == null)
	throw new Error('Ens-TheGraph spec missing EnsName resolver')

const ensNameTimestampResolver = ensTheGraphResolvers.resolvers.find((
	resolver
): resolver is Extract<
	typeof ensTheGraphResolvers.resolvers[number],
	{ entityType: EntityType.EnsName_Timestamp }
> => resolver.entityType === EntityType.EnsName_Timestamp)

if (ensNameTimestampResolver == null)
	throw new Error('Ens-TheGraph spec missing EnsName_Timestamp resolver')

if (ensNamesOwnedResolver == null)
	throw new Error('Ens-TheGraph spec missing EvmAccount $$ensNamesOwned resolver')

const ensRecordResolver = ensTheGraphResolvers.resolvers.find((
	resolver
	): resolver is Extract<
		typeof ensTheGraphResolvers.resolvers[number],
		{ entityType: EntityType.EnsRecord }
	> => (
		resolver.entityType === EntityType.EnsRecord
	))

if (ensRecordResolver == null)
	throw new Error('Ens-TheGraph spec missing EnsRecord resolver')

const ensNameSearchResolver = ensTheGraphResolvers.resolvers.find((
	resolver
): resolver is Extract<
	typeof ensTheGraphResolvers.resolvers[number],
	{ entityType: EntityType.BlockheadEnsNameSearch }
> => (
	resolver.entityType === EntityType.BlockheadEnsNameSearch
))

if (ensNameSearchResolver == null)
	throw new Error('Ens-TheGraph spec missing BlockheadEnsNameSearch $$matchingNames resolver')

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const vitalikDomainWire = {
	id: '0x1234567890123456789012345678901234567890',
	name: 'vitalik.eth',
	labelName: 'vitalik',
	labelhash: '0xlabel',
	parent: {
		id: '0xparent',
		name: 'eth',
	},
	subdomains: [
		{
			id: '0xsub',
			name: 'sub.vitalik.eth',
		},
	],
	resolvedAddress: {
		id: '0xD8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
	},
	owner: {
		id: '0x000000000000000000000000000000000000dead',
	},
	registrant: null,
	wrappedOwner: null,
	wrappedDomain: null,
	registration: null,
	resolver: {
		id: '0xresolver',
		address: '0x0000000000000000000000000000000000000001',
		addr: null,
		contentHash: '0xcontent',
		texts: ['url'],
		coinTypes: ['60'],
	},
	ttl: '300',
	isMigrated: true,
	createdAt: '1700000000',
	expiryDate: '1800000000',
	subdomainCount: 1,
} satisfies EnsSubgraphDomain

describe('Ens-TheGraph entity resolver', () => {
	it('maps gql EnsDomain wire into schema fields without runtime typeof guards', async () => {
		expect(ensNameResolver).toBeDefined()
		vi.spyOn(Date, 'now').mockReturnValue(1_800_000_000_000)
		getName.mockResolvedValueOnce([vitalikDomainWire])

		const resolvedEntity = await ensNameResolver.resolve['NormalizedName'].resolve(
			{ name: 'vitalik.eth' },
			resolverContext
		)

		expect(resolvedEntity).toMatchObject({
			name: 'vitalik.eth',
			normalizedName: 'vitalik.eth',
			node: '0x1234567890123456789012345678901234567890',
			labelName: 'vitalik',
			$parent: {
				[EntityMetaKey.Selector]: {
					name: 'eth',
				},
			},
			$$subdomains: [
				{
					[EntityMetaKey.Selector]: {
						name: 'sub.vitalik.eth',
					},
				},
			],
			$resolverContract: {
				[EntityMetaKey.Selector]: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					address: '0x0000000000000000000000000000000000000001',
				},
			},
			$subgraphResolvedActor: {
				[EntityMetaKey.Selector]: {
					address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
				},
			},
			$ownerActor: {
				[EntityMetaKey.Selector]: {
					address: '0x000000000000000000000000000000000000dead',
				},
			},
			resolverTextKeys: ['url'],
			resolverCoinTypes: ['60'],
			$$records: [
				{
					[EntityMetaKey.Selector]: {
						$name: {
							name: 'vitalik.eth',
						},
						recordKey: 'text:url',
					},
				},
				{
					[EntityMetaKey.Selector]: {
						$name: {
							name: 'vitalik.eth',
						},
						recordKey: 'coin:60',
					},
				},
			],
			$$timestamps: [
				{
					[EntityMetaKey.Selector]: {
						$name: {
							name: 'vitalik.eth',
						},
						timestampMs: 1_800_000_000_000,
						source: Source.TheGraph_Graphql,
					},
				},
			],
			subdomainCount: 1,
		})
		expect(ensNameResolver.projections.$$subdomains.resolveCount(resolvedEntity)).toBe(1)
		expect(ensNameResolver.projections.$$records.resolveCount(resolvedEntity)).toBe(2)
		expect(ensNameResolver.projections.$$timestamps.resolveCount(resolvedEntity)).toBe(1)
	})

	it('omits invalid subgraph account references', async () => {
		getName.mockResolvedValueOnce([{
			...vitalikDomainWire,
			resolvedAddress: {
				id: 'not-an-address',
			},
			owner: null,
		}])

		const resolvedEntity = await ensNameResolver.resolve['NormalizedName'].resolve(
			{ name: 'vitalik.eth' },
			resolverContext
		)

		expect(resolvedEntity).toMatchObject({
			name: 'vitalik.eth',
			normalizedName: 'vitalik.eth',
		})
	})
})

describe('Ens-TheGraph global observation resolver', () => {
	it('materializes a reachable observation from the typed subgraph operation', async () => {
		getEnsSubgraphReachability.mockResolvedValueOnce(true)

		await expect(
			globalEnsNetworkTimestampResolver.resolve[
				'HubTimestampMsSource'
			].resolve(
				{
					$hub: {
						scope: '_GlobalEnsNetwork',
					},
					timestampMs: 1_700_000_000_000,
					source: Source.TheGraph_Graphql,
				},
				resolverContext
			)
		).resolves.toEqual({
			$hub: {
				[EntityMetaKey.Selector]: {
					scope: '_GlobalEnsNetwork',
				},
			},
			timestampMs: 1_700_000_000_000,
			source: Source.TheGraph_Graphql,
			reachable: true,
		})
	})

	it('records an unreachable observation when the provider operation fails', async () => {
		getEnsSubgraphReachability.mockRejectedValueOnce(new Error('provider unavailable'))

		await expect(
			globalEnsNetworkTimestampResolver.resolve[
				'HubTimestampMsSource'
			].resolve(
				{
					$hub: {
						scope: '_GlobalEnsNetwork',
					},
					timestampMs: 1_700_000_000_000,
					source: Source.TheGraph_Graphql,
				},
				resolverContext
			)
		).resolves.toMatchObject({
			reachable: false,
		})
	})

	it('rejects foreign source selectors before provider access', async () => {
		vi.clearAllMocks()

		await expect(
			globalEnsNetworkTimestampResolver.resolve[
				'HubTimestampMsSource'
			].resolve(
				{
					$hub: {
						scope: '_GlobalEnsNetwork',
					},
					timestampMs: 1_700_000_000_000,
					source: Source.Voltaire_JsonRpc,
				},
				resolverContext
			)
		).rejects.toThrow('source mismatch')

		expect(getEnsSubgraphReachability).not.toHaveBeenCalled()
	})
})

describe('Ens-TheGraph ENS name observation resolver', () => {
	it('materializes source-backed observation fields under the requested selector identity', async () => {
		getName.mockResolvedValueOnce([vitalikDomainWire])

		await expect(
			ensNameTimestampResolver.resolve[
				'NameTimestampMsSource'
			].resolve(
				{
					$name: {
						name: 'vitalik.eth',
					},
					timestampMs: 1_700_000_000_000,
					source: Source.TheGraph_Graphql,
				},
				resolverContext
			)
		).resolves.toMatchObject({
			$name: {
				[EntityMetaKey.Selector]: {
					name: 'vitalik.eth',
				},
			},
			timestampMs: 1_700_000_000_000,
			source: Source.TheGraph_Graphql,
			$resolvedActor: {
				[EntityMetaKey.Selector]: {
					address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
				},
			},
			$ownerActor: {
				[EntityMetaKey.Selector]: {
					address: '0x000000000000000000000000000000000000dead',
				},
			},
			subdomainCount: 1,
			resolverTextKeys: ['url'],
			resolverCoinTypes: ['60'],
			ttl: 300n,
			isMigrated: true,
		})
	})

	it('rejects selectors owned by another source before querying the subgraph', async () => {
		vi.clearAllMocks()

		await expect(
			ensNameTimestampResolver.resolve[
				'NameTimestampMsSource'
			].resolve(
				{
					$name: {
						name: 'vitalik.eth',
					},
					timestampMs: 1_700_000_000_000,
					source: Source.Voltaire_JsonRpc,
				},
				resolverContext
			)
		).rejects.toThrow('selector source mismatch')
		expect(getName).not.toHaveBeenCalled()
	})
})

describe('Ens-TheGraph EnsRecord resolver', () => {
	it('derives text and coin record display fields from record keys', () => {
		expect(
			ensRecordResolver.resolve['NameRecordKey'].resolve(
				{
					$name: {
						name: 'vitalik.eth',
					},
					recordKey: 'text:url',
				},
				resolverContext
			)
		).toEqual({
			recordKey: 'text:url',
			recordKind: 'text',
		})
		expect(
			ensRecordResolver.resolve['NameRecordKey'].resolve(
				{
					$name: {
						name: 'vitalik.eth',
					},
					recordKey: 'coin:60',
				},
				resolverContext
			)
		).toEqual({
			recordKey: 'coin:60',
			recordKind: 'coin',
			coinType: 60,
		})
	})
})

describe('Ens-TheGraph EvmAccount identity field resolver', () => {
	it('projects owned names with resolveCount and prefers an owned resolved primary name', async () => {
		expect(ensNamesOwnedResolver).toBeDefined()
		getDomainsByOwner.mockResolvedValueOnce([
			{
				...vitalikDomainWire,
				name: 'owned.eth',
			},
			{
				...vitalikDomainWire,
				name: '',
			},
		])
		getDomainsByResolvedAddress.mockResolvedValueOnce([
			{
				...vitalikDomainWire,
				name: 'forward-only.eth',
			},
			{
				...vitalikDomainWire,
				name: 'owned.eth',
			},
		])

		const snapshot = await ensNamesOwnedResolver.resolve['AddressInteropAddress'].resolve(
			{
				address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
				interopAddress: 'eip155:1:0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
			},
			resolverContext
		)

		expect(getDomainsByOwner).toHaveBeenCalledWith({
			publicEnv: {},
			owner: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
		})
		expect(getDomainsByResolvedAddress).toHaveBeenCalledWith({
			publicEnv: {},
			resolvedAddress: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
		})
		expect(snapshot).toEqual({
			ensNamesOwned: [
				{
					[EntityMetaKey.Selector]: {
						name: 'owned.eth',
					},
				},
			],
			$primaryName: {
				[EntityMetaKey.Selector]: {
					name: 'owned.eth',
				},
			},
		})
		expect(ensNamesOwnedResolver.projections.$$ensNamesOwned.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					name: 'owned.eth',
				},
			},
		])
		expect(ensNamesOwnedResolver.projections.$$ensNamesOwned.resolveCount(snapshot)).toBe(1)
		expect(ensNamesOwnedResolver.projections.$primaryName(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				name: 'owned.eth',
			},
		})
	})

	it('falls back to the oldest forward-resolved name when none are owned', async () => {
		getDomainsByOwner.mockResolvedValueOnce([])
		getDomainsByResolvedAddress.mockResolvedValueOnce([
			{
				...vitalikDomainWire,
				name: 'earliest.eth',
			},
			{
				...vitalikDomainWire,
				name: 'later.eth',
			},
		])

		const snapshot = await ensNamesOwnedResolver.resolve['AddressInteropAddress'].resolve(
			{
				address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
				interopAddress: 'eip155:1:0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
			},
			resolverContext
		)

		expect(snapshot).toEqual({
			ensNamesOwned: [],
			$primaryName: {
				[EntityMetaKey.Selector]: {
					name: 'earliest.eth',
				},
			},
		})
		expect(ensNamesOwnedResolver.projections.$$ensNamesOwned.resolveCount(snapshot)).toBe(0)
		expect(ensNamesOwnedResolver.projections.$primaryName(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				name: 'earliest.eth',
			},
		})
	})

	it('omits $primaryName when the subgraph has no named forward resolution', async () => {
		getDomainsByOwner.mockResolvedValueOnce([
			{
				...vitalikDomainWire,
				name: 'owned.eth',
			},
		])
		getDomainsByResolvedAddress.mockResolvedValueOnce([
			{
				...vitalikDomainWire,
				name: '',
			},
		])

		const snapshot = await ensNamesOwnedResolver.resolve['AddressInteropAddress'].resolve(
			{
				address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
				interopAddress: 'eip155:1:0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
			},
			resolverContext
		)

		expect(snapshot).toEqual({
			ensNamesOwned: [
				{
					[EntityMetaKey.Selector]: {
						name: 'owned.eth',
					},
				},
			],
		})
		expect(ensNamesOwnedResolver.projections.$primaryName(snapshot)).toBeUndefined()
	})
})

describe('Ens-TheGraph BlockheadEnsNameSearch $$matchingNames field resolver', () => {
	it('returns ens name entity refs from substring search', async () => {
		getDomainsContaining.mockResolvedValueOnce([
			{
				...vitalikDomainWire,
				name: 'vitalik.eth',
			},
			{
				...vitalikDomainWire,
				name: '',
			},
		])

		const resolvedEntity = await ensNameSearchResolver.resolve['Query'].resolve(
			{ query: 'vitalik' },
			{
				...resolverContext,
				pagination: { limit: 32 },
			}
		)

		expect(getDomainsContaining).toHaveBeenCalledWith({
			publicEnv: {},
			query: 'vitalik',
			limit: 32,
		})
		expect(resolvedEntity).toEqual([
			{
				[EntityMetaKey.Selector]: {
					name: 'vitalik.eth',
				},
			},
		])
	})
})
