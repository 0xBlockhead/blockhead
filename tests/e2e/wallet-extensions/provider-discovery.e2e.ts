import { reportWalletProviderDiscovery } from '../../../scripts/wallet-extensions/WalletExtensionHarness.ts'
import { walletConnectionsStatus } from './_walletPageSelectors.ts'
import { expect, test } from './wallet.fixture.ts'


test.skip(process.env.WALLET_EXTENSIONS_E2E !== '1', 'Real wallet extension tests are opt-in')

test('reports real wallet providers discovered by Blockhead', async ({
	baseURL,
	extensions,
	page,
}) => {
	await page.goto(`${baseURL ?? 'http://127.0.0.1:5173'}/~/wallets`)
	await expect(walletConnectionsStatus(page)).toBeAttached()
	await page.waitForTimeout(2_000)

	const report = await reportWalletProviderDiscovery(page, extensions)
	console.log(JSON.stringify({
		label: 'wallet-provider-discovery',
		loadedExtensionCount: report.loadedExtensions.length,
		injectedGlobalCount: report.injectedGlobals.length,
		...report,
	}, null, 2))
})
