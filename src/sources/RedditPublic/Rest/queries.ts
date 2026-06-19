import {
	redditJsonGet,
	redditTextGet,
} from '$/sources/RedditPublic/Rest/client.ts'
import type {
	RedditPublicApiInfoResponse,
	RedditPublicApiListing,
	RedditPublicApiSubredditAbout,
	RedditPublicApiThing,
} from '$/sources/RedditPublic/Rest/types.ts'

const decodeXmlEntities = (value: string) => (
	value
		.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, '\'')
		.trim()
)

const tagText = (
	block: string,
	tagName: string
) => (
	((match) => (
		match?.trim() ?
			decodeXmlEntities(match)
		:
			undefined
	))(
		block.match(
			new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'i')
		)?.[1]
	)
)

const linkHref = (block: string) => (
	((match) => (
		match?.trim() ?
			decodeXmlEntities(match)
		:
			undefined
	))(
		block.match(/<link[^>]*\srel=['"]alternate['"][^>]*href=['"]([^'"]+)['"]/i)?.[1]
		?? block.match(/<link[^>]*href=['"]([^'"]+)['"][^>]*\srel=['"]alternate['"]/i)?.[1]
	)
)

const redditFullnameFromEntry = (block: string) => (
	((id) => (
		id == null ?
			undefined
		:
			((match) => (
				match?.[1] != null ?
					`t3_${match[1]}`
				:
					undefined
			))(id.match(/\/comments\/([a-z0-9]+)\//i))
	))(tagText(block, 'id') ?? linkHref(block))
)

const redditAuthorFromEntry = (block: string) => (
	((authorBlock) => (
		authorBlock == null ?
			undefined
		:
			tagText(authorBlock, 'name')
	))(block.match(/<author(?:\s[^>]*)?>([\s\S]*?)<\/author>/i)?.[1])
)

const redditThingFromRssEntry = (
	block: string,
	subredditName: string
): RedditPublicApiThing | undefined => (
	((fullname) => (
		fullname == null ?
			undefined
			:
				{
					kind: 't3' as const,
					data: {
						name: fullname,
						subreddit: subredditName,
						title: tagText(block, 'title') ?? fullname,
						permalink: new URL(linkHref(block) ?? `https://www.reddit.com/comments/${fullname.slice(3)}/`).pathname,
						author: redditAuthorFromEntry(block) ?? '',
						created_utc: ((publishedAt) => (
							publishedAt != null && Number.isFinite(Date.parse(publishedAt)) ?
								Math.floor(Date.parse(publishedAt) / 1_000)
							:
								0
						))(tagText(block, 'updated') ?? tagText(block, 'published')),
					},
				}
	))(redditFullnameFromEntry(block))
)

const listSubredditRss = async (
	name: string,
	limit: number
): Promise<RedditPublicApiListing> => ({
	kind: 'Listing',
	data: {
		children: (
			await redditTextGet(`/r/${encodeURIComponent(name)}/.rss`)
		)
				.match(/<entry[\s>][\s\S]*?<\/entry>/gi)
				?.slice(0, limit)
				.flatMap((entry) => {
					const thing = redditThingFromRssEntry(entry, name)
					return thing == null ? [] : [thing]
				}) ?? [],
	},
})

export const getInfo = async (id: string) => (
	redditJsonGet<RedditPublicApiInfoResponse>(
		`/api/info.json?${(
			new URLSearchParams({ id, raw_json: '1' }).toString()
		)}` as const
	)
)

export const getSubredditAbout = async (name: string) => (
	redditJsonGet<RedditPublicApiSubredditAbout>(
		`/r/${encodeURIComponent(name)}/about.json?raw_json=1` as const
	)
)

export const listSubredditHot = async (
	name: string,
	limit: number
) => (
	await redditJsonGet<RedditPublicApiListing>(
		`/r/${encodeURIComponent(name)}/hot.json?${(
			new URLSearchParams({
				limit: String(limit),
				raw_json: '1',
			}).toString()
		)}` as const
	).catch(async () => (
		await listSubredditRss(name, limit)
	))
)

export const getComments = async (
	permalink: string,
	limit: number
) => (
	redditJsonGet<RedditPublicApiListing[]>(
		`${permalink.startsWith('/') ? permalink : `/${permalink}`}.json?${(
			new URLSearchParams({
				limit: String(limit),
				raw_json: '1',
			}).toString()
		)}`
	)
)

export const getCommentsByArticleId = async (
	articleId: string,
	limit: number
) => (
	redditJsonGet<RedditPublicApiListing[]>(
		`/comments/${encodeURIComponent(articleId)}.json?${(
			new URLSearchParams({
				limit: String(limit),
				raw_json: '1',
			}).toString()
		)}` as const
	)
)
