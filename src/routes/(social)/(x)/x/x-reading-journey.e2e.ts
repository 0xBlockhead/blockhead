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


const postPath = '/x/post/1890000000000000000'


test.beforeEach(async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
	page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-x-reading-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await installChainlistRpcsJsonStub(page)
})


test('X post renders readable content and follows its author identity', async ({ page }, testInfo) => {
	const {
		diagnostics,
		flushArtifacts,
		step,
	} = setupRouteViewSmokePage(page)

	await page.route('**/api-proxy/X_FxEmbed_Rest-*/0/**', async (route) => {
		const providerUrl = new URL(
			decodeURIComponent(new URL(route.request().url()).pathname.split('/').at(-1) ?? '')
		)
		expect(route.request().method()).toBe('GET')
		await route.fulfill({
			contentType: 'application/json',
			json: (
				providerUrl.pathname.endsWith('/profile/id%3A44196397') ?
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
				requiredDt: [
					'ID',
					'Author',
				],
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
				requiredDt: [
					'ID',
					'Username',
				],
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


test('X post exposes provider failure without hanging or dumping wire data', async ({ page }) => {
	const pageErrors: Error[] = []
	page.on('pageerror', (error) => pageErrors.push(error))

	await page.route('**/api-proxy/X_FxEmbed_Rest-*/0/**', async (route) => {
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
	await expect(main.locator('[data-error]').first()).toContainText(
		'Fixture X provider unavailable',
		{ timeout: routeViewSmokeTimeoutsMs.mainSelector }
	)
	await expect(main.getByText(/Loading\b/)).toHaveCount(0)
	await expect(main).not.toContainText('[object Object]')
	await expect(main).not.toContainText('{"message"')
	expect(pageErrors).toEqual([])
})
