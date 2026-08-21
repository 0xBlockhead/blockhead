import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/AtprotoBsky/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const {
	getFeedGenerator,
	getGraphList,
	getStarterPack,
} = await import('$/sources/AtprotoBsky/Rest/queries.ts')

const binding = bindings[Source.Atproto_Xrpc][0]
const feed = 'at://did:plc:alice/app.bsky.feed.generator/whats-hot'
const response = {
	view: {
		uri: feed,
		cid: 'bafyreifeed',
		did: 'did:web:feeds.example.com',
		creator: {
			did: 'did:plc:alice',
			handle: 'alice.test',
		},
		displayName: 'What’s Hot',
		description: 'Popular posts',
		avatar: 'https://cdn.bsky.app/feed.png',
		likeCount: 12,
		acceptsInteractions: true,
		contentMode: 'app.bsky.feed.defs#contentModeUnspecified',
		indexedAt: '2026-08-20T12:00:00.000Z',
	},
	isOnline: true,
	isValid: true,
}

describe('AtprotoBsky feed-generator query', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('requests and parses the exact feed-generator AT URI', async () => {
		sourceGetJson.mockResolvedValue(response)

		await expect(getFeedGenerator(binding, feed)).resolves.toEqual(response)
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			`https://public.api.bsky.app/xrpc/app.bsky.feed.getFeedGenerator?feed=${encodeURIComponent(feed)}`
		)
	})

	it('fails closed when the appview returns another feed', async () => {
		sourceGetJson.mockResolvedValue({
			...response,
			view: {
				...response.view,
				uri: 'at://did:plc:bob/app.bsky.feed.generator/other',
			},
		})

		await expect(getFeedGenerator(binding, feed)).rejects.toThrow(
			'BskyAppView_Xrpc: feed-generator response subject mismatch'
		)
	})

	it('fails closed on an incomplete response envelope', async () => {
		sourceGetJson.mockResolvedValue({
			view: response.view,
			isOnline: true,
		})

		await expect(getFeedGenerator(binding, feed)).rejects.toThrow(
			'BskyAppView_Xrpc: invalid feed-generator response envelope'
		)
	})
})

describe('AtprotoBsky graph declarations', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('requests graph lists and starter packs by their exact AT URI', async () => {
		const list = 'at://did:plc:alice/app.bsky.graph.list/team'
		const starterPack = 'at://did:plc:alice/app.bsky.graph.starterpack/welcome'
		const listResponse = {
			list: {
				uri: list, cid: 'bafylist', creator: { did: 'did:plc:alice', handle: 'alice.test' },
				name: 'Team', purpose: 'app.bsky.graph.defs#referencelist', indexedAt: '2026-08-21T00:00:00.000Z',
			}, items: [],
		}
		const starterPackResponse = {
			starterPack: {
				uri: starterPack, cid: 'bafypack', creator: { did: 'did:plc:alice', handle: 'alice.test' },
				list: { uri: list, cid: 'bafylist', name: 'Team', purpose: 'app.bsky.graph.defs#referencelist' },
				indexedAt: '2026-08-21T00:00:00.000Z',
			},
		}
		sourceGetJson.mockResolvedValueOnce(listResponse).mockResolvedValueOnce(starterPackResponse)

		await expect(getGraphList(binding, list)).resolves.toEqual(listResponse)
		await expect(getStarterPack(binding, starterPack)).resolves.toEqual(starterPackResponse)
		expect(sourceGetJson).toHaveBeenNthCalledWith(1, binding, `https://public.api.bsky.app/xrpc/app.bsky.graph.getList?list=${encodeURIComponent(list)}`)
		expect(sourceGetJson).toHaveBeenNthCalledWith(2, binding, `https://public.api.bsky.app/xrpc/app.bsky.graph.getStarterPack?starterPack=${encodeURIComponent(starterPack)}`)
	})

	it('fails closed when a graph subject does not match the requested URI', async () => {
		const list = 'at://did:plc:alice/app.bsky.graph.list/team'
		sourceGetJson.mockResolvedValue({
			list: { uri: 'at://did:plc:bob/app.bsky.graph.list/other', cid: 'bafylist', creator: { did: 'did:plc:bob', handle: 'bob.test' }, name: 'Other', purpose: 'app.bsky.graph.defs#referencelist', indexedAt: '2026-08-21T00:00:00.000Z' },
			items: [],
		})
		await expect(getGraphList(binding, list)).rejects.toThrow('BskyAppView_Xrpc: graph-list response subject mismatch')
	})
})
