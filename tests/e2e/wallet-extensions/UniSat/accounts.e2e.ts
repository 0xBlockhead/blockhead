import { unisatDriver } from '../../../../scripts/wallet-extensions/UniSat/driver.ts'
import { unisatWalletMatrixScenarios } from '../../../../scripts/wallet-extensions/UniSat/matrix.ts'
import { createEphemeralWalletSecret } from '../../../../scripts/wallet-extensions/WalletExtensionHarness.ts'
import {
	logWalletMatrixResults,
	runWalletCompatibilityMatrix,
} from '../../../../scripts/wallet-extensions/WalletCompatibilityMatrix.ts'
import {
	connectWalletButtonForDriver,
	disconnectWalletButton,
	retryConnectionButton,
	walletConnectionCard,
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
}, testInfo) => {
	const extension = extensions.find(({ kind }) => kind === 'unisat')
	if (!extension)
		test.skip(true, 'UniSat artifact was not loaded')

	if (!extension)
		return

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

	await connectWalletButtonForDriver(page, 'UniSat').first().click()
	const approvalPage = await unisatDriver.waitForApproval(context, extension)
	await expect.poll(() => approvalPage.locator('body').innerText()).not.toBe('')
	await unisatDriver.rejectConnection(approvalPage)
	await expect.poll(() => approvalPage.isClosed()).toBe(true)

	const retryConnection = retryConnectionButton(page).or(connectWalletButtonForDriver(page, 'UniSat')).first()
	await expect(retryConnection).toBeVisible({
		timeout: 120_000,
	})
	await retryConnection.click()
	const retryApprovalPage = await unisatDriver.waitForApproval(context, extension)
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
	await expect(connection.getByText('disconnected', {
		exact: true,
	})).toBeAttached()
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 0.')

	const addresses = [
		firstAddress,
		secondAddress,
	]
	const results = await runWalletCompatibilityMatrix({
		driver: {
			kind: 'unisat',
			run: async (scenario) => (
				scenario.initializationFlow === 'recover' ?
					{
						outcome: 'blocked',
						evidence: {
							code: 'fixture-material-not-provided',
							source: 'test-environment',
						},
					}
				:
					{
						accountAddress: addresses[scenario.accountOrdinal - 1],
						outcome: 'pass',
						evidence: {
							code: `unisat-${scenario.lifecycleEdgeCase}-verified`,
							source: 'real-extension',
						},
					}
			),
		},
		scenarios: unisatWalletMatrixScenarios(extension.manifest.version),
		step: (name, run) => test.step(name, run),
	})
	expect(results.map(({ outcome }) => outcome)).toEqual([
		'pass',
		'pass',
		'blocked',
	])
	const report = logWalletMatrixResults(results, {
		label: 'unisat-account-lifecycle-matrix',
		expectedOutcomes: [
			'pass',
			'blocked',
		],
	})
	await testInfo.attach('unisat-account-lifecycle-matrix.json', {
		body: JSON.stringify(report, null, '\t'),
		contentType: 'application/json',
	})
})
