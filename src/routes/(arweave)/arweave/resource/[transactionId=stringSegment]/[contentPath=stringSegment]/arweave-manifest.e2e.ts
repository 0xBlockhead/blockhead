import {
	expect,
	test,
} from '@playwright/test'

const transactionId = 'A'.repeat(43)
const fallbackTransactionId = 'B'.repeat(43)
const manifest = JSON.stringify({
	manifest: 'arweave/paths',
	version: '0.2.0',
	index: { path: 'index.html' },
	fallback: { id: fallbackTransactionId },
	paths: {
		'index.html': { id: 'C'.repeat(43) },
		'assets/app.js': { id: 'D'.repeat(43) },
	},
})

test('renders an Arweave manifest as native resource hierarchy', async ({ page }) => {
	await page.route('**/tx/*/offset', async (route) => route.fulfill({
		contentType: 'application/json',
		body: JSON.stringify({
			offset: '1',
			size: String(new TextEncoder().encode(manifest).byteLength),
		}),
	}))
	await page.route('**/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/manifest.json', async (route) => route.fulfill({
		contentType: 'application/x.arweave-manifest+json; charset=utf-8',
		body: manifest,
	}))

	await page.goto(`/arweave/resource/${transactionId}/manifest.json`)

	await expect(page.getByText('0.2.0', { exact: true }).first()).toBeVisible({
		timeout: 30_000,
	})
	await expect(page.getByText('index.html', { exact: true }).first()).toBeVisible()
	await expect(page.getByText(fallbackTransactionId, { exact: true }).first()).toBeAttached()
	await expect(page.getByText(`ar://${transactionId}/assets/app.js`, { exact: true }).first()).toBeAttached()
})
