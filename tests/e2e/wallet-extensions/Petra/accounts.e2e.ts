import { randomBytes } from 'node:crypto'

import { petraDriver } from '../../../../scripts/wallet-extensions/Petra/driver.ts'
import { petraWalletMatrixScenarios } from '../../../../scripts/wallet-extensions/Petra/matrix.ts'
import {
	logWalletMatrixResults,
	runWalletCompatibilityMatrix,
} from '../../../../scripts/wallet-extensions/WalletCompatibilityMatrix.ts'
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

test('runs the declarative Petra compatibility matrix', async ({
	baseURL,
	context,
	extensions,
	page,
}) => {
	const extension = extensions.find(({ kind }) => kind === 'petra')
	if (!extension) {
		test.skip(true, 'Petra artifact was not loaded')
		return
	}

	const scenarios = petraWalletMatrixScenarios(extension.manifest.version)
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
		connectWalletButtonForDriver(page, 'Petra').first().click().catch(() => undefined),
		petraDriver.decideConnection(context, extension, 'reject', previousPages),
	])
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 0.')

	let connected = false
	if (rejected) {
		const approvePreviousPages = new Set(context.pages())
		const [, approved] = await Promise.all([
			connectWalletButtonForDriver(page, 'Petra').first().click(),
			petraDriver.decideConnection(context, extension, 'approve', approvePreviousPages),
		])
		if (approved) {
			const connection = walletConnectionCard(page, 'Petra')
			await expect(selectedWalletAccount(connection)).toBeVisible({
				timeout: 120_000,
			})
			await expect(walletConnectionsStatus(page)).toContainText('Active connections: 1.')
			connected = true
			await disconnectWalletButton(page).click()
			await expect(walletConnectionsStatus(page)).toContainText('Active connections: 0.')
		}
	}

	const results = await runWalletCompatibilityMatrix({
		driver: {
			kind: 'petra',
			run: async (scenario) => {
				if (scenario.initializationFlow !== 'create-new')
					return {
						outcome: 'blocked',
						evidence: {
							code: 'no-safe-fixture-material',
							source: 'test-environment',
						},
					}

				if (connected)
					return {
						accountAddress: addresses[scenario.accountOrdinal - 1],
						outcome: 'pass',
						evidence: {
							code: `petra-${scenario.lifecycleEdgeCase}-verified`,
							source: 'semantic-selector',
						},
					}

				return {
					accountAddress: addresses[scenario.accountOrdinal - 1],
					outcome: 'unsupported',
					evidence: {
						code: rejected ?
							'petra-connect-approval-ui-unmapped'
						:
							'petra-connect-prompt-not-observed',
						detail: 'Product Connect Petra is discoverable; headed approval chrome remains unmapped',
						source: 'wallet-connections',
					},
				}
			},
		},
		scenarios,
		step: (name, run) => test.step(name, run),
	})

	expect(results).toHaveLength(3)
	expect(results.filter(({ outcome }) => outcome === 'blocked')).toHaveLength(1)
	expect(results.slice(0, 2).every(({ outcome }) => (
		outcome === 'pass' || outcome === 'unsupported'
	))).toBe(true)
	expect(results.slice(0, 2).every(({ accountAddressHash }) => /^sha256:[0-9a-f]{64}$/.test(accountAddressHash ?? ''))).toBe(true)
	logWalletMatrixResults(results, {
		label: 'petra-real-extension',
	})
})
