import { expect, test } from './wallet.fixture.ts'


test.skip(process.env.WALLET_EXTENSIONS_E2E !== '1', 'Wallet extension tests are opt-in')

test('loads unpacked MV3 extensions in persistent Chromium against Blockhead', async ({
	baseURL,
	extensions,
	page,
}) => {
	expect(extensions.length).toBeGreaterThan(0)

	for (const extension of extensions) {
		expect(extension.id).toMatch(/^[a-p]{32}$/)
		expect(extension.serviceWorker.url()).toBe(`chrome-extension://${extension.id}/${extension.manifest.background.service_worker}`)
	}

	await page.goto(baseURL ?? 'http://127.0.0.1:5173')
	await expect(page.locator('body')).toBeAttached()

	if (extensions.some(({ kind }) => kind === 'harness-only'))
		await expect(page.locator('html')).toHaveAttribute('data-blockhead-wallet-harness', 'loaded')
})
