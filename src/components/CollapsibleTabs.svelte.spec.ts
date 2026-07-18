import { createRawSnippet } from 'svelte'
import { page, userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-svelte'

import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'


const section = (content: string) => createRawSnippet(() => ({
	render: () => `<p>${content}</p>`,
}))


test('mounts every declared section before selection', async () => {
	const { container } = await render(CollapsibleTabs, {
		sectionIdPrefix: 'networks',
		open: false,
		sections: [
			{
				id: 'blocks',
				label: 'Blocks',
			},
			{
				id: 'transactions',
				label: 'Transactions',
			},
			{
				id: 'missing-content',
				label: 'Missing content',
			},
		] as const,
		SectionBlocks: section('Block rows'),
		SectionTransactions: section('Transaction rows'),
	})

	expect(container.querySelectorAll('[data-carousel-markers] a')).toHaveLength(3)
	expect(container.querySelectorAll('[data-collapsible-tabs-pane-host] > section')).toHaveLength(3)
	await expect.element(page.getByText('Block rows')).toBeInTheDocument()
	await expect.element(page.getByText('Transaction rows')).toBeInTheDocument()
	expect(container.querySelector('#networks\\:missing-content')?.textContent).toBe('')
})

test('keeps fragment navigation and accessible marker relationships usable', async () => {
	const { container } = await render(CollapsibleTabs, {
		sectionIdPrefix: 'network',
		sections: [
			{
				id: 'blocks',
				label: 'Blocks',
			},
			{
				id: 'transactions',
				label: 'Transactions',
			},
		] as const,
		initialSection: 'blocks',
		SectionBlocks: section('Block rows'),
		SectionTransactions: section('Transaction rows'),
	})

	const blocksMarker = page.getByRole('link', {
		name: 'Blocks',
	})
	const transactionsMarker = page.getByRole('link', {
		name: 'Transactions',
	})

	await expect.element(blocksMarker).toHaveAttribute('aria-current', 'location')
	await expect.element(blocksMarker).toHaveAttribute('aria-controls', 'network:blocks')
	expect(container.querySelector('#network\\:blocks')?.getAttribute('aria-labelledby')).toBe('network:blocks:marker')

	await userEvent.click(transactionsMarker)

	await expect.element(transactionsMarker).toHaveAttribute('aria-current', 'location')
	await expect.element(blocksMarker).not.toHaveAttribute('aria-current')
	expect(window.location.hash).toBe('#network:transactions')
	await expect.element(page.getByText('Block rows')).toBeInTheDocument()
	await expect.element(page.getByText('Transaction rows')).toBeInTheDocument()
})
