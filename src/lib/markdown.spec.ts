import { describe, expect, it } from 'vitest'

import { htmlToPlainText, syndicationHtmlToSafeHtml } from './html.ts'


describe('syndicationHtmlToSafeHtml', () => {
	it('retains syndication prose while removing executable markup', () => {
		const safeHtml = syndicationHtmlToSafeHtml(`
			<p onclick="alert(1)">Hello <strong>federation</strong>.</p>
			<script>alert(2)</script>
			<a href="javascript:alert(3)">unsafe link</a>
			<a href="JaVaScRiPt:alert(4)">mixed-case unsafe link</a>
			<img src="data:text/html,unsafe" onerror="alert(4)" alt="unsafe image">
		`)

		expect(safeHtml).toContain('<p>Hello <strong>federation</strong>.</p>')
		expect(safeHtml).toContain('<a>unsafe link</a>')
		expect(safeHtml).not.toMatch(/onclick|onerror|javascript:|data:text|<script|alert\(2\)/i)
	})

	it('keeps safe links and media attributes', () => {
		expect(syndicationHtmlToSafeHtml(
			'<a href="https://social.example/@actor/1" target="_blank" rel="opener">Status</a><img src="https://social.example/media/1.png" alt="Description">'
		)).toContain('href="https://social.example/@actor/1"')
		expect(syndicationHtmlToSafeHtml(
			'<a href="https://social.example/@actor/1" target="_blank" rel="opener">Status</a>'
		)).not.toMatch(/target=|rel=/)
	})

	it('rejects encoded, mixed-case, whitespace-prefixed, and data URLs', () => {
		const safeHtml = syndicationHtmlToSafeHtml(`
			<a href="jav&#x61;script:alert(1)">encoded</a>
			<a href="JAVASCRIPT:alert(2)">mixed case</a>
			<a href=" javascript:alert(3)">leading whitespace</a>
			<a href="data:text/html,unsafe">data</a>
			<a href="/relative/status">relative</a>
			<a href="#reply">fragment</a>
		`)

		expect(safeHtml).not.toMatch(/href="(?:javascript|data):/i)
		expect(safeHtml).toContain('<a href="/relative/status">relative</a>')
		expect(safeHtml).toContain('<a href="#reply">fragment</a>')
	})

	it('preserves Unicode prose through malformed nested markup', () => {
		const safeHtml = syndicationHtmlToSafeHtml(
			'<p>你好 🌍 <strong>nested <em>prose</p></em><svg><script>alert(1)</script></svg>'
		)

		expect(safeHtml).toContain('你好 🌍')
		expect(safeHtml).toContain('nested <em>prose</em>')
		expect(safeHtml).not.toMatch(/<svg|<script|alert\(1\)/i)
	})

	it('normalizes nullish and empty content to an empty display value', () => {
		expect(syndicationHtmlToSafeHtml(null)).toBe('')
		expect(syndicationHtmlToSafeHtml(undefined)).toBe('')
		expect(syndicationHtmlToSafeHtml(' \n\t ')).toBe('')
	})
})

describe('htmlToPlainText', () => {
	it('reduces sanitized syndication HTML to decoded compact prose', () => {
		expect(htmlToPlainText(
			'<p>Hello &amp; <strong>federation</strong>.</p><p>你好&nbsp;🌍 &#x1f680;</p>'
		)).toBe('Hello & federation. 你好 🌍 🚀')
	})

	it('removes executable subtrees instead of exposing their source as prose', () => {
		expect(htmlToPlainText(
			'<p>Visible</p><script>alert("not prose")</script><style>.not-prose {}</style><p>Again</p>'
		)).toBe('Visible Again')
	})

	it('normalizes nullish content to empty text', () => {
		expect(htmlToPlainText(null)).toBe('')
		expect(htmlToPlainText(undefined)).toBe('')
	})
})
