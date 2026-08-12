import { rssTimestampMs } from '$/sources/_shared/interfaces/Rss/constants.ts'

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

const firstTagText = (
	block: string,
	tagNames: readonly string[]
) => {
	for (const tagName of tagNames) {
		const match = block.match(
			new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'i')
		)?.[1]
		if (match?.trim()) return decodeXmlEntities(match)
	}
	return undefined
}

const linkHrefFromBlock = (
	block: string,
	rel?: 'alternate' | 'self'
) => {
	if (rel) {
		for (const pattern of [
			new RegExp(`<link[^>]*\\srel=['"]${rel}['"][^>]*href=['"]([^'"]+)['"]`, 'i'),
			new RegExp(`<link[^>]*href=['"]([^'"]+)['"][^>]*\\srel=['"]${rel}['"]`, 'i'),
		]) {
			const match = block.match(pattern)?.[1]
			if (match?.trim()) return decodeXmlEntities(match)
		}
	}
	const href = block.match(/<link[^>]*href=['"]([^'"]+)['"][^>]*\/?>/i)?.[1]
	if (href?.trim()) return decodeXmlEntities(href)
	return firstTagText(block, ['link'])
}

const authorFromBlock = (
	block: string,
	fallbackAuthor?: string
) => {
	for (const tagName of ['author', 'dc:creator']) {
		const escapedTagName = tagName.replace(':', '\\:')
		const authorBlock = block.match(
			new RegExp(`<${escapedTagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escapedTagName}>`, 'i')
		)?.[1]
		if (!authorBlock?.trim()) continue
		const name = authorBlock.match(/<name(?:\s[^>]*)?>([\s\S]*?)<\/name>/i)?.[1]
		if (name?.trim()) return decodeXmlEntities(name)
		if (!authorBlock.includes('<')) return decodeXmlEntities(authorBlock)
	}
	return fallbackAuthor
}

const publishedAtFromBlock = (block: string) => {
	for (const tagName of ['pubDate', 'published']) {
		const timestampMs = rssTimestampMs(firstTagText(block, [tagName]))
		if (timestampMs != null) return timestampMs
	}
	return undefined
}

const categoriesFromBlock = (block: string) => {
	const categories: string[] = []
	for (const match of block.matchAll(/<category(?:\s[^>]*)?>([\s\S]*?)<\/category>/gi)) {
		const text = match[1]?.trim()
		if (text) categories.push(decodeXmlEntities(text))
	}
	for (const match of block.matchAll(/<category\s+term=['"]([^'"]+)['"]/gi)) {
		const term = match[1]?.trim()
		if (term) categories.push(decodeXmlEntities(term))
	}
	return [...new Set(categories)]
}

