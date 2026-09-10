import { readFile } from 'node:fs/promises'

import {
	approvePolkadotJsConnection,
	createPolkadotJsAccounts,
	openPolkadotJs,
} from '../../../../scripts/wallet-extensions/PolkadotJs/driver.ts'
import {
	connectWalletButtonForDriver,
	disconnectWalletButton,
	selectedWalletAccount,
	selectedWalletAccountLabel,
	walletConnectionCardById,
	walletConnectionsStatus,
	waitForWalletPageReady,
} from '../_walletPageSelectors.ts'
import { expect, test } from '../wallet.fixture.ts'


test.skip(process.env.WALLET_EXTENSIONS_E2E !== '1', 'Real polkadot.js extension tests are opt-in')
test.setTimeout(180_000)

test('connects, selects, disconnects, and reloads polkadot.js accounts through Blockhead', async ({
	baseURL,
	context,
	extensions,
	page,
}) => {
	const extension = extensions.find(({ kind }) => kind === 'polkadot-js')
	expect(extension, 'The checksum-pinned polkadot.js extension must be loaded').toBeDefined()
	if (!extension)
		throw new Error('The checksum-pinned polkadot.js extension was not loaded')

	expect(extension.manifest.version).toBe('0.63.1')
	expect(JSON.parse(await readFile('scripts/wallet-extensions/wallets.json', 'utf8'))['polkadot-js'].sha256).toBe('382871bea456d654c215442a069106d18e31bd867021f0c41fe9455fb7022ac1')

	const applicationOrigin = baseURL ?? 'http://127.0.0.1:5173'
	const walletPageUrl = `${applicationOrigin}/~/wallets`
	await page.goto(walletPageUrl)
	await waitForWalletPageReady(page)
	await createPolkadotJsAccounts(await openPolkadotJs(context, extension))
	await expect.poll(() => page.evaluate(() => Object.keys(window.injectedWeb3 ?? {}))).toContain('polkadot-js')
	await expect(connectWalletButtonForDriver(page, 'PolkadotJs')).toBeVisible()

	await Promise.all([
		approvePolkadotJsConnection(context, extension.id, walletPageUrl),
		connectWalletButtonForDriver(page, 'PolkadotJs').click(),
	])
	const connection = walletConnectionCardById(page, 'polkadot:polkadot-js')
	await expect(connection).toBeVisible({ timeout: 45_000 })
	await expect(connection.locator('input[type="radio"]')).toHaveCount(2)
	await expect(selectedWalletAccount(connection)).toHaveCount(1)
	const accountLabels = await connection.locator('label:has(input[type="radio"])').allTextContents()
	expect(new Set(accountLabels).size).toBe(2)
	await connection.getByRole('radio').nth(1).click()
	await expect(connection.locator('fieldset:has(input[type="radio"])')).toHaveAttribute('aria-busy', 'false')
	await expect(selectedWalletAccountLabel(connection)).toHaveText(accountLabels[1])

	await page.reload()
	await expect.poll(() => page.evaluate(() => Object.keys(window.injectedWeb3 ?? {}))).toContain('polkadot-js')
	await expect(selectedWalletAccountLabel(walletConnectionCardById(page, 'polkadot:polkadot-js'))).toHaveText(accountLabels[1])
	await disconnectWalletButton(walletConnectionCardById(page, 'polkadot:polkadot-js')).click()
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 0.', { timeout: 45_000 })
	await page.reload()
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 0.')
})
