import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	entityFieldAddressKey,
	entitySelectorsFromFields,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { AtprotoActorSelector } from '$/schema/AtprotoActor.ts'
import { AtprotoActor_TimestampSelector } from '$/schema/AtprotoActor_Timestamp.ts'
import { EntityType } from '$/schema/EntityType.ts'
import {
	entityDefinitionByType,
	schema,
} from '$/schema/index.ts'
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
			AtprotoActorSelector.Handle
		).resolve[AtprotoActorSelector.Handle].resolve({
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
			AtprotoActorSelector.Did
		).resolve[AtprotoActorSelector.Did].resolve({
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
			AtprotoActorSelector.Did
		).resolve[AtprotoActorSelector.Did].resolve({
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

	it('rejects another source and never refreshes a historical observation', async () => {
		const historical = resolver(
			EntityType.AtprotoActor_Timestamp,
			'source',
			AtprotoActor_TimestampSelector.AtprotoActorTimestampMsSource
		)
		const mismatchedSource = (
			source === Source.Atproto_Xrpc ?
				Source.Atproto_BskySocial_Xrpc
			:
				Source.Atproto_Xrpc
		)

		await expect(historical.resolve[
			AtprotoActor_TimestampSelector.AtprotoActorTimestampMsSource
		].resolve({
			$actor: {
				did: 'did:plc:alice',
			},
			timestampMs: 1_700_000_000_000,
			source: mismatchedSource,
		}, context)).rejects.toThrow('observation source mismatch')
		await expect(historical.resolve[
			AtprotoActor_TimestampSelector.AtprotoActorTimestampMsSource
		].resolve({
			$actor: {
				did: 'did:plc:alice',
			},
			timestampMs: 1_700_000_000_000,
			source,
		}, context)).rejects.toThrow('historical actor observation is unavailable')
		expect(getProfile).not.toHaveBeenCalled()
	})

	it('keeps DID identity and handle ingress free of duplicate profile/feed paths', () => {
		const didIdentity = resolver(
			EntityType.AtprotoActor,
			'did',
			AtprotoActorSelector.Did
		)
		const handleIdentity = resolver(
			EntityType.AtprotoActor,
			'did',
			AtprotoActorSelector.Handle
		)
		const observations = resolver(
			EntityType.AtprotoActor,
			'$$timestamps',
			AtprotoActorSelector.Did
		)
		const posts = resolver(
			EntityType.AtprotoActor,
			'$$posts',
			AtprotoActorSelector.Did
		)

		expect(didIdentity.resolve[AtprotoActorSelector.Did]).toBeDefined()
		expect(handleIdentity.resolve[AtprotoActorSelector.Handle]).toBeDefined()
		expect(observations.resolve[AtprotoActorSelector.Did]).toBeDefined()
		expect(observations.resolve[AtprotoActorSelector.Handle]).toBeUndefined()
		expect(posts.resolve[AtprotoActorSelector.Did]).toBeDefined()
		expect(posts.resolve[AtprotoActorSelector.Handle]).toBeUndefined()
	})
})
