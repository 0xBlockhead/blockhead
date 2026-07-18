import { page } from 'vitest/browser'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'

import Markdown from './Markdown.svelte'


it('renders sanitized syndication HTML without parsing it as Markdown', async () => {
	render(Markdown, {
		content: '<p>Federated <strong>HTML</strong> **not Markdown** <a href="javascript:unsafe()">unsafe link</a> <a href="https://social.example/status/1">status</a></p><script>unsafe()</script>',
		mode: 'syndication',
	})

	await expect.element(page.getByText(/Federated HTML \*\*not Markdown\*\*/)).toBeInTheDocument()
	expect(document.querySelector('.markdown strong')?.textContent).toBe('HTML')
	expect(document.querySelector('.markdown script')).toBeNull()
	expect(document.querySelector('.markdown a')?.hasAttribute('href')).toBe(false)
	expect(document.querySelectorAll('.markdown a')[1]?.getAttribute('href')).toBe('https://social.example/status/1')
})

it('keeps Markdown rendering as the default display mode', async () => {
	render(Markdown, {
		content: '**Markdown** <script>unsafe()</script>',
	})

	await expect.element(page.getByText('Markdown')).toBeInTheDocument()
	expect(document.querySelector('.markdown strong')?.textContent).toBe('Markdown')
	expect(document.querySelector('.markdown script')).toBeNull()
})
