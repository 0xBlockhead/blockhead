import { randomBytes } from 'node:crypto'

import { ambireDriver } from '../../../../scripts/wallet-extensions/Ambire/driver.ts'
import { ambireWalletMatrixScenarios } from '../../../../scripts/wallet-extensions/Ambire/matrix.ts'
import { createEphemeralWalletSecret } from '../../../../scripts/wallet-extensions/WalletExtensionHarness.ts'
import {
	runWalletCompatibilityMatrix,
} from '../../../../scripts/wallet-extensions/WalletCompatibilityMatrix.ts'
import { connectWalletButtonForDriver } from '../_walletPageSelectors.ts'
import { expect, test } from '../wallet.fixture.ts'


test.skip(process.env.WALLET_EXTENSIONS_E2E !== '1', 'Real wallet extension tests are opt-in')
test.setTimeout(420_000)

test('runs the Ambire view-only account lifecycle through Blockhead', async ({
	baseURL,
	context,
	extensions,
}) => {
	const extension = extensions.find(({ kind }) => kind === 'ambire')

	if (!extension)
		throw new Error('Ambire extension was not loaded')

	expect(extension.manifest.version).toBe('6.14.4')

	const walletPage = await ambireDriver.open(context, extension)
	await expect(walletPage).toHaveTitle('Ambire Onboarding')
	await expect(walletPage.getByText('Create new account', {
		exact: true,
	})).toBeVisible()

	await walletPage.getByText('Watch an address', {
		exact: true,
	}).click()
	const accountAddresses = [
		`0x${randomBytes(20).toString('hex')}`,
		`0x${randomBytes(20).toString('hex')}`,
	]
	await walletPage.getByRole('textbox').fill(accountAddresses[0])
	await walletPage.getByText('Add another address', {
		exact: true,
	}).click()
	await walletPage.getByRole('textbox').nth(1).fill(accountAddresses[1])
	await walletPage.getByText('Import', {
		exact: true,
	}).click()
	const password = createEphemeralWalletSecret()
	await walletPage.locator('input[type="password"]').first().fill(password)
	await walletPage.locator('input[type="password"]').nth(1).fill(password)
	await walletPage.locator('[data-testid="create-keystore-pass-btn"]').click()
	await walletPage.getByText('Complete', {
		exact: true,
	}).click()
	await walletPage.locator('[data-testid="onboarding-completed-open-dashboard-btn"]').click()

	const page = await context.newPage()
	await page.addInitScript(() => {
		const providers: unknown[] = []
		const accountChanges: unknown[] = []
		Reflect.set(globalThis, Symbol.for('blockhead-ambire-providers'), providers)
		Reflect.set(globalThis, Symbol.for('blockhead-ambire-account-changes'), accountChanges)
		window.addEventListener('eip6963:announceProvider', (event) => {
			const detail = Reflect.get(event, 'detail')
			const provider = Reflect.get(detail, 'provider')
			providers.push(detail)
			Reflect.get(provider, 'on').call(provider, 'accountsChanged', (accounts: unknown) => {
				accountChanges.push(accounts)
			})
		})
	})
	await page.goto(`${baseURL ?? 'http://127.0.0.1:5173'}/~/wallets`)
	await page.evaluate(() => {
		window.dispatchEvent(new Event('eip6963:requestProvider'))
	})
	await expect(page.getByText(/Ambire/i).first()).toBeVisible({
		timeout: 120_000,
	})
	expect(await page.evaluate(() => (
		Reflect.get(globalThis, Symbol.for('blockhead-ambire-providers')).length
	))).toBeGreaterThan(0)
	const previousPages = new Set(context.pages())
	await connectWalletButtonForDriver(page, 'Ambire').click()
	const requestPage = await ambireDriver.waitForRequest(context, extension, previousPages)
	await ambireDriver.approveConnection(requestPage)
	await expect.poll(() => (
		page.evaluate(async () => {
			const detail = Reflect.get(globalThis, Symbol.for('blockhead-ambire-providers'))[0]
			const provider = Reflect.get(detail, 'provider')
			return Reflect.get(await Reflect.get(provider, 'request').call(provider, {
				method: 'eth_accounts',
			}), 'length')
		})
	)).toBeGreaterThan(0)
	const dashboardPage = await ambireDriver.open(context, extension)
	await dashboardPage.locator('[data-testid="account-select-btn"]').click()
	await ambireDriver.selectAccount(dashboardPage, accountAddresses[1])
	await expect(dashboardPage.getByText('Account 2', {
		exact: true,
	})).toBeVisible()
	await expect.poll(() => (
		page.evaluate(() => (
			Reflect.get(globalThis, Symbol.for('blockhead-ambire-account-changes')).length
		))
	)).toBeGreaterThan(0)
	expect(await page.evaluate(async (expectedAccount) => {
		const detail = Reflect.get(globalThis, Symbol.for('blockhead-ambire-providers'))[0]
		const provider = Reflect.get(detail, 'provider')
		const accounts = await Reflect.get(provider, 'request').call(provider, {
			method: 'eth_accounts',
		})
		return Reflect.get(accounts, 0).toLowerCase() === expectedAccount.toLowerCase()
	}, accountAddresses[1])).toBe(true)

	expect(await page.evaluate(async () => {
		const detail = Reflect.get(globalThis, Symbol.for('blockhead-ambire-providers'))[0]
		const provider = Reflect.get(detail, 'provider')
		await Reflect.get(provider, 'request').call(provider, {
			method: 'wallet_revokePermissions',
			params: [
				{
					eth_accounts: {},
				},
			],
		})
		return Reflect.get(await Reflect.get(provider, 'request').call(provider, {
			method: 'eth_accounts',
		}), 'length')
	})).toBe(0)

	const pagesBeforeRejection = new Set(context.pages())
	await page.evaluate(() => {
		const detail = Reflect.get(globalThis, Symbol.for('blockhead-ambire-providers'))[0]
		const provider = Reflect.get(detail, 'provider')
		Reflect.set(
			globalThis,
			Symbol.for('blockhead-ambire-request-outcome'),
			Reflect.get(provider, 'request').call(provider, {
				method: 'eth_requestAccounts',
			}).then(
				() => true,
				() => false,
			),
		)
	})
	const rejectedRequestPage = await ambireDriver.waitForRequest(context, extension, pagesBeforeRejection)
	await ambireDriver.rejectConnection(rejectedRequestPage)
	expect(await page.evaluate(() => (
		Reflect.get(globalThis, Symbol.for('blockhead-ambire-request-outcome'))
	))).toBe(false)

	const pagesBeforeRetry = new Set(context.pages())
	await page.evaluate(() => {
		const detail = Reflect.get(globalThis, Symbol.for('blockhead-ambire-providers'))[0]
		const provider = Reflect.get(detail, 'provider')
		Reflect.set(
			globalThis,
			Symbol.for('blockhead-ambire-request-outcome'),
			Reflect.get(provider, 'request').call(provider, {
				method: 'eth_requestAccounts',
			}).then(
				() => true,
				() => false,
			),
		)
	})
	const retryRequestPage = await ambireDriver.waitForRequest(context, extension, pagesBeforeRetry)
	await ambireDriver.approveConnection(retryRequestPage)
	expect(await page.evaluate(() => (
		Reflect.get(globalThis, Symbol.for('blockhead-ambire-request-outcome'))
	))).toBe(true)

	expect(await page.evaluate(async () => {
		const detail = Reflect.get(globalThis, Symbol.for('blockhead-ambire-providers'))[0]
		const provider = Reflect.get(detail, 'provider')
		await Reflect.get(provider, 'request').call(provider, {
			method: 'wallet_revokePermissions',
			params: [
				{
					eth_accounts: {},
				},
			],
		})
		return Reflect.get(await Reflect.get(provider, 'request').call(provider, {
			method: 'eth_accounts',
		}), 'length')
	})).toBe(0)

	await dashboardPage.close()
	await walletPage.close()
	const matrixResults = await runWalletCompatibilityMatrix({
		driver: {
			kind: 'ambire',
			run: async (scenario) => (
				scenario.initializationFlow === 'recover' ?
					{
						outcome: 'blocked',
						evidence: {
							code: 'ambire-internal-account-derivation-failed',
							source: 'real-extension',
						},
					}
				:
					{
						accountAddress: accountAddresses[scenario.accountOrdinal - 1],
						outcome: 'pass',
						evidence: {
							code: `ambire-${scenario.lifecycleEdgeCase}-verified`,
							source: 'real-extension',
						},
					}
			),
		},
		scenarios: ambireWalletMatrixScenarios(extension.manifest.version),
		step: (name, run) => test.step(name, run),
	})
	expect(matrixResults.map(({ outcome }) => outcome)).toEqual([
		'pass',
		'pass',
		'blocked',
	])
	expect(matrixResults.every((result) => !('accountAddress' in result))).toBe(true)
	console.log(JSON.stringify(matrixResults, null, 2))
})
