import { afterEach, beforeEach, expect, it, vi } from 'vitest'

import { lensQueries } from '$/sources/Lens/Graphql/queries.ts'
import bindings from '$/sources/Lens/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Lens_Graphql][0]
const {
	queryAccount,
	queryAccountStats,
	queryAccounts,
	queryFeed,
	queryFeedPosts,
	queryFeeds,
	queryNamespace,
	queryNamespaces,
	queryPost,
	queryUsername,
	queryUsernames,
} = lensQueries


const fetchMock = vi.fn<typeof fetch>()
const response = (data: object) => new Response(JSON.stringify({ data }), {
	headers: {
		'content-type': 'application/json',
	},
})
const requestBody = (callIndex: number) => JSON.parse(String(fetchMock.mock.calls[callIndex][1]?.body))

beforeEach(() => {
	fetchMock.mockReset()
	vi.stubGlobal('fetch', fetchMock)
	vi.stubGlobal('window', {})
})

afterEach(() => {
	vi.unstubAllGlobals()
})


it('requests complete public account and post reading fields', async () => {
	const accountAddress = '0x1111111111111111111111111111111111111111'
	const username = {
		id: 'username-1',
		value: 'lens/alice',
		namespace: '0x2222222222222222222222222222222222222222',
		localName: 'alice',
		linkedTo: '0x1111111111111111111111111111111111111111',
		ownedBy: '0x1111111111111111111111111111111111111111',
		timestamp: '2026-07-20T12:00:00.000Z',
	}
	const account = {
		address: accountAddress,
		owner: '0x3333333333333333333333333333333333333333',
		createdAt: '2026-07-20T12:00:00.000Z',
		score: 42,
		username,
		metadata: {
			name: 'Alice',
			bio: 'Lens reader',
			picture: null,
		},
	}
	fetchMock
		.mockResolvedValueOnce(response({ account }))
		.mockResolvedValueOnce(response({
			post: {
				__typename: 'Post',
				slug: 'post-1',
				contentUri: 'lens://post-1',
				feed: {
					address: '0x4444444444444444444444444444444444444444',
					metadata: {
						name: 'Main feed',
						description: 'Public posts',
					},
				},
			},
		}))

	await expect(queryAccount({ address: accountAddress })).resolves.toMatchObject({
		account,
	})
	await expect(queryPost('post-1')).resolves.toMatchObject({
		post: {
			contentUri: 'lens://post-1',
			feed: {
				metadata: {
					name: 'Main feed',
				},
			},
		},
	})
	expect(requestBody(0).query).toMatch(/owner[\s\S]*score[\s\S]*username[\s\S]*linkedTo[\s\S]*ownedBy/)
	expect(requestBody(0).variables).toEqual({
		request: { address: accountAddress },
	})
	expect(requestBody(1).query).toMatch(/contentUri[\s\S]*feed[\s\S]*address[\s\S]*metadata/)
	expect(requestBody(1).variables).toEqual({ post: 'post-1' })
})

it('keeps account and observation provider operations independently addressable', async () => {
	const address = '0x1111111111111111111111111111111111111111'
	fetchMock
		.mockResolvedValueOnce(response({
			account: {
				address,
				username: { localName: 'alice' },
			},
		}))
		.mockResolvedValueOnce(response({ account: null }))
		.mockResolvedValueOnce(response({
			accountStats: {
				graphFollowStats: {
					followers: 5,
					following: 3,
				},
			},
		}))

	await queryAccount({ username: { localName: 'alice' } })
	await queryAccount({ legacyProfileId: '0x01' })
	await queryAccountStats(address)

	expect(fetchMock.mock.calls.map((_call, index) => requestBody(index).variables)).toEqual([
		{ request: { username: { localName: 'alice' } } },
		{ request: { legacyProfileId: '0x01' } },
		{ address },
	])
	expect(requestBody(0).query).toMatch(/query LensAccount/)
	expect(requestBody(1).query).toMatch(/query LensAccount/)
	expect(requestBody(2).query).toMatch(/query LensAccountStats/)
})

