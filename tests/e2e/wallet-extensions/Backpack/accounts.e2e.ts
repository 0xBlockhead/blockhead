import { backpackDriver } from '../../../../scripts/wallet-extensions/Backpack/driver.ts'
import { backpackWalletMatrixScenarios } from '../../../../scripts/wallet-extensions/Backpack/matrix.ts'
import { createEphemeralWalletSecret } from '../../../../scripts/wallet-extensions/WalletExtensionHarness.ts'
import {
	logWalletMatrixResults,
	runWalletCompatibilityMatrix,
} from '../../../../scripts/wallet-extensions/WalletCompatibilityMatrix.ts'
import {
	connectWalletButtonForDriver,
	disconnectWalletButton,
	retryConnectionButton,
	selectedWalletAccountLabel,
	walletConnectionCard,
	walletConnectionsStatus,
} from '../_walletPageSelectors.ts'
import { expect, test } from './fixture.ts'


test.skip(process.env.WALLET_EXTENSIONS_E2E !== '1', 'Real wallet extension tests are opt-in')
test.setTimeout(420_000)

test('proves Backpack Wallet Standard lifecycle and capabilities', async ({
	baseURL,
	context,
	extensions,
	page,
}, testInfo) => {
	const backpack = extensions.find(({ kind }) => kind === 'backpack')
	if (backpack == null)
		test.skip(true, 'Backpack artifact was not loaded')

	if (backpack == null)
		return

	let password = createEphemeralWalletSecret('Bp!')
	const backpackPage = await backpackDriver.open(context, backpack)
	await backpackDriver.onboardSolana(backpackPage, password)
	password = ''

	const popupPage = await backpackDriver.openPopup(context, backpack)
	await expect(popupPage.getByText('Wallet 1', {
		exact: true,
	})).toBeVisible()
	const watchOnlyAddress = await backpackDriver.importViewOnlySolanaAccount(popupPage)
	await backpackPage.close()
	await popupPage.close()

	await page.addInitScript(() => {
		const wallets: unknown[] = []
		Reflect.set(globalThis, Symbol.for('blockhead-backpack-wallet-standard'), wallets)
		window.addEventListener('wallet-standard:register-wallet', (event) => {
			const detail = Reflect.get(event, 'detail')
			if (typeof detail === 'function')
				detail({
					register: (...registeredWallets: unknown[]) => {
						wallets.push(...registeredWallets)
						return () => {}
					},
				})
		})
	})
	await page.goto(new URL('/~/wallets', baseURL ?? 'http://127.0.0.1:5173').href)
	await expect(connectWalletButtonForDriver(page, 'Backpack').first()).toBeVisible({
		timeout: 120_000,
	})
	await expect.poll(() => page.evaluate(() => (
		Reflect.get(globalThis, Symbol.for('blockhead-backpack-wallet-standard')).length
	))).toBeGreaterThan(0)
	const walletStandardMetadata = await page.evaluate(() => (
		Reflect.get(globalThis, Symbol.for('blockhead-backpack-wallet-standard')).map((wallet: object) => ({
			name: Reflect.get(wallet, 'name'),
			walletFeatures: Object.keys(Reflect.get(wallet, 'features') ?? {}),
			accounts: (Reflect.get(wallet, 'accounts') ?? []).map((account: object) => ({
				address: Reflect.get(account, 'address'),
				chains: Reflect.get(account, 'chains'),
				features: Reflect.get(account, 'features'),
			})),
		}))
	))
	expect(walletStandardMetadata).toEqual(expect.arrayContaining([
		expect.objectContaining({
			name: 'Backpack',
			walletFeatures: expect.arrayContaining([
				'standard:connect',
				'standard:disconnect',
				'standard:events',
			]),
		}),
	]))

	const approvalPagePromise = backpackDriver.waitForApproval(context, backpack)
	await connectWalletButtonForDriver(page, 'Backpack').last().click()
	const approvalPage = await approvalPagePromise
	await expect(approvalPage.getByText(/Wallet|View/i).first()).toBeVisible()
	await backpackDriver.rejectConnection(approvalPage)

	const retryConnection = retryConnectionButton(page)
	await expect(retryConnection).toBeVisible()
	const approvedPagePromise = backpackDriver.waitForApproval(context, backpack)
	await retryConnection.click()
	const approvedPage = await approvedPagePromise
	await backpackDriver.approveConnection(approvedPage)

	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 1.')
	const connection = walletConnectionCard(page, 'Backpack')
	await expect(connection.getByRole('radio')).toHaveCount(2)
	await expect(connection).toContainText(/solana/i)
	const selectedAccountBeforeSwitch = await selectedWalletAccountLabel(connection).innerText()
	const connectedWalletMetadata = await page.evaluate(() => (
		Reflect.get(globalThis, Symbol.for('blockhead-backpack-wallet-standard')).map((wallet: object) => (
			(Reflect.get(wallet, 'accounts') ?? []).map((account: object) => ({
				address: Reflect.get(account, 'address'),
				chains: Reflect.get(account, 'chains'),
				features: Reflect.get(account, 'features'),
			}))
		)).flat()
	))
	expect(new Set(connectedWalletMetadata.map(({ address }: { address: string }) => address)).size).toBe(2)
	expect(connectedWalletMetadata.map(({ address }: { address: string }) => address)).toEqual(
		expect.arrayContaining([
			watchOnlyAddress,
		])
	)
	expect(connectedWalletMetadata).toEqual(expect.arrayContaining([
		expect.objectContaining({
			chains: expect.arrayContaining(['solana:mainnet']),
		}),
	]))

	const createdAddress = connectedWalletMetadata
		.map(({ address }: { address: string }) => address)
		.find((address: string) => address !== watchOnlyAddress)
	if (createdAddress == null)
		throw new Error('Backpack create-new account address was not observed after connection')

	const accountSwitcher = await backpackDriver.openPopup(context, backpack)
	await backpackDriver.switchAccount(accountSwitcher, 'Wallet 1', watchOnlyAddress.slice(0, 4))
	await expect.poll(() => selectedWalletAccountLabel(connection).innerText()).not.toBe(selectedAccountBeforeSwitch)
	await accountSwitcher.close()

	await disconnectWalletButton(connection).click()
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 0.')
	await page.reload()
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 0.', {
		timeout: 120_000,
	})

	const results = await runWalletCompatibilityMatrix({
		driver: {
			kind: 'backpack',
			run: async (scenario) => (
				scenario.initializationFlow === 'recover' ?
					{
						outcome: 'blocked',
						evidence: {
							code: 'fixture-material-not-provided',
							source: 'test-environment',
						},
					}
				: scenario.initializationFlow === 'watch-only' ?
					{
						accountAddress: watchOnlyAddress,
						outcome: 'pass',
						evidence: {
							code: `backpack-${scenario.lifecycleEdgeCase}-verified`,
							source: 'semantic-selector',
						},
					}
				:
					{
						accountAddress: createdAddress,
						outcome: 'pass',
						evidence: {
							code: `backpack-${scenario.lifecycleEdgeCase}-verified`,
							source: 'semantic-selector',
						},
					}
			),
		},
		scenarios: backpackWalletMatrixScenarios(backpack.manifest.version),
		step: (name, run) => test.step(name, run),
	})
	expect(results.map(({ outcome }) => outcome)).toEqual([
		'pass',
		'pass',
		'blocked',
	])
	expect(results.map(({ initializationFlow }) => initializationFlow)).toEqual([
		'create-new',
		'watch-only',
		'recover',
	])
	const report = logWalletMatrixResults(results, {
		label: 'backpack-wallet-standard-matrix',
		expectedOutcomes: [
			'pass',
			'blocked',
		],
	})
	await testInfo.attach('backpack-wallet-standard-matrix.json', {
		body: JSON.stringify(report, null, '\t'),
		contentType: 'application/json',
	})
})
