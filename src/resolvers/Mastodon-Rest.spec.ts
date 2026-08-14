import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const {
	getInstance,
	getInstanceV2,
	getAccountByAcct,
	getAccountByActivityStreamsUri,
	getAccountByLocalAccountId,
	getStatus,
	getStatusByActivityStreamsUri,
	getStatusContext,
	listAccountStatusesPageByLocalAccountId,
	listInstanceModeratedDomains,
	listInstancePeerDomains,
	listPublicTimelinePage,
	mastodonInstanceBindingByOrigin,
	mastodonInstances,
	mastodonPublicTimelines,
} = vi.hoisted(() => ({
	getInstance: vi.fn(),
	getInstanceV2: vi.fn(),
	getAccountByAcct: vi.fn(),
	getAccountByActivityStreamsUri: vi.fn(),
	getAccountByLocalAccountId: vi.fn(),
	getStatus: vi.fn(),
	getStatusByActivityStreamsUri: vi.fn(),
	getStatusContext: vi.fn(),
	listAccountStatusesPageByLocalAccountId: vi.fn(),
	listInstanceModeratedDomains: vi.fn(),
	listInstancePeerDomains: vi.fn(),
	listPublicTimelinePage: vi.fn(),
	mastodonInstanceBindingByOrigin: new Map([
		['https://mastodon.social', { requestOwner: 'mastodon-social-instance' }],
		['https://fosstodon.org', { requestOwner: 'fosstodon-instance' }],
	]),
	mastodonInstances: [
		{
			instanceOrigin: 'https://mastodon.social',
			binding: { requestOwner: 'mastodon-social-instance' },
		},
		{
			instanceOrigin: 'https://fosstodon.org',
			binding: { requestOwner: 'fosstodon-instance' },
		},
	],
	mastodonPublicTimelines: [
		{
			instanceOrigin: 'https://fosstodon.org',
			binding: { requestOwner: 'fosstodon-public-timeline' },
		},
	],
}))

vi.mock('$/sources/Mastodon/Rest/queries.ts', () => ({
	assertInstanceMatches: vi.fn(),
	getAccountByAcct,
	getAccountByActivityStreamsUri,
	getAccountByLocalAccountId,
	getInstance,
	getInstanceV2,
	getStatus,
	getStatusByActivityStreamsUri,
	getStatusContext,
	listAccountStatusesPageByLocalAccountId,
	listInstanceModeratedDomains,
	listInstancePeerDomains,
	listPublicTimelinePage,
	mastodonInstanceBindingByOrigin,
	mastodonInstances,
	mastodonPublicTimelines,
}))

const { default: mastodon } = await import('$/resolvers/Mastodon-Rest.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const resolver = (entityType: EntityType, fieldName?: string) => {
	const definition = mastodon.resolvers.find((candidate) => (
		candidate.entityType === entityType
		&& (fieldName == null || fieldName in candidate.projections)
	))
	if (definition == null)
		throw new Error(`Missing ${entityType}${fieldName == null ? '' : `.${fieldName}`} resolver`)
	return definition
}