it('continues public directories by cursor, dedupes identities, and stops at exhaustion', async () => {
	const account = (address: `0x${string}`) => ({
		address,
		owner: address,
		createdAt: '2026-07-20T12:00:00.000Z',
		score: 1,
		username: null,
		metadata: null,
	})
	fetchMock
		.mockResolvedValueOnce(response({
			accounts: {
				items: [
					account('0x1111111111111111111111111111111111111111'),
					account('0x2222222222222222222222222222222222222222'),
				],
				pageInfo: { prev: null, next: 'page-2' },
			},
		}))
		.mockResolvedValueOnce(response({
			accounts: {
				items: [
					account('0x2222222222222222222222222222222222222222'),
					account('0x3333333333333333333333333333333333333333'),
				],
				pageInfo: { prev: 'page-1', next: null },
			},
		}))

	await expect(queryAccounts(3)).resolves.toMatchObject({
		accounts: {
			items: [
				{ address: '0x1111111111111111111111111111111111111111' },
				{ address: '0x2222222222222222222222222222222222222222' },
				{ address: '0x3333333333333333333333333333333333333333' },
			],
			pageInfo: { next: null },
		},
	})
	expect(requestBody(0).variables).toEqual({ pageSize: 'TEN' })
	expect(requestBody(1).variables).toEqual({
		pageSize: 'TEN',
		cursor: 'page-2',
	})

	fetchMock.mockReset()
	fetchMock
		.mockResolvedValueOnce(response({
			feeds: {
				items: [{
					address: '0x4444444444444444444444444444444444444444',
					rules: {
						required: [],
						anyOf: [],
					},
				}],
				pageInfo: { prev: null, next: 'stuck' },
			},
		}))
		.mockResolvedValueOnce(response({
			feeds: {
				items: [{
					address: '0x5555555555555555555555555555555555555555',
					rules: {
						required: [],
						anyOf: [],
					},
				}],
				pageInfo: { prev: null, next: 'stuck' },
			},
		}))
	await expect(queryFeeds(3)).resolves.toMatchObject({
		feeds: {
			items: [
				{ address: '0x4444444444444444444444444444444444444444' },
				{ address: '0x5555555555555555555555555555555555555555' },
			],
			pageInfo: { next: 'stuck' },
		},
	})
	expect(fetchMock).toHaveBeenCalledTimes(2)
})

it('parses documented feed and username namespace rules while retaining open configuration', async () => {
	const feedAddress = '0x1111111111111111111111111111111111111111'
	const namespaceAddress = '0x2222222222222222222222222222222222222222'
	fetchMock
		.mockResolvedValueOnce(response({
			feed: {
				address: feedAddress,
				rules: {
					required: [{
						id: 'feed-rule',
						type: 'SIMPLE_PAYMENT',
						address: '0x3333333333333333333333333333333333333333',
						executesOn: ['CREATING_POST'],
						config: [{
							__typename: 'RawKeyValue',
							provider_extension: 'open',
						}],
						provider_extension: 'dropped',
					}],
					anyOf: [],
				},
			},
		}))
		.mockResolvedValueOnce(response({
			namespace: {
				address: namespaceAddress,
				rules: {
					required: [],
					anyOf: [{
						id: 'namespace-rule',
						type: 'USERNAME_LENGTH',
						address: '0x4444444444444444444444444444444444444444',
						executesOn: ['CREATING'],
						config: [{
							__typename: 'IntKeyValue',
							int: 3,
						}],
					}],
					provider_extension: 'dropped',
				},
			},
		}))
		.mockResolvedValueOnce(response({
			feed: {
				address: feedAddress,
				rules: {
					required: [{
						id: 'feed-rule',
						type: 'USERNAME_LENGTH',
						address: '0x3333333333333333333333333333333333333333',
						executesOn: ['CREATING_POST'],
						config: [],
					}],
					anyOf: [],
				},
			},
		}))

	await expect(queryFeed(feedAddress)).resolves.toMatchObject({
		feed: {
			rules: {
				required: [{
					id: 'feed-rule',
					type: 'SIMPLE_PAYMENT',
					config: [{
						provider_extension: 'open',
					}],
				}],
			},
		},
	})
	await expect(queryNamespace(namespaceAddress)).resolves.toMatchObject({
		namespace: {
			rules: {
				anyOf: [{
					type: 'USERNAME_LENGTH',
				}],
			},
		},
	})
	await expect(queryFeed(feedAddress)).rejects.toThrow('invalid feed rules response')
	expect(requestBody(0).query).toMatch(/config[\s\S]*__typename/)
})

