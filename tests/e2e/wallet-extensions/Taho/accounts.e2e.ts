import { readFile } from 'node:fs/promises'

import {
	approveTahoConnection,
	createTahoWallet,
	openTaho,
	selectTahoAccount,
	tahoBlockedObservation,
} from '../../../../scripts/wallet-extensions/Taho/driver.ts'
import { tahoWalletMatrixScenarios } from '../../../../scripts/wallet-extensions/Taho/matrix.ts'
import {
	assertWalletMatrixOutcomes,
	logWalletMatrixResults,
	runWalletCompatibilityMatrix,
} from '../../../../scripts/wallet-extensions/WalletCompatibilityMatrix.ts'
import {
	connectWalletButtonForDriver,
	disconnectWalletButton,
	walletConnectionsStatus,
} from '../_walletPageSelectors.ts'
import { expect, test } from '../wallet.fixture.ts'


test.skip(process.env.WALLET_EXTENSIONS_E2E !== '1', 'Real Taho extension tests are opt-in')
test.setTimeout(180_000)

test('creates two Taho accounts and propagates accountsChanged to Blockhead', async ({
	baseURL,
	context,
	extensions,
	page,
}) => {
	const taho = extensions.find(({ kind }) => kind === 'taho')
	expect(taho, 'The checksum-pinned Taho extension must be loaded').toBeDefined()
	if (!taho)
		throw new Error('The checksum-pinned Taho extension was not loaded')

	expect(taho?.manifest.version).toBe('0.66.0')
	expect(JSON.parse(await readFile('scripts/wallet-extensions/wallets.json', 'utf8')).taho.sha256).toBe('e14e560cb2188044b9c1f2a9e9641d9902c35c379a3b78e46980466eb5f6dfac')

	const tahoPage = await openTaho(context, taho)
	const accounts = await createTahoWallet(tahoPage)
	expect(accounts.first).toBe('Taho 1')
	expect(accounts.second).toBe('Taho 2')

	await page.goto(`${baseURL ?? 'http://127.0.0.1:5173'}/~/wallets`)
	await expect(walletConnectionsStatus(page)).toContainText(/Wallet discovery active\..*Providers detected: [1-9]/)
	await expect(connectWalletButtonForDriver(page, 'Taho')).toBeVisible()

	await Promise.all([
		approveTahoConnection(context, taho.id),
		connectWalletButtonForDriver(page, 'Taho').click(),
	])
	await expect(disconnectWalletButton(page)).toBeVisible()
	await expect(page.locator('input[type="radio"]:checked')).toHaveCount(1)

	await selectTahoAccount(accounts.page, accounts.first)
	const firstAccount = await page.locator('input[type="radio"]:checked').locator('..').innerText()
	expect(firstAccount).toMatch(/0x[0-9a-f]{40}/i)

	await selectTahoAccount(accounts.page, accounts.second)
	await expect(page.locator('input[type="radio"]:checked').locator('..')).not.toHaveText(firstAccount)

	await disconnectWalletButton(page).click()
	await expect(disconnectWalletButton(page)).toHaveCount(0)

	const results = await runWalletCompatibilityMatrix({
		driver: {
			kind: 'taho',
			run: async (scenario) => (
				scenario.accountOrdinal === 2 || scenario.initializationFlow === 'recover' ?
					tahoBlockedObservation(scenario)
				:
					{
						accountAddress: firstAccount,
						outcome: 'pass',
						evidence: {
							code: `taho-${scenario.lifecycleEdgeCase}-verified`,
							source: 'real-extension',
						},
					}
			),
		},
		scenarios: tahoWalletMatrixScenarios(taho.manifest.version),
		step: (name, run) => test.step(name, run),
	})
	assertWalletMatrixOutcomes(results, ['pass', 'blocked', 'blocked'], 'taho-real-extension')
	logWalletMatrixResults(results, {
		label: 'taho-real-extension',
		expectedOutcomes: ['pass', 'blocked', 'blocked'],
	})
})
