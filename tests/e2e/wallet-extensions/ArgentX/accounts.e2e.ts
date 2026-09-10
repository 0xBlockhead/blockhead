import { randomBytes } from 'node:crypto'
import { readFile } from 'node:fs/promises'

import { argentXDriver } from '../../../../scripts/wallet-extensions/ArgentX/driver.ts'
import {
	connectWalletButtonForDriver,
	disconnectWalletButton,
	selectedWalletAccount,
	walletConnectionCard,
	walletConnectionsStatus,
} from '../_walletPageSelectors.ts'
import { expect, test } from '../wallet.fixture.ts'


test.skip(process.env.WALLET_EXTENSIONS_E2E !== '1', 'Real Argent X extension tests are opt-in')
test.setTimeout(420_000)
test.use({
	screenshot: 'off',
	trace: 'off',
	video: 'off',
})

test('exercises the Argent X account and connection lifecycle', async ({
	baseURL,
	context,
	extensions,
	page,
}) => {
	const extension = extensions.find(({ kind }) => kind === 'argent-x')
	if (!extension)
		throw new Error('The checksum-pinned Argent X extension was not loaded')

	expect(extension.manifest.version).toBe('5.23.0')
	const walletMetadata = JSON.parse(await readFile('scripts/wallet-extensions/wallets.json', 'utf8'))['argent-x']
	expect(walletMetadata.sha256).toBe('86fbe9e1edca1f6300da09a308a90bc1ebbe806424db60b5953e03c71d091b3e')
	expect(walletMetadata.license).toBe('Argent non-commercial source license')


	const {
		page: walletPage,
	} = await argentXDriver.createAccounts(
		context,
		extension,
		randomBytes(24).toString('base64url')
	)
	await page.goto(`${baseURL ?? 'http://127.0.0.1:5173'}/~/wallets`, {
		waitUntil: 'load',
	})
	await expect(walletConnectionsStatus(page)).toContainText(/Wallet discovery active\..*Providers detected: [1-9]/, {
		timeout: 60_000,
	})
	await expect(connectWalletButtonForDriver(page, 'ArgentX').first()).toBeVisible()
	expect(await page.evaluate(() => (
		Object.hasOwn(globalThis, 'starknet_argentX')
	))).toBe(true)

	const [, rejected] = await Promise.all([
		connectWalletButtonForDriver(page, 'ArgentX').first().click(),
		argentXDriver.decideConnection(context, extension.id, 'reject'),
	])
	expect(rejected).toBe(true)
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 0.')

	const [, approved] = await Promise.all([
		connectWalletButtonForDriver(page, 'ArgentX').first().click(),
		argentXDriver.decideConnection(context, extension.id, 'approve'),
	])
	expect(approved).toBe(true)
	const connection = walletConnectionCard(page, 'Argent X')
	await expect(selectedWalletAccount(connection)).toBeVisible()

	const firstAccount = await page.evaluate(async () => (
		(await globalThis.starknet_argentX.request({
			type: 'wallet_requestAccounts',
			params: {
				silent_mode: true,
			},
		}))[0]
	))
	expect(firstAccount).toMatch(/^0x[0-9a-f]{1,64}$/i)
	expect(await page.evaluate(async () => (
		globalThis.starknet_argentX.request({
			type: 'wallet_requestChainId',
		})
	))).toBe('0x534e5f4d41494e')

	await argentXDriver.selectAccount(walletPage, 2)
	await expect.poll(() => page.evaluate(async () => (
		(await globalThis.starknet_argentX.request({
			type: 'wallet_requestAccounts',
			params: {
				silent_mode: true,
			},
		}))[0]
	))).not.toBe(firstAccount)
	const switchedAccount = await page.evaluate(async () => (
		(await globalThis.starknet_argentX.request({
			type: 'wallet_requestAccounts',
			params: {
				silent_mode: true,
			},
		}))[0]
	))
	expect(switchedAccount).toMatch(/^0x[0-9a-f]{1,64}$/i)

	await disconnectWalletButton(page).click()
	await page.reload()
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 0.')
})
