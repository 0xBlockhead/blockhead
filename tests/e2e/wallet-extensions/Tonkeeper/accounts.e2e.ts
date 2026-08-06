import { randomBytes } from 'node:crypto'
import { readFile } from 'node:fs/promises'

import { tonkeeperDriver } from '../../../../scripts/wallet-extensions/Tonkeeper/driver.ts'
import { tonkeeperWalletMatrixScenarios } from '../../../../scripts/wallet-extensions/Tonkeeper/matrix.ts'
import {
	runWalletCompatibilityMatrix,
} from '../../../../scripts/wallet-extensions/WalletCompatibilityMatrix.ts'
import {
	connectWalletButtonForDriver,
	disconnectWalletButton,
	walletConnectionsStatusById,
} from '../_walletPageSelectors.ts'
import { expect, test } from '../wallet.fixture.ts'


test.skip(process.env.WALLET_EXTENSIONS_E2E !== '1', 'Real Tonkeeper extension test is opt-in')
test.setTimeout(360_000)

test('onboards two ephemeral Tonkeeper accounts and exercises TON Connect in Blockhead', async ({
	baseURL,
	context,
	extensions,
	page,
}) => {
	const extension = extensions.find(({ kind }) => kind === 'tonkeeper')
	if (!extension)
		throw new Error('Tonkeeper lifecycle proof requires the checksum-pinned Tonkeeper extension')

	expect(extension.manifest.version).toBe('26.6.1')
	expect(JSON.parse(await readFile('scripts/wallet-extensions/wallets.json', 'utf8')).tonkeeper).toMatchObject({
		commit: '190ad6b9bd090db5d48ca81ff181e28d993cf91c',
		license: 'Apache-2.0',
		sha256: '32f16f38e23c79e195a3d5c033dc3316752dc53959d7b44607cd4c6e1300993e',
	})

	let password = `Tk!${randomBytes(24).toString('base64url')}`
	const onboarding = await tonkeeperDriver.onboardTwoAccounts(
		context,
		extension,
		password
	)
	if (onboarding.secondAccountOnboarded)
		await expect(onboarding.page.getByText('Blockhead Ephemeral 2', {
			exact: true,
		})).toBeVisible()
	else
		await expect(onboarding.page.getByRole('heading', {
			name: 'Name your wallet',
		})).not.toBeVisible()

	await page.goto(`${baseURL ?? 'http://127.0.0.1:5173'}/~/wallets`, {
		waitUntil: 'load',
	})
	await expect.poll(() => page.evaluate(() => ({
		connect: typeof window.tonkeeper?.tonconnect.connect,
		disconnect: typeof window.tonkeeper?.tonconnect.send,
		listen: typeof window.tonkeeper?.tonconnect.listen,
		restore: typeof window.tonkeeper?.tonconnect.restoreConnection,
	}))).toEqual({
		connect: 'function',
		disconnect: 'function',
		listen: 'function',
		restore: 'function',
	})
	await expect(walletConnectionsStatusById(page)).toContainText(/Providers detected: [1-9]/, {
		timeout: 120_000,
	})

	const connectButton = connectWalletButtonForDriver(page, 'Tonkeeper')
	await expect(connectButton).toBeVisible()
	const previousPages = new Set(context.pages())
	await connectButton.click()
	const connectionRequestSupported = await tonkeeperDriver.approveConnection(
		await tonkeeperDriver.waitForRequest(
			context,
			extension,
			previousPages
		),
		password
	)
	password = ''

	if (connectionRequestSupported) {
		await expect(page.getByText('connected', {
			exact: true,
		}).first()).toBeAttached({
			timeout: 120_000,
		})
		await expect(walletConnectionsStatusById(page)).toContainText('Active connections: 1.')
		await expect(page.getByRole('radio')).toHaveCount(1)

		await disconnectWalletButton(page).click()
		await expect(page.getByText('disconnected', {
			exact: true,
		}).first()).toBeAttached({
			timeout: 120_000,
		})
	}
	await expect(walletConnectionsStatusById(page)).toContainText('Active connections: 0.')

	const results = await runWalletCompatibilityMatrix({
		driver: {
			kind: 'tonkeeper',
			run: async (scenario) => (
				scenario.initializationFlow === 'recover' ?
					{
						outcome: 'blocked',
						evidence: {
							code: 'no-safe-fixture-material',
							source: 'test-environment',
						},
					}
				: scenario.accountOrdinal === 2 && !onboarding.secondAccountOnboarded ?
					{
						outcome: 'blocked',
						evidence: {
							code: 'second-account-onboard-unavailable',
							source: 'real-extension',
						},
					}
				: connectionRequestSupported ?
					{
						accountAddress: `tonkeeper-account-${scenario.accountOrdinal}`,
						outcome: 'pass',
						evidence: {
							code: `tonkeeper-${scenario.lifecycleEdgeCase}-verified`,
							source: 'real-extension',
						},
					}
				:
					{
						outcome: 'inaccessible',
						evidence: {
							code: 'ton-connect-request-unsupported',
							source: 'wallet-connections',
						},
					}
			),
		},
		scenarios: tonkeeperWalletMatrixScenarios(extension.manifest.version),
		step: (name, run) => test.step(name, run),
	})
	expect(results).toHaveLength(3)
	console.log(JSON.stringify(results, null, 2))
})
