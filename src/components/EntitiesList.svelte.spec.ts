import { page, userEvent } from 'vitest/browser'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'

import EntitiesListFixture from './EntitiesList.fixture.svelte'


it('isolates continuation failure state while query-owned rows append once', async () => {
	await render(EntitiesListFixture)

	await expect.element(page.getByText('First page item')).toBeInTheDocument()
	const loadMore = page.getByRole('button', {
		name: 'Load more',
	})
	await Promise.all([
		userEvent.click(loadMore),
		userEvent.click(loadMore),
	])
	const loadingMore = page.getByRole('button', {
		name: 'Loading more…',
	})
	await expect.element(loadingMore).toBeDisabled()
	loadingMore.element().click()
	await expect.element(page.getByText('Next attempts: 1')).toBeInTheDocument()

	await userEvent.click(page.getByRole('button', {
		name: 'Reject page',
	}))
	await expect.element(page.getByRole('alert')).toHaveTextContent('Couldn’t load more items.')
	await expect.element(page.getByText('First page item')).toBeInTheDocument()

	const retry = page.getByRole('button', {
		name: 'Retry',
	})
	await Promise.all([
		userEvent.click(retry),
		userEvent.click(retry),
	])
	await expect.element(page.getByText('Next attempts: 2')).toBeInTheDocument()
	await userEvent.click(page.getByRole('button', {
		name: 'Resolve page',
	}))
	await expect.element(page.getByText('Retried page item')).toBeInTheDocument()
	await expect.element(page.getByText('Later attempts: 0')).toBeInTheDocument()
	await expect.element(page.getByRole('alert')).not.toBeInTheDocument()

	await userEvent.click(page.getByRole('button', {
		name: 'Load more',
	}))
	await expect.element(page.getByText('Later attempts: 1')).toBeInTheDocument()
	await userEvent.click(page.getByRole('button', {
		name: 'Reject current page',
	}))
	await expect.element(page.getByRole('alert')).toHaveTextContent('Couldn’t load more items.')
	await expect.element(page.getByText('First page item')).toBeInTheDocument()
	await expect.element(page.getByText('Retried page item')).toBeInTheDocument()

	await userEvent.click(page.getByRole('button', {
		name: 'Retry',
	}))
	await expect.element(page.getByText('Later attempts: 2')).toBeInTheDocument()
	await userEvent.click(page.getByRole('button', {
		name: 'Resolve page',
	}))
	await expect.element(page.getByText('Later page item')).toBeInTheDocument()
	await expect.element(page.getByRole('button', {
		name: 'Load more',
	})).not.toBeInTheDocument()
	await expect.element(page.getByRole('button', {
		name: 'Retry',
	})).not.toBeInTheDocument()
})