it('issues typed unsigned feed, username, and namespace detail and directory operations', async () => {
	const address = '0x1111111111111111111111111111111111111111'
	fetchMock
		.mockResolvedValueOnce(response({ feed: null }))
		.mockResolvedValueOnce(response({ feeds: { items: [], pageInfo: { next: null, prev: null } } }))
		.mockResolvedValueOnce(response({ username: null }))
		.mockResolvedValueOnce(response({ username: null }))
		.mockResolvedValueOnce(response({ usernames: { items: [], pageInfo: { next: null, prev: null } } }))
		.mockResolvedValueOnce(response({ namespace: null }))
		.mockResolvedValueOnce(response({ namespaces: { items: [], pageInfo: { next: null, prev: null } } }))

	await queryFeed(address)
	await queryFeeds(1)
	await queryUsername({ id: 'username-1' })
	await queryUsername({
		username: {
			namespace: address,
			localName: 'alice',
		},
	})
	await queryUsernames(1, { linkedTo: address })
	await queryNamespace(address)
	await queryNamespaces(1)

	expect(fetchMock).toHaveBeenCalledTimes(7)
	expect(fetchMock.mock.calls.map((_call, index) => requestBody(index).variables)).toEqual([
		{ address },
		{ pageSize: 'TEN' },
		{ request: { id: 'username-1' } },
		{
			request: {
				username: {
					namespace: address,
					localName: 'alice',
				},
			},
		},
		{ linkedTo: address, pageSize: 'TEN' },
		{ address },
		{ pageSize: 'TEN' },
	])
	expect(requestBody(0).query).toMatch(/owner[\s\S]*metadata[\s\S]*description/)
	expect(requestBody(2).query).toMatch(/query LensUsername/)
	expect(requestBody(2).query).toMatch(/value[\s\S]*namespace[\s\S]*linkedTo[\s\S]*ownedBy/)
	expect(requestBody(3).query).toMatch(/query LensUsername/)
	expect(requestBody(5).query).toMatch(/tokenName[\s\S]*tokenSymbol[\s\S]*totalUsernames/)
})

it('paginates and deduplicates unsigned posts for one exact feed', async () => {
	const address = '0x1111111111111111111111111111111111111111'
	const post = {
		__typename: 'Post',
		slug: 'post-1',
	}
	fetchMock
		.mockResolvedValueOnce(response({
			posts: {
				items: [post],
				pageInfo: { prev: null, next: 'page-2' },
			},
		}))
		.mockResolvedValueOnce(response({
			posts: {
				items: [post],
				pageInfo: { prev: 'page-1', next: 'page-3' },
			},
		}))
		.mockResolvedValueOnce(response({
			posts: {
				items: [{
					...post,
					slug: 'post-2',
				}],
				pageInfo: { prev: 'page-2', next: null },
			},
		}))

	await expect(queryFeedPosts(address, 2)).resolves.toMatchObject({
		posts: {
			items: [
				post,
				{
					...post,
					slug: 'post-2',
				},
			],
			pageInfo: { next: null },
		},
	})
	expect(fetchMock.mock.calls.map((_call, index) => requestBody(index).variables)).toEqual([
		{
			feed: address,
			pageSize: 'TEN',
		},
		{
			feed: address,
			pageSize: 'TEN',
			cursor: 'page-2',
		},
		{
			feed: address,
			pageSize: 'TEN',
			cursor: 'page-3',
		},
	])
	expect(requestBody(0).query).toMatch(/feeds:\s*\[\{\s*feed:\s*\$feed\s*\}\]/)
	expect(requestBody(0).query).toMatch(/contentUri[\s\S]*repostOf[\s\S]*slug/)
})

it('stops opaque-cursor pagination after repeated pages make no identity progress', async () => {
	const address = '0x1111111111111111111111111111111111111111'
	const post = {
		__typename: 'Post',
		slug: 'post-1',
	}
	fetchMock
		.mockResolvedValueOnce(response({
			posts: {
				items: [post],
				pageInfo: { prev: null, next: 'opaque+/=1' },
			},
		}))
		.mockResolvedValueOnce(response({
			posts: {
				items: [post],
				pageInfo: { prev: 'opaque+/=0', next: 'opaque+/=2' },
			},
		}))
		.mockResolvedValueOnce(response({
			posts: {
				items: [post],
				pageInfo: { prev: 'opaque+/=1', next: 'opaque+/=3' },
			},
		}))

	await expect(queryFeedPosts(address, 2)).resolves.toMatchObject({
		posts: {
			items: [post],
			pageInfo: { next: 'opaque+/=3' },
		},
	})
	expect(fetchMock.mock.calls.map((_call, index) => requestBody(index).variables.cursor)).toEqual([
		undefined,
		'opaque+/=1',
		'opaque+/=2',
	])
})

it('rejects foreign post response identities before enrichment', async () => {
	fetchMock.mockResolvedValueOnce(response({
		post: {
			__typename: 'Post',
			slug: 'foreign-post',
		},
	}))
	await expect(queryPost('requested-post')).rejects.toThrow('post response does not match request')
})

it('rejects malformed identities and invalid directory limits before transport', async () => {
	await expect(queryPost(' ')).rejects.toThrow('post identity must not be empty')
	await expect(queryAccounts(-1)).rejects.toThrow('page limit must be a nonnegative safe integer')
	await expect(queryFeeds(1.5)).rejects.toThrow('page limit must be a nonnegative safe integer')
	await expect(queryFeedPosts('0x1111111111111111111111111111111111111111', -1)).rejects.toThrow('page limit must be a nonnegative safe integer')
	expect(fetchMock).not.toHaveBeenCalled()
})
