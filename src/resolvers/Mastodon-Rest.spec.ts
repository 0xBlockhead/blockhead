import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { ActivityPubActor_TimestampSelector } from '$/schema/ActivityPubActor_Timestamp.ts'
import { ActivityPubActorSelector } from '$/schema/ActivityPubActor.ts'
import { ActivityPubInstanceSelector } from '$/schema/ActivityPubInstance.ts'
import { ActivityPubInstance_TimestampSelector } from '$/schema/ActivityPubInstance_Timestamp.ts'
import { ActivityPubNoteSelector } from '$/schema/ActivityPubNote.ts'
import { ActivityPubNote_TimestampSelector } from '$/schema/ActivityPubNote_Timestamp.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { _GlobalActivityPubNetworkSelector } from '$/schema/_GlobalActivityPubNetwork.ts'
import { _GlobalActivityPubNetwork_TimestampSelector } from '$/schema/_GlobalActivityPubNetwork_Timestamp.ts'
import { Source } from '$/sources/Source.ts'

const {
	getInstance,
	getAccountByAcct,
	getAccountByActivityStreamsUri,
	getAccountByLocalAccountId,
	getStatus,
	getStatusByActivityStreamsUri,
	listInstanceModeratedDomains,
	listInstancePeerDomains,
} = vi.hoisted(() => ({
	getInstance: vi.fn(),
	getAccountByAcct: vi.fn(),
	getAccountByActivityStreamsUri: vi.fn(),
	getAccountByLocalAccountId: vi.fn(),
	getStatus: vi.fn(),
	getStatusByActivityStreamsUri: vi.fn(),
	listInstanceModeratedDomains: vi.fn(),
	listInstancePeerDomains: vi.fn(),
}))

