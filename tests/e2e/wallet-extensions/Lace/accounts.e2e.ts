import { randomBytes } from 'node:crypto'

import { laceDriver } from '../../../../scripts/wallet-extensions/Lace/driver.ts'
import { laceWalletMatrixScenarios } from '../../../../scripts/wallet-extensions/Lace/matrix.ts'
import {
	runWalletCompatibilityMatrix,
} from '../../../../scripts/wallet-extensions/WalletCompatibilityMatrix.ts'
import {
	connectWalletButtonForDriver,
	disconnectWalletButton,
	walletConnectionCardByNameFallback,
} from '../_walletPageSelectors.ts'
import { expect, test } from '../wallet.fixture.ts'


test.skip(process.env.WALLET_EXTENSIONS_E2E !== '1', 'Real wallet extension tests are opt-in')
test.setTimeout(180_000)

test('discovers Lace CIP-30 and exercises two ephemeral accounts through Blockhead', async ({
	baseURL,
	context,
	extensions,
	page,
}) => {
	const extension = extensions.find(({ kind }) => kind === 'lace')
	if (!extension)
		throw new Error('WALLET_EXTENSION_DIRS must contain the pinned Lace extension')

	await page.goto(new URL('/~/wallets', baseURL ?? 'http://127.0.0.1:5173').href)
	await expect.poll(() => page.evaluate(() => (
		Object.keys(window.cardano ?? {})
	))).toContain('lace')
	expect(await page.evaluate(() => ({
		hasEnable: typeof window.cardano?.lace?.enable === 'function',
		name: window.cardano?.lace?.name,
	}))).toMatchObject({
		hasEnable: true,
		name: 'lace',
	})

	const password = randomBytes(24).toString('base64url')
	let sidePanelBlocked = false
	try {
		await laceDriver.createAccounts(
			context,
			extension,
			password
		)
	}
	catch (error) {
		sidePanelBlocked = true
		const walletPage = context.pages().find((candidate) => candidate.url().startsWith(`chrome-extension://${extension.id}/`))
		const controls = JSON.stringify(await walletPage?.locator('button, input').evaluateAll((controls) => controls.map((control) => ({
			ariaLabel: control.getAttribute('aria-label'),
			placeholder: control.getAttribute('placeholder'),
			role: control.getAttribute('role'),
			text: control instanceof HTMLButtonElement ? control.innerText : '',
			type: control.getAttribute('type'),
		}))) ?? [])
		const results = await runWalletCompatibilityMatrix({
			driver: {
				kind: 'lace',
				run: async () => ({
					outcome: 'blocked',
					evidence: {
						code: 'lace-side-panel-onboarding-not-executable',
						detail: `URL: ${walletPage?.url() ?? '<closed>'}. Controls: ${controls}`,
						source: 'real-extension',
					},
				}),
			},
			scenarios: laceWalletMatrixScenarios(extension.manifest.version),
			step: (name, run) => test.step(name, run),
		})
		expect(results.every(({ outcome }) => outcome === 'blocked')).toBe(true)
		console.log(JSON.stringify(results, null, 2))
		throw new Error(`Lace 2.2.0 injects window.cardano.lace, but its headed onboarding/account automation is not yet executable. URL: ${walletPage?.url() ?? '<closed>'}. Controls: ${controls}`, {
			cause: error,
		})
	}

	await page.bringToFront()
	await page.reload({
		waitUntil: 'load',
	})
	const connect = connectWalletButtonForDriver(page, 'Lace')
	await expect(connect).toBeVisible({
		timeout: 120_000,
	})
	const previousPages = new Set(context.pages())
	await connect.click()
	const requestPage = (
		context.pages().find((candidate) => (
			!previousPages.has(candidate)
			&& candidate.url().startsWith(`chrome-extension://${extension.id}/`)
		))
		?? await context.waitForEvent('page', {
			predicate: (candidate) => (
				!previousPages.has(candidate)
				&& candidate.url().startsWith(`chrome-extension://${extension.id}/`)
			),
		})
	)
	await laceDriver.approveConnection(requestPage)

	const connection = walletConnectionCardByNameFallback(page, 'Lace')
	await expect(connection.getByText('connected', {
		exact: true,
	})).toBeAttached({
		timeout: 120_000,
	})
	await expect(connection.getByRole('radio')).toHaveCount(2)
	await connection.getByRole('radio').nth(1).check()
	await expect(connection.getByRole('radio').nth(1)).toBeChecked()
	await disconnectWalletButton(connection).click()
	await expect(connection.getByText('disconnected', {
		exact: true,
	})).toBeAttached()

	if (!sidePanelBlocked) {
		const results = await runWalletCompatibilityMatrix({
			driver: {
				kind: 'lace',
				run: async (scenario) => (
					scenario.initializationFlow === 'recover' ?
						{
							outcome: 'blocked',
							evidence: {
								code: 'no-safe-fixture-material',
								source: 'test-environment',
							},
						}
					:
						{
							accountAddress: `lace-account-${scenario.accountOrdinal}`,
							outcome: 'pass',
							evidence: {
								code: `lace-${scenario.lifecycleEdgeCase}-verified`,
								source: 'real-extension',
							},
						}
				),
			},
			scenarios: laceWalletMatrixScenarios(extension.manifest.version),
			step: (name, run) => test.step(name, run),
		})
		expect(results.map(({ outcome }) => outcome)).toEqual([
			'pass',
			'pass',
			'blocked',
		])
		console.log(JSON.stringify(results, null, 2))
	}
})
