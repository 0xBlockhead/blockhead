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
	{
		slug: 'bitcoin',
		title: 'Blocks',
	},
	{
		slug: 'solana',
		title: 'Blocks',
	},
	{
		slug: 'cosmos',
		title: 'Blocks',
	},
	{
		slug: 'filecoin',
		title: 'Tipsets',
	},
	{
		slug: 'polkadot',
		title: 'Blocks',
	},
	{
		slug: 'near',
		title: 'Blocks',
	},
	{
		slug: 'tron',
		title: 'Blocks',
	},
	{
		slug: 'monero',
		title: 'Blocks',
	},
	{
		slug: 'hyperliquid',
		title: 'Blocks',
	},
	{
		slug: 'bittensor',
		title: 'Blocks',
	},
	{
		slug: '0g',
		title: 'Blocks',
	},
] as const


test.describe('/network/[networkSlug]/blocks', () => {
	test.describe.configure({ mode: 'serial' })

	for (const route of blockRoutes) {
		test(`${route.slug} renders protocol block list`, async ({ page }, testInfo) => {
			testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
			page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
			await installChainlistRpcsJsonStub(page)

			const {
				step,
				flushArtifacts,
			} = setupRouteViewSmokePage(page)

			try {
				await step(page.goto(`/network/${route.slug}/blocks`, {
					waitUntil: 'domcontentloaded',
					timeout: routeViewSmokeTimeoutsMs.goto,
				}))
				await step(expect(page.locator('#main')).toBeAttached({
					timeout: routeViewSmokeTimeoutsMs.mainSelector,
				}))
				await step(expect(page.getByRole('heading', { name: route.title }).first()).toBeAttached({
					timeout: routeViewSmokeTimeoutsMs.mainSelector,
				}))
				await step(expect(page.getByText('Internal Error')).toHaveCount(0))
				await step(expect(page.locator('#main').locator('[data-error]')).toHaveCount(0))
				await step(assertMainSettled(page, routeViewSmokeTimeoutsMs.mainSelector))
			}
			catch (error) {
				await flushArtifacts(testInfo)
				throw error
			}
		})
	}
})