describe('Mastodon ActivityPub observations', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		getAccountByAcct.mockReset()
		getAccountByActivityStreamsUri.mockReset()
		getAccountByLocalAccountId.mockReset()
		getInstance.mockReset()
		getInstanceV2.mockReset()
		getStatus.mockReset()
		getStatusByActivityStreamsUri.mockReset()
		getStatusContext.mockReset()
		listAccountStatusesPageByLocalAccountId.mockReset()
		listInstanceModeratedDomains.mockReset()
		listInstancePeerDomains.mockReset()
		listPublicTimelinePage.mockReset()
	})

	it('materializes and continues public timeline cards only from declared anonymous feeds', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_300)
		listPublicTimelinePage.mockResolvedValueOnce({
			statuses: [
				{
					id: '114000000000000002',
					uri: 'https://fosstodon.org/users/alice/statuses/2',
					content: 'Hello from the continued timeline',
				},
				{},
			],
			continuationToken: 'https://fosstodon.org/api/v1/timelines/public?limit=25&max_id=opaque',
		})

		const definition = resolver(
			EntityType.ActivityPubNetwork,
			'$$activityPubNotes'
		)
		const page = await definition.resolve['Scope'].resolve({ scope: 'ActivityPubNetwork' }, {
			...context,
			pagination: { limit: 25 },
			providerContinuationToken: 'https://fosstodon.org/api/v1/timelines/public?limit=25&max_id=previous',
		})
		const notesProjection = definition.projections.$$activityPubNotes
		if (typeof notesProjection === 'function')
			throw new Error('Mastodon-Rest spec missing ActivityPub network continuation projection')
		const notes = notesProjection.select(page)

		expect(listPublicTimelinePage).toHaveBeenCalledWith(
			expect.objectContaining({ requestOwner: 'fosstodon-public-timeline' }),
			'https://fosstodon.org',
			25,
			'https://fosstodon.org/api/v1/timelines/public?limit=25&max_id=previous'
		)
		expect(listPublicTimelinePage).toHaveBeenCalledTimes(1)
		expect(notes.map((note) => note[EntityMetaKey.Selector])).toEqual([
			{
				instanceOrigin: 'https://fosstodon.org',
				localStatusId: '114000000000000002',
			},
		])
		expect(notes[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.ActivityPubNote, [], 'content')]: 'Hello from the continued timeline',
			[entityFieldAddressKey(EntityType.ActivityPubNote, [], 'activityStreamsUri')]: 'https://fosstodon.org/users/alice/statuses/2',
		})
		expect(notesProjection.continuation?.(page)).toEqual({
			operation: 'activitypub-network-notes',
			target: 'https://fosstodon.org',
			terminal: false,
			token: 'https://fosstodon.org/api/v1/timelines/public?limit=25&max_id=opaque',
		})
	})

	it('materializes the routed global timeline with canonical configured identities', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_200)
		listPublicTimelinePage.mockResolvedValueOnce({
			statuses: [{
				id: '114000000000000003',
				uri: 'https://remote.example/users/alice/statuses/3',
				account: {
					id: 'remote-cache-1',
					uri: 'https://remote.example/users/alice',
					username: 'alice',
					acct: 'alice@remote.example',
					display_name: 'Alice',
					followers_count: 10,
				},
			},
			{
				id: 'local-copy-of-3',
				uri: 'https://remote.example/users/alice/statuses/3',
				account: {
					id: 'remote-cache-2',
					uri: 'https://remote.example/users/alice',
					username: 'alice',
					acct: 'alice@remote.example',
					display_name: 'Alice duplicate',
				},
			},
			{
				id: '114000000000000004',
				uri: 'https://fosstodon.org/users/bob/statuses/4',
				account: {
					id: 'bob-local-id',
					uri: 'https://fosstodon.org/users/bob',
					username: 'bob',
					acct: 'bob',
					display_name: 'Bob',
				},
			}],
			continuationToken: undefined,
		})

		const definition = resolver(
			EntityType._GlobalActivityPubNetwork,
			'$$observedNotes'
		)
		const timeline = await definition.resolve['Scope'].resolve({
			scope: '_GlobalActivityPubNetwork',
		}, {
			...context,
			pagination: { limit: 17 },
		})
		const notes = definition.projections.$$observedNotes
		const actors = definition.projections.$$observedActors
		if (typeof notes !== 'function' || typeof actors !== 'function')
			throw new Error('Mastodon-Rest spec missing shared global timeline projections')

	expect(listPublicTimelinePage).toHaveBeenCalledWith(
		expect.objectContaining({ requestOwner: 'fosstodon-public-timeline' }),
		'https://fosstodon.org',
			17
		)
		expect(listPublicTimelinePage).toHaveBeenCalledTimes(1)
		const projectedNotes = notes(timeline)
		expect(projectedNotes.map((note) => note[EntityMetaKey.Selector])).toEqual([
			{
				instanceOrigin: 'https://fosstodon.org',
				localStatusId: '114000000000000003',
			},
			{
				instanceOrigin: 'https://fosstodon.org',
				localStatusId: '114000000000000004',
			},
		])
		expect(projectedNotes[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.ActivityPubNote, [], 'instanceOrigin')]: 'https://fosstodon.org',
			[entityFieldAddressKey(EntityType.ActivityPubNote, [], 'localStatusId')]: '114000000000000003',
			[entityFieldAddressKey(EntityType.ActivityPubNote, [], 'activityStreamsUri')]: 'https://remote.example/users/alice/statuses/3',
		})
		const projectedActors = actors(timeline)
		expect(projectedActors.map((actor) => actor[EntityMetaKey.Selector])).toEqual([
			{
				instanceOrigin: 'https://fosstodon.org',
				localAccountId: 'remote-cache-1',
			},
			{
				instanceOrigin: 'https://fosstodon.org',
				localAccountId: 'bob-local-id',
			},
		])
		expect(projectedActors[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.ActivityPubActor, [], 'instanceOrigin')]: 'https://fosstodon.org',
			[entityFieldAddressKey(EntityType.ActivityPubActor, [], 'localAccountId')]: 'remote-cache-1',
			[entityFieldAddressKey(EntityType.ActivityPubActor, [], 'acct')]: 'alice@remote.example',
			[entityFieldAddressKey(EntityType.ActivityPubActor, [], 'displayName')]: 'Alice',
			[entityFieldAddressKey(EntityType.ActivityPubActor, [], '$$timestamps')]: [{
				[EntityMetaKey.Selector]: {
					$actor: {
						activityStreamsUri: 'https://remote.example/users/alice',
					},
					timestampMs: 1_700_000_000_200,
					source: Source.Mastodon_Rest,
				},
			}],
		})
		expect(projectedActors[1][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.ActivityPubActor, [], 'instanceOrigin')]: 'https://fosstodon.org',
			[entityFieldAddressKey(EntityType.ActivityPubActor, [], 'localAccountId')]: 'bob-local-id',
		})
	})

	it('treats the requested limit as the aggregate limit and performs no work for zero', async () => {
		listPublicTimelinePage.mockResolvedValue({
			statuses: [{
				id: '1',
				uri: 'https://mastodon.social/users/alice/statuses/1',
				account: {
					id: 'alice',
					uri: 'https://mastodon.social/users/alice',
					acct: 'alice@mastodon.social',
				},
			},
			{
				id: '2',
				uri: 'https://mastodon.social/users/bob/statuses/2',
				account: {
					id: 'bob',
					uri: 'https://mastodon.social/users/bob',
					acct: 'bob@mastodon.social',
				},
			}],
			continuationToken: undefined,
		})
		const definition = resolver(EntityType._GlobalActivityPubNetwork, '$$observedNotes')
		const notes = definition.projections.$$observedNotes
		const actors = definition.projections.$$observedActors
		if (typeof notes !== 'function' || typeof actors !== 'function')
			throw new Error('Mastodon-Rest spec missing shared global timeline projections')

		const limitedTimeline = await definition.resolve['Scope'].resolve({
			scope: '_GlobalActivityPubNetwork',
		}, {
			...context,
			pagination: { limit: 1 },
		})
		expect(notes(limitedTimeline)).toHaveLength(1)
		expect(actors(limitedTimeline)).toHaveLength(1)
		expect(listPublicTimelinePage).toHaveBeenCalledTimes(1)

		listPublicTimelinePage.mockClear()
		const emptyTimeline = await definition.resolve['Scope'].resolve({
			scope: '_GlobalActivityPubNetwork',
		}, {
			...context,
			pagination: { limit: 0 },
		})
		expect(notes(emptyTimeline)).toEqual([])
		expect(actors(emptyTimeline)).toEqual([])
		expect(listPublicTimelinePage).not.toHaveBeenCalled()
	})

	it('fails closed on missing, local-foreign, and remote-domain-mismatched timeline authors', async () => {
		const definition = resolver(EntityType._GlobalActivityPubNetwork, '$$observedActors')
		const actors = definition.projections.$$observedActors
		if (typeof actors !== 'function')
			throw new Error('Mastodon-Rest spec missing shared global timeline actor projection')

		for (const status of [
			{
				id: '1',
				uri: 'https://mastodon.social/users/alice/statuses/1',
			},
			{
				id: '2',
				uri: 'https://evil.example/users/alice/statuses/2',
				account: {
					id: 'alice',
					uri: 'https://evil.example/users/alice',
					acct: 'alice',
				},
			},
			{
				id: '3',
				uri: 'https://evil.example/users/alice/statuses/3',
				account: {
					id: 'remote-alice',
					uri: 'https://evil.example/users/alice',
					acct: 'alice@remote.example',
				},
			},
		]) {
			listPublicTimelinePage.mockResolvedValueOnce({
				statuses: [status],
				continuationToken: undefined,
			})

			const timeline = await definition.resolve['Scope'].resolve({
				scope: '_GlobalActivityPubNetwork',
			}, context)
			expect(actors(timeline)).toEqual([])
		}
	})

	it('materializes a typed global observation from the configured instance', async () => {
		vi.spyOn(Date, 'now').mockReturnValueOnce(1_700_000_000_100)
		getInstance.mockResolvedValueOnce({
			title: 'Mastodon',
			description: 'Federated social network',
			version: '4.3.0',
		})
		getInstanceV2.mockResolvedValueOnce({
			usage: {
				users: {
					active_month: 12_345,
				},
			},
		})
		listInstancePeerDomains.mockResolvedValueOnce([
			'peer-one.example',
			'peer-two.example',
		])
		listInstanceModeratedDomains.mockResolvedValueOnce([
			{ domain: 'blocked.example', digest: 'a'.repeat(64), severity: 'suspend' },
			{ domain: 'blocked-two.example', digest: 'b'.repeat(64), severity: 'silence' },
		])
		listPublicTimelinePage.mockResolvedValueOnce({
			statuses: [
				{
					id: '1',
					uri: 'https://fosstodon.org/users/alice/statuses/1',
					account: {
						id: 'alice',
						uri: 'https://fosstodon.org/users/alice',
						acct: 'alice',
					},
				},
				{
					id: '2',
					uri: 'https://fosstodon.org/users/bob/statuses/2',
					account: {
						id: 'bob',
						uri: 'https://fosstodon.org/users/bob',
						acct: 'bob',
					},
				},
				{
					id: '3',
					uri: 'https://fosstodon.org/users/alice/statuses/1',
					account: {
						id: 'alice',
						uri: 'https://fosstodon.org/users/alice',
						acct: 'alice',
					},
				},
			],
			continuationToken: undefined,
		})

		const observations = await resolver(
			EntityType._GlobalActivityPubNetwork,
			'$$timestamps'
		).resolve['Scope'].resolve({
			scope: '_GlobalActivityPubNetwork',
		}, context)

		expect(getInstance).toHaveBeenCalledTimes(1)
		expect(getInstanceV2).toHaveBeenCalledWith(
			expect.objectContaining({ requestOwner: 'mastodon-social-instance' }),
			'https://mastodon.social'
		)
		expect(listInstancePeerDomains).toHaveBeenCalledWith(
			expect.objectContaining({ requestOwner: 'mastodon-social-instance' }),
			'https://mastodon.social'
		)
		expect(listInstanceModeratedDomains).toHaveBeenCalledWith(
			expect.objectContaining({ requestOwner: 'mastodon-social-instance' }),
			'https://mastodon.social'
		)
		expect(listPublicTimelinePage).toHaveBeenCalledWith(
			expect.objectContaining({ requestOwner: 'fosstodon-public-timeline' }),
			'https://fosstodon.org',
			40
		)
		expect(observations).toHaveLength(1)
		expect(observations[0][EntityMetaKey.Selector]).toEqual({
			$hub: {
				scope: '_GlobalActivityPubNetwork',
			},
			timestampMs: 1_700_000_000_100,
			source: Source.Mastodon_Rest,
		})
		expect(observations[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'instanceOrigin')]: 'https://mastodon.social',
			[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'instanceTitle')]: 'Mastodon',
			[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'instanceDescription')]: 'Federated social network',
			[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'instanceVersion')]: '4.3.0',
			[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'activeUserCount')]: 12_345,
			[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'observedActorCount')]: 2,
			[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'observedNoteCount')]: 2,
			[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'seededInstanceCount')]: 2,
			[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'knownPeerDomainCount')]: 2,
			[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'moderatedDomainCount')]: 2,
			[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'reachable')]: true,
		})
	})

	it('records an unreachable global observation without inventing instance metadata', async () => {
		vi.spyOn(Date, 'now').mockReturnValueOnce(1_700_000_000_101)
		getInstance.mockRejectedValueOnce(new Error('instance unavailable'))

		const observations = await resolver(
			EntityType._GlobalActivityPubNetwork,
			'$$timestamps'
		).resolve['Scope'].resolve({
			scope: '_GlobalActivityPubNetwork',
		}, context)

		expect(Object.values(observations[0][EntityMetaKey.Fields])).toEqual([
			'https://mastodon.social',
			2,
			false,
		])
	})

	it('does not register a direct global observation resolver', () => {
		expect(mastodon.resolvers.some((candidate) => (
			candidate.entityType === EntityType._GlobalActivityPubNetwork_Timestamp
		))).toBe(false)
	})

	it('produces one source-keyed instance observation batch with observation-owned topology', async () => {
		vi.spyOn(Date, 'now').mockReturnValueOnce(1_700_000_000_000)
		getInstance.mockResolvedValueOnce({
			title: 'Alpha',
			description: 'First observation',
			version: '4.3.0',
		})
		listInstancePeerDomains.mockResolvedValueOnce([
			'peer-one.example',
			'peer-two.example',
		])
		listInstanceModeratedDomains.mockResolvedValueOnce([{
			domain: 'blocked.example',
			digest: 'a'.repeat(64),
			severity: 'suspend',
		}])

		const observations = await resolver(
			EntityType.ActivityPubInstance,
			'$$timestamps'
		).resolve['InstanceOrigin'].resolve({
			instanceOrigin: 'https://mastodon.social',
		}, context)

		expect(getInstance).toHaveBeenCalledTimes(1)
		expect(listInstancePeerDomains).toHaveBeenCalledTimes(1)
		expect(listInstanceModeratedDomains).toHaveBeenCalledTimes(1)
		expect(observations).toHaveLength(1)
		expect(observations[0][EntityMetaKey.Selector]).toEqual({
			$instance: {
				instanceOrigin: 'https://mastodon.social',
			},
			timestampMs: 1_700_000_000_000,
			source: Source.Mastodon_Rest,
		})
		expect(Object.values(observations[0][EntityMetaKey.Fields])).toEqual(expect.arrayContaining([
			expect.arrayContaining([
				expect.objectContaining({
					[EntityMetaKey.Selector]: expect.objectContaining({
						peerDomain: 'peer-one.example',
					}),
				}),
			]),
			expect.arrayContaining([
				expect.objectContaining({
					[EntityMetaKey.Selector]: expect.objectContaining({
						digest: 'a'.repeat(64),
					}),
				}),
			]),
		]))
	})

	it('does not publish a partial instance snapshot when topology resolution fails', async () => {
		getInstance.mockResolvedValueOnce({
			title: 'Available metadata',
			version: '4.3.1',
		})
		listInstancePeerDomains.mockRejectedValueOnce(new Error('peers unavailable'))
		listInstanceModeratedDomains.mockRejectedValueOnce(new Error('domain blocks unavailable'))

		await expect(resolver(
			EntityType.ActivityPubInstance,
			'$$timestamps'
		).resolve['InstanceOrigin'].resolve({
			instanceOrigin: 'https://mastodon.social',
		}, context)).rejects.toThrow('peers unavailable')

		expect(getInstance).toHaveBeenCalledTimes(1)
		expect(listInstancePeerDomains).toHaveBeenCalledTimes(1)
		expect(listInstanceModeratedDomains).toHaveBeenCalledTimes(1)
	})

	it('does not mask required instance metadata failure', async () => {
		getInstance.mockRejectedValueOnce(new Error('instance metadata unavailable'))
		listInstancePeerDomains.mockResolvedValueOnce([])
		listInstanceModeratedDomains.mockResolvedValueOnce([])

		await expect(resolver(
			EntityType.ActivityPubInstance,
			'$$timestamps'
		).resolve['InstanceOrigin'].resolve({
			instanceOrigin: 'https://mastodon.social',
		}, context)).rejects.toThrow('instance metadata unavailable')
	})

	it('converges local, acct, and ActivityStreams actor selectors on one source-shaped identity', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_300)
		const account = {
			id: 'actor-17',
			uri: 'https://mastodon.social/users/alice',
			username: 'alice',
			acct: 'alice@federation.example',
			display_name: 'Alice',
		}
		getAccountByLocalAccountId.mockImplementation(async (_binding, instanceOrigin, localAccountId) => {
			if (instanceOrigin !== 'https://mastodon.social' || localAccountId !== 'actor-17')
				throw new Error('unknown local actor request')
			return account
		})
		getAccountByAcct.mockImplementation(async (_binding, instanceOrigin, acct) => {
			if (instanceOrigin !== 'https://mastodon.social' || acct !== 'alice@federation.example')
				throw new Error('unknown acct actor request')
			return account
		})
		getAccountByActivityStreamsUri.mockImplementation(async (_binding, activityStreamsUri) => {
			if (activityStreamsUri !== account.uri)
				throw new Error('unknown ActivityStreams actor request')
			return account
		})
		const actor = resolver(EntityType.ActivityPubActor, 'activityStreamsUri')

		const local = await actor.resolve['LocalAccountId'].resolve({
			instanceOrigin: 'https://mastodon.social',
			localAccountId: 'actor-17',
		}, context)
		const acct = await actor.resolve['Acct'].resolve({
			instanceOrigin: 'https://mastodon.social',
			acct: 'alice@federation.example',
		}, context)
		const activityStreams = await actor.resolve['ActivityStreamsUri'].resolve({
			activityStreamsUri: account.uri,
		}, context)

		expect(local).toEqual(acct)
		expect(acct).toEqual(activityStreams)
		expect(local).toMatchObject({
			instanceOrigin: 'https://mastodon.social',
			localAccountId: 'actor-17',
			activityStreamsUri: account.uri,
		})
		expect(getAccountByLocalAccountId).toHaveBeenCalledTimes(1)
		expect(getAccountByAcct).toHaveBeenCalledTimes(1)
		expect(getAccountByActivityStreamsUri).toHaveBeenCalledTimes(1)
		await expect(actor.resolve['ActivityStreamsUri'].resolve({
			activityStreamsUri: 'https://mastodon.social/users/mallory',
		}, context)).rejects.toThrow('unknown ActivityStreams actor request')
	})

	it('maps source-shaped note author, reply, boost, and media relations to typed entity references', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_785_507_628_670)
		const status = {
			id: 'note-9',
			uri: 'https://fosstodon.org/users/alice/statuses/note-9',
			content: '<p>Hello federation</p>',
			created_at: '2026-07-16T12:00:00.000Z',
			edited_at: '2026-07-16T12:30:00.000Z',
			account: {
				id: 'actor-17',
				uri: 'https://mastodon.social/users/alice',
				username: 'alice',
				acct: 'alice@federation.example',
				display_name: 'Alice Example',
				avatar: 'https://media-origin.example/files/alice.png',
			},
			favourites_count: 7,
			reblogs_count: 5,
			replies_count: 3,
			in_reply_to_id: 'note-8',
			reblog: {
				id: 'remote-note-4',
				uri: 'https://boost-origin.example/users/bob/statuses/remote-note-4',
				content: '<p>Original note</p>',
				created_at: '2026-07-16T11:30:00.000Z',
				account: {
					id: 'bob-local-id',
					uri: 'https://boost-origin.example/users/bob',
					acct: 'bob',
				},
			},
			media_attachments: [{
				id: 'media-2',
				type: 'image',
				remote_url: 'https://remote.example/files/image.png',
			}],
		}
		const parentStatus = {
			id: 'note-8',
			uri: 'https://fosstodon.org/users/alice/statuses/note-8',
			content: '<p>Parent note</p>',
			created_at: '2026-07-16T11:00:00.000Z',
			account: {
				id: 'actor-17',
				uri: 'https://mastodon.social/users/alice',
				username: 'alice',
				acct: 'alice@federation.example',
			},
		}
		getStatus.mockImplementation(async (_binding, instanceOrigin, localStatusId) => {
			if (instanceOrigin !== 'https://fosstodon.org')
				throw new Error('unknown local note request')
			if (localStatusId === 'note-9')
				return status
			if (localStatusId === 'note-8')
				return parentStatus
			throw new Error('unknown local note request')
		})
		getStatusByActivityStreamsUri.mockImplementation(async (_binding, activityStreamsUri) => {
			if (activityStreamsUri !== status.uri)
				throw new Error('unknown ActivityStreams note request')
			return status
		})
		const note = resolver(EntityType.ActivityPubNote, 'content')

		const local = await note.resolve['InstanceOriginLocalStatusId'].resolve({
			instanceOrigin: 'https://fosstodon.org',
			localStatusId: 'note-9',
		}, context)
		const activityStreams = await note.resolve['ActivityStreamsUri'].resolve({
			activityStreamsUri: status.uri,
		}, context)

		expect(local).toEqual(activityStreams)
		expect(local.$author).toMatchObject({
			[EntityMetaKey.Selector]: {
				activityStreamsUri: 'https://mastodon.social/users/alice',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.ActivityPubActor, [], 'instanceOrigin')]: 'https://fosstodon.org',
				[entityFieldAddressKey(EntityType.ActivityPubActor, [], 'localAccountId')]: 'actor-17',
				[entityFieldAddressKey(EntityType.ActivityPubActor, [], 'username')]: 'alice',
				[entityFieldAddressKey(EntityType.ActivityPubActor, [], 'acct')]: 'alice@federation.example',
				[entityFieldAddressKey(EntityType.ActivityPubActor, [], 'displayName')]: 'Alice Example',
				[entityFieldAddressKey(EntityType.ActivityPubActor, [], '$icon')]: expect.any(Object),
			},
		})
		expect(local.$inReplyTo).toMatchObject({
			[EntityMetaKey.Selector]: {
				instanceOrigin: 'https://fosstodon.org',
				localStatusId: 'note-8',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.ActivityPubNote, [], 'content')]: '<p>Parent note</p>',
				[entityFieldAddressKey(EntityType.ActivityPubNote, [], 'activityStreamsUri')]: 'https://fosstodon.org/users/alice/statuses/note-8',
			},
		})
		expect(local.editedAt).toBe(1_784_205_000_000)
		expect(local.$reblogOf).toMatchObject({
			[EntityMetaKey.Selector]: {
				activityStreamsUri: 'https://boost-origin.example/users/bob/statuses/remote-note-4',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.ActivityPubNote, [], 'content')]: '<p>Original note</p>',
				[entityFieldAddressKey(EntityType.ActivityPubNote, [], 'createdAt')]: 1_784_201_400_000,
				[entityFieldAddressKey(EntityType.ActivityPubNote, [], '$author')]: {
					[EntityMetaKey.Selector]: {
						activityStreamsUri: 'https://boost-origin.example/users/bob',
					},
				},
			},
		})
		expect(local.$$media).toHaveLength(1)
		expect(local.$$media[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				url: 'https://remote.example/files/image.png',
			},
		})
		expect(getStatus).toHaveBeenCalledTimes(3)
		expect(getStatusByActivityStreamsUri).toHaveBeenCalledTimes(1)
		await expect(note.resolve['ActivityStreamsUri'].resolve({
			activityStreamsUri: 'https://fosstodon.org/users/mallory/statuses/1',
		}, context)).rejects.toThrow('unknown ActivityStreams note request')
	})

	it('materializes thread context as immediately renderable canonical note observations', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_785_507_628_671)
		getStatusContext.mockResolvedValueOnce({
			ancestors: [{
				id: 'note-8',
				uri: 'https://remote.example/users/bob/statuses/note-8',
				content: '<p>Parent note</p>',
				created_at: '2026-07-16T11:00:00.000Z',
				account: {
					id: 'bob-local-id',
					uri: 'https://remote.example/users/bob',
					acct: 'bob@remote.example',
				},
				favourites_count: 2,
			}],
			descendants: [{
				id: 'note-10',
				uri: 'https://fosstodon.org/users/carol/statuses/note-10',
				content: '<p>Reply note</p>',
				created_at: '2026-07-16T13:00:00.000Z',
				account: {
					id: 'carol-local-id',
					uri: 'https://fosstodon.org/users/carol',
					acct: 'carol',
				},
				replies_count: 4,
			}],
		})

		const thread = await resolver(
			EntityType.ActivityPubNote,
			'$$thread'
		).resolve['InstanceOriginLocalStatusId'].resolve({
			instanceOrigin: 'https://fosstodon.org',
			localStatusId: 'note-9',
		}, context)

		expect(getStatusContext).toHaveBeenCalledWith(
			expect.objectContaining({ requestOwner: 'fosstodon-instance' }),
			'https://fosstodon.org',
			'note-9'
		)
		expect(thread.map((note) => note[EntityMetaKey.Selector])).toEqual([
			{
				instanceOrigin: 'https://fosstodon.org',
				localStatusId: 'note-8',
			},
			{
				instanceOrigin: 'https://fosstodon.org',
				localStatusId: 'note-10',
			},
		])
		expect(thread[0]?.[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.ActivityPubNote, [], 'content')]: '<p>Parent note</p>',
			[entityFieldAddressKey(EntityType.ActivityPubNote, [], 'activityStreamsUri')]: 'https://remote.example/users/bob/statuses/note-8',
			[entityFieldAddressKey(EntityType.ActivityPubNote, [], '$author')]: {
				[EntityMetaKey.Selector]: {
					activityStreamsUri: 'https://remote.example/users/bob',
				},
			},
			[entityFieldAddressKey(EntityType.ActivityPubNote, [], '$$timestamps')]: [
				expect.objectContaining({
					[EntityMetaKey.Selector]: {
						$note: {
							activityStreamsUri: 'https://remote.example/users/bob/statuses/note-8',
						},
						timestampMs: 1_785_507_628_671,
						source: Source.Mastodon_Rest,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.ActivityPubNote_Timestamp, [], 'favouriteCount')]: 2,
					},
				}),
			],
		})
		expect(thread[1]?.[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.ActivityPubNote, [], 'content')]: '<p>Reply note</p>',
			[entityFieldAddressKey(EntityType.ActivityPubNote, [], '$$timestamps')]: [
				expect.objectContaining({
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.ActivityPubNote_Timestamp, [], 'replyCount')]: 4,
					},
				}),
			],
		})
	})

	it('rejects notes with an invalid creation timestamp', async () => {
		getStatus.mockResolvedValueOnce({
			id: 'note-invalid-time',
			uri: 'https://fosstodon.org/users/alice/statuses/note-invalid-time',
			created_at: 'not-a-timestamp',
			account: {
				id: 'actor-17',
				uri: 'https://mastodon.social/users/alice',
				username: 'alice',
				acct: 'alice@federation.example',
				display_name: 'Alice Example',
				avatar: null,
			},
			media_attachments: [],
		})

		const note = resolver(EntityType.ActivityPubNote, 'content')
		await expect(note.resolve['InstanceOriginLocalStatusId'].resolve({
			instanceOrigin: 'https://fosstodon.org',
			localStatusId: 'note-invalid-time',
		}, context)).rejects.toThrow('invalid creation timestamp')
	})

	it('rejects notes with an invalid edit timestamp', async () => {
		getStatus.mockResolvedValueOnce({
			id: 'note-invalid-edit',
			uri: 'https://fosstodon.org/users/alice/statuses/note-invalid-edit',
			created_at: '2026-07-16T12:00:00.000Z',
			edited_at: 'not-a-timestamp',
			account: {
				id: 'actor-17',
				uri: 'https://fosstodon.org/users/alice',
			},
		})

		await expect(resolver(EntityType.ActivityPubNote, 'content').resolve['InstanceOriginLocalStatusId'].resolve({
			instanceOrigin: 'https://fosstodon.org',
			localStatusId: 'note-invalid-edit',
		}, context)).rejects.toThrow('invalid edit timestamp')
	})

	it('rejects source payloads whose actor or note identity differs from the requested subject', async () => {
		getAccountByLocalAccountId.mockResolvedValueOnce({
			id: 'different',
			uri: 'https://mastodon.social/users/alice',
			acct: 'alice',
		})
		getAccountByAcct.mockResolvedValueOnce({
			id: 'actor-17',
			uri: 'https://mastodon.social/users/alice',
			acct: 'different',
		})
		getAccountByActivityStreamsUri.mockResolvedValueOnce({
			id: 'actor-17',
			uri: 'https://mastodon.social/users/different',
			acct: 'alice',
		})
		getStatus.mockResolvedValueOnce({
			id: 'different',
			uri: 'https://fosstodon.org/users/alice/statuses/note-9',
		})
		getStatusByActivityStreamsUri.mockResolvedValueOnce({
			id: 'note-9',
			uri: 'https://fosstodon.org/users/alice/statuses/different',
		})
		const actor = resolver(EntityType.ActivityPubActor, 'activityStreamsUri')
		const note = resolver(EntityType.ActivityPubNote, 'activityStreamsUri')

		await expect(actor.resolve['LocalAccountId'].resolve({
			instanceOrigin: 'https://mastodon.social',
			localAccountId: 'actor-17',
		}, context)).rejects.toThrow('local account subject')
		await expect(actor.resolve['Acct'].resolve({
			instanceOrigin: 'https://mastodon.social',
			acct: 'alice',
		}, context)).rejects.toThrow('acct subject')
		await expect(actor.resolve['ActivityStreamsUri'].resolve({
			activityStreamsUri: 'https://mastodon.social/users/alice',
		}, context)).rejects.toThrow('ActivityStreams subject')
		await expect(note.resolve['InstanceOriginLocalStatusId'].resolve({
			instanceOrigin: 'https://fosstodon.org',
			localStatusId: 'note-9',
		}, context)).rejects.toThrow('local status subject')
		await expect(note.resolve['ActivityStreamsUri'].resolve({
			activityStreamsUri: 'https://fosstodon.org/users/alice/statuses/note-9',
		}, context)).rejects.toThrow('ActivityStreams subject')
	})

	it('lists canonical authored-note identities with exact local fallback', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_123)
		listAccountStatusesPageByLocalAccountId.mockResolvedValueOnce({
			statuses: [
				{
					id: 'note-1',
					uri: 'https://mastodon.social/users/alice/statuses/note-1',
					content: 'Authored note',
					favourites_count: 7,
					reblogs_count: 5,
					replies_count: 3,
				},
				{
					id: 'serving-instance-copy',
					uri: 'https://mastodon.social/users/alice/statuses/note-1',
					content: 'Duplicate must not displace the canonical first row',
				},
			{
				uri: 'https://mastodon.social/users/alice/statuses/malformed',
			},
			{ id: 'local-only' },
			],
			continuationToken: 'https://mastodon.social/api/v1/accounts/13179/statuses?max_id=next%2B%2F%3D',
		})

		const definition = resolver(EntityType.ActivityPubActor, '$$notes')
		const page = await definition.resolve[
			'LocalAccountId'
		].resolve({
			instanceOrigin: 'https://mastodon.social',
			localAccountId: '13179',
		}, {
			...context,
			pagination: {
				limit: 3,
			},
			providerContinuationToken: 'https://mastodon.social/api/v1/accounts/13179/statuses?max_id=previous%2B%2F%3D',
		})

		expect(listAccountStatusesPageByLocalAccountId).toHaveBeenCalledWith(
			expect.objectContaining({ requestOwner: 'mastodon-social-instance' }),
			'https://mastodon.social',
			'13179',
			3,
			'https://mastodon.social/api/v1/accounts/13179/statuses?max_id=previous%2B%2F%3D'
		)
		if (typeof definition.projections.$$notes === 'function')
			throw new Error('Mastodon spec missing authored notes continuation')
		const notes = definition.projections.$$notes.select(page, {
			instanceOrigin: 'https://mastodon.social',
			localAccountId: '13179',
		}, {
			...context,
			pagination: { limit: 3 },
		})
		expect(definition.projections.$$notes.select(page, {
			instanceOrigin: 'https://mastodon.social',
			localAccountId: '13179',
		}, {
			...context,
			pagination: { limit: 3 },
		})).toEqual(notes)
		expect(listAccountStatusesPageByLocalAccountId).toHaveBeenCalledTimes(1)
		expect(notes).toEqual([{
			[EntityMetaKey.Selector]: {
				instanceOrigin: 'https://mastodon.social',
				localStatusId: 'note-1',
			},
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType.ActivityPubNote, [], 'content')]: 'Authored note',
				[entityFieldAddressKey(EntityType.ActivityPubNote, [], '$$timestamps')]: [
					expect.objectContaining({
						[EntityMetaKey.Selector]: expect.objectContaining({
							timestampMs: 1_700_000_000_123,
							source: Source.Mastodon_Rest,
						}),
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.ActivityPubNote_Timestamp, [], 'favouriteCount')]: 7,
							[entityFieldAddressKey(EntityType.ActivityPubNote_Timestamp, [], 'reblogCount')]: 5,
							[entityFieldAddressKey(EntityType.ActivityPubNote_Timestamp, [], 'replyCount')]: 3,
						},
					}),
				],
			}),
		}])
		expect(definition.projections.$$notes.continuation?.(page, {
			instanceOrigin: 'https://mastodon.social',
			localAccountId: '13179',
		}, context)).toEqual({
			operation: 'activitypub-actor-notes',
			target: 'mastodon-compatible-activitypub',
			viewerScope: 'https://mastodon.social/accounts/13179',
			terminal: false,
			token: 'https://mastodon.social/api/v1/accounts/13179/statuses?max_id=next%2B%2F%3D',
		})
	})

	it('preserves changed and disappeared topology as distinct historical observations', async () => {
		vi.spyOn(Date, 'now')
			.mockReturnValueOnce(1_700_000_000_010)
			.mockReturnValueOnce(1_700_000_000_020)
		getInstance
			.mockResolvedValueOnce({ title: 'First' })
			.mockResolvedValueOnce({ title: 'Second' })
		listInstancePeerDomains
			.mockResolvedValueOnce(['departed-peer.example'])
			.mockResolvedValueOnce(['new-peer.example'])
		listInstanceModeratedDomains
			.mockResolvedValueOnce([{
				domain: 'formerly-blocked.example',
				digest: 'c'.repeat(64),
				severity: 'suspend',
			}])
			.mockResolvedValueOnce([])
		const resolveObservation = resolver(
			EntityType.ActivityPubInstance,
			'$$timestamps'
		).resolve['InstanceOrigin'].resolve

		const first = (await resolveObservation({
			instanceOrigin: 'https://mastodon.social',
		}, context))[0]
		const second = (await resolveObservation({
			instanceOrigin: 'https://mastodon.social',
		}, context))[0]

		expect(first[EntityMetaKey.Selector]).toMatchObject({
			timestampMs: 1_700_000_000_010,
		})
		expect(second[EntityMetaKey.Selector]).toMatchObject({
			timestampMs: 1_700_000_000_020,
		})
		expect(Object.values(first[EntityMetaKey.Fields])).toEqual(expect.arrayContaining([
			expect.arrayContaining([
				expect.objectContaining({
					[EntityMetaKey.Selector]: expect.objectContaining({
						peerDomain: 'departed-peer.example',
					}),
				}),
			]),
			expect.arrayContaining([
				expect.objectContaining({
					[EntityMetaKey.Selector]: expect.objectContaining({
						digest: 'c'.repeat(64),
					}),
				}),
			]),
		]))
		expect(Object.values(second[EntityMetaKey.Fields])).toEqual(expect.arrayContaining([
			expect.arrayContaining([
				expect.objectContaining({
					[EntityMetaKey.Selector]: expect.objectContaining({
						peerDomain: 'new-peer.example',
					}),
				}),
			]),
			[],
		]))
		expect(getInstance).toHaveBeenCalledTimes(2)
		expect(listInstancePeerDomains).toHaveBeenCalledTimes(2)
		expect(listInstanceModeratedDomains).toHaveBeenCalledTimes(2)
	})

	it('does not register direct actor, note, or instance observation resolvers', () => {
		for (const entityType of [
			EntityType.ActivityPubActor_Timestamp,
			EntityType.ActivityPubNote_Timestamp,
			EntityType.ActivityPubInstance_Timestamp,
		])
			expect(mastodon.resolvers.some((candidate) => candidate.entityType === entityType)).toBe(false)
	})

	it('keeps equal clocks distinct by source', () => {
		const selector = {
			$instance: {
				instanceOrigin: 'https://instance.example',
			},
			timestampMs: 1,
		}
		expect({
			...selector,
			source: Source.Mastodon_Rest,
		}).not.toEqual({
			...selector,
			source: Source.Constants_Internal,
		})
	})
})
