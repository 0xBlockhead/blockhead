import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient } from '@tanstack/query-core'
import type { PersistenceAdapter } from '@tanstack/db-sqlite-persistence-core'

import { client } from '$/client/$client.svelte.ts'
import { subscribeEntity } from '$/client/$subscribe.svelte.ts'
import {
	entityFieldAddressKey,
	entitySelectorsFromFields,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import {
	entityDefinitionByType,
	schema,
} from '$/schema/index.ts'
import sourceProviders from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'

const {
	bskyGetProfile,
	bskyResolveHandle,
	bskySocialGetProfile,
	bskySocialResolveHandle,
} = vi.hoisted(() => ({
	bskyGetProfile: vi.fn(),
	bskyResolveHandle: vi.fn(),
	bskySocialGetProfile: vi.fn(),
	bskySocialResolveHandle: vi.fn(),
}))

vi.mock('$/sources/AtprotoBsky/Rest/queries.ts', () => ({
	getProfile: bskyGetProfile,
	resolveHandle: bskyResolveHandle,
}))

vi.mock('$/sources/AtprotoBskySocial/Rest/queries.ts', () => ({
	getProfile: bskySocialGetProfile,
	resolveHandle: bskySocialResolveHandle,
}))

const [
	{ default: atproto },
	{ default: atprotoBskySocial },
] = await Promise.all([
	import('$/resolvers/Atproto-Xrpc.ts'),
	import('$/resolvers/Atproto-BskySocial-Xrpc.ts'),
])

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe.each([
	{
		name: 'Atproto_Xrpc',
		definition: atproto,
		source: Source.Atproto_Xrpc,
		getProfile: bskyGetProfile,
		resolveHandle: bskyResolveHandle,
	},
	{
		name: 'Atproto_BskySocial_Xrpc',
		definition: atprotoBskySocial,
		source: Source.Atproto_BskySocial_Xrpc,
		getProfile: bskySocialGetProfile,
		resolveHandle: bskySocialResolveHandle,
	},
])('$name actor identity and observations', ({
	definition,
	source,
	getProfile,
	resolveHandle,
}) => {
	const resolver = (
		entityType: EntityType,
		fieldName: string,
		selectorName: string
	) => {
		const candidate = definition.resolvers.find((resolverDefinition) => (
			resolverDefinition.entityType === entityType
			&& fieldName in resolverDefinition.projections
			&& selectorName in resolverDefinition.resolve
		))
		if (candidate == null)
			throw new Error(`Missing ${entityType}.${fieldName}.${selectorName} resolver`)
		return candidate
	}

	beforeEach(() => {
		vi.restoreAllMocks()
		bskyGetProfile.mockReset()
		bskyResolveHandle.mockReset()
		bskySocialGetProfile.mockReset()
		bskySocialResolveHandle.mockReset()
	})

	it('resolves a handle through identity lookup to the DID-selected actor', async () => {
		resolveHandle.mockResolvedValueOnce({
			did: 'did:plc:alice',
		})

		await expect(resolver(
			EntityType.AtprotoActor,
			'did',
			'Handle'
		).resolve['Handle'].resolve({
			handle: 'alice.test',
		}, context)).resolves.toEqual({
			did: 'did:plc:alice',
			handle: 'alice.test',
		})
		expect(resolveHandle).toHaveBeenCalledWith('alice.test')
		expect(getProfile).not.toHaveBeenCalled()
		expect(entitySelectorsFromFields(
			schema,
			entityDefinitionByType[EntityType.AtprotoActor],
			{
				handle: 'alice.test',
			},
			{
				did: 'did:plc:alice',
				handle: 'alice.test',
			}
		)).toEqual([
			{
				handle: 'alice.test',
			},
			{
				did: 'did:plc:alice',
			},
		])
	})

	it('keeps canonical DID identity provider-free and profile-free', async () => {
		await expect(resolver(
			EntityType.AtprotoActor,
			'did',
			'Did'
		).resolve['Did'].resolve({
			did: 'did:plc:alice',
		}, context)).resolves.toEqual({
			did: 'did:plc:alice',
		})
		expect(resolveHandle).not.toHaveBeenCalled()
		expect(getProfile).not.toHaveBeenCalled()
	})

	it('materializes zero counters and mutable profile state on a source-keyed observation', async () => {
		vi.spyOn(Date, 'now').mockReturnValueOnce(1_700_000_000_000)
		getProfile.mockResolvedValueOnce({
			did: 'did:plc:stale-response',
			handle: 'alice.test',
			displayName: 'Alice',
			description: 'Profile',
			avatar: 'https://cdn.example/avatar.png',
			banner: 'https://cdn.example/banner.png',
			indexedAt: '2026-07-16T00:00:00.000Z',
			followersCount: 0,
			followsCount: 0,
			postsCount: 0,
		})

		const observations = await resolver(
			EntityType.AtprotoActor,
			'$$timestamps',
			'Did'
		).resolve['Did'].resolve({
			did: 'did:plc:alice',
		}, context)

		expect(observations).toHaveLength(1)
		expect(observations[0][EntityMetaKey.Selector]).toEqual({
			$actor: {
				did: 'did:plc:alice',
			},
			timestampMs: 1_700_000_000_000,
			source,
		})
		expect(observations[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'source')]: source,
			[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'handle')]: 'alice.test',
			[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'displayName')]: 'Alice',
			[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'description')]: 'Profile',
			[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'followersCount')]: 0,
			[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'followsCount')]: 0,
			[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'postsCount')]: 0,
		})
	})

	it('creates a distinct source-keyed observation on explicit refresh', async () => {
		vi.spyOn(Date, 'now')
			.mockReturnValueOnce(1_700_000_000_000)
			.mockReturnValueOnce(1_700_000_001_000)
		getProfile.mockResolvedValue({
			did: 'did:plc:alice',
			handle: 'alice.test',
			followersCount: 0,
			followsCount: 0,
			postsCount: 0,
		})
		const actorObservations = resolver(
			EntityType.AtprotoActor,
			'$$timestamps',
			'Did'
		).resolve['Did']

		const first = await actorObservations.resolve({
			did: 'did:plc:alice',
		}, context)
		const refreshed = await actorObservations.resolve({
			did: 'did:plc:alice',
		}, context)

		expect([
			first[0][EntityMetaKey.Selector],
			refreshed[0][EntityMetaKey.Selector],
		]).toEqual([
			{
				$actor: {
					did: 'did:plc:alice',
				},
				timestampMs: 1_700_000_000_000,
				source,
			},
			{
				$actor: {
					did: 'did:plc:alice',
				},
				timestampMs: 1_700_000_001_000,
				source,
			},
		])
		expect(getProfile).toHaveBeenCalledTimes(2)
	})

	it('preserves app-view failure instead of fabricating an observation', async () => {
		getProfile.mockRejectedValueOnce(new Error('profile unavailable'))

		await expect(resolver(
			EntityType.AtprotoActor,
			'$$timestamps',
			'Did'
		).resolve['Did'].resolve({
			did: 'did:plc:alice',
		}, context)).rejects.toThrow('profile unavailable')
		expect(getProfile).toHaveBeenCalledTimes(1)
	})

	it('does not advertise an impossible direct historical observation resolver', () => {
		expect(definition.resolvers.some((resolverDefinition) => (
			resolverDefinition.entityType === EntityType.AtprotoActor_Timestamp
		))).toBe(false)
		expect(getProfile).not.toHaveBeenCalled()
	})

	it('keeps DID identity and handle ingress free of duplicate profile/feed paths', () => {
		const didIdentity = resolver(
			EntityType.AtprotoActor,
			'did',
			'Did'
		)
		const handleIdentity = resolver(
			EntityType.AtprotoActor,
			'did',
			'Handle'
		)
		const observations = resolver(
			EntityType.AtprotoActor,
			'$$timestamps',
			'Did'
		)
		const posts = resolver(
			EntityType.AtprotoActor,
			'$$posts',
			'Did'
		)

		expect(didIdentity.resolve['Did']).toBeDefined()
		expect(handleIdentity.resolve['Handle']).toBeDefined()
		expect(observations.resolve['Did']).toBeDefined()
		expect(observations.resolve['Handle']).toBeUndefined()
		expect(posts.resolve['Did']).toBeDefined()
		expect(posts.resolve['Handle']).toBeUndefined()
	})
})

