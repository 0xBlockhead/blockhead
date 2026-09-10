import { randomBytes } from 'node:crypto'
import { readFile } from 'node:fs/promises'

import { keplrDriver } from '../../../../scripts/wallet-extensions/Keplr/driver.ts'
import {
	connectWalletButtonForDriver,
	disconnectWalletButton,
} from '../_walletPageSelectors.ts'
import { expect, test } from '../wallet.fixture.ts'


declare global {
	interface Window {
		keplr?: {
			enable: (chainId: string) => Promise<void>
			getOfflineSignerAuto: (chainId: string) => Promise<{
				getAccounts: () => Promise<{
					address: string
				}[]>
			}>
		}
	}
}

const COSMOS_HUB_CHAIN_ID = 'cosmoshub-4'

test.skip(process.env.WALLET_EXTENSIONS_E2E !== '1', 'Real wallet extension tests are opt-in')
test.setTimeout(240_000)

test('onboards two ephemeral Keplr accounts and exercises Blockhead Cosmos discovery', async ({
	baseURL,
	context,
	extensions,
	page,
}) => {
	const descriptor = JSON.parse(await readFile('scripts/wallet-extensions/wallets.json', 'utf8')).keplr
	expect(descriptor).toMatchObject({
		version: '0.13.41',
		repository: 'https://github.com/chainapsis/keplr-wallet',
		distribution: 'https://chromewebstore.google.com/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap',
		license: 'Apache-2.0; official managed builds include closed-source submodules',
		sha256: '7f62697382730def4afefa149659ec133423616020080b09ea42e664edd9fe4c',
	})

	const extension = extensions.find(({ kind }) => kind === 'keplr')
	if (!extension)
		throw new Error('WALLET_EXTENSION_DIRS must contain checksum-pinned Keplr 0.13.41')

	const password = randomBytes(24).toString('base64url')
	await keplrDriver.createAccount(await keplrDriver.open(context, extension), {
		name: 'Blockhead Keplr 1',
		password,
	})
	const secondAccountPage = await context.newPage()
	await secondAccountPage.goto(`chrome-extension://${extension.id}/register.html`)
	await keplrDriver.createAccount(secondAccountPage, {
		name: 'Blockhead Keplr 2',
		password,
	})

	await page.goto(`${baseURL ?? 'http://127.0.0.1:5173'}/~/wallets`)
	await expect.poll(() => page.evaluate(() => Boolean(window.keplr))).toBe(true)
	const approvalPagePromise = context.waitForEvent('page', {
		predicate: (openedPage) => openedPage.url().startsWith(`chrome-extension://${extension.id}/`),
	})
	await connectWalletButtonForDriver(page, 'Keplr').first().click()
	const approvalPage = await approvalPagePromise
	await approvalPage.getByRole('button', {
		name: /approve|connect/i,
	}).click()

	const secondAccountAddress = await page.evaluate(async (chainId) => (
		(await (await window.keplr?.getOfflineSignerAuto(chainId))?.getAccounts())?.[0]?.address
	), COSMOS_HUB_CHAIN_ID)
	expect(secondAccountAddress).toMatch(/^cosmos1/)

	await keplrDriver.switchAccount(context, extension, 'Blockhead Keplr 2', 'Blockhead Keplr 1')
	await expect.poll(() => page.evaluate(async (chainId) => (
		(await (await window.keplr?.getOfflineSignerAuto(chainId))?.getAccounts())?.[0]?.address
	), COSMOS_HUB_CHAIN_ID)).not.toBe(secondAccountAddress)
	const firstAccountAddress = await page.evaluate(async (chainId) => (
		(await (await window.keplr?.getOfflineSignerAuto(chainId))?.getAccounts())?.[0]?.address
	), COSMOS_HUB_CHAIN_ID)
	expect(firstAccountAddress).toMatch(/^cosmos1/)
	await expect(page.getByText('connected', {
		exact: true,
	})).toBeVisible()
	await expect(page.getByRole('radio', {
		name: new RegExp(firstAccountAddress ?? ''),
	})).toBeChecked()

	await keplrDriver.switchAccount(context, extension, 'Blockhead Keplr 1', 'Blockhead Keplr 2')
	await expect.poll(() => page.evaluate(async (chainId) => (
		(await (await window.keplr?.getOfflineSignerAuto(chainId))?.getAccounts())?.[0]?.address
	), COSMOS_HUB_CHAIN_ID)).toBe(secondAccountAddress)
	await disconnectWalletButton(page).click()
	await expect(connectWalletButtonForDriver(page, 'Keplr').first()).toBeVisible()
	await page.reload()
	await expect(connectWalletButtonForDriver(page, 'Keplr').first()).toBeVisible()
})
