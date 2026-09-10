import { unisatDriver } from '../../../../scripts/wallet-extensions/UniSat/driver.ts'
import { createEphemeralWalletSecret } from '../../../../scripts/wallet-extensions/WalletExtensionHarness.ts'
import {
	connectWalletButtonForDriver,
	disconnectWalletButton,
	retryConnectionButton,
	walletConnectionCard,
	walletConnectionCardByNameFallback,
	walletConnectionsStatus,
} from '../_walletPageSelectors.ts'
import { expect, test } from '../wallet.fixture.ts'


declare global {
	interface Window {
		unisat?: {
			getAccounts: () => Promise<string[]>
			requestAccounts: () => Promise<string[]>
		}
	}
}


test.skip(process.env.WALLET_EXTENSIONS_E2E !== '1', 'Real wallet extension tests are opt-in')
test.setTimeout(420_000)

test('creates and switches ephemeral UniSat accounts through Blockhead', async ({
	baseURL,
	context,
	extensions,
	page,
}) => {
	const extension = extensions.find(({ kind }) => kind === 'unisat')
	if (!extension)
		throw new Error('Declared UniSat wallet journey requires its artifact to be loaded')

	const walletPage = await unisatDriver.open(context, extension)
	let password = createEphemeralWalletSecret('Us!')
	await unisatDriver.onboard(walletPage, password)
	password = ''
	await expect(walletPage.getByTestId('account-select')).toBeVisible({
		timeout: 30_000,
	})
	await unisatDriver.createDerivedAccount(walletPage)

	await page.goto(`${baseURL ?? 'http://127.0.0.1:5173'}/~/wallets`, {
		waitUntil: 'load',
	})
	await expect.poll(() => page.evaluate(() => Boolean(window.unisat))).toBe(true)
	await expect(connectWalletButtonForDriver(page, 'UniSat').first()).toBeVisible({
		timeout: 120_000,
	})

	const [approvalPage] = await Promise.all([
		unisatDriver.waitForApproval(context, extension),
		connectWalletButtonForDriver(page, 'UniSat').first().click(),
	])
	await expect.poll(() => approvalPage.locator('body').innerText()).not.toBe('')
	await unisatDriver.rejectConnection(approvalPage)
	await expect.poll(() => approvalPage.isClosed()).toBe(true)

	const retryConnection = retryConnectionButton(page).or(connectWalletButtonForDriver(page, 'UniSat')).first()
	await expect(retryConnection).toBeVisible({
		timeout: 120_000,
	})
	const [retryApprovalPage] = await Promise.all([
		unisatDriver.waitForApproval(context, extension),
		retryConnection.click(),
	])
	await expect.poll(() => retryApprovalPage.locator('body').innerText()).not.toBe('')
	await unisatDriver.approveConnection(retryApprovalPage)
	await expect.poll(() => retryApprovalPage.isClosed()).toBe(true)

	const connection = walletConnectionCard(page, 'UniSat')
	await expect(connection.getByText('connected', {
		exact: true,
	})).toBeAttached({
		timeout: 120_000,
	})

	const firstAddress = (
		await page.evaluate(async () => (
			(await window.unisat?.getAccounts())?.[0]
		))
	)
	if (firstAddress == null)
		throw new Error('UniSat did not expose a connected account address')

	const activeAccountBeforeSwitch = await connection.locator('input[type="radio"]:checked').locator('..').innerText()
	await unisatDriver.switchAccount(walletPage)
	await expect.poll(() => connection.locator('input[type="radio"]:checked').locator('..').innerText()).not.toBe(activeAccountBeforeSwitch)
	const secondAddress = (
		await page.evaluate(async () => (
			(await window.unisat?.getAccounts())?.[0]
		))
	)
	if (secondAddress == null || secondAddress === firstAddress)
		throw new Error('UniSat account switch did not expose a distinct second account address')

	await disconnectWalletButton(connection).click()
	await expect(walletConnectionCardByNameFallback(page, 'UniSat').getByText('disconnected', {
		exact: true,
	})).toBeAttached()
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 0.')

})
