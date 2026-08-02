import {
	redditJsonGet,
	redditTextGet,
} from '$/sources/RedditPublic/Rest/client.ts'
import type {
	RedditPublicApiInfoResponse,
	RedditPublicApiListing,
	RedditPublicApiListingRequest,
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

const redditListingLimit = (limit: number) => {
	if (!Number.isSafeInteger(limit) || limit < 0)
		throw new Error('Reddit_PublicJson: listing limit must be a nonnegative safe integer')
	return Math.min(100, limit)
}

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
					kind: 't3',
					data: {
						name: fullname,
						subreddit: subredditName,
						title: tagText(block, 'title') ?? fullname,
						permalink: new URL(linkHref(block) ?? `https://www.reddit.com/comments/${fullname.slice(3)}/`).pathname,
						author: redditAuthorFromEntry(block) ?? '',
						...((publishedAt) => (
							publishedAt != null && Number.isFinite(Date.parse(publishedAt)) && {
								created_utc: Math.floor(Date.parse(publishedAt) / 1_000),
							}
						))(tagText(block, 'updated') ?? tagText(block, 'published')),
					},
				}
	))(redditFullnameFromEntry(block))
)

const listSubredditRss = async (
	name: string,
	limit: number
) => ({
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

export const getInfo = (id: string) => (
	redditJsonGet<RedditPublicApiInfoResponse>(
		`/api/info.json?${(
			new URLSearchParams({ id, raw_json: '1' }).toString()
		)}`
	)
)

export const getSubredditAbout = (name: string) => (
	redditJsonGet<RedditPublicApiSubredditAbout>(
		`/r/${encodeURIComponent(name)}/about.json?raw_json=1`
	)
)

export const listSubredditLinks = async (
	name: string,
	request: RedditPublicApiListingRequest
) => {
	const limit = redditListingLimit(request.limit)
	if (limit === 0)
		return {
			kind: 'Listing',
			data: { children: [] },
		}

	return redditJsonGet<RedditPublicApiListing>(
		`/r/${encodeURIComponent(name)}/${request.sort}.json?${(
			new URLSearchParams({
				...(request.after !== undefined && {
					after: request.after,
				}),
				limit: String(limit),
				raw_json: '1',
			}).toString()
		)}`
	).catch(
		request.sort === 'hot' && request.after === undefined ?
			() => listSubredditRss(name, limit)
		:
			undefined
	)
}

export const getCommentsByArticleId = async (
	articleId: string,
	limit: number
) => {
	const boundedLimit = redditListingLimit(limit)
	if (boundedLimit === 0)
		return [
			{ kind: 'Listing', data: { children: [] } },
			{ kind: 'Listing', data: { children: [] } },
		] satisfies RedditPublicApiListing[]

	return redditJsonGet<RedditPublicApiListing[]>(
		`/comments/${encodeURIComponent(articleId)}.json?${(
			new URLSearchParams({
				limit: String(boundedLimit),
				raw_json: '1',
			}).toString()
		)}`
	)
}
