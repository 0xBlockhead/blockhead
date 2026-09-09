import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../tests/_e2eBrowserHelpers.ts'
import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from '../../../../../tests/e2e/_routeViewDiagnostics.ts'
import { installRouteViewSqliteIsolation } from '../../../../../tests/e2e/_routeViewFixtures.ts'


const postPath = '/x/post/1890000000000000000'


test.beforeEach(async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
	page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
	await installRouteViewSqliteIsolation(page, testInfo, 'x-reading')
	await installChainlistRpcsJsonStub(page)
})


test('X post renders readable content and follows its author identity', async ({ page }, testInfo) => {
	const {
		diagnostics,
		flushArtifacts,
		step,
	} = setupRouteViewSmokePage(page)

	await page.route('**/*', async (route) => {
		const providerUrl = decodeURIComponent(decodeURIComponent(route.request().url()))
		if (!providerUrl.includes('api.fxtwitter.com/2/')) {
			await route.fallback()
			return
		}

		expect(route.request().method()).toBe('GET')
		await route.fulfill({
			contentType: 'application/json',
			json: (
				providerUrl.includes('/profile/id:44196397') ?
					{
						user: {
							type: 'profile',
							id: '44196397',
							screen_name: 'fixture_reader',
							name: 'Fixture Reader',
							description: 'Deterministic X reading profile',
						},
					}
				:
					{
						status: {
							type: 'status',
							id: '1890000000000000000',
							text: 'Deterministic X reading journey content',
							created_timestamp: 1_768_435_200,
							author: {
								type: 'profile',
								id: '44196397',
								screen_name: 'fixture_reader',
								name: 'Fixture Reader',
							},
						},
					}
			),
		})
	})

	try {
		await step(page.goto(postPath, {
			waitUntil: 'load',
			timeout: routeViewSmokeTimeoutsMs.goto,
		}))
		await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
		await step(assertMainSettled(
			page,
			routeViewSmokeTimeoutsMs.mainSelector,
			diagnostics,
			{
				requiredDt: ['Author'],
				requiredText: ['Deterministic X reading journey content'],
			}
		))
		const main = page.locator('#main')
		const authorLink = main.locator('a[href="/x/user/44196397"]')
		await step(expect(authorLink).toBeAttached())
		await step(expect(main.locator('[data-error]')).toHaveCount(0))
		await step(expect(main).not.toContainText('[object Object]'))

		await step(authorLink.click())
		await step(expect(page).toHaveURL((url) => url.pathname === '/x/user/44196397'))
		await step(assertMainSettled(
			page,
			routeViewSmokeTimeoutsMs.mainSelector,
			diagnostics,
			{
				requiredDt: ['Username'],
				requiredText: [
					'Fixture Reader',
					'fixture_reader',
				],
			}
		))
	}
	catch (error) {
		await flushArtifacts(testInfo)
		throw error
	}
})


test('X post renders normalized provider failure without hanging or dumping wire data', async ({ page }) => {
	const pageErrors: Error[] = []
	page.on('pageerror', (error) => pageErrors.push(error))

	await page.route('**/*', async (route) => {
		if (!decodeURIComponent(decodeURIComponent(route.request().url())).includes('api.fxtwitter.com/2/')) {
			await route.fallback()
			return
		}

		await route.fulfill({
			contentType: 'application/json',
			json: {
				message: 'Fixture X provider unavailable',
			},
			status: 503,
		})
	})

	await page.goto(postPath, {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	const main = page.locator('#main')
	await expect(main).toBeVisible({
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
	await expect(main.locator('[data-resource-state="failed"]').first()).toHaveAttribute(
		'aria-label',
		'Internal Error',
		{ timeout: routeViewSmokeTimeoutsMs.mainSelector }
	)
	await expect(main.locator('[data-resource-state="pending"]')).toHaveCount(0)
	await expect(main).not.toContainText('[object Object]')
	await expect(main).not.toContainText('{"message"')
	expect(pageErrors).toEqual([])
})
