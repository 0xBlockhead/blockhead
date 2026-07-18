import { createRawSnippet } from 'svelte'
import { render } from 'svelte/server'
import { expect, test } from 'vitest'

import SocialClientArchetype from '$/components/social/SocialClientArchetype.svelte'


const snippet = (html: string) => createRawSnippet(() => ({
	render: () => html,
}))


test('shared social navigation keeps identity and thread context in named landmarks', () => {
	const { body } = render(SocialClientArchetype, {
		props: {
			label: 'ActivityPub note',
			Identity: snippet('<h2>@author@example.social</h2>'),
			Navigation: snippet('<a href="/activitypub">ActivityPub</a>'),
			ThreadContext: snippet('<a href="#parent">Parent note</a>'),
			children: snippet('<p>Note body</p>'),
		},
	})

	expect(body).toContain('<header')
	expect(body).toContain('aria-label="ActivityPub note navigation"')
	expect(body).toContain('aria-label="ActivityPub note thread context"')
	expect(body).toContain('@author@example.social')
	expect(body).not.toContain('aria-label="ActivityPub note source state"')
})

test('content warning conceals content until explicitly revealed', () => {
	const concealed = render(SocialClientArchetype, {
		props: {
			label: 'ActivityPub note',
			contentWarning: 'Spoilers',
			Identity: snippet('<h2>Note</h2>'),
			children: snippet('<p>The ending</p>'),
		},
	}).body
	const revealed = render(SocialClientArchetype, {
		props: {
			label: 'ActivityPub note',
			contentWarning: 'Spoilers',
			contentWarningRevealed: true,
			Identity: snippet('<h2>Note</h2>'),
			children: snippet('<p>The ending</p>'),
		},
	}).body

	expect(concealed).toContain('aria-label="Content warning"')
	expect(concealed).toContain('aria-expanded="false"')
	expect(concealed).toContain('Show content')
	expect(concealed).not.toContain('The ending')
	expect(revealed).toContain('The ending')
	expect(revealed).not.toContain('Show content')
})

test('source state renders supplied provenance without inventing an absent status', () => {
	const withSourceState = render(SocialClientArchetype, {
		props: {
			label: 'Nostr event',
			Identity: snippet('<h2>Event</h2>'),
			SourceState: snippet('<p>relay.example · indexed 2 minutes ago</p>'),
			children: snippet('<p>Event body</p>'),
		},
	}).body
	const withoutSourceState = render(SocialClientArchetype, {
		props: {
			label: 'Nostr event',
			Identity: snippet('<h2>Event</h2>'),
			children: snippet('<p>Event body</p>'),
		},
	}).body

	expect(withSourceState).toContain('aria-label="Nostr event source state"')
	expect(withSourceState).toContain('relay.example · indexed 2 minutes ago')
	expect(withoutSourceState).not.toContain('source state')
	expect(withoutSourceState).not.toContain('Unavailable')
})
