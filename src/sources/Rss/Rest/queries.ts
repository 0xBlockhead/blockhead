import { rssFetchFeed } from '$/sources/Rss/Rest/client.ts'
import bindings from '$/sources/Rss/bindings.ts'
import { Source } from '$/sources/Source.ts'

export const rssBindingByOrigin = new Map(
	bindings[Source.Rss_Rest].map((binding) => [
		binding.target.key,
		binding,
	] as const)
)

export const getFeed = (
	binding: (typeof bindings)[Source.Rss_Rest][number],
	feedUrl: string
) => (
	rssFetchFeed(binding, feedUrl)
)
