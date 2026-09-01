import { createRawSnippet } from 'svelte'
import { page, userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-svelte'

import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'


const section = (content: string) => createRawSnippet(() => ({
	render: () => `<p>${content}</p>`,
}))

const summary = createRawSnippet<[context: {
	open?: boolean,
}]>((context) => ({
	render: () => `<p>Summary ${context().open ? 'open' : 'closed'}</p>`,
}))


test('defers inactive section content until disclosure and tab activation', async () => {
	await render(CollapsibleTabs, {
		id: 'network-tabs',
		class: 'network-tabs',
		'data-card': true,
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
		] as const,
		SectionBlocks: section('Block rows'),
		SectionTransactions: section('Transaction rows'),
		Summary: summary,
	})

	await expect.element(page.getByText('Block rows')).toBeInTheDocument()
	await expect.element(page.getByText('Transaction rows')).not.toBeInTheDocument()

	await userEvent.click(page.getByText('Summary closed'))
	await expect.element(page.getByText('Summary open')).toBeInTheDocument()

	await userEvent.click(page.getByRole('link', {
		name: 'Transactions',
	}))

	await expect.element(page.getByText('Block rows')).toBeInTheDocument()
	await expect.element(page.getByText('Transaction rows')).toBeInTheDocument()
})

test('rejects a declared section without content', async () => {
	await expect(render(CollapsibleTabs, {
		sectionIdPrefix: 'network',
		sections: [{
			id: 'missing-content',
			label: 'Missing content',
		}] as const,
	})).rejects.toThrow('CollapsibleTabs section missing-content has no content snippet')
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
