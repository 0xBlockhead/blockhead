import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { schemaSource } from '$/sources/Youtube/Discovery/schema-source.ts'
import type {
	YoutubeApiChannel,
	YoutubeApiChannelsListResponse,
	YoutubeApiComment,
	YoutubeApiSnippet,
	YoutubeApiVideo,
	YoutubeApiVideosListResponse,
} from '$/sources/Youtube/Rest/types.ts'

const discoveryDir = dirname(fileURLToPath(import.meta.url))

describe('Youtube Discovery schema-source', () => {
	it('declares a checked-in Discovery document and generated typesFile', () => {
		expect(schemaSource.schemaUrl).toContain('youtube.googleapis.com/$discovery/rest')
		expect(schemaSource.schemaFile).toBe('./youtube-v3.json')
		expect(schemaSource.typesFile).toBe('./discovery.d.ts')
		expect(readFileSync(resolve(discoveryDir, schemaSource.schemaFile), 'utf8')).toContain('"youtube:v3"')
		expect(readFileSync(resolve(discoveryDir, schemaSource.typesFile), 'utf8')).toContain('ChannelListResponse:')
	})

	it('exposes Rest wire aliases from generated Discovery schemas', () => {
		const channel = {
			kind: 'youtube#channel',
			id: 'UC123',
			snippet: {
				title: 'Channel',
			},
			statistics: {
				subscriberCount: '1',
			},
		} as const satisfies YoutubeApiChannel
		const video = {
			kind: 'youtube#video',
			id: 'vid',
			snippet: {
				title: 'Video',
				channelId: channel.id,
			},
			statistics: {
				viewCount: '2',
			},
			contentDetails: {
				duration: 'PT1M',
			},
		} as const satisfies YoutubeApiVideo
		const comment = {
			kind: 'youtube#comment',
			id: 'c1',
			snippet: {
				authorChannelId: {
					value: channel.id,
				},
				textOriginal: 'hi',
			},
		} as const satisfies YoutubeApiComment

		expect([
			channel.id,
			video.id,
			comment.id,
		]).toEqual([
			'UC123',
			'vid',
			'c1',
		])

		const channels = {
			kind: 'youtube#channelListResponse',
			items: [channel],
		} as const satisfies YoutubeApiChannelsListResponse
		const videos = {
			kind: 'youtube#videoListResponse',
			items: [video],
		} as const satisfies YoutubeApiVideosListResponse
		expect(channels.items?.[0]?.id).toBe('UC123')
		expect(videos.items?.[0]?.id).toBe('vid')

		const snippet = {
			title: 'Video',
			channelId: channel.id,
			channelTitle: 'Channel',
			categoryId: '22',
			tags: ['tag'],
			liveBroadcastContent: 'none',
			customUrl: '@channel',
		} as const satisfies YoutubeApiSnippet
		expect(snippet.channelTitle).toBe('Channel')
	})
})
