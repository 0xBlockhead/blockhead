/**
 * Markdown -> safe HTML via starkdown + sanitize-html. No raw HTML pass-through; links limited to http/https/mailto.
 * On parse error (e.g. unsupported token), normalize input and fall back to escaped plain text in <pre>.
 */

import sanitizeHtml, { type IOptions } from 'sanitize-html'
import { starkdown } from 'starkdown'

const escapeHtml = (s: string) => (
	s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
)

const isFenceLineAtStart = (line: string) => (
	/^`{3,}\s*[\w-]*$/.test(line)
)

const normalizeFenceLine = (line: string) => (
	line.replace(/^(`{3,})(\s*[\w-]*)$/, (_match, _run, rest) => `\`\`\`${rest}`)
)

const escapeBareLt = (line: string) => (
	line.replace(/<(?!\/?[a-zA-Z!?])/g, '&lt;')
)

const normalizeForStarkdown = (s: string) => {
	let inCodeBlock = false
	return s
		.replace(/\0/g, '')
		.replace(/\r\n/g, '\n')
		.replace(/\r/g, '\n')
		.split('\n')
		.map((line) => {
			if (isFenceLineAtStart(line)) {
				inCodeBlock = !inCodeBlock
				return normalizeFenceLine(line)
			}

			return inCodeBlock ?
				line
			:
				escapeBareLt(line.replace(/``/g, '`\u200B`'))
		})
		.join('\n')
}

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
			'target',
			'rel',
		],
		img: [
			'src',
			'alt',
		],
	},
} satisfies IOptions

export const syndicationHtmlToSafeHtml = (
	htmlText: string | null | undefined,
): string => {
	const html = htmlText?.trim() ?? ''
	if (html === '') return ''
	return sanitizeHtml(html, syndicationHtmlSanitizerOptions)
}

export const markdownToHtml = (
	markdownText: string | null | undefined,
): string => {
	const markdown = markdownText === undefined || markdownText === null ? '' : markdownText
	try {
		return sanitizeHtml(starkdown(normalizeForStarkdown(markdown)), syndicationHtmlSanitizerOptions)
	} catch {
		return `<pre>${escapeHtml(markdown)}</pre>`
	}
}
