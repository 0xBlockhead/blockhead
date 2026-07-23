import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../tests/_e2eBrowserHelpers.ts'
import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from '../../../../tests/e2e/_routeViewDiagnostics.ts'


const redditListing = (
	children: object[],
	after?: string | null
) => ({
	kind: 'Listing',
	data: {
		...(after !== undefined && {
			after,
		}),
		children,
	},
})

const submission = {
	kind: 't3',
	data: {
		name: 't3_1u8x2f8',
		subreddit: 'ethereum',
		title: 'Daily General Discussion June 18, 2026',
		permalink: '/r/ethereum/comments/1u8x2f8/daily_general_discussion_june_18_2026/',
		author: '/u/EthereumDailyThread',
		created_utc: 1_781_758_884,
		score: 128,
		num_comments: 2,
	},
}

const comment = {
	kind: 't1',
	data: {
		name: 't1_osbo75d',
		body: 'Ethereum!',
		author: '/u/Mysterious_Town6196',
		created_utc: 1_781_758_895,
		depth: 0,
		link_id: 't3_1u8x2f8',
		parent_id: 't3_1u8x2f8',
		score: 17,
		replies: redditListing([
			{
				kind: 't1',
				data: {
					name: 't1_nestedreply',
					body: 'Layer two keeps the discussion grounded.',
					author: '/u/reply_reader',
					created_utc: 1_781_758_925,
					depth: 1,
					link_id: 't3_1u8x2f8',
					parent_id: 't1_osbo75d',
					score: 9,
					replies: '',
				},
			},
		]),
	},
}

const secondSubmission = {
	kind: 't3',
	data: {
		name: 't3_second',
		subreddit: 'ethereum',
		title: 'Protocol research update',
		permalink: '/r/ethereum/comments/second/protocol_research_update/',
		author: '/u/protocol_researcher',
		created_utc: 1_781_758_985,
		score: 64,
		num_comments: 0,
	},
}


test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-reddit-reading-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await installChainlistRpcsJsonStub(page)
	await page.route('**/*', async (route) => {
		const url = decodeURIComponent(route.request().url())
		if (!url.includes('reddit.com/')) {
			await route.continue()
			return
		}
		if (url.includes('/r/ethereum/about.json')) {
			await route.fulfill({
				json: {
					kind: 't5',
					data: {
						display_name: 'ethereum',
						title: 'r/ethereum',
						public_description: 'Ethereum community',
						created_utc: 1_330_000_000,
						over18: false,
						subscribers: 3_000_000,
						active_user_count: 1_234,
					},
				},
			})
			return
		}
		if (
			url.includes('/r/ethereum/hot.json')
			|| url.includes('/r/popular/hot.json')
		) {
			await route.fulfill({
				json: (
					url.includes('after=t3_first') ?
						redditListing([secondSubmission], null)
					:
						redditListing([submission], 't3_first')
				),
			})
			return
		}
		if (url.includes('/comments/1u8x2f8.json')) {
			await route.fulfill({
				json: [
					redditListing([submission]),
					redditListing([comment]),
				],
			})
			return
		}
		if (url.includes('/api/info.json')) {
			await route.fulfill({
				json: redditListing([
					url.includes('t1_nestedreply') ?
						comment.data.replies.data.children[0]
					: url.includes('t1_osbo75d') ?
						comment
					: url.includes('t3_second') ?
						secondSubmission
					:
						submission,
				]),
			})
			return
		}
		await route.abort('blockedbyclient')
	})
})


