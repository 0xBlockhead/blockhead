import { createRawSnippet } from 'svelte'
import { page, userEvent } from 'vitest/browser'
import {
	expect,
	test,
} from 'vitest'
import { render } from 'vitest-browser-svelte'

import SocialClientArchetype from './SocialClientArchetype.svelte'


test('reveals content through the warning disclosure that owns its accessible target', async () => {
	await render(SocialClientArchetype, {
		props: {
			label: 'ActivityPub note',
			contentWarning: 'Spoilers',
			Identity: createRawSnippet(() => ({
				render: () => '<h2>Note</h2>',
			})),
			children: createRawSnippet(() => ({
				render: () => '<p>The ending</p>',
			})),
		},
	})

	const reveal = page.getByRole('button', {
		name: 'Show content',
	})
	const contentId = reveal.element().getAttribute('aria-controls')
	if (contentId == null)
		throw new Error('Content warning disclosure must name its controlled content')
	await expect.element(page.getByText('The ending')).not.toBeInTheDocument()

	await userEvent.click(reveal)

	await expect.element(page.getByText('The ending')).toBeVisible()
	expect(document.getElementById(contentId)).not.toBeNull()
	await expect.element(reveal).not.toBeInTheDocument()
})
