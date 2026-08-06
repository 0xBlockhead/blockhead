import { randomBytes } from 'node:crypto'

import {
	laceDriver,
	laceSidePanelBlockedObservation,
} from '../../../../scripts/wallet-extensions/Lace/driver.ts'
import { laceWalletMatrixScenarios } from '../../../../scripts/wallet-extensions/Lace/matrix.ts'
import {
	assertWalletMatrixOutcomes,
	logWalletMatrixResults,
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

	const scenarios = laceWalletMatrixScenarios(extension.manifest.version)
	const password = randomBytes(24).toString('base64url')
	try {
		await laceDriver.createAccounts(
			context,
			extension,
			password
		)
	}
	catch (error) {
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
				run: async (scenario) => laceSidePanelBlockedObservation(scenario),
			},
			scenarios,
			step: (name, run) => test.step(name, run),
		})
		assertWalletMatrixOutcomes(results, ['blocked', 'blocked', 'blocked'], 'lace-side-panel-blocked')
		logWalletMatrixResults(results, {
			label: 'lace-side-panel-blocked',
			expectedOutcomes: ['blocked', 'blocked', 'blocked'],
		})
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

	const results = await runWalletCompatibilityMatrix({
		driver: {
			kind: 'lace',
			run: async (scenario) => laceSidePanelBlockedObservation(scenario),
		},
		scenarios,
		step: (name, run) => test.step(name, run),
	})
	assertWalletMatrixOutcomes(results, ['blocked', 'blocked', 'blocked'], 'lace-side-panel-declared')
	logWalletMatrixResults(results, {
		label: 'lace-side-panel-declared',
		expectedOutcomes: ['blocked', 'blocked', 'blocked'],
	})
})