test('community to post preserves Reddit identity and navigation', async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test * 2)
	const consoleErrors: string[] = []
	const pageErrors: string[] = []
	const redditPublicProxyRequests: string[] = []
	page.on('console', (message) => {
		if (message.type() === 'error')
			consoleErrors.push(message.text())
	})
	page.on('pageerror', (error) => pageErrors.push(error.message))
	page.on('request', (request) => {
		if (request.url().includes('/api-proxy/Reddit_PublicJson-'))
			redditPublicProxyRequests.push(decodeURIComponent(request.url()))
	})
	const {
		diagnostics,
		flushArtifacts,
		step,
	} = setupRouteViewSmokePage(page)

	try {
		await step(page.goto('/reddit/r/ethereum', {
			waitUntil: 'load',
			timeout: routeViewSmokeTimeoutsMs.goto,
		}))
		await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
		await step(assertMainSettled(
			page,
			routeViewSmokeTimeoutsMs.mainSelector,
			diagnostics,
			{
				requiredText: [
					'Reddit',
					'r/ethereum',
					'Daily General Discussion June 18, 2026',
				],
				minimumEntityRows: 1,
				minimumLinks: 3,
			}
		))
		await step(expect(page.locator('[data-social-client-archetype="reddit"] nav')).toBeVisible())
		const communityCards = page.locator('#main article#RedditLinksView-links[data-card][data-scroll-container]')
		await step(expect(communityCards).toHaveCount(1))
		await step(expect(communityCards.getByRole('heading', {
			name: /Submissions/,
		})).toBeAttached())

		await step(communityCards.getByRole('link', {
			name: 'Daily General Discussion June 18, 2026',
		}).first().click())
		await step(expect(page).toHaveURL('/reddit/link/t3_1u8x2f8'))
		await step(expect(page.getByRole('navigation', {
			name: 'Reddit navigation',
		})).toBeVisible())
		await step(expect(page.locator('#main a[href="/reddit/r/ethereum"]')).toBeAttached())
		await step(expect(page.locator('#main [data-error], #main [role="alert"]')).toHaveCount(0))
		expect(redditPublicProxyRequests.some((url) => url.includes('/r/ethereum/about.json'))).toBe(true)
		expect(redditPublicProxyRequests.some((url) => url.includes('/r/ethereum/hot.json'))).toBe(true)
		expect(redditPublicProxyRequests.some((url) => url.includes('/api/info.json'))).toBe(true)
		expect(pageErrors).toEqual([])
		expect(consoleErrors).toEqual([])
	}
	catch (error) {
		await flushArtifacts(testInfo)
		throw error
	}
})

test('comment thread opens an authored comment and parent submission', async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test * 2)

	await page.goto('/reddit/link/t3_1u8x2f8/comments', {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	await expect(page.getByText('Ethereum!', {
		exact: true,
	}).first()).toBeVisible({
		timeout: routeViewSmokeTimeoutsMs.settle,
	})
	const commentCards = page.locator('#main article[data-card][data-scroll-container]').filter({
		has: page.getByRole('heading', {
			name: /Comments/,
		}),
	})
	await expect(commentCards).toHaveCount(1)
	await expect(commentCards.getByRole('heading', {
		name: /Comments/,
	})).toBeAttached()
	await expect(commentCards.getByText('Layer two keeps the discussion grounded.', {
		exact: true,
	})).toBeAttached()
	await page.getByRole('link', {
		name: 'Ethereum!',
	}).first().click()
	await expect(page).toHaveURL('/reddit/comment/t1_osbo75d')
	await expect(page.locator('#main')).toContainText('/u/Mysterious_Town6196')
	await expect(page.locator('#main')).toContainText('Daily General Discussion June 18, 2026')
	await expect(page.locator('#main a[href="/reddit/link/t3_1u8x2f8"]')).toBeAttached()
	await expect(page.locator('#main [data-error], #main [role="alert"]')).toHaveCount(0)
})

test('back navigation restores the community reading position', async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test * 3)

	await page.goto('/reddit/r/ethereum', {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	const submissionLink = page.getByRole('link', {
		name: 'Daily General Discussion June 18, 2026',
	}).first()
	await expect(submissionLink).toBeVisible({
		timeout: 120_000,
	})
	await submissionLink.scrollIntoViewIfNeeded()
	const scrollTop = await page.locator('#main').evaluate((main) => main.scrollTop)
	await submissionLink.click()
	await expect(page).toHaveURL('/reddit/link/t3_1u8x2f8')
	await page.goBack()
	await expect(page).toHaveURL('/reddit/r/ethereum')
	await expect(page.getByRole('link', {
		name: 'Daily General Discussion June 18, 2026',
	}).first()).toBeVisible()
	await expect.poll(async () => page.locator('#main').evaluate((main) => main.scrollTop)).toBe(scrollTop)
})

test('community continuation appends a terminal page without duplicate rows', async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test * 2)

	await page.goto('/reddit/r/ethereum', {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	const firstSubmission = page.getByRole('link', {
		name: 'Daily General Discussion June 18, 2026',
	}).first()
	await expect(firstSubmission).toBeVisible({
		timeout: routeViewSmokeTimeoutsMs.settle,
	})
	const firstSubmissionElement = await firstSubmission.elementHandle()
	await page.getByRole('button', {
		name: 'Load more',
	}).click()
	await expect(page.getByRole('link', {
		name: 'Protocol research update',
	}).first()).toBeVisible({
		timeout: routeViewSmokeTimeoutsMs.settle,
	})
	await expect(page.getByRole('link', {
		name: 'Daily General Discussion June 18, 2026',
	})).toHaveCount(1)
	await expect(page.getByRole('link', {
		name: 'Protocol research update',
	})).toHaveCount(1)
	expect(await firstSubmissionElement?.evaluate((element) => element.isConnected)).toBe(true)
	await expect(page.getByRole('button', {
		name: 'Load more',
	})).toHaveCount(0)
})
