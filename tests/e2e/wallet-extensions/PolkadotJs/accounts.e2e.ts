import { readFile } from 'node:fs/promises'

import {
	approvePolkadotJsConnection,
	createPolkadotJsAccounts,
	openPolkadotJs,
} from '../../../../scripts/wallet-extensions/PolkadotJs/driver.ts'
import { polkadotJsWalletMatrixScenarios } from '../../../../scripts/wallet-extensions/PolkadotJs/matrix.ts'
import { runWalletCompatibilityMatrix } from '../../../../scripts/wallet-extensions/WalletCompatibilityMatrix.ts'
import {
	connectWalletButtonForDriver,
	disconnectWalletButton,
} from '../_walletPageSelectors.ts'
import { expect, test } from '../wallet.fixture.ts'


test.skip(process.env.WALLET_EXTENSIONS_E2E !== '1', 'Real polkadot.js extension tests are opt-in')
test.setTimeout(180_000)

test('runs the declarative polkadot.js compatibility matrix', async ({
	baseURL,
	context,
	extensions,
	page,
}) => {
	const extension = extensions.find(({ kind }) => kind === 'polkadot-js')
	expect(extension, 'The checksum-pinned polkadot.js extension must be loaded').toBeDefined()
	if (!extension)
		throw new Error('The checksum-pinned polkadot.js extension was not loaded')

	expect(extension.manifest.version).toBe('0.63.1')
	expect(JSON.parse(await readFile('scripts/wallet-extensions/wallets.json', 'utf8'))['polkadot-js'].sha256).toBe('382871bea456d654c215442a069106d18e31bd867021f0c41fe9455fb7022ac1')

	await createPolkadotJsAccounts(await openPolkadotJs(context, extension))
	await page.goto(`${baseURL ?? 'http://127.0.0.1:5173'}/~/wallets`)
	await expect.poll(() => page.evaluate(() => Object.keys(window.injectedWeb3 ?? {}))).toContain('polkadot-js')

	const [, accounts] = await Promise.all([
		approvePolkadotJsConnection(context, extension.id),
		page.evaluate(async () => {
			const wallet = window.injectedWeb3?.['polkadot-js']
			if (!wallet)
				throw new Error('polkadot.js disappeared after injectedWeb3 discovery')

			return (await wallet.enable('Blockhead')).accounts.get()
		}),
	])
	expect(accounts).toHaveLength(2)
	expect(new Set(accounts.map(({ address }) => address)).size).toBe(2)
	await expect(connectWalletButtonForDriver(page, 'PolkadotJs')).toHaveCount(0)
	await expect(disconnectWalletButton(page)).toHaveCount(0)
	await expect(page.locator('input[type="radio"]')).toHaveCount(0)

	await page.reload()
	await expect.poll(() => page.evaluate(() => Object.keys(window.injectedWeb3 ?? {}))).toContain('polkadot-js')
	await expect(connectWalletButtonForDriver(page, 'PolkadotJs')).toHaveCount(0)
	await expect(disconnectWalletButton(page)).toHaveCount(0)

	const results = await runWalletCompatibilityMatrix({
		driver: {
			kind: 'polkadot-js',
			run: async (scenario) => (
				scenario.accountOrdinal === 3 ?
					{
						outcome: 'blocked',
						evidence: {
							code: 'third-initialization-flow-not-independently-available',
							source: 'real-extension',
						},
					}
				:
					{
						accountAddress: accounts[scenario.accountOrdinal - 1].address,
						outcome: 'inaccessible',
						evidence: {
							code: 'injected-account-visible-product-bridge-missing',
							source: 'wallet-connections',
						},
					}
			),
		},
		scenarios: polkadotJsWalletMatrixScenarios(extension.manifest.version),
		step: (name, run) => test.step(name, run),
	})
	expect(results).toHaveLength(3)
	expect(results.filter(({ outcome }) => outcome === 'inaccessible')).toHaveLength(2)
	expect(results.filter(({ outcome }) => outcome === 'blocked')).toHaveLength(1)
	expect(results.slice(0, 2).every(({ accountAddressHash }) => /^sha256:[0-9a-f]{64}$/.test(accountAddressHash ?? ''))).toBe(true)
	expect(JSON.stringify(results)).not.toContain(accounts[0].address)
	expect(JSON.stringify(results)).not.toContain(accounts[1].address)
	console.log(JSON.stringify(results, null, 2))
})
