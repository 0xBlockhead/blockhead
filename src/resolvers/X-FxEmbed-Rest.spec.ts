import { describe, expect, it, vi } from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MediaTransport } from '$/schema/MediaTransport.ts'
import { MediaType } from '$/schema/MediaType.ts'

const fxEmbedQueries = vi.hoisted(() => ({
	getStatus: vi.fn(),
	getUser: vi.fn(),
	getUserStatuses: vi.fn(),
	searchStatuses: vi.fn(),
}))

vi.mock('$/sources/FxEmbed/Rest/queries.ts', () => fxEmbedQueries)

const { default: fxEmbedResolvers } = await import('$/resolvers/X-FxEmbed-Rest.ts')

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
	limit: 10,
}

describe('X FxEmbed reading materialization', () => {
	it('prefills readable users and posts from network search results', async () => {
		fxEmbedQueries.searchStatuses.mockResolvedValue({
			cursor: {
				top: null,
				bottom: 'search/+ %=cursor',
			},
			results: [{
				type: 'status',
				id: 'post-1',
				text: 'Readable fixture post',
				created_timestamp: 1_768_435_200,
				author: {
					id: 'user-1',
					screen_name: 'reader',
					name: 'Fixture Reader',
					avatar_url: 'https://images.example/avatar.jpg',
					banner_url: 'https://images.example/banner.jpg',
					joined: '2026-01-01T00:00:00Z',
					website: {
						url: 'https://reader.example',
						display_url: 'reader.example',
					},
				},
			}],
		})

		const snapshot = await fxEmbedResolvers.resolvers[2].resolve['Scope'].resolve(
			{ scope: 'XNetwork' },
			resolverContext
		)
		const users = fxEmbedResolvers.resolvers[2].projections.$$xUsers.select(snapshot)
		const posts = fxEmbedResolvers.resolvers[2].projections.$$xPosts.select(snapshot)
		const expectedUserReference = {
			[EntityMetaKey.Selector]: { id: 'user-1' },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XUser, [], 'username')]: 'reader',
				[entityFieldAddressKey(EntityType.XUser, [], 'name')]: 'Fixture Reader',
				[entityFieldAddressKey(EntityType.XUser, [], 'createdAt')]: 1_767_225_600_000,
				[entityFieldAddressKey(EntityType.XUser, [], 'websiteUrl')]: 'https://reader.example',
				[entityFieldAddressKey(EntityType.XUser, [], '$icon')]: {
					[EntityMetaKey.Selector]: { url: 'https://images.example/avatar.jpg' },
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.Media, [], 'type')]: MediaType.Image,
						[entityFieldAddressKey(EntityType.Media, [], 'transport')]: MediaTransport.Http,
					},
				},
				[entityFieldAddressKey(EntityType.XUser, [], '$profileBanner')]: {
					[EntityMetaKey.Selector]: { url: 'https://images.example/banner.jpg' },
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.Media, [], 'type')]: MediaType.Image,
						[entityFieldAddressKey(EntityType.Media, [], 'transport')]: MediaTransport.Http,
					},
				},
			},
		}

		expect(users).toEqual([expectedUserReference])
		expect(posts).toEqual([{
			[EntityMetaKey.Selector]: { id: 'post-1' },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XPost, [], 'text')]: 'Readable fixture post',
				[entityFieldAddressKey(EntityType.XPost, [], 'createdAt')]: 1_768_435_200_000,
				[entityFieldAddressKey(EntityType.XPost, [], '$author')]: expectedUserReference,
			},
		}])
		expect(fxEmbedQueries.searchStatuses).toHaveBeenCalledOnce()
		expect(fxEmbedQueries.searchStatuses).toHaveBeenCalledWith(64, undefined)
		expect(fxEmbedResolvers.resolvers[2].projections.$$xPosts.continuation(snapshot)).toEqual({
			operation: 'timeline',
			target: 'fxembed-api',
			viewerScope: 'search:latest:lang:en -is:retweet',
			terminal: false,
			token: 'search/+ %=cursor',
		})
	})

	it('prefills profile posts only for the selected author', async () => {
		fxEmbedQueries.getUserStatuses.mockResolvedValue({
			cursor: {
				top: null,
				bottom: 'profile/+ %=cursor',
			},
			results: [
				{
					type: 'status',
					id: 'post-2',
					text: 'Profile fixture post',
					created_timestamp: 1_768_435_201,
					author: {
						id: 'user-1',
					},
				},
				{
					type: 'status',
					id: 'foreign-post',
					created_timestamp: 1_768_435_202,
					author: {
						id: 'user-2',
					},
				},
			],
		})

		const snapshot = await fxEmbedResolvers.resolvers[3].resolve['Id'].resolve(
			{ id: 'user-1' },
			{
				...resolverContext,
				providerContinuationToken: 'prior/+ %=cursor',
			}
		)
		const posts = fxEmbedResolvers.resolvers[3].projections.$$posts.select(snapshot)

		expect(posts).toEqual([{
			[EntityMetaKey.Selector]: { id: 'post-2' },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XPost, [], 'text')]: 'Profile fixture post',
				[entityFieldAddressKey(EntityType.XPost, [], 'createdAt')]: 1_768_435_201_000,
				[entityFieldAddressKey(EntityType.XPost, [], '$author')]: {
					[EntityMetaKey.Selector]: { id: 'user-1' },
				},
			},
		}])
		expect(fxEmbedQueries.getUserStatuses).toHaveBeenCalledWith(
			'user-1',
			64,
			'prior/+ %=cursor'
		)
		expect(fxEmbedResolvers.resolvers[3].projections.$$posts.continuation(snapshot)).toEqual({
			operation: 'timeline',
			target: 'fxembed-api',
			viewerScope: 'id:user-1',
			terminal: false,
			token: 'profile/+ %=cursor',
		})
	})

	it('keeps profile viewer identities distinct and deduplicates a boundary post', async () => {
		fxEmbedQueries.getUserStatuses.mockResolvedValue({
			cursor: {
				top: null,
				bottom: '',
			},
			results: [
				{
					type: 'status',
					id: 'boundary-post',
					created_timestamp: 1_768_435_201,
					author: {
						id: 'user-1',
						screen_name: 'Reader',
					},
				},
				{
					type: 'status',
					id: 'boundary-post',
					created_timestamp: 1_768_435_201,
					author: {
						id: 'user-1',
						screen_name: 'Reader',
					},
				},
			],
		})

		const snapshot = await fxEmbedResolvers.resolvers[3].resolve['Username'].resolve(
			{ username: 'READER' },
			resolverContext
		)

		expect(fxEmbedResolvers.resolvers[3].projections.$$posts.select(snapshot))
			.toHaveLength(1)
		expect(fxEmbedResolvers.resolvers[3].projections.$$posts.continuation(snapshot)).toEqual({
			operation: 'timeline',
			target: 'fxembed-api',
			viewerScope: 'username:reader',
			terminal: true,
		})
	})
})

