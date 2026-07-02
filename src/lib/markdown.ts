/**
 * Markdown -> safe HTML via Sätteri + insane. No raw HTML pass-through; links limited to http/https/mailto.
 * On parse error, fall back to escaped plain text in <pre>.
 */

import insane, { type SanitizeOptions } from 'insane'
import { parseToHtml } from 'satteri-browser'

const escapeHtml = (s: string) => (
	s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
)

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
} satisfies SanitizeOptions

export const syndicationHtmlToSafeHtml = (
	htmlText: string | null | undefined
): string => {
	const html = htmlText?.trim() ?? ''
	if (html === '') return ''
	return insane(html, syndicationHtmlSanitizerOptions)
}

export const markdownToHtml = (
	markdownText: string | null | undefined
): string => {
	const markdown = (markdownText === undefined || markdownText === null ? '' : markdownText)
		.replace(/\0/g, '')
		.replace(/\r\n/g, '\n')
		.replace(/\r/g, '\n')
	try {
		return insane(parseToHtml(markdown), syndicationHtmlSanitizerOptions)
	} catch {
		return `<pre>${escapeHtml(markdown)}</pre>`
	}
}
