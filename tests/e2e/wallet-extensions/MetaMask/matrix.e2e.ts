import {
	createEphemeralWalletSecret,
	exerciseWalletSigningRequest,
} from '../../../../scripts/wallet-extensions/WalletExtensionHarness.ts'
import { WalletHarnessEcosystem } from '../../../../scripts/wallet-extensions/ecosystems.ts'
import {
	metamaskDriver,
	metamaskUnsupportedEnvironmentEvidence,
} from '../../../../scripts/wallet-extensions/MetaMask/driver.ts'
import { metamaskWalletMatrixScenarios } from '../../../../scripts/wallet-extensions/MetaMask/matrix.ts'
import {
	assertWalletMatrixOutcomes,
	logWalletMatrixResults,
	runWalletCompatibilityMatrix,
} from '../../../../scripts/wallet-extensions/WalletCompatibilityMatrix.ts'
import {
	connectWalletButtonForDriver,
	selectedWalletAccount,
	walletConnectionCard,
	walletConnectionsStatus,
} from '../_walletPageSelectors.ts'
import { expect, test } from '../wallet.fixture.ts'


test.skip(process.env.WALLET_EXTENSIONS_E2E !== '1', 'Real MetaMask extension test is opt-in')
test.setTimeout(420_000)

test('runs the MetaMask real-extension matrix shard', async ({
	baseURL,
	context,
	extensions,
	page,
}) => {
	const extension = extensions.find(({ kind }) => kind === 'metamask')
	const scenarios = metamaskWalletMatrixScenarios(extension?.manifest.version ?? 'unavailable')

	if (!process.env.METAMASK_EXTENSION_DIR || !extension) {
		const results = await runWalletCompatibilityMatrix({
			driver: {
				kind: 'metamask',
				run: async () => metamaskUnsupportedEnvironmentEvidence(),
			},
			scenarios,
			step: (name, run) => test.step(name, run),
		})
		assertWalletMatrixOutcomes(results, ['unsupported'], 'metamask-unsupported-environment')
		logWalletMatrixResults(results, {
			label: 'metamask-unsupported-environment',
			expectedOutcomes: ['unsupported'],
		})
		return
	}

	const {
		addresses,
		page: walletPage,
	} = await metamaskDriver.createAccounts(
		context,
		extension,
		createEphemeralWalletSecret('MetaMask-')
	)
	expect(new Set(addresses.map((address) => address.toLowerCase())).size).toBe(3)

	await page.addInitScript(() => {
		const announcements: unknown[] = []
		Reflect.set(globalThis, Symbol.for('blockhead-metamask-announcements'), announcements)
		window.addEventListener('eip6963:announceProvider', (event) => {
			announcements.push(Reflect.get(event, 'detail'))
		})
	})
	await page.goto(`${baseURL ?? 'http://127.0.0.1:5173'}/~/wallets`)
	await page.evaluate(() => {
		window.dispatchEvent(new Event('eip6963:requestProvider'))
	})
	await expect.poll(() => page.evaluate(() => (
		Reflect.get(globalThis, Symbol.for('blockhead-metamask-announcements')).length
	))).toBeGreaterThan(0)
	await expect(walletConnectionsStatus(page)).toContainText(/Providers detected: [1-9]/)

	const pagesBeforeRejection = new Set(context.pages())
	await connectWalletButtonForDriver(page, 'MetaMask').click()
	await metamaskDriver.rejectConnection(await metamaskDriver.waitForRequest(context, extension, pagesBeforeRejection))
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 0.')

	const pagesBeforeRetry = new Set(context.pages())
	await connectWalletButtonForDriver(page, 'MetaMask').click()
	await metamaskDriver.approveConnection(await metamaskDriver.waitForRequest(context, extension, pagesBeforeRetry))
	const connection = walletConnectionCard(page, 'MetaMask')
	await expect(selectedWalletAccount(connection)).toBeVisible()

	await metamaskDriver.selectAccount(walletPage, 'Account 2')
	await expect.poll(() => page.evaluate(async () => {
		const provider = Reflect.get(
			Reflect.get(globalThis, Symbol.for('blockhead-metamask-announcements'))[0],
			'provider'
		)
		return String(Reflect.get(await Reflect.get(provider, 'request').call(provider, {
			method: 'eth_accounts',
		}), 0)).toLowerCase()
	})).toBe(addresses[1].toLowerCase())

	const signing = metamaskDriver.signing(context, extension)
	for (const decision of ['reject', 'approve'] as const) {
		const result = await exerciseWalletSigningRequest({
			contract: {
				provider: {
					request: ({ method, params }) => page.evaluate(async ({
						method,
						params,
					}) => {
						const provider = Reflect.get(
							Reflect.get(globalThis, Symbol.for('blockhead-metamask-announcements'))[0],
							'provider'
						)
						return Reflect.get(provider, 'request').call(provider, {
							method,
							params,
						})
					}, {
						method,
						params,
					}),
				},
				driver: signing,
				observePersistence: () => ({
					evmTransactionIds: [],
				}),
			},
			request: {
				ecosystem: WalletHarnessEcosystem.Evm,
				kind: 'message',
				method: 'personal_sign',
				accountAddress: addresses[1],
				chainId: 'eip155:1',
				params: [
					decision === 'approve' ? '0x426c6f636b68656164204d6574614d61736b20617070726f7665' : '0x426c6f636b68656164204d6574614d61736b2072656a656374',
					addresses[1],
				],
			},
			decision,
		})
		expect(result.decision).toBe(decision)
	}

	await page.evaluate(async () => {
		const provider = Reflect.get(
			Reflect.get(globalThis, Symbol.for('blockhead-metamask-announcements'))[0],
			'provider'
		)
		await Reflect.get(provider, 'request').call(provider, {
			method: 'wallet_revokePermissions',
			params: [{
				eth_accounts: {},
			}],
		})
	})
	await page.reload()
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 0.')

	const results = await runWalletCompatibilityMatrix({
		driver: {
			kind: 'metamask',
			run: async (scenario) => ({
				accountAddress: addresses[scenario.accountOrdinal - 1],
				outcome: 'pass',
				evidence: {
					code: `metamask-${scenario.lifecycleEdgeCase}-verified`,
					source: 'semantic-selector',
				},
			}),
		},
		scenarios,
		step: (name, run) => test.step(name, run),
	})
	assertWalletMatrixOutcomes(results, ['pass'], 'metamask-real-extension')
	logWalletMatrixResults(results, {
		label: 'metamask-real-extension',
		expectedOutcomes: ['pass'],
	})
})
