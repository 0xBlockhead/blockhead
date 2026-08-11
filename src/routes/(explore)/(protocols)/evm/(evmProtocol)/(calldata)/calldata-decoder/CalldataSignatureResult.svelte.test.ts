import { page } from 'vitest/browser'
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { tick } from 'svelte'

import { functionSelectorFromSignature } from '$/lib/calldata-decode.ts'
import { TanStackLiveQueryResource } from '$/lib/db/queryResource.svelte.ts'
import CalldataSignatureResult from './CalldataSignatureResult.svelte'

test('keeps pending, ready-empty, late decoded data, and failure distinct without reload', async () => {
	const resource = new TanStackLiveQueryResource<{ values: readonly string[] }>(() => ({
		data: { values: [] },
		isLoading: true,
		isError: false,
		isReady: false,
		status: 'loading',
	}))
	const signature = 'setValue(uint256)'

	await render(CalldataSignatureResult, {
		hex: `${functionSelectorFromSignature(signature)}${'0'.repeat(62)}7b`,
		kind: 'Function',
		resource,
	})

	await expect.element(page.getByRole('complementary', { name: 'Signature provenance' })).toBeVisible()
	await expect.element(page.getByText('Openchain REST', { exact: false })).toBeVisible()
	await expect.element(page.getByText('provider-attributed claims', { exact: false })).toBeVisible()
	await expect.element(page.getByText('deterministic for the selected candidate', { exact: false })).toBeVisible()
	await expect.element(page.getByLabelText('Loading function signature...')).toBeInTheDocument()
	await expect.element(page.getByText('No catalog signatures matched this function selector.')).not.toBeInTheDocument()
	await tick()
	resource.set({ values: [] })
	await expect.element(page.getByText('No catalog signatures matched this function selector.')).toBeInTheDocument()
	await expect.element(page.getByText(signature)).not.toBeInTheDocument()

	resource.set({ values: [signature] })
	await expect.element(page.getByText(signature)).toBeInTheDocument()
	await expect.element(page.getByText('123')).toBeInTheDocument()
	await expect.element(page.getByText('No catalog signatures matched this function selector.')).not.toBeInTheDocument()

	resource.fail(new Error('catalog unavailable'))
	await expect.element(page.getByText('Unable to load function signatures: catalog unavailable')).toBeInTheDocument()
	await expect.element(page.getByRole('complementary', { name: 'Signature provenance' })).toBeVisible()
	await expect.element(page.getByText('No catalog signatures matched this function selector.')).not.toBeInTheDocument()
	await expect.element(page.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
})
