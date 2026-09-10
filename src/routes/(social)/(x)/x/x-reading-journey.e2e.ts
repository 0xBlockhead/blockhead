import { expect, test } from '@playwright/test'
import * as devalue from 'devalue'

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
import fxEmbedBindings from '$/sources/FxEmbed/bindings.ts'
import xBindings from '$/sources/X/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'


const postPath = '/x/post/1890000000000000000'
const username = 'fixture_reader'
const usernamePath = `/x/user/@${username}`
const xRestBindingId = sourceBindingId(xBindings[Source.X_Rest][0])
const fxEmbedBindingId = sourceBindingId(fxEmbedBindings[Source.X_FxEmbed_Rest][0])


test.beforeEach(async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
	page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
	await installRouteViewSqliteIsolation(page, `blockhead-x-reading-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`)
	await installChainlistRpcsJsonStub(page)
})


test('X username route resolves the requested identity through the exact X_Rest boundary', async ({ page }) => {
	const unexpectedProxyRequests: string[] = []
	const sourceCapabilityRequests: string[] = []
	const xRestRequests: string[] = []
	const source39LifecycleDiagnostics: string[] = []
	const fxEmbedRequests: string[] = []
	const fxEmbedStatusesRequests: string[] = []

	await page.route('**/_app/remote/**', async (route) => {
		const requestUrl = new URL(route.request().url())
		const remoteId = requestUrl.pathname.split('/_app/remote/')[1]
		if (
			remoteId?.endsWith('/sourceRuntimeCapabilities')
			&& requestUrl.searchParams.get('payload') == null
		) {
			const result = {
				enabledServerBindingIds: [xRestBindingId, fxEmbedBindingId],
			}
			sourceCapabilityRequests.push(`${route.request().method()} ${requestUrl}`)
			if (sourceCapabilityRequests.length > 1)
				source39LifecycleDiagnostics.push(`source capabilities repeat ${sourceCapabilityRequests.length}: ${requestUrl}`)
			await route.fulfill({
				contentType: 'application/json',
				json: {
					type: 'result',
					data: devalue.stringify({
						_: result,
						q: {
							[`${remoteId}/`]: { v: result },
						},
					}),
				},
			})
			return
		}
		await route.fallback()
	})

	await page.route('**/api-proxy/**', async (route) => {
		const proxyPath = new URL(route.request().url()).pathname.split('/')
		const bindingId = decodeURIComponent(proxyPath.at(-3) ?? '')
		const providerUrl = decodeURIComponent(proxyPath.at(-1) ?? '')
		const provider = new URL(providerUrl)
		const isExpectedXRestLookup = (
			bindingId === xRestBindingId
			&& proxyPath.at(-2) === '0'
			&& provider.origin === 'https://api.x.com'
			&& provider.pathname === `/2/users/by/username/${username}`
		)
		const isExpectedFxEmbedLookup = (
			bindingId === fxEmbedBindingId
			&& proxyPath.at(-2) === '0'
			&& provider.origin === 'https://api.fxtwitter.com'
			&& provider.pathname === `/2/profile/${username}`
		)
		const isExpectedFxEmbedStatusesLookup = (
			bindingId === fxEmbedBindingId
			&& proxyPath.at(-2) === '0'
			&& provider.origin === 'https://api.fxtwitter.com'
			&& provider.pathname === `/2/profile/${username}/statuses`
			&& provider.search === '?count=64'
		)

		if (!isExpectedXRestLookup && !isExpectedFxEmbedLookup && !isExpectedFxEmbedStatusesLookup) {
			unexpectedProxyRequests.push(`${bindingId} ${providerUrl}`)
			await route.fulfill({
				status: 501,
				contentType: 'application/json',
				json: { message: 'Unexpected X username route provider request' },
			})
			return
		}

		expect(route.request().method()).toBe('GET')
		expect(route.request().headers().authorization).toBeUndefined()
		if (isExpectedFxEmbedStatusesLookup) {
			fxEmbedStatusesRequests.push(providerUrl)
			if (fxEmbedStatusesRequests.length > 1)
				source39LifecycleDiagnostics.push(`FxEmbed statuses repeat ${fxEmbedStatusesRequests.length}: ${providerUrl}`)
			await route.fulfill({
				contentType: 'application/json',
				json: {
					code: 200,
					results: [],
					cursor: {
						top: null,
						bottom: null,
					},
				},
			})
			return
		}

		if (isExpectedXRestLookup) {
			xRestRequests.push(providerUrl)
			if (xRestRequests.length > 1)
				source39LifecycleDiagnostics.push(`repeat ${xRestRequests.length}: ${providerUrl}`)
			await route.fulfill({
				contentType: 'application/json',
				json: {
					data: {
						id: '44196397',
						username,
						name: 'Fixture Reader',
						description: 'Deterministic X username route identity',
					},
				},
			})
			return
		}

		fxEmbedRequests.push(providerUrl)
		if (fxEmbedRequests.length > 1)
			source39LifecycleDiagnostics.push(`FxEmbed profile repeat ${fxEmbedRequests.length}: ${providerUrl}`)
		await route.fulfill({
			contentType: 'application/json',
			json: {
				code: 200,
				user: {
					id: '44196397',
					screen_name: username,
					name: 'Fixture Reader',
					description: 'Deterministic X username route identity',
				},
			},
		})
	})

	await page.goto(usernamePath, {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	const main = page.locator('#main')
	await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector)
	await assertMainSettled(
		page,
		routeViewSmokeTimeoutsMs.mainSelector,
		undefined,
		{
			requiredDt: ['Username'],
			requiredText: ['Fixture Reader', username, '44196397'],
		}
	)
	await expect(page).toHaveURL((url) => url.pathname === usernamePath)
	await expect(main.locator('[data-error]')).toHaveCount(0)
	await expect(main.locator('[data-resource-state="failed"]')).toHaveCount(0)
	await expect(main).not.toContainText('[object Object]')
	expect(unexpectedProxyRequests).toEqual([])
	expect(
		sourceCapabilityRequests.length,
		`source39 lifecycle diagnostic: ${source39LifecycleDiagnostics.join('; ') || 'no repeated lifecycle calls'}`
	).toBeGreaterThan(0)
	expect(
		xRestRequests.length,
		`source39 lifecycle diagnostic: ${source39LifecycleDiagnostics.join('; ') || 'no repeated X_Rest calls'}`
	).toBeGreaterThan(0)
})


test('X post renders readable content and follows its author identity', async ({ page }, testInfo) => {
	const unexpectedProviderRequests: string[] = []
	const {
		diagnostics,
		flushArtifacts,
		step,
	} = setupRouteViewSmokePage(page)

	await page.route('**/*', async (route) => {
		const requestUrl = new URL(route.request().url())
		const providerUrl = (
			requestUrl.pathname.includes('/api-proxy/') ?
				decodeURIComponent(requestUrl.pathname.split('/').at(-1) ?? '')
			:
				requestUrl.toString()
		)
		const provider = new URL(providerUrl)
		if (provider.origin !== 'https://api.fxtwitter.com') {
			await route.fallback()
			return
		}

		expect(route.request().method()).toBe('GET')
		const isExpectedProfile = (
			provider.pathname === `/2/profile/${encodeURIComponent('id:44196397')}`
			&& provider.search === ''
		)
		const isExpectedProfileStatuses = (
			provider.pathname === `/2/profile/${encodeURIComponent('id:44196397')}/statuses`
			&& provider.search === '?count=64'
		)
		const isExpectedPost = (
			provider.pathname === '/2/status/1890000000000000000'
			&& provider.search === ''
		)
		if (!isExpectedProfile && !isExpectedProfileStatuses && !isExpectedPost) {
			unexpectedProviderRequests.push(providerUrl)
			await route.fulfill({
				status: 501,
				contentType: 'application/json',
				json: { message: 'Unexpected X reading journey provider request' },
			})
			return
		}

		if (isExpectedProfileStatuses) {
			await route.fulfill({
				contentType: 'application/json',
				json: {
					code: 200,
					results: [],
					cursor: {
						top: null,
						bottom: null,
					},
				},
			})
			return
		}
		await route.fulfill({
			contentType: 'application/json',
			json: (
				isExpectedProfile ?
					{
						code: 200,
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
						code: 200,
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
		expect(unexpectedProviderRequests).toEqual([])

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
	const unexpectedProviderRequests: string[] = []
	page.on('pageerror', (error) => pageErrors.push(error))

	await page.route('**/api-proxy/**', async (route) => {
		const proxyPath = new URL(route.request().url()).pathname.split('/')
		const bindingId = decodeURIComponent(proxyPath.at(-3) ?? '')
		const providerUrl = decodeURIComponent(proxyPath.at(-1) ?? '')
		const provider = new URL(providerUrl)
		const isExpectedProfile = (
			bindingId === fxEmbedBindingId
			&& proxyPath.at(-2) === '0'
			&& provider.origin === 'https://api.fxtwitter.com'
			&& provider.pathname === `/2/profile/${encodeURIComponent('id:44196397')}`
			&& provider.search === ''
		)
		const isExpectedProfileStatuses = (
			bindingId === fxEmbedBindingId
			&& proxyPath.at(-2) === '0'
			&& provider.origin === 'https://api.fxtwitter.com'
			&& provider.pathname === `/2/profile/${encodeURIComponent('id:44196397')}/statuses`
			&& provider.search === '?count=64'
		)
		const isExpectedPost = (
			bindingId === fxEmbedBindingId
			&& proxyPath.at(-2) === '0'
			&& provider.origin === 'https://api.fxtwitter.com'
			&& provider.pathname === '/2/status/1890000000000000000'
			&& provider.search === ''
		)
		if (!isExpectedProfile && !isExpectedProfileStatuses && !isExpectedPost) {
			unexpectedProviderRequests.push(`${bindingId} ${providerUrl}`)
			await route.fulfill({
				status: 501,
				contentType: 'application/json',
				json: { message: 'Unexpected X provider failure fixture request' },
			})
			return
		}

		expect(route.request().method()).toBe('GET')
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
	const failedBoundary = main.locator('[data-resource-state="failed"]').first()
	const providerFailure = /X_FxEmbed_Rest: Fetch failed \(503 Service Unavailable\).*Fixture X provider unavailable/
	await expect(failedBoundary).toBeVisible({ timeout: routeViewSmokeTimeoutsMs.mainSelector })
	await expect(failedBoundary).toHaveAttribute('role', 'alert')
	await expect(failedBoundary).toHaveAttribute('aria-label', providerFailure)
	await expect(failedBoundary).toHaveAttribute('title', providerFailure)
	await expect(main.locator('[data-resource-state="pending"]')).toHaveCount(0)
	await expect(main).not.toContainText('[object Object]')
	await expect(main).not.toContainText('{"message"')
	expect(pageErrors).toEqual([])
	expect(unexpectedProviderRequests).toEqual([])
})
