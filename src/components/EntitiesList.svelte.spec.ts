import { page, userEvent } from 'vitest/browser'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'

import EntitiesListFixture from './EntitiesList.fixture.svelte'


it('keeps loaded rows visible and retries a rejected continuation', async () => {
	await render(EntitiesListFixture)

	await expect.element(page.getByText('First page item')).toBeInTheDocument()
	const loadMore = page.getByRole('button', {
		name: 'Load more',
	})
	await userEvent.click(loadMore)
	const loadingMore = page.getByRole('button', {
		name: 'Loading more…',
	})
	await expect.element(loadingMore).toBeDisabled()
	loadingMore.element().click()
	await expect.element(page.getByText('Attempts: 1')).toBeInTheDocument()

	await userEvent.click(page.getByRole('button', {
		name: 'Reject page',
	}))
	await expect.element(page.getByRole('alert')).toHaveTextContent('Couldn’t load more items.')
	await expect.element(page.getByText('First page item')).toBeInTheDocument()

	await userEvent.click(page.getByRole('button', {
		name: 'Retry',
	}))
	await expect.element(page.getByText('Attempts: 2')).toBeInTheDocument()
	await userEvent.click(page.getByRole('button', {
		name: 'Resolve page',
	}))
	await expect.element(page.getByText('Retried page item')).toBeInTheDocument()
	await expect.element(page.getByRole('button', {
		name: 'Load more',
	})).not.toBeInTheDocument()
	await expect.element(page.getByRole('alert')).not.toBeInTheDocument()
})
