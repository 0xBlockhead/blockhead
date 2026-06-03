import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	installChainlistRpcsJsonStub,
} from '../../../../../../tests/_e2eBrowserHelpers.ts'

import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from '../../../../../../tests/e2e/_routeViewDiagnostics.ts'


const networks = [
	{
		slug: 'bitcoin',
		name: 'Bitcoin',
		sections: [
			'UTXO',
			'Assets',
			'Resources',
		],
	},
	{
		slug: 'bitcoin-cash',
		name: 'Bitcoin Cash',
		sections: [
			'UTXO',
			'Assets',
			'Resources',
		],
	},
	{
		slug: 'litecoin',
		name: 'Litecoin',
		sections: [
			'UTXO',
			'Assets',
			'Resources',
		],
	},
	{
		slug: 'dogecoin',
		name: 'Dogecoin',
		sections: [
			'UTXO',
			'Assets',
			'Resources',
		],
	},
	{
		slug: 'zcash',
		name: 'Zcash',
		sections: [
			'UTXO',
			'Assets',
			'Resources',
		],
	},
	{
		slug: 'solana',
		name: 'Solana Mainnet',
		sections: [
			'Execution',
			'Consensus & Block Production',
			'Assets',
			'Resources',
		],
	},
	{
		slug: 'cosmos',
		name: 'Cosmos Hub',
		sections: [
			'Execution',
			'Consensus & Governance',
			'Assets',
			'Resources',
		],
	},
	{
		slug: 'filecoin',
		name: 'Filecoin',
		sections: [
			'Execution',
			'Consensus & Storage Power',
			'Assets',
			'Resources',
		],
	},
	{
		slug: 'polkadot',
		name: 'Polkadot',
		sections: [
			'Polkadot',
			'Assets',
			'Resources',
		],
	},
	{
		slug: 'near',
		name: 'NEAR',
		sections: [
			'NEAR',
			'Assets',
			'Resources',
		],
	},
	{
		slug: 'tron',
		name: 'TRON Mainnet',
		sections: [
			'TRON',
			'Resources',
		],
	},
	{
		slug: 'monero',
		name: 'Monero',
		sections: [
			'Monero',
			'Resources',
		],
	},
	{
		slug: 'lightning',
		name: 'Lightning Network',
		sections: [
			'Graph',
			'Assets',
			'Resources',
		],
	},
	{
		slug: 'hyperliquid',
		name: 'Hyperliquid',
		sections: [
			'Execution',
			'Assets',
			'Resources',
		],
	},
	{
		slug: 'bittensor',
		name: 'Bittensor',
		sections: [
			'Activity',
			'Consensus & Neurons',
			'Assets',
			'Resources',
		],
	},
	{
		slug: '0g',
		name: '0G',
		sections: [
			'Execution',
			'Data & Storage',
			'Resources',
		],
	},
	{
		slug: 'logos-testnet',
		name: 'Logos Testnet',
		sections: [
			'Topology',
			'Resources',
		],
	},
	{
		slug: 'quilibrium',
		name: 'Quilibrium',
		sections: [
			'Protocol',
			'Resources',
		],
	},
] as const


test.describe('/network/[networkSlug]', () => {
	test.describe.configure({ mode: 'serial' })

	for (const network of networks) {
		test(`${network.slug} renders non-EVM parity sections`, async ({ page }, testInfo) => {
			testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
			page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
			await installChainlistRpcsJsonStub(page)

			const {
				step,
				flushArtifacts,
			} = setupRouteViewSmokePage(page)

			try {
				await step(page.goto(`/network/${network.slug}`, {
					waitUntil: 'domcontentloaded',
					timeout: routeViewSmokeTimeoutsMs.goto,
				}))
				await step(expect(page.locator('#main')).toBeAttached({
					timeout: routeViewSmokeTimeoutsMs.mainSelector,
				}))
				await step(expect(page.getByText(network.name).first()).toBeAttached({
					timeout: routeViewSmokeTimeoutsMs.mainSelector,
				}))
				await step(expect(page.getByText('Internal Error')).toHaveCount(0))
				await step(expect(page.locator('#main').locator('[data-error]')).toHaveCount(0))

				for (const section of network.sections) {
					await step(expect(page.getByRole('heading', { name: section }).first()).toBeAttached({
						timeout: routeViewSmokeTimeoutsMs.mainSelector,
					}))
				}

				await step(assertMainSettled(page, routeViewSmokeTimeoutsMs.mainSelector))
			}
			catch (error) {
				await flushArtifacts(testInfo)
				throw error
			}
		})
	}
})
