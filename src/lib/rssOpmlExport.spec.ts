import { describe, expect, it } from 'vitest'

import { serializeRssOpml } from '$/lib/rssOpmlExport.ts'

describe('serializeRssOpml', () => {
	it('exports a deterministic normalized, deduplicated ordered snapshot', () => {
		expect(serializeRssOpml([
			{ feedUrl: ' https://example.com/z.xml ' },
			{ feedUrl: 'https://example.com/a.xml', title: 'A & <feed> "\'' },
			{ feedUrl: 'https://example.com/z.xml', title: 'duplicate' },
		])).toBe([
			'<?xml version="1.0" encoding="UTF-8"?>',
			'<opml version="2.0">',
			'  <head>',
			'    <title>RSS subscriptions</title>',
			'  </head>',
			'  <body>',
			'    <outline type="rss" text="A &amp; &lt;feed&gt; &quot;&apos;" title="A &amp; &lt;feed&gt; &quot;&apos;" xmlUrl="https://example.com/a.xml" />',
			'    <outline type="rss" text="https://example.com/z.xml" title="https://example.com/z.xml" xmlUrl="https://example.com/z.xml" />',
			'  </body>',
			'</opml>',
		].join('\n') + '\n')
	})

	it('serializes a valid empty document', () => {
		expect(serializeRssOpml([])).toContain('<body>\n  </body>')
	})

	it.each([
		'ftp://example.com/feed.xml',
		'https://user:pass@example.com/feed.xml',
		'https://example.com/feed.xml#private',
		'not a URL',
	])('rejects unsafe URL %s', (feedUrl) => {
		expect(() => serializeRssOpml([{ feedUrl }])).toThrow(TypeError)
	})
})
