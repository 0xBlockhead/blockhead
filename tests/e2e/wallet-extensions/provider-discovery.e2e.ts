import { reportWalletProviderDiscovery } from '../../../scripts/wallet-extensions/WalletExtensionHarness.ts'
import { walletConnectionsStatusById } from './_walletPageSelectors.ts'
import { expect, test } from './wallet.fixture.ts'


test.skip(process.env.WALLET_EXTENSIONS_E2E !== '1', 'Real wallet extension tests are opt-in')

test('reports real wallet providers discovered by Blockhead', async ({
	baseURL,
	extensions,
	page,
}) => {
	await page.goto(`${baseURL ?? 'http://127.0.0.1:5173'}/~/wallets`)
	await expect(page.locator('body')).toBeAttached()
	const status = walletConnectionsStatusById(page)
	await expect(status.or(page.locator('#main'))).toBeAttached({
		timeout: 60_000,
	})

	if (await status.count() === 0) {
		console.log(JSON.stringify({
			label: 'wallet-provider-discovery',
			note: 'wallet-connections status node not yet attached; reporting loaded extensions only',
			loadedExtensions: extensions.map(({ id, kind, manifest }) => ({
				id,
				kind,
				name: manifest.name,
				version: manifest.version,
			})),
		}, null, 2))
		expect(extensions.length).toBeGreaterThan(0)
		return
	}

	await expect.poll(async () => (
		(await status.innerText()).length
	)).toBeGreaterThan(0)

	const report = await reportWalletProviderDiscovery(page, extensions)
	expect(report.loadedExtensions.length).toBe(extensions.length)
	expect(report.loadedExtensions.every(({ id }) => /^[a-p]{32}$/.test(id))).toBe(true)
	expect(report.walletConnections.length).toBeGreaterThan(0)

	if (extensions.some(({ kind }) => kind === 'harness-only'))
		await expect(page.locator('html')).toHaveAttribute('data-blockhead-wallet-harness', 'loaded')

	console.log(JSON.stringify({
		label: 'wallet-provider-discovery',
		loadedExtensionCount: report.loadedExtensions.length,
		injectedGlobalCount: report.injectedGlobals.length,
		...report,
	}, null, 2))
})
