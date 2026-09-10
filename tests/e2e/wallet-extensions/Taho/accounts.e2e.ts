import { readFile } from 'node:fs/promises'

import {
	approveTahoConnection,
	createTahoWallet,
	openTaho,
} from '../../../../scripts/wallet-extensions/Taho/driver.ts'
import {
	connectWalletButtonForDriver,
	disconnectWalletButton,
	walletConnectionsStatus,
	waitForWalletPageReady,
} from '../_walletPageSelectors.ts'
import { expect, test } from '../wallet.fixture.ts'


test.skip(process.env.WALLET_EXTENSIONS_E2E !== '1', 'Real Taho extension tests are opt-in')
test.setTimeout(180_000)

test('creates one Taho account and connects it to Blockhead', async ({
	baseURL,
	context,
	extensions,
	page,
}) => {
	const taho = extensions.find(({ kind }) => kind === 'taho')
	expect(taho, 'The checksum-pinned Taho extension must be loaded').toBeDefined()
	if (!taho)
		throw new Error('The checksum-pinned Taho extension was not loaded')

	expect(taho.manifest.version).toBe('0.66.0')
	expect(JSON.parse(await readFile('scripts/wallet-extensions/wallets.json', 'utf8')).taho.sha256).toBe('e14e560cb2188044b9c1f2a9e9641d9902c35c379a3b78e46980466eb5f6dfac')

	const tahoPage = await openTaho(context, taho)
	const accounts = await createTahoWallet(tahoPage)
	expect(accounts.first).toBe('Taho 1')

	const applicationUrl = new URL(baseURL ?? 'http://127.0.0.1:5173')
	applicationUrl.hostname = 'localhost'
	await page.goto(new URL('/~/wallets', applicationUrl).href)
	await waitForWalletPageReady(page)
	const connect = connectWalletButtonForDriver(page, 'Taho')
	const discovered = await connect.waitFor({
		state: 'visible',
		timeout: 15_000,
	}).then(() => true).catch(() => false)

	if (!discovered) {
		throw new Error('Loaded Taho artifact did not expose its provider on the requested page')
	}

	await expect(walletConnectionsStatus(page)).toContainText(/Providers detected: [1-9]/)

	const pagesBeforeConnection = new Set(context.pages())
	await Promise.all([
		approveTahoConnection(context, taho.id, pagesBeforeConnection),
		connectWalletButtonForDriver(page, 'Taho').click(),
	])
	await expect(disconnectWalletButton(page)).toBeVisible()
	await expect(page.locator('input[type="radio"]:checked')).toHaveCount(1)

	const firstAccount = await page.locator('input[type="radio"]:checked').locator('..').innerText()
	expect(firstAccount).toMatch(/0x[0-9a-f]{40}/i)

	await disconnectWalletButton(page).click()
	await expect(disconnectWalletButton(page)).toHaveCount(0)
	await page.reload({ waitUntil: 'load' })
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 0.')
})
