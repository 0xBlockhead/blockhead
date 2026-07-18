import insane, { type SanitizeOptions } from 'insane'


const syndicationHtmlSanitizerOptions = {
	allowedSchemes: [
		'http',
		'https',
		'mailto',
	],
	allowedTags: [
		'a',
		'b',
		'blockquote',
		'br',
		'code',
		'div',
		'em',
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'hr',
		'i',
		'li',
		'ol',
		'p',
		'pre',
		'span',
		'strong',
		'table',
		'tbody',
		'td',
		'th',
		'thead',
		'tr',
		'ul',
		'img',
	],
	allowedAttributes: {
		a: [
			'href',
		],
		img: [
			'src',
			'alt',
		],
	},
} satisfies SanitizeOptions

const decodeHtmlCodePoint = (
	entity: string,
	codePoint: string,
	radix: number
) => {
	const value = Number.parseInt(codePoint, radix)
	return (
		Number.isSafeInteger(value)
		&& value >= 0
		&& value <= 0x10ffff
		&& !(value >= 0xd800 && value <= 0xdfff)
	) ?
		String.fromCodePoint(value)
		:
		entity
}

export const syndicationHtmlToSafeHtml = (
	html: string | null | undefined
) => {
	const normalizedHtml = html?.trim() ?? ''
	return normalizedHtml === '' ?
		''
		:
		insane(normalizedHtml.replace(/\0/g, ''), syndicationHtmlSanitizerOptions, true)
}

export const htmlToPlainText = (html: string | null | undefined) => (
	syndicationHtmlToSafeHtml(html)
		.replace(/<[^>]+>/g, ' ')
		.replace(/&#(\d+);/g, (entity, codePoint: string) => decodeHtmlCodePoint(entity, codePoint, 10))
		.replace(/&#x([\da-f]+);/gi, (entity, codePoint: string) => decodeHtmlCodePoint(entity, codePoint, 16))
		.replace(/&nbsp;/gi, ' ')
		.replace(/&amp;/gi, '&')
		.replace(/&lt;/gi, '<')
		.replace(/&gt;/gi, '>')
		.replace(/&quot;/gi, '"')
		.replace(/&apos;|&#39;/gi, "'")
		.replace(/\0/g, '')
		.replace(/\s+/g, ' ')
		.replace(/\s+([,.;:!?])/g, '$1')
		.trim()
)
