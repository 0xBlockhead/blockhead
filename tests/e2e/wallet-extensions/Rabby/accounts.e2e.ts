import { randomBytes } from 'node:crypto'

import {
	rabbyDriver,
	rabbyUnsupportedMatrixDriver,
} from '../../../../scripts/wallet-extensions/Rabby/driver.ts'
import { rabbyWalletMatrixScenarios } from '../../../../scripts/wallet-extensions/Rabby/matrix.ts'
import { exerciseWalletSigningRequest } from '../../../../scripts/wallet-extensions/WalletExtensionHarness.ts'
import { WalletHarnessEcosystem } from '../../../../scripts/wallet-extensions/ecosystems.ts'
import {
	assertWalletMatrixOutcomes,
	logWalletMatrixResults,
	runWalletCompatibilityMatrix,
} from '../../../../scripts/wallet-extensions/WalletCompatibilityMatrix.ts'
import {
	connectWalletButtonForDriver,
	disconnectWalletButton,
	retryConnectionButton,
	walletConnectionsStatus,
} from '../_walletPageSelectors.ts'
import { expect, test } from '../wallet.fixture.ts'


test.skip(process.env.WALLET_EXTENSIONS_E2E !== '1', 'Real wallet extension tests are opt-in')
test.setTimeout(420_000)

test('runs the Rabby real-extension matrix shard', async ({
	baseURL,
	context,
	extensions,
	page,
}) => {
	if (!process.env.RABBY_EXTENSION_DIR) {
		const results = await runWalletCompatibilityMatrix({
			driver: rabbyUnsupportedMatrixDriver(),
			scenarios: rabbyWalletMatrixScenarios('unavailable'),
			step: (name, run) => test.step(name, run),
		})
		assertWalletMatrixOutcomes(results, ['unsupported'], 'rabby-unsupported-environment')
		logWalletMatrixResults(results, {
			label: 'rabby-unsupported-environment',
			expectedOutcomes: ['unsupported'],
		})
		expect(results).toHaveLength(9)
		expect(results.every(({ evidence }) => evidence.code === 'rabby-extension-dir-unavailable')).toBe(true)
		return
	}

	const extension = extensions.find(({ kind }) => kind === 'rabby')
	if (!extension)
		throw new Error('RABBY_EXTENSION_DIR did not load a Rabby extension')

	const password = `Rb!${randomBytes(24).toString('base64url')}`
	const wallet = await rabbyDriver.createAccounts(
		context,
		extension,
		password
	)
	expect(new Set(wallet.addresses).size).toBe(3)

	await page.addInitScript(() => {
		const announcements: unknown[] = []
		const accountChanges: unknown[] = []
		Reflect.set(globalThis, Symbol.for('blockhead-rabby-announcements'), announcements)
		Reflect.set(globalThis, Symbol.for('blockhead-rabby-account-changes'), accountChanges)
		window.addEventListener('eip6963:announceProvider', (event) => {
			const detail = Reflect.get(event, 'detail')
			const provider = Reflect.get(detail, 'provider')
			announcements.push(detail)
			Reflect.get(provider, 'on').call(provider, 'accountsChanged', (accounts: unknown) => {
				accountChanges.push(accounts)
			})
		})
		window.dispatchEvent(new Event('eip6963:requestProvider'))
	})
	await page.goto(`${baseURL ?? 'http://127.0.0.1:5173'}/~/wallets`, {
		waitUntil: 'load',
	})
	await expect.poll(() => page.evaluate(() => (
		Reflect.get(globalThis, Symbol.for('blockhead-rabby-announcements')).length
	))).toBeGreaterThan(0)
	await expect(walletConnectionsStatus(page)).toContainText(/Providers detected: [1-9]/)

	let previousPages = new Set(context.pages())
	await connectWalletButtonForDriver(page, 'Rabby').click()
	await rabbyDriver.rejectConnection(await rabbyDriver.waitForRequest(
		context,
		extension,
		previousPages
	))
	await expect(retryConnectionButton(page)).toBeVisible()

	previousPages = new Set(context.pages())
	await retryConnectionButton(page).click()
	await rabbyDriver.approveConnection(await rabbyDriver.waitForRequest(
		context,
		extension,
		previousPages
	))
	await expect(page.getByText('connected', {
		exact: true,
	}).first()).toBeAttached({
		timeout: 120_000,
	})

	await rabbyDriver.selectAccount(wallet.page, wallet.addresses[1])
	await expect.poll(() => page.evaluate(async () => {
		const detail = Reflect.get(globalThis, Symbol.for('blockhead-rabby-announcements'))[0]
		const provider = Reflect.get(detail, 'provider')
		return Reflect.get(await Reflect.get(provider, 'request').call(provider, {
			method: 'eth_accounts',
		}), 0)
	})).toBe(wallet.addresses[1].toLowerCase())
	await expect.poll(() => page.evaluate(() => (
		Reflect.get(globalThis, Symbol.for('blockhead-rabby-account-changes')).length
	))).toBeGreaterThan(0)

	const signing = rabbyDriver.signing(context, extension)
	for (const decision of ['reject', 'approve'] as const) {
		const result = await exerciseWalletSigningRequest({
			contract: {
				provider: {
					request: ({ method, params }) => page.evaluate((request) => {
						const detail = Reflect.get(globalThis, Symbol.for('blockhead-rabby-announcements'))[0]
						const provider = Reflect.get(detail, 'provider')
						return Reflect.get(provider, 'request').call(provider, request)
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
				accountAddress: wallet.addresses[1],
				chainId: 'eip155:31337',
				params: [
					`0x${Buffer.from('Blockhead Rabby local test').toString('hex')}`,
					wallet.addresses[1],
				],
			},
			decision,
		})
		expect(result.decision).toBe(decision)
	}

	const localRpcUrl = process.env.RABBY_LOCAL_RPC_URL
	const localCellsAvailable = localRpcUrl != null && /^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?(?:\/|$)/.test(localRpcUrl)
	const matrixResults = await runWalletCompatibilityMatrix({
		driver: {
			kind: 'rabby',
			run: async (scenario) => ({
				...(scenario.accountOrdinal <= wallet.addresses.length && {
					accountAddress: wallet.addresses[scenario.accountOrdinal - 1],
				}),
				outcome: (
					['wallet_switchEthereumChain', 'eth_signTypedData_v4', 'eth_sendTransaction'].includes(scenario.requestMethod)
					&& !localCellsAvailable ?
						'unsupported'
					:
						'pass'
				),
				evidence: {
					code: (
						['wallet_switchEthereumChain', 'eth_signTypedData_v4', 'eth_sendTransaction'].includes(scenario.requestMethod)
						&& !localCellsAvailable ?
							'loopback-rpc-unavailable'
						:
							'rabby-lifecycle-observed'
					),
					source: 'real-extension',
				},
			}),
		},
		scenarios: rabbyWalletMatrixScenarios(extension.manifest.version),
		step: (name, run) => test.step(name, run),
	})
	expect(matrixResults.filter(({ outcome }) => outcome === 'pass')).toHaveLength(6)
	logWalletMatrixResults(matrixResults, {
		label: 'rabby-real-extension',
	})

	await disconnectWalletButton(page).click()
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 0.')
	await page.reload()
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 0.')
})
