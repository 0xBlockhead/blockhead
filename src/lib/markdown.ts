/**
 * Markdown -> safe HTML via Sätteri + insane. No raw HTML pass-through; links limited to http/https/mailto.
 * On parse error, fall back to escaped plain text in <pre>.
 */

import { markdownToHtml as renderMarkdownToHtml } from 'satteri'

import { syndicationHtmlToSafeHtml } from './html.ts'

export const markdownToHtml = (
	markdownText: string | null | undefined
): string => {
	const markdown = (markdownText === undefined || markdownText === null ? '' : markdownText)
		.replace(/\0/g, '')
		.replace(/\r\n/g, '\n')
		.replace(/\r/g, '\n')
	try {
		return syndicationHtmlToSafeHtml(renderMarkdownToHtml(markdown).html)
	} catch {
		return `<pre>${
			markdown
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
		}</pre>`
	}
}
