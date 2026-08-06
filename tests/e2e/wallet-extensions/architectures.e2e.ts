import {
	architectureDenominatorScenarios,
	assertArchitectureDenominatorScenarios,
} from '../../../scripts/wallet-extensions/architectures.matrix.ts'
import {
	WalletHarnessCoverageKind,
	walletHarnessEcosystemByEcosystem,
} from '../../../scripts/wallet-extensions/ecosystems.ts'
import { walletConnectionsStatusById } from './_walletPageSelectors.ts'
import { expect, test } from './wallet.fixture.ts'


test.skip(process.env.WALLET_EXTENSIONS_E2E !== '1', 'Real wallet extension tests are opt-in')

test('keeps Lightning/Farcaster/Near/Sui architecture denominators unsupported under the headed harness', async ({
	baseURL,
	extensions,
	page,
}) => {
	assertArchitectureDenominatorScenarios()
	expect(architectureDenominatorScenarios.length).toBeGreaterThanOrEqual(4)
	expect(extensions.length).toBeGreaterThan(0)

	for (const scenario of architectureDenominatorScenarios) {
		expect(scenario.expectedOutcome).toBe('unsupported')
		const ecosystem = walletHarnessEcosystemByEcosystem[scenario.ecosystem]
		expect(ecosystem.extensionKinds).toEqual([])
		expect(
			ecosystem.coverageKind === WalletHarnessCoverageKind.ArchitectureOnly
			|| ecosystem.coverageKind === WalletHarnessCoverageKind.IdentityOverlay
		).toBe(true)
	}

	await page.goto(`${baseURL ?? 'http://127.0.0.1:5173'}/~/wallets`)
	await expect(page.locator('body')).toBeAttached()
	await expect(walletConnectionsStatusById(page).or(page.locator('#main'))).toBeAttached({
		timeout: 60_000,
	})
	console.log(JSON.stringify({
		label: 'wallet-architecture-denominator',
		scenarios: architectureDenominatorScenarios.map(({
			id,
			ecosystem,
			coverageKind,
			expectedOutcome,
		}) => ({
			id,
			ecosystem,
			coverageKind,
			expectedOutcome,
		})),
	}, null, 2))
})