const enclosureUrlFromBlock = (block: string) => {
	for (const pattern of [
		/<enclosure[^>]+url=['"]([^'"]+)['"]/i,
		/<link[^>]*\srel=['"]enclosure['"][^>]*href=['"]([^'"]+)['"]/i,
		/<link[^>]*href=['"]([^'"]+)['"][^>]*\srel=['"]enclosure['"]/i,
		/<media:content[^>]+url=['"]([^'"]+)['"]/i,
		/<podcast:alternateEnclosure[\s>][\s\S]*?<podcast:source[^>]+uri=['"]([^'"]+)['"]/i,
	]) {
		const match = block.match(pattern)?.[1]
		if (match?.trim()) return decodeXmlEntities(match)
	}
	return undefined
}

const commentsUrlFromBlock = (block: string) => {
	const match = firstTagText(block, ['comments'])
	if (match?.trim()) return match
	return undefined
}

const updatedAtFromBlock = (block: string) => (
	rssTimestampMs(firstTagText(block, ['updated']))
)

const imageUrlFromBlock = (block: string) => {
	const rssImage = block.match(/<image[\s>][\s\S]*?<\/image>/i)?.[0]
	if (rssImage) {
		const url = firstTagText(rssImage, ['url'])
		if (url?.trim()) return url
	}
	const atomLogo = firstTagText(block, ['logo'])
	if (atomLogo?.trim()) return atomLogo
	const atomIcon = firstTagText(block, ['icon'])
	if (atomIcon?.trim()) return atomIcon
	return undefined
}

const itemBlocksFromXml = (xml: string) => (
	xml.includes('<entry') ?
		[...xml.matchAll(/<entry[\s>][\s\S]*?<\/entry>/gi)].map((match) => match[0])
	:
		[...xml.matchAll(/<item[\s>][\s\S]*?<\/item>/gi)].map((match) => match[0])
)

const parseItemBlock = (
	block: string,
	options: {
		isAtom: boolean
		feedAuthor?: string
	}
) => {
	const title = firstTagText(block, ['title'])
	const link = (
		options.isAtom ?
			linkHrefFromBlock(block, 'alternate')
		:
			linkHrefFromBlock(block)
	)
	const guid = firstTagText(block, ['guid', 'id'])
	if ((guid == null || guid.trim() === '') && link == null) return null
	const author = authorFromBlock(block, options.feedAuthor)
	const publishedAtStrict = publishedAtFromBlock(block)
	const updatedAtRaw = updatedAtFromBlock(block)
	const publishedAt = publishedAtStrict ?? updatedAtRaw
	const updatedAt = (
		publishedAtStrict != null
		&& updatedAtRaw != null
		&& updatedAtRaw !== publishedAtStrict
	) ?
		updatedAtRaw
	:
		undefined
	const categories = categoriesFromBlock(block)
	const enclosureUrl = enclosureUrlFromBlock(block)
	const commentsUrl = commentsUrlFromBlock(block)
	return {
		...(guid != null && guid.trim() !== '' && { guid: guid.trim() }),
		...(title != null && { title }),
		...(link != null && { link }),
		...(firstTagText(block, ['description', 'summary']) != null && {
			description: firstTagText(block, ['description', 'summary']),
		}),
		...(firstTagText(block, ['content:encoded', 'content']) != null && {
			content: firstTagText(block, ['content:encoded', 'content']),
		}),
		...(author != null && { author }),
		...(publishedAt != null && { publishedAt }),
		...(updatedAt != null && { updatedAt }),
		...(categories.length > 0 && { categories }),
		...(enclosureUrl != null && { enclosureUrl }),
		...(commentsUrl != null && { commentsUrl }),
	}
}

export const parseRssFeedXml = (xml: string) => {
	const rootXml = xml.trim().replace(/^\uFEFF?\s*<\?xml[\s\S]*?\?>\s*/i, '')
	const isAtom = /^<feed[\s>]/i.test(rootXml)
	if (!isAtom && !/^<rss[\s>]/i.test(rootXml))
		throw new Error('Rss_Rest: invalid feed XML envelope')
	const channelBlock = (
		xml.match(/<channel[\s>][\s\S]*?<\/channel>/i)?.[0]
		?? xml.match(/<feed[\s>][\s\S]*?<\/feed>/i)?.[0]
		?? xml
	)
	const feedAuthor = authorFromBlock(channelBlock)
	const websiteUrl = (
		isAtom ?
			linkHrefFromBlock(channelBlock, 'alternate')
		:
			firstTagText(channelBlock, ['link'])
			?? linkHrefFromBlock(channelBlock)
	)
	const lastBuildDate = rssTimestampMs(firstTagText(channelBlock, ['lastBuildDate', 'updated']))
	const imageUrl = imageUrlFromBlock(channelBlock)
	return {
		...(firstTagText(channelBlock, ['title']) != null && {
			title: firstTagText(channelBlock, ['title']),
		}),
		...(firstTagText(channelBlock, ['description', 'subtitle']) != null && {
			description: firstTagText(channelBlock, ['description', 'subtitle']),
		}),
		...(websiteUrl != null && {
			siteUrl: websiteUrl,
		}),
		...(firstTagText(channelBlock, ['language']) != null && {
			language: firstTagText(channelBlock, ['language']),
		}),
		...(lastBuildDate != null && {
			lastBuildDate,
		}),
		...(imageUrl != null && { imageUrl }),
		items: itemBlocksFromXml(xml)
			.map((block) => (
				parseItemBlock(block, {
					isAtom,
					...(feedAuthor != null && { feedAuthor }),
				})
			))
			.flatMap((item) => (
				item == null ?
					[]
				:
					[item]
			)),
	}
}