it('persists source-scoped handle and DID equivalence across restart', async () => {
	bskyResolveHandle.mockResolvedValue({
		did: 'did:plc:alice',
	})
	bskySocialResolveHandle.mockResolvedValue({
		did: 'did:plc:alice',
	})
	const collectionRowsByCollectionId = new Map<string, Map<string | number, object>>()
	const collectionMetadataByCollectionId = new Map<string, Map<string, string>>()
	const persistence = {
		adapter: {
			loadSubset: async (collectionId) => [
				...(collectionRowsByCollectionId.get(collectionId) ?? new Map()),
			].map(([key, value]) => ({
				key,
				value,
			})),
			applyCommittedTx: async (collectionId, transaction) => {
				const collectionRows = collectionRowsByCollectionId.get(collectionId) ?? new Map()
				for (const mutation of transaction.mutations) {
					if (mutation.type === 'delete')
						collectionRows.delete(mutation.key)
					else
						collectionRows.set(mutation.key, mutation.value)
				}
				collectionRowsByCollectionId.set(collectionId, collectionRows)
				const collectionMetadata = collectionMetadataByCollectionId.get(collectionId) ?? new Map()
				for (const mutation of transaction.collectionMetadataMutations ?? []) {
					if (mutation.type === 'delete')
						collectionMetadata.delete(mutation.key)
					else
						collectionMetadata.set(mutation.key, JSON.stringify(mutation.value))
				}
				collectionMetadataByCollectionId.set(collectionId, collectionMetadata)
			},
			loadCollectionMetadata: async (collectionId) => [
				...(collectionMetadataByCollectionId.get(collectionId) ?? new Map()),
			].map(([key, value]) => ({
				key,
				value: JSON.parse(value),
			})),
			ensureIndex: async () => {},
		} satisfies PersistenceAdapter,
	}
	const createContext = () => client({
		schema,
		sourceProviders,
	})({
		resolvers: [
			atproto,
			atprotoBskySocial,
		],
		env: {},
	})({
		queryClient: new QueryClient(),
		persistence,
		schemaVersion: 1,
	})
	const firstContext = createContext()

	await subscribeEntity(
		firstContext,
		EntityType.AtprotoActor,
		{
			handle: 'alice.test',
		},
		{
			sources: [Source.Atproto_Xrpc],
		}
	)
	await expect.poll(() => collectionRowsByCollectionId.get('client.entities.AtprotoActor')?.size).toBe(2)
	await expect.poll(() => collectionMetadataByCollectionId.get('client.entities.AtprotoActor')?.size).toBe(2)
	expect([
		...(collectionRowsByCollectionId.get('client.entities.AtprotoActor')?.values() ?? []),
	]).toEqual(expect.arrayContaining([
		expect.objectContaining({
			[EntityMetaKey.Selector]: {
				did: 'did:plc:alice',
			},
		}),
		expect.objectContaining({
			[EntityMetaKey.Selector]: {
				handle: 'alice.test',
			},
		}),
	]))
	expect(bskyResolveHandle).toHaveBeenCalledTimes(1)

	const restartedContext = createContext()
	await subscribeEntity(
		restartedContext,
		EntityType.AtprotoActor,
		{
			handle: 'alice.test',
		},
		{
			sources: [Source.Atproto_Xrpc],
			fields: {},
		}
	)
	expect(bskyResolveHandle).toHaveBeenCalledTimes(1)

	await expect(subscribeEntity(
		restartedContext,
		EntityType.AtprotoActor,
		{
			handle: 'alice.new',
		},
		{
			sources: [Source.Atproto_Xrpc],
			fields: {
				did: true,
			},
		}
	)).resolves.toMatchObject({
		did: 'did:plc:alice',
	})
	expect(bskyResolveHandle).toHaveBeenCalledTimes(2)
	expect([
		...(collectionRowsByCollectionId.get('client.entities.AtprotoActor')?.values() ?? []),
	].filter((row) => row[EntityMetaKey.Selector].did === 'did:plc:alice')).toHaveLength(1)
	expect([
		...(collectionRowsByCollectionId.get('client.entities.AtprotoActor')?.values() ?? []),
	].filter((row) => row[EntityMetaKey.Selector].handle != null)).toHaveLength(2)

	await subscribeEntity(
		restartedContext,
		EntityType.AtprotoActor,
		{
			handle: 'alice.test',
		},
		{
			sources: [Source.Atproto_BskySocial_Xrpc],
			fields: {},
		}
	)
	expect(bskySocialResolveHandle).toHaveBeenCalledTimes(1)
})