vi.mock('$/sources/Mastodon/Rest/queries.ts', () => ({
	assertInstanceMatches: vi.fn(),
	getAccountByAcct,
	getAccountByActivityStreamsUri,
	getAccountByLocalAccountId,
	getInstance,
	getStatus,
	getStatusByActivityStreamsUri,
	listInstanceModeratedDomains,
	listInstancePeerDomains,
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
		getStatus.mockReset()
		getStatusByActivityStreamsUri.mockReset()
		listInstanceModeratedDomains.mockReset()
		listInstancePeerDomains.mockReset()
	})

	it('materializes a typed global observation from the configured instance', async () => {
		vi.spyOn(Date, 'now').mockReturnValueOnce(1_700_000_000_100)
		getInstance.mockResolvedValueOnce({
			title: 'Mastodon',
			description: 'Federated social network',
			version: '4.3.0',
		})

		const observations = await resolver(
			EntityType._GlobalActivityPubNetwork,
			'$$timestamps'
		).resolve[_GlobalActivityPubNetworkSelector.Scope].resolve({
			scope: '_GlobalActivityPubNetwork',
		}, context)

		expect(getInstance).toHaveBeenCalledTimes(1)
		expect(observations).toHaveLength(1)
		expect(observations[0][EntityMetaKey.Selector]).toEqual({
			$hub: {
				scope: '_GlobalActivityPubNetwork',
			},
			timestampMs: 1_700_000_000_100,
			source: Source.Mastodon_Rest,
		})
		expect(Object.values(observations[0][EntityMetaKey.Fields])).toEqual(expect.arrayContaining([
			'https://mastodon.social',
			'Mastodon',
			'Federated social network',
			'4.3.0',
			2,
			true,
		]))
	})

	it('records an unreachable global observation without inventing instance metadata', async () => {
		vi.spyOn(Date, 'now').mockReturnValueOnce(1_700_000_000_101)
		getInstance.mockRejectedValueOnce(new Error('instance unavailable'))

		const observations = await resolver(
			EntityType._GlobalActivityPubNetwork,
			'$$timestamps'
		).resolve[_GlobalActivityPubNetworkSelector.Scope].resolve({
			scope: '_GlobalActivityPubNetwork',
		}, context)

		expect(Object.values(observations[0][EntityMetaKey.Fields])).toEqual([
			'https://mastodon.social',
			2,
			false,
		])
	})

	it('reuses persisted global observations without refetching current state', async () => {
		const observation = resolver(EntityType._GlobalActivityPubNetwork_Timestamp)

		await expect(observation.resolve[
			_GlobalActivityPubNetwork_TimestampSelector.HubTimestampMsSource
		].resolve({
			$hub: {
				scope: '_GlobalActivityPubNetwork',
			},
			timestampMs: 1_700_000_000_100,
			source: Source.Mastodon_Rest,
		}, context)).resolves.toEqual({
			$hub: {
				[EntityMetaKey.Selector]: {
					scope: '_GlobalActivityPubNetwork',
				},
			},
			timestampMs: 1_700_000_000_100,
			source: Source.Mastodon_Rest,
		})
		expect(getInstance).not.toHaveBeenCalled()
		await expect(observation.resolve[
			_GlobalActivityPubNetwork_TimestampSelector.HubTimestampMsSource
		].resolve({
			$hub: {
				scope: '_GlobalActivityPubNetwork',
			},
			timestampMs: 1_700_000_000_100,
			source: Source.Rss_Rest,
		}, context)).rejects.toThrow('source mismatch')
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
			severity: 'suspend',
		}])

		const observations = await resolver(
			EntityType.ActivityPubInstance,
			'$$timestamps'
		).resolve[ActivityPubInstanceSelector.InstanceOrigin].resolve({
			instanceOrigin: 'https://instance-one.example',
		}, context)

		expect(getInstance).toHaveBeenCalledTimes(1)
		expect(listInstancePeerDomains).toHaveBeenCalledTimes(1)
		expect(listInstanceModeratedDomains).toHaveBeenCalledTimes(1)
		expect(observations).toHaveLength(1)
		expect(observations[0][EntityMetaKey.Selector]).toEqual({
			$instance: {
				instanceOrigin: 'https://instance-one.example',
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
						domain: 'blocked.example',
					}),
				}),
			]),
		]))
	})

	it('keeps required instance metadata when optional topology endpoints are unavailable', async () => {
		vi.spyOn(Date, 'now').mockReturnValueOnce(1_700_000_000_001)
		getInstance.mockResolvedValueOnce({
			title: 'Available metadata',
			version: '4.3.1',
		})
		listInstancePeerDomains.mockRejectedValueOnce(new Error('peers unavailable'))
		listInstanceModeratedDomains.mockRejectedValueOnce(new Error('domain blocks unavailable'))

		const observations = await resolver(
			EntityType.ActivityPubInstance,
			'$$timestamps'
		).resolve[ActivityPubInstanceSelector.InstanceOrigin].resolve({
			instanceOrigin: 'https://metadata.example',
		}, context)
		const fields = Object.values(observations[0][EntityMetaKey.Fields])

		expect(getInstance).toHaveBeenCalledTimes(1)
		expect(listInstancePeerDomains).toHaveBeenCalledTimes(1)
		expect(listInstanceModeratedDomains).toHaveBeenCalledTimes(1)
		expect(fields).toContain('Available metadata')
		expect(fields).toContain('4.3.1')
		expect(fields).toEqual(expect.arrayContaining([
			[],
			[],
		]))
	})

	it('does not mask required instance metadata failure', async () => {
		getInstance.mockRejectedValueOnce(new Error('instance metadata unavailable'))
		listInstancePeerDomains.mockResolvedValueOnce([])
		listInstanceModeratedDomains.mockResolvedValueOnce([])

		await expect(resolver(
			EntityType.ActivityPubInstance,
			'$$timestamps'
		).resolve[ActivityPubInstanceSelector.InstanceOrigin].resolve({
			instanceOrigin: 'https://required.example',
		}, context)).rejects.toThrow('instance metadata unavailable')
	})

	it('converges local, acct, and ActivityStreams actor selectors on one source-shaped identity', async () => {
		const account = {
			id: 'actor-17',
			uri: 'https://actor-origin.example/users/alice',
			username: 'alice',
			acct: 'alice@federation.example',
			display_name: 'Alice',
		}
		getAccountByLocalAccountId.mockImplementation(async (_publicEnv, instanceOrigin, localAccountId) => {
			if (instanceOrigin !== 'https://actor-origin.example' || localAccountId !== 'actor-17')
				throw new Error('unknown local actor request')
			return account
		})
		getAccountByAcct.mockImplementation(async (_publicEnv, instanceOrigin, acct) => {
			if (instanceOrigin !== 'https://actor-origin.example' || acct !== 'alice@federation.example')
				throw new Error('unknown acct actor request')
			return account
		})
		getAccountByActivityStreamsUri.mockImplementation(async (_publicEnv, activityStreamsUri) => {
			if (activityStreamsUri !== account.uri)
				throw new Error('unknown ActivityStreams actor request')
			return account
		})
		const actor = resolver(EntityType.ActivityPubActor, 'activityStreamsUri')

		const local = await actor.resolve[ActivityPubActorSelector.LocalAccountId].resolve({
			instanceOrigin: 'https://actor-origin.example',
			localAccountId: 'actor-17',
		}, context)
		const acct = await actor.resolve[ActivityPubActorSelector.Acct].resolve({
			instanceOrigin: 'https://actor-origin.example',
			acct: 'alice@federation.example',
		}, context)
		const activityStreams = await actor.resolve[ActivityPubActorSelector.ActivityStreamsUri].resolve({
			activityStreamsUri: account.uri,
		}, context)

		expect(local).toEqual(acct)
		expect(acct).toEqual(activityStreams)
		expect(local).toMatchObject({
			instanceOrigin: 'https://actor-origin.example',
			localAccountId: 'actor-17',
			activityStreamsUri: account.uri,
		})
		expect(getAccountByLocalAccountId).toHaveBeenCalledTimes(1)
		expect(getAccountByAcct).toHaveBeenCalledTimes(1)
		expect(getAccountByActivityStreamsUri).toHaveBeenCalledTimes(1)
		await expect(actor.resolve[ActivityPubActorSelector.ActivityStreamsUri].resolve({
			activityStreamsUri: 'https://unknown-actor.example/users/mallory',
		}, context)).rejects.toThrow('unknown ActivityStreams actor request')
	})

	it('maps source-shaped note author, reply, boost, and media relations to typed entity references', async () => {
		const status = {
			id: 'note-9',
			uri: 'https://note-origin.example/users/alice/statuses/note-9',
			content: '<p>Hello federation</p>',
			created_at: '2026-07-16T12:00:00.000Z',
			account: {
				id: 'actor-17',
				uri: 'https://actor-origin.example/users/alice',
				acct: 'alice@federation.example',
			},
			in_reply_to_id: 'note-8',
			reblog: {
				id: 'remote-note-4',
				uri: 'https://boost-origin.example/users/bob/statuses/remote-note-4',
			},
			media_attachments: [{
				id: 'media-2',
				type: 'image',
				url: 'https://media-origin.example/files/image.png',
			}],
		}
		getStatus.mockImplementation(async (_publicEnv, instanceOrigin, localStatusId) => {
			if (instanceOrigin !== 'https://note-origin.example' || localStatusId !== 'note-9')
				throw new Error('unknown local note request')
			return status
		})
		getStatusByActivityStreamsUri.mockImplementation(async (_publicEnv, activityStreamsUri) => {
			if (activityStreamsUri !== status.uri)
				throw new Error('unknown ActivityStreams note request')
			return status
		})
		const note = resolver(EntityType.ActivityPubNote, 'content')

		const local = await note.resolve[ActivityPubNoteSelector.InstanceOriginLocalStatusId].resolve({
			instanceOrigin: 'https://note-origin.example',
			localStatusId: 'note-9',
		}, context)
		const activityStreams = await note.resolve[ActivityPubNoteSelector.ActivityStreamsUri].resolve({
			activityStreamsUri: status.uri,
		}, context)

		expect(local).toEqual(activityStreams)
		expect(local.$author).toEqual({
			[EntityMetaKey.Selector]: {
				activityStreamsUri: 'https://actor-origin.example/users/alice',
			},
		})
		expect(local.$inReplyTo).toEqual({
			[EntityMetaKey.Selector]: {
				instanceOrigin: 'https://note-origin.example',
				localStatusId: 'note-8',
			},
		})
		expect(local.$reblogOf).toEqual({
			[EntityMetaKey.Selector]: {
				activityStreamsUri: 'https://boost-origin.example/users/bob/statuses/remote-note-4',
			},
		})
		expect(local.$$media).toHaveLength(1)
		expect(getStatus).toHaveBeenCalledTimes(1)
		expect(getStatusByActivityStreamsUri).toHaveBeenCalledTimes(1)
		await expect(note.resolve[ActivityPubNoteSelector.ActivityStreamsUri].resolve({
			activityStreamsUri: 'https://unknown-note.example/users/mallory/statuses/1',
		}, context)).rejects.toThrow('unknown ActivityStreams note request')
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
				severity: 'suspend',
			}])
			.mockResolvedValueOnce([])
		const resolveObservation = resolver(
			EntityType.ActivityPubInstance,
			'$$timestamps'
		).resolve[ActivityPubInstanceSelector.InstanceOrigin].resolve

		const first = (await resolveObservation({
			instanceOrigin: 'https://history.example',
		}, context))[0]
		const second = (await resolveObservation({
			instanceOrigin: 'https://history.example',
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
						domain: 'formerly-blocked.example',
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

	it('does not refetch current state for historical actor, note, or instance selectors', async () => {
		const actor = resolver(EntityType.ActivityPubActor_Timestamp)
		const note = resolver(EntityType.ActivityPubNote_Timestamp)
		const instance = resolver(EntityType.ActivityPubInstance_Timestamp)

		expect(actor.resolve[
			ActivityPubActor_TimestampSelector.ActivityPubActorTimestampMsSource
		].resolve({
			$actor: {
				activityStreamsUri: 'https://actor.example/users/alice',
			},
			timestampMs: 1,
			source: Source.Mastodon_Rest,
		}, context)).toMatchObject({
			timestampMs: 1,
		})
		expect(note.resolve[
			ActivityPubNote_TimestampSelector.ActivityPubNoteTimestampMsSource
		].resolve({
			$note: {
				activityStreamsUri: 'https://note.example/users/alice/statuses/1',
			},
			timestampMs: 1,
			source: Source.Mastodon_Rest,
		}, context)).toMatchObject({
			timestampMs: 1,
		})
		expect(instance.resolve[
			ActivityPubInstance_TimestampSelector.InstanceTimestampMsSource
		].resolve({
			$instance: {
				instanceOrigin: 'https://instance.example',
			},
			timestampMs: 1,
			source: Source.Mastodon_Rest,
		}, context)).toMatchObject({
			timestampMs: 1,
		})
		expect(getInstance).not.toHaveBeenCalled()
		expect(listInstancePeerDomains).not.toHaveBeenCalled()
		expect(listInstanceModeratedDomains).not.toHaveBeenCalled()
	})

	it('keeps equal clocks distinct by source and rejects unsupported source reads', async () => {
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
		expect(() => resolver(EntityType.ActivityPubInstance_Timestamp).resolve[
			ActivityPubInstance_TimestampSelector.InstanceTimestampMsSource
		].resolve({
			...selector,
			source: Source.Constants_Internal,
		}, context)).toThrow('source mismatch')
	})
})
