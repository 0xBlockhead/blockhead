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
	tagNames: readonly string[],
) => {
	for (const tagName of tagNames) {
		const match = block.match(
			new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'i'),
		)?.[1]
		if (match?.trim()) return decodeXmlEntities(match)
	}
	return undefined
}

const itemBlocksFromXml = (xml: string) => (
	xml.includes('<entry') ?
		[...xml.matchAll(/<entry[\s>][\s\S]*?<\/entry>/gi)].map((match) => match[0])
	:
		[...xml.matchAll(/<item[\s>][\s\S]*?<\/item>/gi)].map((match) => match[0])
)

const parseItemBlock = (block: string) => {
	const title = firstTagText(block, ['title'])
	const link = (
		block.match(/<link[^>]*href=['"]([^'"]+)['"][^>]*\/?>/i)?.[1]
		?? firstTagText(block, ['link'])
	)
	const guid = (
		firstTagText(block, ['guid', 'id'])
		?? link
		?? title
	)
	if (guid == null || guid.trim() === '') return null
	const pubDate = (
		firstTagText(block, ['pubDate', 'published', 'updated'])
	)
	const publishedAt = (
		pubDate != null && Number.isFinite(Date.parse(pubDate)) ?
			Date.parse(pubDate)
		:
			undefined
	)
	return {
		guid: guid.trim(),
		...(title != null && { title }),
		...(link != null && { link }),
		...(firstTagText(block, ['description', 'summary']) != null && {
			description: firstTagText(block, ['description', 'summary']),
		}),
		...(firstTagText(block, ['content:encoded', 'content']) != null && {
			content: firstTagText(block, ['content:encoded', 'content']),
		}),
		...(firstTagText(block, ['author', 'dc:creator']) != null && {
			author: firstTagText(block, ['author', 'dc:creator']),
		}),
		...(publishedAt != null && { publishedAt }),
	}
}

export const parseRssFeedXml = (xml: string) => {
	const channelBlock = (
		xml.match(/<channel[\s>][\s\S]*?<\/channel>/i)?.[0]
		?? xml.match(/<feed[\s>][\s\S]*?<\/feed>/i)?.[0]
		?? xml
	)
	const lastBuildDateText = firstTagText(channelBlock, ['lastBuildDate', 'updated'])
	return {
		...(firstTagText(channelBlock, ['title']) != null && {
			title: firstTagText(channelBlock, ['title']),
		}),
		...(firstTagText(channelBlock, ['description', 'subtitle']) != null && {
			description: firstTagText(channelBlock, ['description', 'subtitle']),
		}),
		...(firstTagText(channelBlock, ['link']) != null && {
			link: firstTagText(channelBlock, ['link']),
		}),
		...(channelBlock.match(/<link[^>]*href=['"]([^'"]+)['"][^>]*\/?>/i)?.[1] != null && {
			siteUrl: channelBlock.match(/<link[^>]*href=['"]([^'"]+)['"][^>]*\/?>/i)?.[1],
		}),
		...(firstTagText(channelBlock, ['language']) != null && {
			language: firstTagText(channelBlock, ['language']),
		}),
		...(lastBuildDateText != null && Number.isFinite(Date.parse(lastBuildDateText)) && {
			lastBuildDate: Date.parse(lastBuildDateText),
		}),
		items: itemBlocksFromXml(xml)
			.map(parseItemBlock)
			.flatMap((item) => (
				item == null ?
					[]
				:
					[item]
			)),
	}
}
