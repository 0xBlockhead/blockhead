import { page, userEvent } from 'vitest/browser'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'

import CollapsibleFixture from './Collapsible.fixture.svelte'


it('keeps closed details unmounted and scoped to the item identity', async () => {
	const first = await render(CollapsibleFixture, {
		itemKey: 'A',
		summary: 'First item',
	})
	const second = await render(CollapsibleFixture, {
		itemKey: 'C',
		summary: 'Second item',
	})

	await expect.element(page.getByText('Details for A')).not.toBeInTheDocument()
	await expect.element(page.getByAltText('Details media for A')).not.toBeInTheDocument()
	await expect.element(page.getByText('Details for C')).not.toBeInTheDocument()

	const firstSummary = page.getByText('First item')
	firstSummary.element().closest('summary')?.focus()
	await userEvent.keyboard('{Enter}')

	await expect.element(page.getByText('Details for A')).toBeInTheDocument()
	await expect.element(page.getByAltText('Details media for A')).toBeInTheDocument()
	await expect.element(page.getByText('Details for C')).not.toBeInTheDocument()
	expect(document.activeElement).toBe(firstSummary.element().closest('summary'))
	await userEvent.keyboard(' ')
	await expect.element(page.getByText('Details for A')).not.toBeInTheDocument()
	await userEvent.keyboard(' ')
	await expect.element(page.getByText('Details for A')).toBeInTheDocument()

	await first.rerender({
		itemKey: 'B',
		summary: 'First item',
	})
	await expect.element(page.getByText('Details for B')).not.toBeInTheDocument()
	await expect.element(page.getByAltText('Details media for B')).not.toBeInTheDocument()

	await first.rerender({
		itemKey: 'A',
		summary: 'First item',
	})
	await expect.element(page.getByText('Details for A')).not.toBeInTheDocument()
	await expect.element(page.getByAltText('Details media for A')).not.toBeInTheDocument()

	await page.getByText('Second item').click()
	await expect.element(page.getByText('Details for C')).toBeInTheDocument()
	await expect.element(page.getByText('Details for A')).not.toBeInTheDocument()

	await second.unmount()
})
