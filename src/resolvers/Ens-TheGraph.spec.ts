import { describe, expect, it, vi } from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { EnsSubgraphDomain } from '$/sources/TheGraph/Graphql/Ens/types.ts'
import { Source } from '$/sources/Source.ts'


const getName = vi.fn()
const getDomainsByOwner = vi.fn()
const getDomainsByResolvedAddress = vi.fn()
const getDomainsContaining = vi.fn()
const getEnsSubgraphReachability = vi.fn()
const getReverseRecord = vi.fn()

vi.mock('@tevm/voltaire/Ens', () => ({
	normalize: (name: string) => name,
	toString: (name: string) => name,
}))

vi.mock('$/sources/TheGraph/Graphql/Ens/queries.ts', () => ({
	ensQueries: {
		getName,
		getDomainsByOwner,
		getDomainsByResolvedAddress,
		getDomainsContaining,
		getEnsSubgraphReachability,
		getReverseRecord,
	},
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
		events: [
			{
				__typename: 'TextChanged' as const,
				blockNumber: 100,
				key: 'url',
				value: 'https://vitalik.ca',
			},
			{
				__typename: 'MulticoinAddrChanged' as const,
				blockNumber: 101,
				coinType: '60',
				addr: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
			},
		],
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
			createdAtMs: 1_700_000_000_000,
			resolverTextKeys: ['url'],
			resolverCoinTypes: ['60'],
			textRecords: {
				url: 'https://vitalik.ca',
			},
			$$records: [
				{
					[EntityMetaKey.Selector]: {
						$name: {
							name: 'vitalik.eth',
						},
						recordKey: 'text:url',
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.EnsRecord, [], 'recordKind')]: 'text',
						[entityFieldAddressKey(EntityType.EnsRecord, [], '$$timestamps')]: [{
							[EntityMetaKey.Selector]: {
								$record: {
									$name: {
										name: 'vitalik.eth',
									},
									recordKey: 'text:url',
								},
								timestampMs: 1_800_000_000_000,
								source: Source.TheGraph_Graphql,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.EnsRecord_Timestamp, [], 'value')]: 'https://vitalik.ca',
							},
						}],
					},
				},
				{
					[EntityMetaKey.Selector]: {
						$name: {
							name: 'vitalik.eth',
						},
						recordKey: 'coin:60',
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.EnsRecord, [], 'recordKind')]: 'coin',
						[entityFieldAddressKey(EntityType.EnsRecord, [], 'coinType')]: 60,
						[entityFieldAddressKey(EntityType.EnsRecord, [], '$$timestamps')]: [{
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.EnsRecord_Timestamp, [], 'value')]: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
							},
						}],
					},
				},
				{
					[EntityMetaKey.Selector]: {
						$name: {
							name: 'vitalik.eth',
						},
						recordKey: 'contenthash',
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.EnsRecord, [], 'recordKind')]: 'contenthash',
						[entityFieldAddressKey(EntityType.EnsRecord, [], '$$timestamps')]: [{
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.EnsRecord_Timestamp, [], 'value')]: '0xcontent',
							},
						}],
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
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.EnsName_Timestamp, [], '$resolvedActor')]: {
							[EntityMetaKey.Selector]: {
								address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
							},
						},
						[entityFieldAddressKey(EntityType.EnsName_Timestamp, [], '$resolverContract')]: {
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
						[entityFieldAddressKey(EntityType.EnsName_Timestamp, [], '$ownerActor')]: {
							[EntityMetaKey.Selector]: {
								address: '0x000000000000000000000000000000000000dead',
							},
						},
						[entityFieldAddressKey(EntityType.EnsName_Timestamp, [], 'subdomainCount')]: 1,
						[entityFieldAddressKey(EntityType.EnsName_Timestamp, [], 'resolverTextKeys')]: ['url'],
						[entityFieldAddressKey(EntityType.EnsName_Timestamp, [], 'resolverCoinTypes')]: ['60'],
						[entityFieldAddressKey(EntityType.EnsName_Timestamp, [], 'ttl')]: 300n,
						[entityFieldAddressKey(EntityType.EnsName_Timestamp, [], 'isMigrated')]: true,
					},
				},
			],
			subdomainCount: 1,
		})
		expect(ensNameResolver.projections.$$subdomains.resolveCount(resolvedEntity)).toBe(1)
		expect(ensNameResolver.projections.$$records.resolveCount(resolvedEntity)).toBe(3)
		expect(ensNameResolver.projections.$$timestamps).not.toHaveProperty('resolveCount')
		expect(ensTheGraphResolvers.resolvers.some((resolver) => (
			resolver.entityType === EntityType.EnsName_Timestamp
		))).toBe(false)
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

	it('maps registrar registration and NameWrapper state as distinct name facts', async () => {
		getName.mockResolvedValueOnce([{
			...vitalikDomainWire,
			registrant: {
				id: '0x000000000000000000000000000000000000beef',
			},
			wrappedOwner: {
				id: '0x000000000000000000000000000000000000cafe',
			},
			wrappedDomain: {
				expiryDate: '1900000000',
				fuses: 196608,
			},
			registration: {
				registrationDate: '1600000000',
				expiryDate: '1800000000',
				cost: '1',
				registrant: {
					id: '0x000000000000000000000000000000000000beef',
				},
			},
		}])

		const resolvedEntity = await ensNameResolver.resolve['NormalizedName'].resolve(
			{ name: 'vitalik.eth' },
			resolverContext
		)

		expect(resolvedEntity).toMatchObject({
			$registrantActor: {
				[EntityMetaKey.Selector]: {
					address: '0x000000000000000000000000000000000000beef',
				},
			},
			$wrapperOwnerActor: {
				[EntityMetaKey.Selector]: {
					address: '0x000000000000000000000000000000000000cafe',
				},
			},
			registeredAtMs: 1_600_000_000_000,
			registrationExpiryAtMs: 1_800_000_000_000,
			wrapperFuses: 196608,
			wrapperExpiryAtMs: 1_900_000_000_000,
		})
		expect(resolvedEntity).not.toHaveProperty('expiryDate')
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

describe('Ens-TheGraph EnsRecord resolver', () => {
	it('derives text/coin fields and tip $$timestamps from subgraph record keys', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_800_000_000_000)
		getName.mockResolvedValueOnce([vitalikDomainWire])

		const textRecord = await ensRecordResolver.resolve['NameRecordKey'].resolve(
			{
				$name: {
					name: 'vitalik.eth',
				},
				recordKey: 'text:url',
			},
			resolverContext
		)
		expect(textRecord).toEqual({
			$name: {
				[EntityMetaKey.Selector]: {
					name: 'vitalik.eth',
				},
			},
			recordKey: 'text:url',
			recordKind: 'text',
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					$record: {
						$name: {
							name: 'vitalik.eth',
						},
						recordKey: 'text:url',
					},
					timestampMs: 1_800_000_000_000,
					source: Source.TheGraph_Graphql,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EnsRecord_Timestamp, [], 'value')]: 'https://vitalik.ca',
				},
			}],
		})
		expect(ensRecordResolver.projections.$$timestamps).not.toHaveProperty('resolveCount')

		getName.mockResolvedValueOnce([vitalikDomainWire])
		const coinRecord = await ensRecordResolver.resolve['NameRecordKey'].resolve(
			{
				$name: {
					name: 'vitalik.eth',
				},
				recordKey: 'coin:60',
			},
			resolverContext
		)
		expect(coinRecord).toEqual({
			$name: {
				[EntityMetaKey.Selector]: {
					name: 'vitalik.eth',
				},
			},
			recordKey: 'coin:60',
			recordKind: 'coin',
			coinType: 60,
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					$record: {
						$name: {
							name: 'vitalik.eth',
						},
						recordKey: 'coin:60',
					},
					timestampMs: 1_800_000_000_000,
					source: Source.TheGraph_Graphql,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EnsRecord_Timestamp, [], 'value')]: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
				},
			}],
		})
		expect(ensTheGraphResolvers.resolvers.some((resolver) => (
			resolver.entityType === EntityType.EnsRecord_Timestamp
		))).toBe(false)

		getName.mockResolvedValueOnce([{
			...vitalikDomainWire,
			resolver: {
				...vitalikDomainWire.resolver,
				addr: {
					id: '0xD8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
				},
				events: [
					{
						__typename: 'TextChanged' as const,
						blockNumber: 100,
						key: 'url',
						value: 'https://vitalik.ca',
					},
					{
						__typename: 'AddrChanged' as const,
						blockNumber: 99,
						addr: {
							id: '0xD8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
						},
					},
				],
			},
		}])
		const legacyCoinRecord = await ensRecordResolver.resolve['NameRecordKey'].resolve(
			{
				$name: {
					name: 'vitalik.eth',
				},
				recordKey: 'coin:60',
			},
			resolverContext
		)
		expect(legacyCoinRecord.$$timestamps[0][EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.EnsRecord_Timestamp, [], 'value')]: '0xD8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
		})
	})

	it('resolves contenthash records from the subgraph resolver tip', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_800_000_000_000)
		getName.mockResolvedValueOnce([vitalikDomainWire])

		const contentHashRecord = await ensRecordResolver.resolve['NameRecordKey'].resolve(
			{
				$name: {
					name: 'vitalik.eth',
				},
				recordKey: 'contenthash',
			},
			resolverContext
		)

		expect(contentHashRecord).toEqual({
			$name: {
				[EntityMetaKey.Selector]: {
					name: 'vitalik.eth',
				},
			},
			recordKey: 'contenthash',
			recordKind: 'contenthash',
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					$record: {
						$name: {
							name: 'vitalik.eth',
						},
						recordKey: 'contenthash',
					},
					timestampMs: 1_800_000_000_000,
					source: Source.TheGraph_Graphql,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EnsRecord_Timestamp, [], 'value')]: '0xcontent',
				},
			}],
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

