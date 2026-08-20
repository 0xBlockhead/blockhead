import { describe, expect, it } from 'vitest'

import { htmlToPlainText, syndicationHtmlToSafeHtml } from './html.ts'


describe('syndicationHtmlToSafeHtml', () => {
	it('preserves display content while removing executable markup and unsafe attributes', () => {
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
		expect(syndicationHtmlToSafeHtml(
			'<a href="https://social.example/@actor/1" target="_blank" rel="opener">Status</a><img src="https://social.example/media/1.png" alt="Description">'
		)).toContain('href="https://social.example/@actor/1"')
		expect(syndicationHtmlToSafeHtml(
			'<a href="https://social.example/@actor/1" target="_blank" rel="opener">Status</a>'
		)).not.toMatch(/target=|rel=/)
		const encodedUrlHtml = syndicationHtmlToSafeHtml(`
			<a href="jav&#x61;script:alert(1)">encoded</a>
			<a href="JAVASCRIPT:alert(2)">mixed case</a>
			<a href=" javascript:alert(3)">leading whitespace</a>
			<a href="data:text/html,unsafe">data</a>
			<a href="/relative/status">relative</a>
			<a href="#reply">fragment</a>
		`)

		expect(encodedUrlHtml).not.toMatch(/href="(?:javascript|data):/i)
		expect(encodedUrlHtml).toContain('<a href="/relative/status">relative</a>')
		expect(encodedUrlHtml).toContain('<a href="#reply">fragment</a>')

		const malformedHtml = syndicationHtmlToSafeHtml(
			'<p>你好 🌍 <strong>nested <em>prose</p></em><svg><script>alert(1)</script></svg>'
		)

		expect(malformedHtml).toContain('你好 🌍')
		expect(malformedHtml).toContain('nested <em>prose</em>')
		expect(malformedHtml).not.toMatch(/<svg|<script|alert\(1\)/i)

		expect(syndicationHtmlToSafeHtml(null)).toBe('')
		expect(syndicationHtmlToSafeHtml(undefined)).toBe('')
		expect(syndicationHtmlToSafeHtml(' \n\t ')).toBe('')
	})
})

describe('htmlToPlainText', () => {
	it('reduces safe display content to compact prose', () => {
		expect(htmlToPlainText(
			'<p>Hello &amp; <strong>federation</strong>.</p><p>你好&nbsp;🌍 &#x1f680;</p>'
		)).toBe('Hello & federation. 你好 🌍 🚀')
		expect(htmlToPlainText(
			'<p>Visible</p><script>alert("not prose")</script><style>.not-prose {}</style><p>Again</p>'
		)).toBe('Visible Again')
		expect(htmlToPlainText(null)).toBe('')
		expect(htmlToPlainText(undefined)).toBe('')
	})
})
