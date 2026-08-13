import { page } from 'vitest/browser'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'

import OpenEntityPage from './+page.svelte'


it('renders separate network and entity-kind coordinates for a bare EVM hash', async () => {
	const hash = '0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca'

	await render(OpenEntityPage, {
		data: {
			query: hash,
		},
	})

	await expect.element(page.getByRole('heading', { name: 'Identify this EVM hash' })).toBeVisible()
	await expect.element(page.getByRole('status')).toHaveTextContent('valid 32-byte EVM hash')
	await expect.element(page.getByRole('alert')).not.toBeInTheDocument()
	await expect.element(page.getByRole('complementary', { name: 'Candidate provenance' })).toHaveTextContent('checked-in network catalog')
	await expect.element(page.getByRole('complementary', { name: 'Candidate provenance' })).toHaveTextContent('does not claim that a configured provider supports')
	await expect.element(page.getByRole('combobox', { name: 'Network' })).toBeVisible()
	await expect.element(page.getByRole('option', { name: 'Ethereum Mainnet — Mainnet (eip155:1)' })).toBeInTheDocument()
	await expect.element(page.getByRole('option', { name: 'Ethereum Sepolia — Testnet (eip155:11155111)' })).toBeInTheDocument()
	await expect.element(page.getByRole('combobox', { name: 'Entity kind' })).toBeVisible()
	await expect.element(page.getByRole('option', { name: 'Transaction' })).toBeInTheDocument()
	await expect.element(page.getByRole('option', { name: 'ERC-4337 user operation' })).toBeInTheDocument()
	expect(page.getByRole('option', { name: 'Block' }).query()).toBeNull()
	await expect.element(page.getByRole('button', { name: 'Open hash' })).toBeVisible()
})

it('does not render hash coordinates for other unresolved input', async () => {
	await render(OpenEntityPage, {
		data: {
			query: 'not-a-hash',
		},
	})

	await expect.element(page.getByRole('heading', { name: 'Identify this EVM hash' })).not.toBeInTheDocument()
	await expect.element(page.getByRole('complementary', { name: 'Candidate provenance' })).not.toBeInTheDocument()
	await expect.element(page.getByRole('alert')).toHaveTextContent('is unsupported')
})

it('advertises typed asset and catalog-backed explorer ingress', async () => {
	await render(OpenEntityPage, {
		data: {
			query: '',
		},
	})

	await expect.element(page.getByText(/CAIP-19 ERC-20 assets/)).toBeVisible()
	await expect.element(page.getByText(/checked-in explorer transaction, address, token and block URLs/)).toBeVisible()
})

it('identifies a bare EVM address as incomplete rather than unsupported', async () => {
	await render(OpenEntityPage, {
		data: {
			query: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
		},
	})

	await expect.element(page.getByRole('status')).toHaveTextContent('valid EVM address')
	await expect.element(page.getByRole('heading', { name: 'Identify this EVM address' })).toBeVisible()
	await expect.element(page.getByRole('combobox', { name: 'Network' })).toBeVisible()
	await expect.element(page.getByRole('combobox', { name: 'Entity kind' })).toBeVisible()
	await expect.element(page.getByRole('option', { name: 'Account' })).toBeInTheDocument()
	await expect.element(page.getByRole('option', { name: 'Contract' })).toBeInTheDocument()
	await expect.element(page.getByRole('button', { name: 'Open address' })).toBeVisible()
	await expect.element(page.getByRole('complementary', { name: 'Candidate provenance' })).toBeVisible()
	await expect.element(page.getByRole('alert')).not.toBeInTheDocument()
})

it('groups a bare 32-byte transaction ID by checked-in network identity', async () => {
	await render(OpenEntityPage, {
		data: {
			query: '31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca',
		},
	})

	await expect.element(page.getByRole('status')).toHaveTextContent('valid 32-byte hexadecimal identifier')
	await expect.element(page.getByRole('heading', { name: 'Identify this transaction' })).toBeVisible()
	await expect.element(page.getByRole('combobox', { name: 'Network' })).toBeVisible()
	await expect.element(page.getByRole('option', { name: 'Bitcoin — Mainnet (bip122:000000000019d6689c085ae165831e93)' })).toBeInTheDocument()
	await expect.element(page.getByRole('option', { name: 'Cardano — Mainnet (cip34:1-764824073)' })).toBeInTheDocument()
	await expect.element(page.getByRole('option', { name: 'Liquid Network — Mainnet (Elements catalog slug: liquid)' })).toBeInTheDocument()
	await expect.element(page.getByRole('complementary', { name: 'Candidate provenance' })).toBeVisible()
	await expect.element(page.getByRole('alert')).not.toBeInTheDocument()
	await expect.element(page.getByRole('heading', { name: 'Identify this Nostr value' })).toBeVisible()
	await expect.element(page.getByRole('combobox', { name: 'Nostr entity kind' })).toBeVisible()
	await expect.element(page.getByRole('option', { name: 'Profile public key' })).toBeInTheDocument()
	await expect.element(page.getByRole('option', { name: 'Note event' })).toBeInTheDocument()
})