const ensReverseRecordResolver = ensTheGraphResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EnsReverseRecord
))

describe('Ens-TheGraph reverse record resolver', () => {
	it('materializes one verified source observation from matching forward and reverse records', async () => {
		if (ensReverseRecordResolver == null || !('AccountName' in ensReverseRecordResolver.resolve))
			throw new Error('Ens-TheGraph spec missing EnsReverseRecord resolver')

		vi.spyOn(Date, 'now').mockReturnValue(1_800_000_000_000)
		getReverseRecord.mockResolvedValueOnce({
			forward: vitalikDomainWire,
			reverse: {
				...vitalikDomainWire,
				name: 'd8da6bf26964af9d7eed9e03e53415d37aa96045.addr.reverse',
				resolvedAddress: null,
				resolver: {
					...vitalikDomainWire.resolver,
					address: '0x0000000000000000000000000000000000000002',
				},
			},
		})
		const selector = {
			$account: {
				caip10: {
					namespace: 'eip155',
					reference: '1',
					accountAddress: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
				},
			},
			$name: {
				name: 'vitalik.eth',
			},
		}
		const resolved = await ensReverseRecordResolver.resolve.AccountName.resolve(selector, resolverContext)

		expect(ensReverseRecordResolver.projections.$account(resolved)).toEqual({
			[EntityMetaKey.Selector]: selector.$account,
		})
		expect(ensReverseRecordResolver.projections.$$timestamps(resolved)).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$reverseRecord: selector,
				timestampMs: 1_800_000_000_000,
				source: Source.TheGraph_Graphql,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EnsReverseRecord_Timestamp, [], 'verified')]: true,
			},
		}])
	})

	it('rejects non-EVM reverse records before transport', async () => {
		if (ensReverseRecordResolver == null || !('AccountName' in ensReverseRecordResolver.resolve))
			throw new Error('Ens-TheGraph spec missing EnsReverseRecord resolver')
		getReverseRecord.mockClear()

		await expect(ensReverseRecordResolver.resolve.AccountName.resolve({
			$account: {
				caip10: {
					namespace: 'solana',
					reference: 'mainnet',
					accountAddress: 'not-evm',
				},
			},
			$name: {
				name: 'vitalik.eth',
			},
		}, resolverContext)).rejects.toThrow('requires an EVM account')
		expect(getReverseRecord).not.toHaveBeenCalled()
	})
})
