import { page, userEvent } from 'vitest/browser'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'

import ContentWarningFixture from './Collapsible.content-warning.fixture.svelte'


it('keeps warning content unmounted and selector-scoped across identity changes', async () => {
	const first = await render(ContentWarningFixture, {
		selectorKey: 'A',
		warningText: 'Warning one',
	})
	const second = await render(ContentWarningFixture, {
		selectorKey: 'C',
		warningText: 'Warning two',
	})

	await expect.element(page.getByText('Concealed body for A')).not.toBeInTheDocument()
	await expect.element(page.getByAltText('Concealed media for A')).not.toBeInTheDocument()
	await expect.element(page.getByText('Concealed body for C')).not.toBeInTheDocument()

	const firstSummary = page.getByText('Warning one')
	firstSummary.element().closest('summary')?.focus()
	await userEvent.keyboard('{Enter}')

	await expect.element(page.getByText('Concealed body for A')).toBeInTheDocument()
	await expect.element(page.getByAltText('Concealed media for A')).toBeInTheDocument()
	await expect.element(page.getByText('Concealed body for C')).not.toBeInTheDocument()
	expect(document.activeElement).toBe(firstSummary.element().closest('summary'))
	await userEvent.keyboard(' ')
	await expect.element(page.getByText('Concealed body for A')).not.toBeInTheDocument()
	await userEvent.keyboard(' ')
	await expect.element(page.getByText('Concealed body for A')).toBeInTheDocument()

	await first.rerender({
		selectorKey: 'B',
		warningText: 'Warning one',
	})
	await expect.element(page.getByText('Concealed body for B')).not.toBeInTheDocument()
	await expect.element(page.getByAltText('Concealed media for B')).not.toBeInTheDocument()

	await first.rerender({
		selectorKey: 'A',
		warningText: 'Warning one',
	})
	await expect.element(page.getByText('Concealed body for A')).not.toBeInTheDocument()
	await expect.element(page.getByAltText('Concealed media for A')).not.toBeInTheDocument()

	await page.getByText('Warning two').click()
	await expect.element(page.getByText('Concealed body for C')).toBeInTheDocument()
	await expect.element(page.getByText('Concealed body for A')).not.toBeInTheDocument()

	await second.unmount()
})
