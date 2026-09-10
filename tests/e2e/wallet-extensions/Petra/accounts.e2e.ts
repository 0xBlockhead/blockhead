import { randomBytes } from 'node:crypto'

import { petraDriver } from '../../../../scripts/wallet-extensions/Petra/driver.ts'
import {
	connectWalletButtonForDriver,
	disconnectWalletButton,
	selectedWalletAccount,
	walletConnectionCard,
	walletConnectionsStatus,
} from '../_walletPageSelectors.ts'
import { expect, test } from '../wallet.fixture.ts'


test.skip(process.env.WALLET_EXTENSIONS_E2E !== '1', 'Real Petra extension test is opt-in')
test.setTimeout(240_000)

test('onboards Petra accounts and exercises its connection surfaces', async ({
	baseURL,
	context,
	extensions,
	page,
}) => {
	const extension = extensions.find(({ kind }) => kind === 'petra')
	if (!extension)
		throw new Error('Declared Petra wallet journey requires its artifact to be loaded')

	const {
		addresses,
	} = await petraDriver.createAccounts(
		context,
		extension,
		`Petra!${randomBytes(24).toString('base64url')}`
	)
	expect(addresses[0]).toMatch(/^0x[0-9a-f]+\.\.[0-9a-f]+$/i)
	expect(addresses[1]).toMatch(/^0x[0-9a-f]+\.\.[0-9a-f]+$/i)
	expect(addresses[1]).not.toBe(addresses[0])

	await page.addInitScript({
		content: `
			globalThis.__petraAip62Registrations = []
			globalThis.addEventListener('wallet-standard:register-wallet', (event) => {
				event.detail({
					register: (...wallets) => {
						globalThis.__petraAip62Registrations.push(...wallets.map((wallet) => ({
							name: wallet.name,
							features: Object.keys(wallet.features),
						})))
						return () => {}
					},
				})
			})
		`,
	})
	await page.goto(`${baseURL ?? 'http://127.0.0.1:5173'}/~/wallets`, {
		waitUntil: 'load',
	})
	await expect.poll(() => page.evaluate('globalThis.__petraAip62Registrations')).toContainEqual({
		name: 'Petra',
		features: expect.arrayContaining([
			'aptos:account',
			'aptos:connect',
			'aptos:network',
		]),
	})
	await expect(walletConnectionsStatus(page)).toContainText(/Providers detected: [1-9]/, {
		timeout: 120_000,
	})
	await expect(connectWalletButtonForDriver(page, 'Petra').first()).toBeVisible({
		timeout: 120_000,
	})

	const previousPages = new Set(context.pages())
	const [, rejected] = await Promise.all([
		connectWalletButtonForDriver(page, 'Petra').first().click(),
		petraDriver.decideConnection(context, extension, 'reject', previousPages),
	])
	expect(rejected).toBe(true)
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 0.')

	const approvePreviousPages = new Set(context.pages())
	const [, approved] = await Promise.all([
		connectWalletButtonForDriver(page, 'Petra').first().click(),
		petraDriver.decideConnection(context, extension, 'approve', approvePreviousPages),
	])
	expect(approved).toBe(true)
	const connection = walletConnectionCard(page, 'Petra')
	await expect(selectedWalletAccount(connection)).toBeVisible({
		timeout: 120_000,
	})
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 1.')
	await disconnectWalletButton(page).click()
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 0.')
})
