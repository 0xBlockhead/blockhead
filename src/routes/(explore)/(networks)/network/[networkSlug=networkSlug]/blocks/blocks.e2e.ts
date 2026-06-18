import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	installChainlistRpcsJsonStub,
} from '../../../../../../../tests/_e2eBrowserHelpers.ts'

import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from '../../../../../../../tests/e2e/_routeViewDiagnostics.ts'


const blockRoutes = [
	'bitcoin',
	'solana',
	'cosmos',
	'filecoin',
	'polkadot',
	'near',
	'tron',
	'monero',
	'hyperliquid',
	'bittensor',
	'0g',
] as const


test.describe('/network/[networkSlug]/blocks', () => {
	test.describe.configure({ mode: 'serial' })

	for (const slug of blockRoutes) {
		test(`${slug} renders protocol block list`, async ({ page }, testInfo) => {
			testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
			page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
			await installChainlistRpcsJsonStub(page)

			const {
				step,
				flushArtifacts,
			} = setupRouteViewSmokePage(page)

			try {
				await step(page.goto(`/network/${slug}/blocks`, {
					waitUntil: 'domcontentloaded',
					timeout: routeViewSmokeTimeoutsMs.goto,
				}))
				await step(expect(page.locator('#main')).toBeAttached({
					timeout: routeViewSmokeTimeoutsMs.mainSelector,
				}))
				await step(expect(page.locator('#main [data-error]')).toHaveCount(0))
				await step(assertMainSettled(page, routeViewSmokeTimeoutsMs.mainSelector))
			}
			catch (error) {
				await flushArtifacts(testInfo)
				throw error
			}
		})
	}
})
