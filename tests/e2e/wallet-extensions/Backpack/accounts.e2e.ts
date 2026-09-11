import { ed25519 } from '@noble/curves/ed25519.js'
import type { StandardWallet } from '../../../../src/state/wallets/adapters/walletStandard.ts'

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


declare global {
	interface Window {
		blockheadBackpackWallets: StandardWallet[]
	}
}


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
		throw new Error('Backpack capability was requested but its extension artifact was not loaded')

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
		window.blockheadBackpackWallets = []
		window.addEventListener('wallet-standard:register-wallet', (event) => {
			const register = (...wallets: StandardWallet[]) => {
				window.blockheadBackpackWallets.push(...wallets)
				return () => {
					window.blockheadBackpackWallets = window.blockheadBackpackWallets.filter((wallet) => !wallets.includes(wallet))
				}
			}
			if ('register' in event.detail)
				event.detail.register(register)
			else
				event.detail({ register })
		})
	})
	await page.goto(new URL('/~/wallets', baseURL ?? 'http://127.0.0.1:5173').href)
	await expect(connectWalletButtonForDriver(page, 'Backpack').first()).toBeVisible({
		timeout: 120_000,
	})
	await expect.poll(() => page.evaluate(() => (
		window.blockheadBackpackWallets.length
	))).toBeGreaterThan(0)
	const walletStandardMetadata = await page.evaluate(() => (
		window.blockheadBackpackWallets.map((wallet) => ({
			name: wallet.name,
			walletFeatures: Object.keys(wallet.features ?? {}),
			accounts: (wallet.accounts ?? []).map((account) => ({
				address: account.address,
				chains: account.chains,
				features: account.features,
				publicKey: Array.from(account.publicKey ?? []),
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
	const approvalAccountAddress = walletStandardMetadata
		.flatMap(({ accounts }) => accounts)
		.map(({ address }) => address)
		.find((address) => address !== watchOnlyAddress) ?? watchOnlyAddress
	const approvalIdentity = {
		accountAddress: approvalAccountAddress,
		intendedProvider: page.url(),
	}

	const approvalPagePromise = backpackDriver.waitForConnectionRequest(context, backpack, approvalIdentity)
	await connectWalletButtonForDriver(page, 'Backpack').last().click()
	const approvalPage = await approvalPagePromise
	await expect(approvalPage.getByText(/Wallet|View/i).first()).toBeVisible()
	await backpackDriver.rejectConnection(approvalPage)

	const retryConnection = retryConnectionButton(page)
	await expect(retryConnection).toBeVisible()
	const approvedPagePromise = backpackDriver.waitForConnectionRequest(context, backpack, approvalIdentity)
	await retryConnection.click()
	const approvedPage = await approvedPagePromise
	await backpackDriver.approveConnection(approvedPage)

	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 1.')
	const connection = walletConnectionCard(page, 'Backpack')
	await expect(connection.getByRole('radio')).toHaveCount(2)
	await expect(connection).toContainText(/solana/i)
	const selectedAccountBeforeSwitch = await selectedWalletAccountLabel(connection).innerText()
	const connectedWalletMetadata = await page.evaluate(() => (
		window.blockheadBackpackWallets.map((wallet) => (
			(wallet.accounts ?? []).map((account) => ({
				address: account.address,
				chains: account.chains,
				features: account.features,
				publicKey: Array.from(account.publicKey ?? []),
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
	const createdAccount = connectedWalletMetadata.find(({ address }: { address: string }) => (
		address === createdAddress
	))
	if (createdAccount == null || createdAccount.publicKey.length !== 32)
		throw new Error('Backpack create-new account did not expose its Wallet Standard public key')

	const results = await runWalletCompatibilityMatrix({
		driver: {
			kind: 'backpack',
			run: async (scenario) => {
				if (scenario.initializationFlow === 'recover')
					return {
						outcome: 'blocked' as const,
						evidence: {
							code: 'no-safe-fixture-material',
							source: 'test-environment',
						},
					}
				if (scenario.requestMethod !== 'solana:signMessage')
					return {
						outcome: 'unsupported' as const,
						evidence: {
							code: `backpack-${scenario.requestMethod}-not-executed`,
							source: 'semantic-selector',
						},
					}

				// Fault: metadata-only discovery is misreported as signing capability.
				// Owner: Backpack's registered solana:signMessage Wallet Standard feature.
				// Observable: its identity-bound popup approves one request whose returned
				// signature verifies over the exact challenge and registered public key.
				const message = new TextEncoder().encode('Blockhead local Backpack consent challenge')
				const requestPagePromise = backpackDriver.waitForMessageRequest(
					context,
					backpack,
					{
						accountAddress: createdAddress,
						intendedProvider: page.url(),
					}
				)
				const signaturePromise = page.evaluate(async ({ accountAddress, messageBytes }) => {
						const wallet = window.blockheadBackpackWallets.find((candidate) => candidate.name === 'Backpack')
						if (wallet == null)
							throw new Error('Backpack Wallet Standard registration disappeared before signMessage')
						const account = wallet.accounts?.find((candidate) => (
							candidate.address === accountAddress
						))
						if (account == null)
							throw new Error('Backpack Wallet Standard account disappeared before signMessage')
						const feature = wallet.features?.['solana:signMessage']
						if (feature === undefined)
							throw new Error('Backpack did not expose the requested signMessage capability')
						const outputs = await feature.signMessage({
							account,
							message: Uint8Array.from(messageBytes),
						})
						if (outputs.length !== 1)
							throw new Error('Backpack returned an unexpected number of signatures')
						return Array.from(outputs[0].signature)
					}, {
						accountAddress: createdAddress,
						messageBytes: Array.from(message),
					})
				const requestPage = await requestPagePromise
				await backpackDriver.approveMessage(requestPage)
				const signature = Uint8Array.from(await signaturePromise)
				if (!ed25519.verify(signature, message, Uint8Array.from(createdAccount.publicKey)))
					throw new Error('Backpack returned a signature that does not verify for the requested account')

				return {
					accountAddress: createdAddress,
					outcome: 'pass' as const,
					evidence: {
						code: 'backpack-solana-sign-message-verified',
						source: 'real-extension',
					},
				}
			},
		},
		scenarios: backpackWalletMatrixScenarios(backpack.manifest.version),
		step: (name, run) => test.step(name, run),
	})
	expect(results.map(({ outcome }) => outcome)).toEqual([
		'pass',
		'unsupported',
		'blocked',
	])

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