describe('X FxEmbed post media', () => {
	it('materializes native media attachments on post snapshots', async () => {
		fxEmbedQueries.getStatus.mockResolvedValueOnce({
			status: {
				type: 'status',
				id: 'post-media',
				text: 'Photo post',
				created_timestamp: 1_768_435_200,
				author: {
					id: 'user-1',
				},
				media: {
					photos: [{
						id: 'photo-1',
						type: 'photo',
						url: 'https://images.example/photo.jpg',
						width: 1200,
						height: 800,
					}],
					videos: [{
						id: 'video-1',
						type: 'video',
						url: 'https://video.example/video.mp4',
						transcode_url: 'https://video.example/video-transcoded.mp4',
						width: 1280,
						height: 720,
						duration: 12,
						formats: [],
					}],
				},
			},
		})

		const snapshot = await fxEmbedResolvers.resolvers[1].resolve['Id'].resolve(
			{ id: 'post-media' },
			resolverContext
		)

		expect(snapshot.$$media).toEqual([
			{
				[EntityMetaKey.Selector]: { url: 'https://images.example/photo.jpg' },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.Media, [], 'type')]: MediaType.Image,
					[entityFieldAddressKey(EntityType.Media, [], 'transport')]: MediaTransport.Http,
					[entityFieldAddressKey(EntityType.Media, [], 'hash')]: 'photo-1',
				},
			},
			{
				[EntityMetaKey.Selector]: { url: 'https://video.example/video-transcoded.mp4' },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.Media, [], 'type')]: MediaType.Video,
					[entityFieldAddressKey(EntityType.Media, [], 'transport')]: MediaTransport.Http,
					[entityFieldAddressKey(EntityType.Media, [], 'hash')]: 'video-1',
				},
			},
		])
		expect(fxEmbedResolvers.resolvers[1].projections.$$media.select(snapshot)).toEqual(snapshot.$$media)
		expect(fxEmbedResolvers.resolvers[1].projections.$$media.resolveCount(snapshot)).toBe(2)
	})
})
