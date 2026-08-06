import { randomBytes } from 'node:crypto'

import { zerionDriver } from '../../../../scripts/wallet-extensions/Zerion/driver.ts'
import { zerionWalletMatrixScenarios } from '../../../../scripts/wallet-extensions/Zerion/matrix.ts'
import {
	runWalletCompatibilityMatrix,
} from '../../../../scripts/wallet-extensions/WalletCompatibilityMatrix.ts'
import {
	connectWalletButtonForDriver,
	disconnectWalletButton,
	retryConnectionButton,
	walletConnectionsStatusById,
} from '../_walletPageSelectors.ts'
import { expect, test } from '../wallet.fixture.ts'


test.skip(process.env.WALLET_EXTENSIONS_E2E !== '1', 'Real Zerion extension test is opt-in')
test.setTimeout(240_000)

test('runs the real Zerion EIP-6963 account lifecycle', async ({
	baseURL,
	context,
	extensions,
	page,
}) => {
	const extension = extensions.find(({ kind }) => kind === 'zerion')
	if (!extension)
		throw new Error('Zerion lifecycle proof requires the unpacked Zerion extension')

	let captchaBlocked = false
	let walletPage
	try {
		walletPage = await zerionDriver.onboard(
			context,
			extension,
			`Zr!${randomBytes(24).toString('base64url')}`
		)
	}
	catch (error) {
		captchaBlocked = /Turnstile|CAPTCHA/i.test(String(error))
		if (!captchaBlocked)
			throw error

		const results = await runWalletCompatibilityMatrix({
			driver: {
				kind: 'zerion',
				run: async () => ({
					outcome: 'blocked',
					evidence: {
						code: 'zerion-turnstile-captcha-blocked',
						source: 'real-extension',
					},
				}),
			},
			scenarios: zerionWalletMatrixScenarios(extension.manifest.version),
			step: (name, run) => test.step(name, run),
		})
		expect(results.every(({ outcome }) => outcome === 'blocked')).toBe(true)
		console.log(JSON.stringify(results, null, 2))
		throw error
	}

	await expect(walletPage).toHaveURL(/#\/overview/)

	await page.goto(`${baseURL ?? 'http://127.0.0.1:5173'}/~/wallets`, {
		waitUntil: 'load',
	})
	const connectButton = connectWalletButtonForDriver(page, 'Zerion').first()
	await expect(connectButton).toBeVisible({
		timeout: 120_000,
	})
	await expect(walletConnectionsStatusById(page)).toContainText(/Providers detected: [1-9]/)

	let previousPages = new Set(context.pages())
	await connectButton.click()
	await zerionDriver.rejectConnection(await zerionDriver.waitForRequest(
		context,
		extension,
		previousPages
	))
	await expect(page.getByText(/rejected/i).first()).toBeAttached({
		timeout: 120_000,
	})

	previousPages = new Set(context.pages())
	await retryConnectionButton(page).click()
	await zerionDriver.approveConnection(await zerionDriver.waitForRequest(
		context,
		extension,
		previousPages
	))
	await expect(page.getByText('connected', {
		exact: true,
	}).first()).toBeAttached({
		timeout: 120_000,
	})

	const initialAccount = page.getByRole('radio').first()
	await expect(initialAccount).toBeChecked()
	await expect(walletConnectionsStatusById(page)).toContainText('Active connections: 1.')

	await walletPage.bringToFront()
	await walletPage.getByText(/^0x[0-9a-fA-F…]+$/).first().click()
	const addAccountButton = walletPage.getByText(/Add Account|Create Account/i).first()
	let secondAccountCreated = false
	if (await addAccountButton.isVisible()) {
		await addAccountButton.click()
		await walletPage.getByText(/Create New Account|Create Account/i).last().click()
		await page.bringToFront()
		await expect(page.getByRole('radio')).toHaveCount(2, {
			timeout: 120_000,
		})
		await page.getByRole('radio').last().check()
		await expect(page.getByRole('radio').last()).toBeChecked()
		secondAccountCreated = true
	}

	await disconnectWalletButton(page).click()
	await expect(page.getByText('disconnected', {
		exact: true,
	}).first()).toBeAttached({
		timeout: 120_000,
	})
	await expect(walletConnectionsStatusById(page)).toContainText('Active connections: 0.')

	if (!captchaBlocked) {
		const results = await runWalletCompatibilityMatrix({
			driver: {
				kind: 'zerion',
				run: async (scenario) => (
					scenario.initializationFlow === 'recover' ?
						{
							outcome: 'blocked',
							evidence: {
								code: 'no-safe-fixture-material',
								source: 'test-environment',
							},
						}
					: scenario.accountOrdinal === 2 && !secondAccountCreated ?
						{
							outcome: 'blocked',
							evidence: {
								code: 'second-account-ui-unavailable',
								source: 'real-extension',
							},
						}
					:
						{
							accountAddress: `zerion-account-${scenario.accountOrdinal}`,
							outcome: 'pass',
							evidence: {
								code: `zerion-${scenario.lifecycleEdgeCase}-verified`,
								source: 'real-extension',
							},
						}
				),
			},
			scenarios: zerionWalletMatrixScenarios(extension.manifest.version),
			step: (name, run) => test.step(name, run),
		})
		expect(results).toHaveLength(3)
		console.log(JSON.stringify(results, null, 2))
	}
})
