import { describe, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { EnsSubgraphDomain } from '$/sources/TheGraph/Graphql/Ens/types.ts'


const getEnsName = vi.fn()
const getEnsDomainsByOwner = vi.fn()

vi.mock('@tevm/voltaire/Ens', () => ({
	normalize: (name: string) => name,
	toString: (name: string) => name,
}))

vi.mock('$/sources/TheGraph/Graphql/Ens/queries.ts', () => ({
	getEnsName,
	getEnsDomainsByOwner,
}))

vi.mock('$/lib/singleFlight.ts', () => ({
	singleFlight: <Fn extends (...args: never[]) => unknown>(fn: Fn) => fn,
}))

const { default: ensTheGraphResolvers } = await import('$/resolvers/Ens-TheGraph.ts')

const ensNameResolver = ensTheGraphResolvers.entityResolvers.find((
	resolver,
) => resolver.entityType === EntityType.EnsName)

const ensNamesOwnedResolver = ensTheGraphResolvers.entityFieldResolvers.find((
	resolver,
) => (
	resolver.entityType === EntityType.EvmAccount
	&& resolver.fieldName === '$$ensNamesOwned'
))

const resolverContext = {
	filters: [],
	sorts: [],
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
		address: '0xresolver',
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
		getEnsName.mockResolvedValueOnce([vitalikDomainWire])

		const result = await ensNameResolver!.resolve(
			{ name: 'vitalik.eth' },
			resolverContext,
		)

		expect(result).toMatchObject({
			subgraphId: vitalikDomainWire.id,
			labelName: 'vitalik',
			$parent: {
				[EntityMetaKey.Id]: {
					name: 'eth',
				},
			},
			$$subdomains: [
				{
					[EntityMetaKey.Id]: {
						name: 'sub.vitalik.eth',
					},
				},
			],
			$subgraphResolvedActor: {
				[EntityMetaKey.Id]: {
					address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
				},
			},
			$subgraphOwnerActor: {
				[EntityMetaKey.Id]: {
					address: '0x000000000000000000000000000000000000dead',
				},
			},
			ttl: 300n,
			createdAt: 1700000000000n,
			expiryDate: 1800000000000n,
			subdomainCount: 1,
			isMigrated: true,
			contentHash: '0xcontent',
			resolverTextKeys: ['url'],
			resolverCoinTypes: ['60'],
		})
	})

	it('omits invalid subgraph account ids', async () => {
		getEnsName.mockResolvedValueOnce([{
			...vitalikDomainWire,
			resolvedAddress: {
				id: 'not-an-address',
			},
			owner: null,
		}])

		const result = await ensNameResolver!.resolve(
			{ name: 'vitalik.eth' },
			resolverContext,
		)

		expect(result.$subgraphResolvedActor).toBeUndefined()
		expect(result.$subgraphOwnerActor).toBeUndefined()
	})
})

describe('Ens-TheGraph $$ensNamesOwned field resolver', () => {
	it('returns ens name entity refs for owned domains', async () => {
		expect(ensNamesOwnedResolver).toBeDefined()
		getEnsDomainsByOwner.mockResolvedValueOnce([
			{
				...vitalikDomainWire,
				name: 'owned.eth',
			},
			{
				...vitalikDomainWire,
				name: '',
			},
		])

		const result = await ensNamesOwnedResolver!.resolve(
			{ address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045' },
			resolverContext,
		)

		expect(result).toEqual([
			{
				[EntityMetaKey.Id]: {
					name: 'owned.eth',
				},
			},
		])
	})
})
